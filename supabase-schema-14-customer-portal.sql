-- Backline schema 14: reusable customer portal links.
-- Run after the base schema has created public.jobs.

do $$
begin
  if to_regclass('public.jobs') is null then
    raise exception 'Backline schema 14 needs the base schema first. Run supabase-schema.sql or supabase-schema-01-tables.sql before this file.';
  end if;
end $$;

create or replace function public.customer_safe_job(raw_job jsonb)
returns jsonb
language sql
stable
as $$
  select (
    coalesce(raw_job, '{}'::jsonb)
    - 'parts'
    - 'reservations'
    - 'tasks'
    - 'notifications'
    - 'followupState'
    - 'assignmentSeenBy'
    - 'fieldChecklist'
    - 'equipment'
    - 'customerSignatureImage'
  ) || jsonb_build_object(
    'messages', coalesce((
      select jsonb_agg(message)
      from jsonb_array_elements(coalesce(raw_job->'messages', '[]'::jsonb)) as message
      where lower(coalesce(message->>'customerVisible', 'false')) = 'true'
    ), '[]'::jsonb),
    'files', coalesce((
      select jsonb_agg(file)
      from jsonb_array_elements(coalesce(raw_job->'files', '[]'::jsonb)) as file
      where lower(coalesce(file->>'customerVisible', 'false')) = 'true'
    ), '[]'::jsonb)
  );
$$;

drop function if exists public.get_customer_portal_by_token(text);

create or replace function public.get_customer_portal_by_token(input_token text)
returns table (
  job jsonb,
  company_settings jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select
    public.customer_safe_job(j.payload) as job,
    coalesce(o.payload->'companySettings', '{}'::jsonb)
      || jsonb_build_object(
        'companyName',
        coalesce(
          nullif(o.payload#>>'{companySettings,companyName}', ''),
          nullif(o.payload->>'companyName', ''),
          o.name,
          'Backline'
        )
      ) as company_settings
  from public.jobs j
  join public.organizations o on o.id = j.organization_id
  where nullif(btrim(input_token), '') is not null
    and j.payload->>'portalToken' = input_token
  limit 1;
$$;

create or replace function public.submit_customer_portal_reply(
  input_token text,
  input_reply text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_org_id uuid;
  target_job_id text;
  current_payload jsonb;
  next_payload jsonb;
  reply_body text;
  customer_name text;
begin
  reply_body := nullif(btrim(input_reply), '');

  if nullif(btrim(input_token), '') is null then
    raise exception 'Customer portal token is required';
  end if;

  if reply_body is null then
    raise exception 'Message is required';
  end if;

  if length(reply_body) > 2000 then
    raise exception 'Message is too long';
  end if;

  select j.organization_id, j.id, j.payload
  into target_org_id, target_job_id, current_payload
  from public.jobs j
  where nullif(btrim(input_token), '') is not null
    and j.payload->>'portalToken' = input_token
  for update;

  if target_job_id is null then
    raise exception 'Customer portal link not found';
  end if;

  customer_name := coalesce(nullif(current_payload->>'name', ''), 'Customer');

  next_payload := jsonb_set(
    current_payload,
    '{messages}',
    coalesce(current_payload->'messages', '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'direction', 'in',
        'body', reply_body,
        'createdAt', to_char(now(), 'FMMM/FMDD/YYYY, FMHH12:MI AM'),
        'createdBy', customer_name,
        'customerVisible', true
      )
    )
  );

  update public.jobs
  set
    payload = next_payload,
    updated_at = now()
  where organization_id = target_org_id
    and id = target_job_id;

  return public.customer_safe_job(next_payload);
end;
$$;

grant execute on function public.customer_safe_job(jsonb) to anon, authenticated;
grant execute on function public.get_customer_portal_by_token(text) to anon, authenticated;
grant execute on function public.submit_customer_portal_reply(text, text) to anon, authenticated;

create index if not exists jobs_portal_token_idx
on public.jobs ((payload->>'portalToken'));

create unique index if not exists jobs_portal_token_unique_idx
on public.jobs ((payload->>'portalToken'))
where nullif(payload->>'portalToken', '') is not null;

notify pgrst, 'reload schema';
