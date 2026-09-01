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

-- Combined schema additions: billing, access, guarded sync, and launch hardening.

-- Backline subscription billing. Stripe writes this through Edge Functions only.

create table if not exists public.organization_billing (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan_key text,
  status text not null default 'inactive' check (status in (
    'inactive', 'trialing', 'active', 'past_due', 'unpaid', 'paused',
    'canceled', 'incomplete', 'incomplete_expired'
  )),
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  trial_end timestamptz,
  latest_invoice_id text,
  last_stripe_event_created_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stripe_webhook_events (
  id text primary key,
  event_type text not null,
  created_at_stripe timestamptz,
  processed_at timestamptz not null default now()
);

alter table public.organization_billing enable row level security;
alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Workspace members can read billing status" on public.organization_billing;
create policy "Workspace members can read billing status"
on public.organization_billing
for select
to authenticated
using (exists (
  select 1
  from public.organization_members member
  where member.organization_id = organization_billing.organization_id
    and member.user_id = auth.uid()
));

-- No client-side insert/update/delete policies: only the Stripe webhook and
-- authenticated billing Edge Functions use the service role for writes.

create index if not exists organization_billing_subscription_idx
on public.organization_billing (stripe_subscription_id)
where stripe_subscription_id is not null;

notify pgrst, 'reload schema';
-- Backline subscription access enforcement.
-- Run after schemas 01 through 20. This keeps workspace data readable when a
-- subscription stops, while preventing new writes until it is restored.

do $$
begin
  if to_regclass('public.organization_billing') is null
    or to_regclass('public.platform_admins') is null then
    raise exception 'Backline schema 21 needs schemas 19 and 20 first.';
  end if;
end $$;

alter table public.organization_billing
add column if not exists access_grace_until timestamptz;

-- This is for a short, deliberate support override. It has no client policies;
-- manage it only in the SQL editor or through a trusted server process.
create table if not exists public.workspace_access_overrides (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  access_mode text not null default 'full' check (access_mode = 'full'),
  reason text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspace_access_overrides enable row level security;

create or replace function public.has_backline_full_access(target_org uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if target_org is null then
    return false;
  end if;

  -- Stripe Edge Functions run with this role and must be able to record status.
  if coalesce(auth.role(), '') = 'service_role' then
    return true;
  end if;

  -- Founder access is controlled by the separate platform_admins table.
  if coalesce(public.is_platform_admin(), false) then
    return true;
  end if;

  if exists (
    select 1
    from public.workspace_access_overrides override
    where override.organization_id = target_org
      and override.access_mode = 'full'
      and (override.expires_at is null or override.expires_at > now())
  ) then
    return true;
  end if;

  return exists (
    select 1
    from public.organization_billing billing
    where billing.organization_id = target_org
      and (
        billing.status in ('trialing', 'active')
        or (
          billing.status = 'past_due'
          and billing.access_grace_until is not null
          and billing.access_grace_until > now()
        )
      )
  );
end;
$$;

create or replace function public.backline_workspace_access(target_org uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  billing public.organization_billing%rowtype;
  is_member boolean;
  is_founder boolean;
begin
  is_founder := coalesce(public.is_platform_admin(), false);
  select exists (
    select 1 from public.organization_members member
    where member.organization_id = target_org and member.user_id = auth.uid()
  ) into is_member;

  if not is_member and not is_founder then
    raise exception 'You do not have access to this workspace.' using errcode = '42501';
  end if;

  select * into billing
  from public.organization_billing
  where organization_id = target_org;

  return jsonb_build_object(
    'mode', case when public.has_backline_full_access(target_org) then 'full' else 'read_only' end,
    'status', coalesce(billing.status, 'inactive'),
    'grace_until', billing.access_grace_until,
    'founder', is_founder
  );
end;
$$;

create or replace function public.enforce_backline_billing_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_org uuid;
begin
  if coalesce(auth.role(), '') = 'service_role' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    target_org := old.organization_id;
  else
    target_org := new.organization_id;
  end if;
  if not public.has_backline_full_access(target_org) then
    raise exception 'This Backline workspace is read-only until its subscription is active.' using errcode = '42501';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function public.enforce_backline_organization_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' and not public.has_backline_full_access(new.id) then
    raise exception 'This Backline workspace is read-only until its subscription is active.' using errcode = '42501';
  end if;
  return new;
end;
$$;

create or replace function public.enforce_backline_membership_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_org uuid;
begin
  if coalesce(auth.role(), '') = 'service_role' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  -- Let a new owner establish the first membership for a just-created shop.
  if tg_op = 'INSERT'
    and new.user_id = auth.uid()
    and new.role = 'owner'
    and exists (
      select 1 from public.organizations organization
      where organization.id = new.organization_id and organization.owner_id = auth.uid()
    )
    and not exists (
      select 1 from public.organization_members member
      where member.organization_id = new.organization_id
    ) then
    return new;
  end if;

  if tg_op = 'DELETE' then
    target_org := old.organization_id;
  else
    target_org := new.organization_id;
  end if;
  if not public.has_backline_full_access(target_org) then
    raise exception 'This Backline workspace is read-only until its subscription is active.' using errcode = '42501';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists backline_subscription_write_guard on public.customers;
create trigger backline_subscription_write_guard
before insert or update or delete on public.customers
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_write_guard on public.jobs;
create trigger backline_subscription_write_guard
before insert or update or delete on public.jobs
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_write_guard on public.approval_links;
create trigger backline_subscription_write_guard
before insert or update or delete on public.approval_links
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_write_guard on public.pricebook_items;
create trigger backline_subscription_write_guard
before insert or update or delete on public.pricebook_items
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_write_guard on public.activity_events;
create trigger backline_subscription_write_guard
before insert or update or delete on public.activity_events
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_write_guard on public.deleted_jobs;
create trigger backline_subscription_write_guard
before insert or update or delete on public.deleted_jobs
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_write_guard on public.job_files;
create trigger backline_subscription_write_guard
before insert or update or delete on public.job_files
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_write_guard on public.team_invites;
create trigger backline_subscription_write_guard
before insert or update or delete on public.team_invites
for each row execute function public.enforce_backline_billing_write();

drop trigger if exists backline_subscription_organization_write_guard on public.organizations;
create trigger backline_subscription_organization_write_guard
before update on public.organizations
for each row execute function public.enforce_backline_organization_write();

drop trigger if exists backline_subscription_membership_write_guard on public.organization_members;
create trigger backline_subscription_membership_write_guard
before insert or update or delete on public.organization_members
for each row execute function public.enforce_backline_membership_write();

-- File reads remain available in read-only mode. New or changed files require
-- an active trial/subscription, just like their job-file records.
drop policy if exists "Members can upload job files" on storage.objects;
create policy "Members can upload job files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Admins or uploaders can update job files" on storage.objects;
create policy "Admins or uploaders can update job files"
on storage.objects for update to authenticated
using (
  bucket_id = 'job-files'
  and (public.is_org_admin(public.safe_uuid((storage.foldername(name))[1])) or owner = auth.uid())
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
)
with check (
  bucket_id = 'job-files'
  and (public.is_org_admin(public.safe_uuid((storage.foldername(name))[1])) or owner = auth.uid())
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Admins or uploaders can delete job files" on storage.objects;
create policy "Admins or uploaders can delete job files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'job-files'
  and (public.is_org_admin(public.safe_uuid((storage.foldername(name))[1])) or owner = auth.uid())
  and public.has_backline_full_access(public.safe_uuid((storage.foldername(name))[1]))
);

grant execute on function public.has_backline_full_access(uuid) to authenticated;
grant execute on function public.backline_workspace_access(uuid) to authenticated;

notify pgrst, 'reload schema';
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
  if public.org_has_permission(target_org, 'start') then
    allowed_keys := allowed_keys || array['status', 'startedAt', 'assignmentSeenBy', 'messages', 'notifications'];
  end if;
  if public.org_has_permission(target_org, 'complete') then
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
