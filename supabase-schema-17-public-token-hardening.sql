-- Backline schema 17: public token hardening.
-- Run after schema 16. Public approval and portal links should return only
-- customer-safe job fields, even though shop users still sync full job records.

do $$
begin
  if to_regclass('public.jobs') is null then
    raise exception 'Backline schema 17 needs public.jobs. Run the base schema before this file.';
  end if;
  if to_regclass('public.approval_links') is null then
    raise exception 'Backline schema 17 needs public.approval_links. Run supabase-schema-05-approval-rpc.sql before this file.';
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

drop function if exists public.get_approval_by_token(text);

create or replace function public.get_approval_by_token(input_token text)
returns table (
  job jsonb,
  company_settings jsonb,
  link_status text,
  expires_at timestamptz,
  used_at timestamptz
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
      ) as company_settings,
    case
      when l.expires_at is not null and l.expires_at < now() then 'expired'
      when l.used_at is not null then 'used'
      else 'active'
    end as link_status,
    l.expires_at,
    l.used_at
  from public.approval_links l
  join public.jobs j on j.id = l.job_id and j.organization_id = l.organization_id
  join public.organizations o on o.id = l.organization_id
  where l.token = input_token
  limit 1;
$$;

create or replace function public.submit_approval_by_token(
  input_token text,
  input_decision text,
  input_signature text,
  input_deposit_collected boolean,
  input_decline_reason text,
  input_signature_image text,
  input_approval_pdf_file jsonb
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
  event_message text;
  expected_customer_name text;
begin
  if input_decision not in ('approved', 'declined') then
    raise exception 'Invalid approval decision';
  end if;

  select l.organization_id, j.id, j.payload
  into target_org_id, target_job_id, current_payload
  from public.approval_links l
  join public.jobs j on j.id = l.job_id and j.organization_id = l.organization_id
  where l.token = input_token
    and (l.expires_at is null or l.expires_at > now())
    and l.used_at is null
  for update of l, j;

  if target_job_id is null then
    raise exception 'Approval link not found or expired';
  end if;

  expected_customer_name := coalesce(current_payload->>'name', '');

  if input_decision = 'approved' and (
    nullif(btrim(input_signature), '') is null
    or lower(regexp_replace(btrim(input_signature), '\s+', ' ', 'g')) <> lower(regexp_replace(btrim(expected_customer_name), '\s+', ' ', 'g'))
  ) then
    raise exception 'Signature must match the customer name on this job: %', expected_customer_name;
  end if;

  if input_decision = 'approved' and nullif(btrim(input_signature_image), '') is null then
    raise exception 'Drawn customer signature is required before approval';
  end if;

  event_message := coalesce(nullif(input_signature, ''), coalesce(current_payload->>'name', 'Customer'))
    || case
      when input_decision = 'approved' then ' approved ' || coalesce(current_payload->>'value', 'the estimate')
      else ' declined the estimate. Reason: ' || coalesce(nullif(input_decline_reason, ''), 'No reason provided')
    end;

  next_payload := current_payload
    || jsonb_build_object(
      'approvalStatus', input_decision,
      'customerSignature', input_signature,
      'customerSignatureImage', case when input_decision = 'approved' then input_signature_image else '' end,
      'declineReason', case when input_decision = 'declined' then input_decline_reason else '' end,
      'depositCollected', input_deposit_collected
    );

  if input_decision = 'approved' then
    next_payload := next_payload
      || jsonb_build_object('approvedAt', now())
      || jsonb_build_object(
        'fieldChecklist',
        coalesce(next_payload->'fieldChecklist', '{}'::jsonb) || jsonb_build_object('signature', true)
      );
    if input_approval_pdf_file is not null then
      next_payload := jsonb_set(
        next_payload,
        '{files}',
        coalesce(next_payload->'files', '[]'::jsonb) || jsonb_build_array(input_approval_pdf_file)
      );
    end if;
  else
    next_payload := next_payload || jsonb_build_object('declinedAt', now());
  end if;

  next_payload := jsonb_set(
    next_payload,
    '{messages}',
    coalesce(next_payload->'messages', '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'direction', 'note',
        'body', event_message,
        'createdAt', to_char(now(), 'MM/DD/YYYY, HH12:MI AM')
      )
    )
  );

  update public.jobs
  set
    approval_status = input_decision,
    payload = next_payload,
    updated_at = now()
  where organization_id = target_org_id
    and id = target_job_id;

  update public.approval_links
  set used_at = coalesce(used_at, now())
  where organization_id = target_org_id
    and token = input_token;

  return public.customer_safe_job(next_payload);
end;
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
grant execute on function public.get_approval_by_token(text) to anon, authenticated;
grant execute on function public.submit_approval_by_token(text, text, text, boolean, text, text, jsonb) to anon, authenticated;
grant execute on function public.get_customer_portal_by_token(text) to anon, authenticated;
grant execute on function public.submit_customer_portal_reply(text, text) to anon, authenticated;

notify pgrst, 'reload schema';
