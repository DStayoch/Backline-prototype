-- Backline custom roles.
-- Run after schema 14 so organization members and invites can store owner-defined role slugs.

create extension if not exists pgcrypto;

do $$
begin
  if to_regclass('public.organizations') is null or to_regclass('public.organization_members') is null then
    raise exception 'Backline schema 15 needs the base team tables first. Run supabase-schema.sql or schemas 01 and 07a before this file.';
  end if;
end $$;

alter table public.organization_members
add column if not exists email text;

alter table public.organization_members
add column if not exists display_name text;

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

alter table public.organization_members
drop constraint if exists organization_members_role_check;

alter table public.team_invites
drop constraint if exists team_invites_role_check;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.organization_members'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.organization_members drop constraint if exists %I', constraint_name);
  end loop;

  for constraint_name in
    select conname
    from pg_constraint
    where conrelid = 'public.team_invites'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%role%'
  loop
    execute format('alter table public.team_invites drop constraint if exists %I', constraint_name);
  end loop;
end $$;

select pg_notify('pgrst', 'reload schema');
