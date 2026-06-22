-- Backline secure database schema for Supabase.
-- Run this in the Supabase SQL editor, then copy supabase-config.example.js
-- to supabase-config.js and fill in your project URL and anon key.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.customers (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  last_job_id text,
  last_job_status text,
  last_job_at timestamptz,
  total_value numeric not null default 0,
  job_count integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id text references public.customers(id) on delete set null,
  status text not null default 'open',
  trade text,
  job_type text,
  urgency text,
  schedule_date date,
  start_time text,
  technician text,
  estimated_value numeric not null default 0,
  approval_status text not null default 'not_sent',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pricebook_items (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text not null default 'General',
  unit text not null default 'each',
  unit_price numeric not null default 0,
  active boolean not null default true,
  taxable boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.approval_links (
  token text primary key default encode(gen_random_bytes(24), 'hex'),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id text,
  activity_type text not null default 'updated',
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.customers enable row level security;
alter table public.jobs enable row level security;
alter table public.pricebook_items enable row level security;
alter table public.approval_links enable row level security;
alter table public.activity_events enable row level security;

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_org
      and user_id = auth.uid()
  );
$$;

create or replace function public.org_member_role(target_org uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select om.role
  from public.organization_members om
  where om.organization_id = target_org
    and om.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_org_admin(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.org_member_role(target_org) in ('owner', 'admin'), false);
$$;

create or replace function public.is_org_owner(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.org_member_role(target_org) = 'owner', false);
$$;

create or replace function public.safe_uuid(input_text text)
returns uuid
language plpgsql
immutable
as $$
begin
  return input_text::uuid;
exception
  when others then
    return null;
end;
$$;

grant execute on function public.safe_uuid(text) to authenticated;
grant execute on function public.org_member_role(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;
grant execute on function public.is_org_owner(uuid) to authenticated;

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

grant execute on function public.customer_safe_job(jsonb) to anon, authenticated;

drop policy if exists "Users can create their own organizations" on public.organizations;
create policy "Users can create their own organizations"
on public.organizations for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Members can read organizations" on public.organizations;
create policy "Members can read organizations"
on public.organizations for select
to authenticated
using (public.is_org_member(id) or owner_id = auth.uid());

drop policy if exists "Owners can update organizations" on public.organizations;
drop policy if exists "Admins can update organizations" on public.organizations;
create policy "Admins can update organizations"
on public.organizations for update
to authenticated
using (owner_id = auth.uid() or public.is_org_admin(id))
with check (owner_id = auth.uid() or public.is_org_admin(id));

drop policy if exists "Users can create own membership" on public.organization_members;
create policy "Users can create own membership"
on public.organization_members for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.organizations
    where id = organization_id
      and owner_id = auth.uid()
  )
);

drop policy if exists "Members can read memberships" on public.organization_members;
create policy "Members can read memberships"
on public.organization_members for select
to authenticated
using (public.is_org_member(organization_id) or user_id = auth.uid());

drop policy if exists "Members can manage customers" on public.customers;
create policy "Members can manage customers"
on public.customers for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

drop policy if exists "Members can manage jobs" on public.jobs;
create policy "Members can manage jobs"
on public.jobs for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

drop policy if exists "Members can manage pricebook items" on public.pricebook_items;
drop policy if exists "Members can read pricebook items" on public.pricebook_items;
create policy "Members can read pricebook items"
on public.pricebook_items for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Admins can manage pricebook items" on public.pricebook_items;
create policy "Admins can manage pricebook items"
on public.pricebook_items for all
to authenticated
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

drop policy if exists "Members can manage approval links" on public.approval_links;
create policy "Members can manage approval links"
on public.approval_links for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

drop policy if exists "Members can read activity events" on public.activity_events;
create policy "Members can read activity events"
on public.activity_events for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Members can create activity events" on public.activity_events;
create policy "Members can create activity events"
on public.activity_events for insert
to authenticated
with check (public.is_org_member(organization_id));

drop policy if exists "Members can update activity events" on public.activity_events;
drop policy if exists "Admins can update activity events" on public.activity_events;
-- Activity events are append-only from the app. Members can create events,
-- and existing events are not updated through browser clients.

create index if not exists customers_org_idx on public.customers(organization_id);
create index if not exists jobs_org_idx on public.jobs(organization_id);
create index if not exists jobs_customer_idx on public.jobs(customer_id);
create index if not exists jobs_schedule_idx on public.jobs(schedule_date);
create index if not exists pricebook_items_org_idx on public.pricebook_items(organization_id);
create index if not exists pricebook_items_category_idx on public.pricebook_items(organization_id, category);
create index if not exists approval_links_job_idx on public.approval_links(job_id);
create index if not exists activity_events_org_idx on public.activity_events(organization_id);
create index if not exists activity_events_job_idx on public.activity_events(job_id);
create index if not exists activity_events_created_idx on public.activity_events(created_at desc);
create index if not exists activity_events_type_idx on public.activity_events(activity_type);

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

drop function if exists public.submit_approval_by_token(text, text, text, boolean);
drop function if exists public.submit_approval_by_token(text, text, text, boolean, text);
drop function if exists public.submit_approval_by_token(text, text, text, boolean, text, text);
drop function if exists public.submit_approval_by_token(text, text, text, boolean, text, text, jsonb);

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

grant execute on function public.get_approval_by_token(text) to anon, authenticated;
grant execute on function public.submit_approval_by_token(text, text, text, boolean, text, text, jsonb) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('job-files', 'job-files', false)
on conflict (id) do nothing;

create table if not exists public.job_files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  customer_id text references public.customers(id) on delete set null,
  file_name text not null,
  file_type text,
  file_size bigint,
  storage_path text not null,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.job_files enable row level security;

drop policy if exists "Members can manage job files" on public.job_files;
drop policy if exists "Members can read job file records" on public.job_files;
create policy "Members can read job file records"
on public.job_files for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Members can create job file records" on public.job_files;
create policy "Members can create job file records"
on public.job_files for insert
to authenticated
with check (public.is_org_member(organization_id) and created_by = auth.uid());

drop policy if exists "Admins or uploaders can update job file records" on public.job_files;
create policy "Admins or uploaders can update job file records"
on public.job_files for update
to authenticated
using (public.is_org_admin(organization_id) or created_by = auth.uid())
with check (public.is_org_admin(organization_id) or created_by = auth.uid());

drop policy if exists "Admins or uploaders can delete job file records" on public.job_files;
create policy "Admins or uploaders can delete job file records"
on public.job_files for delete
to authenticated
using (public.is_org_admin(organization_id) or created_by = auth.uid());

drop policy if exists "Members can upload job files" on storage.objects;
create policy "Members can upload job files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Members can read job files" on storage.objects;
create policy "Members can read job files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Members can update job files" on storage.objects;
drop policy if exists "Admins or uploaders can update job files" on storage.objects;
create policy "Admins or uploaders can update job files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'job-files'
  and (
    public.is_org_admin(public.safe_uuid((storage.foldername(name))[1]))
    or owner = auth.uid()
  )
)
with check (
  bucket_id = 'job-files'
  and (
    public.is_org_admin(public.safe_uuid((storage.foldername(name))[1]))
    or owner = auth.uid()
  )
);

drop policy if exists "Members can delete job files" on storage.objects;
drop policy if exists "Admins or uploaders can delete job files" on storage.objects;
create policy "Admins or uploaders can delete job files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'job-files'
  and (
    public.is_org_admin(public.safe_uuid((storage.foldername(name))[1]))
    or owner = auth.uid()
  )
);

create index if not exists job_files_org_idx on public.job_files(organization_id);
create index if not exists job_files_job_idx on public.job_files(job_id);

alter table public.organization_members
add column if not exists email text;

alter table public.organization_members
add column if not exists display_name text;

update public.organization_members om
set email = u.email
from auth.users u
where om.user_id = u.id
  and om.email is null;

update public.organization_members om
set display_name = coalesce(
  nullif(u.raw_user_meta_data->>'display_name', ''),
  nullif(u.raw_user_meta_data->>'full_name', ''),
  split_part(u.email, '@', 1)
)
from auth.users u
where om.user_id = u.id
  and (om.display_name is null or om.display_name = '');

create table if not exists public.team_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'tech',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid references auth.users(id) on delete set null,
  accepted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz
);

alter table public.team_invites enable row level security;

drop policy if exists "Users can create own membership" on public.organization_members;
create policy "Users can create own membership"
on public.organization_members for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.organizations
    where id = organization_id
      and owner_id = auth.uid()
  )
);

create or replace function public.is_org_admin(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.org_member_role(target_org) in ('owner', 'admin'), false);
$$;

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

  insert into public.organization_members (organization_id, user_id, email, display_name, role)
  values (invite_row.organization_id, auth.uid(), current_email, current_display_name, invite_row.role)
  on conflict (organization_id, user_id)
  do update set
    email = excluded.email,
    display_name = excluded.display_name,
    role = excluded.role;

  update public.team_invites
  set status = 'accepted',
      accepted_by = auth.uid(),
      accepted_at = now()
  where id = invite_row.id;

  return invite_row.organization_id;
end;
$$;

drop policy if exists "Admins can update memberships" on public.organization_members;
create policy "Admins can update memberships"
on public.organization_members for update
to authenticated
using (public.is_org_admin(organization_id) and role <> 'owner')
with check (public.is_org_admin(organization_id) and role <> 'owner');

drop policy if exists "Admins can remove memberships" on public.organization_members;
create policy "Admins can remove memberships"
on public.organization_members for delete
to authenticated
using (public.is_org_admin(organization_id) and role <> 'owner');

drop policy if exists "Members can read team invites" on public.team_invites;
create policy "Members can read team invites"
on public.team_invites for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Admins can create team invites" on public.team_invites;
create policy "Admins can create team invites"
on public.team_invites for insert
to authenticated
with check (public.is_org_admin(organization_id));

drop policy if exists "Admins can update team invites" on public.team_invites;
create policy "Admins can update team invites"
on public.team_invites for update
to authenticated
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

drop policy if exists "Admins can delete team invites" on public.team_invites;
create policy "Admins can delete team invites"
on public.team_invites for delete
to authenticated
using (public.is_org_admin(organization_id));

create unique index if not exists team_invites_one_pending_email_idx
on public.team_invites (organization_id, (lower(email)))
where status = 'pending';

create index if not exists team_invites_org_idx on public.team_invites(organization_id);
create index if not exists team_invites_email_idx on public.team_invites((lower(email)));

grant execute on function public.accept_team_invite() to authenticated;

create or replace function public.sync_member_display_name(
  target_org uuid,
  input_display_name text,
  input_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.organization_members
  set
    display_name = nullif(btrim(input_display_name), ''),
    email = lower(nullif(btrim(input_email), ''))
  where organization_id = target_org
    and user_id = auth.uid();
end;
$$;

grant execute on function public.sync_member_display_name(uuid, text, text) to authenticated;

create table if not exists public.deleted_jobs (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id text,
  customer_id text,
  customer_name text,
  deleted_by text,
  deleted_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

alter table public.deleted_jobs enable row level security;

drop policy if exists "Members can read deleted jobs" on public.deleted_jobs;
drop policy if exists "Admins can read deleted jobs" on public.deleted_jobs;
create policy "Admins can read deleted jobs"
on public.deleted_jobs for select
to authenticated
using (public.is_org_admin(organization_id));

drop policy if exists "Members can archive deleted jobs" on public.deleted_jobs;
drop policy if exists "Admins can archive deleted jobs" on public.deleted_jobs;
create policy "Admins can archive deleted jobs"
on public.deleted_jobs for insert
to authenticated
with check (public.is_org_admin(organization_id));

drop policy if exists "Members can update deleted jobs" on public.deleted_jobs;
drop policy if exists "Admins can update deleted jobs" on public.deleted_jobs;
create policy "Admins can update deleted jobs"
on public.deleted_jobs for update
to authenticated
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

drop policy if exists "Members can restore deleted jobs" on public.deleted_jobs;
drop policy if exists "Admins can restore deleted jobs" on public.deleted_jobs;
create policy "Admins can restore deleted jobs"
on public.deleted_jobs for delete
to authenticated
using (public.is_org_admin(organization_id));

create index if not exists deleted_jobs_org_idx on public.deleted_jobs(organization_id);
create index if not exists deleted_jobs_deleted_at_idx on public.deleted_jobs(deleted_at);
create index if not exists deleted_jobs_job_idx on public.deleted_jobs(job_id);

notify pgrst, 'reload schema';

-- Backline platform/creator access.
-- This table is intentionally separate from organization_members so shop
-- owners cannot grant creator access.

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.platform_admins enable row level security;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_admins admin
    where admin.user_id = auth.uid()
  );
$$;

drop policy if exists "Platform admins can read platform admins" on public.platform_admins;
create policy "Platform admins can read platform admins"
on public.platform_admins
for select
to authenticated
using (public.is_platform_admin());

grant execute on function public.is_platform_admin() to authenticated;

-- Bootstrap a creator manually from the SQL editor after their auth account exists:
-- insert into public.platform_admins (user_id, email, display_name)
-- select id, email, 'Backline creator'
-- from auth.users
-- where lower(email) = lower('you@example.com')
-- on conflict (user_id) do update
-- set email = excluded.email,
--     display_name = excluded.display_name;

notify pgrst, 'reload schema';

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

grant execute on function public.get_customer_portal_by_token(text) to anon, authenticated;
grant execute on function public.submit_customer_portal_reply(text, text) to anon, authenticated;

create index if not exists jobs_portal_token_idx
on public.jobs ((payload->>'portalToken'));

create unique index if not exists jobs_portal_token_unique_idx
on public.jobs ((payload->>'portalToken'))
where nullif(payload->>'portalToken', '') is not null;

notify pgrst, 'reload schema';
