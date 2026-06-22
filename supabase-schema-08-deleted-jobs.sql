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
create policy "Members can read deleted jobs"
on public.deleted_jobs for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Members can archive deleted jobs" on public.deleted_jobs;
create policy "Members can archive deleted jobs"
on public.deleted_jobs for insert
to authenticated
with check (public.is_org_member(organization_id));

drop policy if exists "Members can update deleted jobs" on public.deleted_jobs;
create policy "Members can update deleted jobs"
on public.deleted_jobs for update
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

drop policy if exists "Members can restore deleted jobs" on public.deleted_jobs;
create policy "Members can restore deleted jobs"
on public.deleted_jobs for delete
to authenticated
using (public.is_org_member(organization_id));

create index if not exists deleted_jobs_org_idx on public.deleted_jobs(organization_id);
create index if not exists deleted_jobs_deleted_at_idx on public.deleted_jobs(deleted_at);
create index if not exists deleted_jobs_job_idx on public.deleted_jobs(job_id);

notify pgrst, 'reload schema';
