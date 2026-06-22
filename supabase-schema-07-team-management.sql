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
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_org
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
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

notify pgrst, 'reload schema';
