-- Backline schema 22: guarded job/customer writes and conflict-safe sync.
-- Run after schemas 01 through 21. This migration is required before deploying
-- the matching app.js release.

do $$
begin
  if to_regclass('public.organizations') is null
    or to_regclass('public.organization_members') is null
    or to_regclass('public.jobs') is null
    or to_regclass('public.customers') is null then
    raise exception 'Backline schema 22 needs schemas 01 through 21 first.';
  end if;
end $$;

alter table public.jobs
add column if not exists revision bigint not null default 1;

alter table public.customers
add column if not exists revision bigint not null default 1;

create or replace function public.org_has_permission(target_org uuid, requested_permission text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  membership_role text;
  settings jsonb := '{}'::jsonb;
  permissions jsonb;
begin
  select role
  into membership_role
  from public.organization_members
  where organization_id = target_org
    and user_id = auth.uid()
  limit 1;

  if membership_role is null then
    return false;
  end if;

  if membership_role in ('owner', 'admin') then
    return true;
  end if;

  select coalesce(payload->'companySettings', payload, '{}'::jsonb)
  into settings
  from public.organizations
  where id = target_org;

  if membership_role in ('dispatcher', 'tech') then
    permissions := settings->'roleOverrides'->membership_role->'permissions';
  else
    select role_definition->'permissions'
    into permissions
    from jsonb_array_elements(coalesce(settings->'customRoles', '[]'::jsonb)) as role_definition
    where role_definition->>'slug' = membership_role
    limit 1;
  end if;

  if permissions is not null then
    if requested_permission in ('createJob', 'uploadFiles', 'exportData', 'manageTeam') then
      return coalesce((permissions->>requested_permission)::boolean, false);
    end if;
    return coalesce(permissions->'actions' ? requested_permission, false);
  end if;

  if membership_role = 'dispatcher' then
    return requested_permission in ('createJob', 'book', 'portal', 'portal-update', 'payment-request', 'customer-profile', 'task', 'task-toggle');
  end if;

  if membership_role = 'tech' then
    return requested_permission in ('start', 'complete', 'parts', 'task', 'task-toggle', 'check-diagnosis', 'check-photos', 'check-signature', 'uploadFiles');
  end if;

  return false;
end;
$$;

create or replace function public.jsonb_changed_keys(before_value jsonb, after_value jsonb)
returns text[]
language sql
immutable
as $$
  select coalesce(array_agg(key order by key), array[]::text[])
  from (
    select key
    from jsonb_object_keys(coalesce(before_value, '{}'::jsonb) || coalesce(after_value, '{}'::jsonb)) as key
    where coalesce(before_value, '{}'::jsonb)->key is distinct from coalesce(after_value, '{}'::jsonb)->key
  ) changed;
$$;

create or replace function public.job_payload_change_is_allowed(target_org uuid, previous_payload jsonb, next_payload jsonb)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  changed_keys text[];
  allowed_keys text[] := array[]::text[];
  next_status text;
begin
  if jsonb_typeof(next_payload) <> 'object' then
    return false;
  end if;

  if public.is_org_admin(target_org) then
    return true;
  end if;

  if previous_payload is null then
    if not public.org_has_permission(target_org, 'createJob') then
      return false;
    end if;
    next_status := coalesce(nullif(next_payload->>'status', ''), 'open');
    return next_status in ('open', 'booked')
      and coalesce(nullif(next_payload->>'approvalStatus', ''), 'not_sent') = 'not_sent'
      and coalesce(nullif(next_payload #>> '{invoice,amount}', '')::numeric, 0) = 0
      and coalesce(jsonb_array_length(next_payload #> '{invoice,payments}'), 0) = 0
      and coalesce(jsonb_array_length(next_payload->'estimateHistory'), 0) = 0;
  end if;

  changed_keys := public.jsonb_changed_keys(previous_payload, next_payload);
  if cardinality(changed_keys) = 0 then
    return true;
  end if;

  if public.org_has_permission(target_org, 'book') then
    allowed_keys := allowed_keys || array['scheduleDate', 'startTime', 'durationMinutes', 'endTime', 'technician', 'assignmentSeenBy', 'status', 'messages'];
  end if;
  if public.org_has_permission(target_org, 'start') or public.org_has_permission(target_org, 'complete') then
    allowed_keys := allowed_keys || array['status', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'parts') then
    allowed_keys := allowed_keys || array['parts', 'partsNote', 'equipment', 'reservations', 'messages'];
  end if;
  if public.org_has_permission(target_org, 'task') or public.org_has_permission(target_org, 'task-toggle') then
    allowed_keys := allowed_keys || array['tasks', 'messages'];
  end if;
  if public.org_has_permission(target_org, 'check-diagnosis')
    or public.org_has_permission(target_org, 'check-photos')
    or public.org_has_permission(target_org, 'check-signature') then
    allowed_keys := allowed_keys || array['fieldChecklist', 'messages'];
  end if;
  if public.org_has_permission(target_org, 'portal') then
    allowed_keys := allowed_keys || array['portalToken', 'messages'];
  end if;
  if public.org_has_permission(target_org, 'portal-update') then
    allowed_keys := allowed_keys || array['messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'payment-request') then
    allowed_keys := allowed_keys || array['paymentRequests', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'estimate') then
    allowed_keys := allowed_keys || array['estimate', 'estimateHistory', 'value', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'approval') then
    allowed_keys := allowed_keys || array['approvalStatus', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'change') then
    allowed_keys := allowed_keys || array['estimate', 'estimateHistory', 'approvalStatus', 'scopeChanges', 'value', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'invoice') or public.org_has_permission(target_org, 'paid') then
    allowed_keys := allowed_keys || array['invoice', 'paymentRequests', 'status', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'close') or public.org_has_permission(target_org, 'reopen') then
    allowed_keys := allowed_keys || array['status', 'closedAt', 'closedBy', 'messages'];
  end if;

  if not (changed_keys <@ allowed_keys) then
    return false;
  end if;

  next_status := coalesce(nullif(next_payload->>'status', ''), previous_payload->>'status', 'open');
  if 'status' = any(changed_keys) then
    if next_status = 'in_progress' and not public.org_has_permission(target_org, 'start') then
      return false;
    end if;
    if next_status = 'completed' and not public.org_has_permission(target_org, 'complete') then
      return false;
    end if;
    if next_status in ('paid', 'invoiced') and not (public.org_has_permission(target_org, 'invoice') or public.org_has_permission(target_org, 'paid')) then
      return false;
    end if;
    if next_status = 'closed' and not public.org_has_permission(target_org, 'close') then
      return false;
    end if;
  end if;

  return true;
end;
$$;

create or replace function public.sync_job_if_revision(input_row jsonb, expected_revision bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  input_id text := nullif(btrim(input_row->>'id'), '');
  input_org uuid := public.safe_uuid(input_row->>'organization_id');
  input_payload jsonb := input_row->'payload';
  existing public.jobs%rowtype;
  saved public.jobs%rowtype;
begin
  if input_id is null or input_org is null or jsonb_typeof(input_payload) <> 'object' then
    raise exception 'Invalid Backline job sync request.' using errcode = '22023';
  end if;
  if not public.is_org_member(input_org) then
    raise exception 'You do not have access to this workspace.' using errcode = '42501';
  end if;
  if nullif(input_payload->>'id', '') is distinct from input_id then
    raise exception 'Job identity does not match its payload.' using errcode = '22023';
  end if;

  select * into existing from public.jobs where id = input_id for update;
  if found and existing.organization_id <> input_org then
    raise exception 'Job belongs to a different workspace.' using errcode = '42501';
  end if;

  if found then
    if existing.revision <> coalesce(expected_revision, 0) then
      return jsonb_build_object('status', 'conflict', 'id', input_id, 'revision', existing.revision, 'payload', existing.payload);
    end if;
    if not public.job_payload_change_is_allowed(input_org, existing.payload, input_payload) then
      raise exception 'Your role cannot make this job change.' using errcode = '42501';
    end if;

    update public.jobs
    set customer_id = nullif(input_payload->>'customerId', ''),
        status = coalesce(nullif(input_payload->>'status', ''), 'open'),
        trade = nullif(input_payload->>'trade', ''),
        job_type = nullif(input_payload->>'jobType', ''),
        urgency = nullif(input_payload->>'urgency', ''),
        schedule_date = nullif(input_payload->>'scheduleDate', '')::date,
        start_time = nullif(input_payload->>'startTime', ''),
        technician = nullif(input_payload->>'technician', ''),
        estimated_value = coalesce(nullif(input_payload->>'value', '')::numeric, 0),
        approval_status = coalesce(nullif(input_payload->>'approvalStatus', ''), 'not_sent'),
        payload = input_payload,
        revision = existing.revision + 1,
        updated_at = now()
    where id = input_id
    returning * into saved;
  else
    if coalesce(expected_revision, 0) <> 0 then
      return jsonb_build_object('status', 'conflict', 'id', input_id, 'revision', 0);
    end if;
    if not public.job_payload_change_is_allowed(input_org, null, input_payload) then
      raise exception 'Your role cannot create this job.' using errcode = '42501';
    end if;

    insert into public.jobs (
      id, organization_id, customer_id, status, trade, job_type, urgency,
      schedule_date, start_time, technician, estimated_value, approval_status,
      payload, created_at, updated_at, revision
    ) values (
      input_id, input_org, nullif(input_payload->>'customerId', ''),
      coalesce(nullif(input_payload->>'status', ''), 'open'),
      nullif(input_payload->>'trade', ''), nullif(input_payload->>'jobType', ''), nullif(input_payload->>'urgency', ''),
      nullif(input_payload->>'scheduleDate', '')::date, nullif(input_payload->>'startTime', ''), nullif(input_payload->>'technician', ''),
      coalesce(nullif(input_payload->>'value', '')::numeric, 0),
      coalesce(nullif(input_payload->>'approvalStatus', ''), 'not_sent'),
      input_payload, coalesce(nullif(input_payload->>'createdAt', '')::timestamptz, now()), now(), 1
    ) returning * into saved;
  end if;

  return jsonb_build_object('status', 'saved', 'id', saved.id, 'revision', saved.revision, 'updatedAt', saved.updated_at);
end;
$$;

create or replace function public.sync_customer_if_revision(input_row jsonb, expected_revision bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  input_id text := nullif(btrim(input_row->>'id'), '');
  input_org uuid := public.safe_uuid(input_row->>'organization_id');
  input_payload jsonb := input_row->'payload';
  existing public.customers%rowtype;
  saved public.customers%rowtype;
begin
  if input_id is null or input_org is null or jsonb_typeof(input_payload) <> 'object' then
    raise exception 'Invalid Backline customer sync request.' using errcode = '22023';
  end if;
  if not public.is_org_member(input_org) then
    raise exception 'You do not have access to this workspace.' using errcode = '42501';
  end if;
  if nullif(input_payload->>'id', '') is distinct from input_id then
    raise exception 'Customer identity does not match its payload.' using errcode = '22023';
  end if;

  select * into existing from public.customers where id = input_id for update;
  if found and existing.organization_id <> input_org then
    raise exception 'Customer belongs to a different workspace.' using errcode = '42501';
  end if;
  if found and existing.revision <> coalesce(expected_revision, 0) then
    return jsonb_build_object('status', 'conflict', 'id', input_id, 'revision', existing.revision, 'payload', existing.payload);
  end if;
  if found and not public.org_has_permission(input_org, 'customer-profile') then
    raise exception 'Your role cannot edit customer records.' using errcode = '42501';
  end if;
  if not found and not (public.org_has_permission(input_org, 'createJob') or public.org_has_permission(input_org, 'customer-profile')) then
    raise exception 'Your role cannot create customer records.' using errcode = '42501';
  end if;

  if found then
    update public.customers
    set name = coalesce(nullif(input_payload->>'name', ''), existing.name),
        phone = nullif(input_payload->>'phone', ''),
        email = nullif(input_payload->>'email', ''),
        address = nullif(input_payload->>'address', ''),
        last_job_id = nullif(input_payload->>'lastJobId', ''),
        last_job_status = nullif(input_payload->>'lastJobStatus', ''),
        last_job_at = nullif(input_payload->>'lastJobAt', '')::timestamptz,
        total_value = coalesce(nullif(input_payload->>'totalValue', '')::numeric, 0),
        job_count = coalesce(nullif(input_payload->>'jobCount', '')::integer, 0),
        payload = input_payload,
        revision = existing.revision + 1,
        updated_at = now()
    where id = input_id
    returning * into saved;
  else
    insert into public.customers (
      id, organization_id, name, phone, email, address, last_job_id, last_job_status,
      last_job_at, total_value, job_count, payload, created_at, updated_at, revision
    ) values (
      input_id, input_org, coalesce(nullif(input_payload->>'name', ''), 'Customer'),
      nullif(input_payload->>'phone', ''), nullif(input_payload->>'email', ''), nullif(input_payload->>'address', ''),
      nullif(input_payload->>'lastJobId', ''), nullif(input_payload->>'lastJobStatus', ''),
      nullif(input_payload->>'lastJobAt', '')::timestamptz,
      coalesce(nullif(input_payload->>'totalValue', '')::numeric, 0),
      coalesce(nullif(input_payload->>'jobCount', '')::integer, 0),
      input_payload, coalesce(nullif(input_payload->>'createdAt', '')::timestamptz, now()), now(), 1
    ) returning * into saved;
  end if;

  return jsonb_build_object('status', 'saved', 'id', saved.id, 'revision', saved.revision, 'updatedAt', saved.updated_at);
end;
$$;

create or replace function public.delete_job_if_revision(input_org uuid, input_job_id text, expected_revision bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing public.jobs%rowtype;
begin
  if input_org is null or nullif(btrim(input_job_id), '') is null then
    raise exception 'Invalid Backline job deletion request.' using errcode = '22023';
  end if;
  if not public.org_has_permission(input_org, 'delete') then
    raise exception 'Your role cannot delete jobs.' using errcode = '42501';
  end if;

  select * into existing from public.jobs where id = input_job_id for update;
  if not found then
    return jsonb_build_object('status', 'deleted', 'id', input_job_id);
  end if;
  if existing.organization_id <> input_org then
    raise exception 'Job belongs to a different workspace.' using errcode = '42501';
  end if;
  if existing.revision <> coalesce(expected_revision, 0) then
    return jsonb_build_object('status', 'conflict', 'id', input_job_id, 'revision', existing.revision, 'payload', existing.payload);
  end if;

  delete from public.jobs where id = input_job_id;
  return jsonb_build_object('status', 'deleted', 'id', input_job_id);
end;
$$;

-- Browser clients may read their workspace records but must use the guarded
-- functions above for writes. This prevents direct API mutation bypasses.
drop policy if exists "Members can manage customers" on public.customers;
drop policy if exists "Members can read customers" on public.customers;
create policy "Members can read customers"
on public.customers for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Members can manage jobs" on public.jobs;
drop policy if exists "Members can read jobs" on public.jobs;
create policy "Members can read jobs"
on public.jobs for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Members can manage approval links" on public.approval_links;
drop policy if exists "Members can read approval links" on public.approval_links;
drop policy if exists "Permitted members can create approval links" on public.approval_links;
create policy "Members can read approval links"
on public.approval_links for select
to authenticated
using (public.is_org_member(organization_id));

create policy "Permitted members can create approval links"
on public.approval_links for insert
to authenticated
with check (public.org_has_permission(organization_id, 'approval'));

revoke all on function public.org_has_permission(uuid, text) from public;
revoke all on function public.jsonb_changed_keys(jsonb, jsonb) from public;
revoke all on function public.job_payload_change_is_allowed(uuid, jsonb, jsonb) from public;
revoke all on function public.sync_job_if_revision(jsonb, bigint) from public;
revoke all on function public.sync_customer_if_revision(jsonb, bigint) from public;
revoke all on function public.delete_job_if_revision(uuid, text, bigint) from public;

grant execute on function public.org_has_permission(uuid, text) to authenticated;
grant execute on function public.sync_job_if_revision(jsonb, bigint) to authenticated;
grant execute on function public.sync_customer_if_revision(jsonb, bigint) to authenticated;
grant execute on function public.delete_job_if_revision(uuid, text, bigint) to authenticated;

notify pgrst, 'reload schema';
