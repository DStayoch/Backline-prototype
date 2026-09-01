-- Backline schema 23: launch security hardening.
-- Run after schemas 01 through 22. This migration enforces field assignments,
-- protects workspace ownership, and validates browser-synced job records.

do $$
begin
  if to_regclass('public.organizations') is null
    or to_regclass('public.organization_members') is null
    or to_regclass('public.jobs') is null
    or to_regclass('public.customers') is null
    or to_regclass('public.team_invites') is null then
    raise exception 'Backline schema 23 needs schemas 01 through 22 first.';
  end if;
end $$;

create or replace function public.backline_valid_record_id(input_value text)
returns boolean
language sql
immutable
as $$
  select coalesce(input_value ~ '^[A-Za-z0-9_-]{1,96}$', false);
$$;

create or replace function public.backline_valid_job_status(input_value text)
returns boolean
language sql
immutable
as $$
  select input_value in (
    'open', 'booked', 'in_progress', 'completed',
    'estimated', 'invoiced', 'paid', 'closed'
  );
$$;

create or replace function public.is_org_field_worker(target_org uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  membership_role text;
  settings jsonb := '{}'::jsonb;
begin
  select role
  into membership_role
  from public.organization_members
  where organization_id = target_org
    and user_id = auth.uid()
  limit 1;

  if membership_role = 'tech' then
    return true;
  end if;
  if membership_role is null then
    return false;
  end if;

  select coalesce(payload->'companySettings', payload, '{}'::jsonb)
  into settings
  from public.organizations
  where id = target_org;

  return exists (
    select 1
    from jsonb_array_elements(coalesce(settings->'customRoles', '[]'::jsonb)) as role_definition
    where role_definition->>'slug' = membership_role
      and role_definition->>'template' = 'tech'
  );
end;
$$;

create or replace function public.is_current_user_assigned_technician(target_org uuid, assigned_technician text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  normalized_assignee text := lower(btrim(coalesce(assigned_technician, '')));
begin
  if not public.is_org_field_worker(target_org) then
    return true;
  end if;
  if normalized_assignee = '' or normalized_assignee = 'to be determined' then
    return false;
  end if;

  return exists (
    select 1
    from public.organization_members member
    cross join lateral unnest(array[
      lower(btrim(coalesce(member.display_name, ''))),
      lower(btrim(coalesce(member.email, ''))),
      lower(btrim(split_part(coalesce(member.email, ''), '@', 1)))
    ]) as identity_value(value)
    where member.organization_id = target_org
      and member.user_id = auth.uid()
      and identity_value.value <> ''
      and identity_value.value = normalized_assignee
  );
end;
$$;

create or replace function public.can_access_job(target_org uuid, target_job_id text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  assigned_technician text;
begin
  if not public.is_org_member(target_org) then
    return false;
  end if;
  if not public.is_org_field_worker(target_org) then
    return true;
  end if;

  select technician
  into assigned_technician
  from public.jobs
  where organization_id = target_org
    and id = target_job_id;

  return public.is_current_user_assigned_technician(target_org, assigned_technician);
end;
$$;

create or replace function public.can_access_customer(target_org uuid, target_customer_id text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_org_member(target_org) then
    return false;
  end if;
  if not public.is_org_field_worker(target_org) then
    return true;
  end if;

  return exists (
    select 1
    from public.jobs job
    where job.organization_id = target_org
      and job.customer_id = target_customer_id
      and public.is_current_user_assigned_technician(target_org, job.technician)
  );
end;
$$;

-- Once created, an organization owner cannot be changed through the browser.
-- A future ownership-transfer workflow must be an explicit, audited operation.
create or replace function public.protect_organization_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.owner_id is distinct from old.owner_id then
    raise exception 'Workspace ownership cannot be changed from this action.' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists backline_owner_immutable on public.organizations;
create trigger backline_owner_immutable
before update on public.organizations
for each row execute function public.protect_organization_owner();

-- An owner membership is created only during workspace bootstrap. It cannot be
-- granted, demoted, or deleted by an administrator or a crafted API request.
create or replace function public.protect_organization_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  workspace_owner uuid;
begin
  if tg_op = 'DELETE' then
    if old.role = 'owner' then
      raise exception 'The workspace owner membership cannot be removed.' using errcode = '42501';
    end if;
    return old;
  end if;

  select owner_id
  into workspace_owner
  from public.organizations
  where id = new.organization_id;

  if tg_op = 'INSERT' and new.role = 'owner' and new.user_id <> workspace_owner then
    raise exception 'Only the workspace owner can have the owner role.' using errcode = '42501';
  end if;
  if tg_op = 'UPDATE' then
    if old.role = 'owner' and new.role <> 'owner' then
      raise exception 'The workspace owner role cannot be changed.' using errcode = '42501';
    end if;
    if old.role <> 'owner' and new.role = 'owner' then
      raise exception 'The owner role cannot be granted from this action.' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists backline_owner_membership_protection on public.organization_members;
create trigger backline_owner_membership_protection
before insert or update or delete on public.organization_members
for each row execute function public.protect_organization_owner_membership();

create or replace function public.reject_owner_team_invites()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'owner' then
    raise exception 'The owner role cannot be assigned through an invitation.' using errcode = '42501';
  end if;
  if tg_op = 'UPDATE' and new.organization_id <> old.organization_id then
    raise exception 'An invitation cannot be moved to a different workspace.' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists backline_team_invite_owner_protection on public.team_invites;
create trigger backline_team_invite_owner_protection
before insert or update on public.team_invites
for each row execute function public.reject_owner_team_invites();

-- Do not let a pending invitation overwrite an existing member's role.
create or replace function public.accept_team_invite()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_row public.team_invites%rowtype;
  current_email text;
  current_display_name text;
begin
  current_email := lower(coalesce(auth.jwt()->>'email', ''));
  current_display_name := coalesce(
    nullif(auth.jwt()->'user_metadata'->>'display_name', ''),
    nullif(auth.jwt()->'user_metadata'->>'full_name', ''),
    split_part(current_email, '@', 1)
  );

  if current_email = '' then
    return null;
  end if;

  select *
  into invite_row
  from public.team_invites
  where lower(email) = current_email
    and status = 'pending'
  order by created_at asc
  limit 1
  for update;

  if invite_row.id is null then
    return null;
  end if;
  if invite_row.role = 'owner' then
    raise exception 'Owner invitations are not permitted.' using errcode = '42501';
  end if;

  insert into public.organization_members (organization_id, user_id, email, display_name, role)
  values (invite_row.organization_id, auth.uid(), current_email, current_display_name, invite_row.role)
  on conflict (organization_id, user_id)
  do update set
    email = excluded.email,
    display_name = excluded.display_name;

  update public.team_invites
  set status = 'accepted',
      accepted_by = auth.uid(),
      accepted_at = now()
  where id = invite_row.id;

  return invite_row.organization_id;
end;
$$;

drop policy if exists "Admins can create team invites" on public.team_invites;
create policy "Admins can create team invites"
on public.team_invites for insert
to authenticated
with check (
  public.is_org_admin(organization_id)
  and role <> 'owner'
  and invited_by = auth.uid()
  and status = 'pending'
  and accepted_by is null
  and accepted_at is null
);

drop policy if exists "Admins can update team invites" on public.team_invites;
create policy "Admins can update team invites"
on public.team_invites for update
to authenticated
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id) and role <> 'owner');

-- Validate status before the admin shortcut so a direct RPC call cannot store
-- arbitrary markup that would later be rendered in a status chip.
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

  next_status := coalesce(nullif(next_payload->>'status', ''), coalesce(previous_payload->>'status', 'open'));
  if not public.backline_valid_job_status(next_status) then
    return false;
  end if;

  if public.is_org_admin(target_org) then
    return true;
  end if;

  if previous_payload is null then
    if not public.org_has_permission(target_org, 'createJob') then
      return false;
    end if;
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
  if public.org_has_permission(target_org, 'start') then
    allowed_keys := allowed_keys || array['status', 'startedAt', 'assignmentSeenBy', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'complete') then
    allowed_keys := allowed_keys || array['status', 'completedAt', 'fieldChecklist', 'messages', 'notifications'];
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
  if public.org_has_permission(target_org, 'uploadFiles') then
    allowed_keys := allowed_keys || array['files', 'fieldChecklist', 'messages'];
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
  input_status text := coalesce(nullif(input_row->>'status', ''), nullif(input_payload->>'status', ''), 'open');
  input_technician text := nullif(input_payload->>'technician', '');
  existing public.jobs%rowtype;
  saved public.jobs%rowtype;
begin
  if input_id is null
    or input_org is null
    or jsonb_typeof(input_payload) <> 'object'
    or not public.backline_valid_record_id(input_id)
    or not public.backline_valid_job_status(input_status) then
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
  if found and public.is_org_field_worker(input_org)
    and not public.is_current_user_assigned_technician(input_org, existing.technician) then
    raise exception 'You can only change work assigned to you.' using errcode = '42501';
  end if;
  if not found and public.is_org_field_worker(input_org)
    and not public.is_current_user_assigned_technician(input_org, input_technician) then
    raise exception 'You can only create work assigned to you.' using errcode = '42501';
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
        status = input_status,
        trade = nullif(input_payload->>'trade', ''),
        job_type = nullif(input_payload->>'jobType', ''),
        urgency = nullif(input_payload->>'urgency', ''),
        schedule_date = nullif(input_payload->>'scheduleDate', '')::date,
        start_time = nullif(input_payload->>'startTime', ''),
        technician = input_technician,
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
      input_id, input_org, nullif(input_payload->>'customerId', ''), input_status,
      nullif(input_payload->>'trade', ''), nullif(input_payload->>'jobType', ''), nullif(input_payload->>'urgency', ''),
      nullif(input_payload->>'scheduleDate', '')::date, nullif(input_payload->>'startTime', ''), input_technician,
      coalesce(nullif(input_payload->>'value', '')::numeric, 0),
      coalesce(nullif(input_payload->>'approvalStatus', ''), 'not_sent'),
      input_payload, coalesce(nullif(input_payload->>'createdAt', '')::timestamptz, now()), now(), 1
    ) returning * into saved;
  end if;

  return jsonb_build_object('status', 'saved', 'id', saved.id, 'revision', saved.revision, 'updatedAt', saved.updated_at);
end;
$$;

drop policy if exists "Members can read customers" on public.customers;
create policy "Permitted members can read customers"
on public.customers for select
to authenticated
using (public.can_access_customer(organization_id, id));

drop policy if exists "Members can read jobs" on public.jobs;
create policy "Permitted members can read jobs"
on public.jobs for select
to authenticated
using (public.can_access_job(organization_id, id));

drop policy if exists "Members can read approval links" on public.approval_links;
create policy "Permitted members can read approval links"
on public.approval_links for select
to authenticated
using (public.can_access_job(organization_id, job_id));

drop policy if exists "Members can read job file records" on public.job_files;
create policy "Permitted members can read job file records"
on public.job_files for select
to authenticated
using (public.can_access_job(organization_id, job_id));

drop policy if exists "Members can create job file records" on public.job_files;
create policy "Permitted members can create job file records"
on public.job_files for insert
to authenticated
with check (
  created_by = auth.uid()
  and public.can_access_job(organization_id, job_id)
);

drop policy if exists "Admins or uploaders can update job file records" on public.job_files;
create policy "Permitted members can update job file records"
on public.job_files for update
to authenticated
using (
  public.can_access_job(organization_id, job_id)
  and (public.is_org_admin(organization_id) or created_by = auth.uid())
)
with check (
  public.can_access_job(organization_id, job_id)
  and (public.is_org_admin(organization_id) or created_by = auth.uid())
);

drop policy if exists "Admins or uploaders can delete job file records" on public.job_files;
create policy "Permitted members can delete job file records"
on public.job_files for delete
to authenticated
using (
  public.can_access_job(organization_id, job_id)
  and (public.is_org_admin(organization_id) or created_by = auth.uid())
);

drop policy if exists "Members can read activity events" on public.activity_events;
create policy "Permitted members can read activity events"
on public.activity_events for select
to authenticated
using (
  public.is_org_member(organization_id)
  and (not public.is_org_field_worker(organization_id) or public.can_access_job(organization_id, job_id))
);

drop policy if exists "Members can read team invites" on public.team_invites;
create policy "Admins can read team invites"
on public.team_invites for select
to authenticated
using (public.is_org_admin(organization_id));

drop policy if exists "Members can upload job files" on storage.objects;
create policy "Permitted members can upload job files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'job-files'
  and public.can_access_job(
    public.safe_uuid((storage.foldername(name))[1]),
    (storage.foldername(name))[2]
  )
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Members can read job files" on storage.objects;
create policy "Permitted members can read job files"
on storage.objects for select to authenticated
using (
  bucket_id = 'job-files'
  and public.can_access_job(
    public.safe_uuid((storage.foldername(name))[1]),
    (storage.foldername(name))[2]
  )
);

drop policy if exists "Admins or uploaders can update job files" on storage.objects;
create policy "Permitted members can update job files"
on storage.objects for update to authenticated
using (
  bucket_id = 'job-files'
  and public.can_access_job(public.safe_uuid((storage.foldername(name))[1]), (storage.foldername(name))[2])
  and (public.is_org_admin(public.safe_uuid((storage.foldername(name))[1])) or owner = auth.uid())
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
)
with check (
  bucket_id = 'job-files'
  and public.can_access_job(public.safe_uuid((storage.foldername(name))[1]), (storage.foldername(name))[2])
  and (public.is_org_admin(public.safe_uuid((storage.foldername(name))[1])) or owner = auth.uid())
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Admins or uploaders can delete job files" on storage.objects;
create policy "Permitted members can delete job files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'job-files'
  and public.can_access_job(public.safe_uuid((storage.foldername(name))[1]), (storage.foldername(name))[2])
  and (public.is_org_admin(public.safe_uuid((storage.foldername(name))[1])) or owner = auth.uid())
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
);

revoke all on function public.backline_valid_record_id(text) from public;
revoke all on function public.backline_valid_job_status(text) from public;
revoke all on function public.is_org_field_worker(uuid) from public;
revoke all on function public.is_current_user_assigned_technician(uuid, text) from public;
revoke all on function public.can_access_job(uuid, text) from public;
revoke all on function public.can_access_customer(uuid, text) from public;
revoke all on function public.protect_organization_owner() from public;
revoke all on function public.protect_organization_owner_membership() from public;
revoke all on function public.reject_owner_team_invites() from public;

grant execute on function public.backline_valid_record_id(text) to authenticated;
grant execute on function public.backline_valid_job_status(text) to authenticated;
grant execute on function public.is_org_field_worker(uuid) to authenticated;
grant execute on function public.is_current_user_assigned_technician(uuid, text) to authenticated;
grant execute on function public.can_access_job(uuid, text) to authenticated;
grant execute on function public.can_access_customer(uuid, text) to authenticated;
grant execute on function public.accept_team_invite() to authenticated;
grant execute on function public.sync_job_if_revision(jsonb, bigint) to authenticated;

notify pgrst, 'reload schema';
