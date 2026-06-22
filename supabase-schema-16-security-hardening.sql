-- Backline schema 16: workspace/security hardening.
-- Run after schema 15. This keeps field work available to workspace members,
-- while restricting business/admin records to owner/admin roles in Supabase.

create extension if not exists pgcrypto;

do $$
begin
  if to_regclass('public.organizations') is null
    or to_regclass('public.organization_members') is null
    or to_regclass('public.customers') is null
    or to_regclass('public.jobs') is null then
    raise exception 'Backline schema 16 needs the base secure tables first. Run supabase-schema.sql or schemas 01 through 15 before this file.';
  end if;
end $$;

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

-- Ensure optional Backline sync tables exist before hardening their policies.
-- This lets older workspaces run schema 16 without manually replaying every optional schema.
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

alter table public.pricebook_items enable row level security;
alter table public.activity_events enable row level security;
alter table public.deleted_jobs enable row level security;
alter table public.job_files enable row level security;

create index if not exists pricebook_items_org_idx on public.pricebook_items(organization_id);
create index if not exists pricebook_items_category_idx on public.pricebook_items(organization_id, category);
create index if not exists activity_events_org_idx on public.activity_events(organization_id);
create index if not exists activity_events_job_idx on public.activity_events(job_id);
create index if not exists activity_events_created_idx on public.activity_events(created_at desc);
create index if not exists activity_events_type_idx on public.activity_events(activity_type);
create index if not exists deleted_jobs_org_idx on public.deleted_jobs(organization_id);
create index if not exists deleted_jobs_deleted_at_idx on public.deleted_jobs(deleted_at);
create index if not exists deleted_jobs_job_idx on public.deleted_jobs(job_id);
create index if not exists job_files_org_idx on public.job_files(organization_id);
create index if not exists job_files_job_idx on public.job_files(job_id);

drop policy if exists "Owners can update organizations" on public.organizations;
drop policy if exists "Admins can update organizations" on public.organizations;
create policy "Admins can update organizations"
on public.organizations for update
to authenticated
using (owner_id = auth.uid() or public.is_org_admin(id))
with check (owner_id = auth.uid() or public.is_org_admin(id));

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

drop policy if exists "Members can update activity events" on public.activity_events;
drop policy if exists "Admins can update activity events" on public.activity_events;

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

grant execute on function public.safe_uuid(text) to authenticated;
grant execute on function public.org_member_role(uuid) to authenticated;
grant execute on function public.is_org_admin(uuid) to authenticated;
grant execute on function public.is_org_owner(uuid) to authenticated;

notify pgrst, 'reload schema';
