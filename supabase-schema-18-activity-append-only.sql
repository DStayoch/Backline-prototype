-- Backline activity log append-only policy patch.
-- Run this if lower-permission roles can complete work but owners do not see
-- those actions in the Activity tab.

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

alter table public.activity_events enable row level security;

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

create index if not exists activity_events_org_idx on public.activity_events(organization_id);
create index if not exists activity_events_job_idx on public.activity_events(job_id);
create index if not exists activity_events_created_idx on public.activity_events(created_at desc);
create index if not exists activity_events_type_idx on public.activity_events(activity_type);
