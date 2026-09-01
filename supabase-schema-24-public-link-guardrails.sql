-- Backline schema 24: public customer portal guardrails.
-- Run after schemas 01 through 23. Portal links remain reusable, while this
-- migration rejects malformed tokens and limits reply bursts per link.

do $$
begin
  if to_regclass('public.jobs') is null then
    raise exception 'Backline schema 24 needs public.jobs. Run schemas 01 through 23 first.';
  end if;
end $$;

create or replace function public.backline_valid_portal_token(input_value text)
returns boolean
language sql
immutable
as $$
  select coalesce(input_value ~ '^portal-[A-Za-z0-9_-]{16,120}$', false);
$$;

create table if not exists public.portal_reply_rate_limits (
  token_digest text not null,
  created_at timestamptz not null default now()
);

alter table public.portal_reply_rate_limits enable row level security;

create index if not exists portal_reply_rate_limits_token_created_idx
on public.portal_reply_rate_limits (token_digest, created_at desc);

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
  where public.backline_valid_portal_token(input_token)
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
  reply_token_digest text;
  recent_reply_count integer;
begin
  reply_body := nullif(btrim(input_reply), '');

  if not public.backline_valid_portal_token(input_token) then
    raise exception 'Customer portal link not found';
  end if;

  if reply_body is null then
    raise exception 'Message is required';
  end if;

  if length(reply_body) > 2000 then
    raise exception 'Message is too long';
  end if;

  -- Serialize submissions for one token so parallel requests cannot bypass
  -- the reply limit.
  reply_token_digest := md5(input_token);
  perform pg_advisory_xact_lock(hashtext(reply_token_digest));

  select j.organization_id, j.id, j.payload
  into target_org_id, target_job_id, current_payload
  from public.jobs j
  where j.payload->>'portalToken' = input_token
  for update;

  if target_job_id is null then
    raise exception 'Customer portal link not found';
  end if;

  select count(*)
  into recent_reply_count
  from public.portal_reply_rate_limits as rate_limit
  where rate_limit.token_digest = reply_token_digest
    and created_at > now() - interval '15 minutes';

  if recent_reply_count >= 6 then
    raise exception 'Too many messages were sent. Please wait a few minutes and try again.';
  end if;

  insert into public.portal_reply_rate_limits (token_digest)
  values (reply_token_digest);

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

revoke all on function public.backline_valid_portal_token(text) from public;
grant execute on function public.backline_valid_portal_token(text) to anon, authenticated;
grant execute on function public.get_customer_portal_by_token(text) to anon, authenticated;
grant execute on function public.submit_customer_portal_reply(text, text) to anon, authenticated;

notify pgrst, 'reload schema';
