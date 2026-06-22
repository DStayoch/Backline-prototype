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
