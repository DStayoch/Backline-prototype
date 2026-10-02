-- Backline trial protection: each account can own one workspace.
-- Run after schemas 01 through 25. Without this, anyone could open a fresh
-- workspace to restart the 14-day trial. Platform admins are exempt, and
-- accounts that already own several workspaces keep them; only new ones are
-- blocked. Being invited into other shops as a non-owner is unaffected.
--
-- Safe to re-run. Each table has its own trigger function: a function shared
-- between tables fails with `record "new" has no field ...` as soon as it
-- reads a column the other table does not have.

do $$
begin
  if to_regclass('public.organization_members') is null
    or to_regclass('public.platform_admins') is null then
    raise exception 'Backline schema 26 needs the team and platform admin schemas first.';
  end if;
end $$;

-- Only workspaces with an owner membership count, so a signup that failed
-- halfway (workspace row, no membership) never locks the account out.
create or replace function public.backline_user_owns_workspace(target_user uuid, except_org uuid default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members member
    where member.user_id = target_user
      and member.role = 'owner'
      and (except_org is null or member.organization_id <> except_org)
  );
$$;

create or replace function public.enforce_single_owned_workspace_on_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' or coalesce(public.is_platform_admin(), false) then
    return new;
  end if;

  -- Serialize concurrent signups for the same account.
  perform pg_advisory_xact_lock(hashtextextended('backline-owned-workspace:' || new.owner_id::text, 0));

  if public.backline_user_owns_workspace(new.owner_id) then
    raise exception 'Each Backline account can own one workspace. Contact Backline support if you need another.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create or replace function public.enforce_single_owned_workspace_on_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> 'owner'
    or coalesce(auth.role(), '') = 'service_role'
    or coalesce(public.is_platform_admin(), false) then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended('backline-owned-workspace:' || new.user_id::text, 0));

  if public.backline_user_owns_workspace(new.user_id, new.organization_id) then
    raise exception 'Each Backline account can own one workspace. Contact Backline support if you need another.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists backline_single_owned_workspace_guard on public.organizations;
create trigger backline_single_owned_workspace_guard
before insert on public.organizations
for each row execute function public.enforce_single_owned_workspace_on_organization();

drop trigger if exists backline_single_owned_workspace_guard on public.organization_members;
create trigger backline_single_owned_workspace_guard
before insert on public.organization_members
for each row execute function public.enforce_single_owned_workspace_on_membership();

-- Remove the original shared function, which broke workspace creation.
drop function if exists public.enforce_single_owned_workspace();

revoke all on function public.backline_user_owns_workspace(uuid, uuid) from public, anon, authenticated;
revoke all on function public.enforce_single_owned_workspace_on_organization() from public, anon, authenticated;
revoke all on function public.enforce_single_owned_workspace_on_membership() from public, anon, authenticated;

notify pgrst, 'reload schema';
