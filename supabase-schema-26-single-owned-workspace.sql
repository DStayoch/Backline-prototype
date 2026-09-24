-- Backline trial protection: each account can own one workspace.
-- Run after schemas 01 through 25. Without this, anyone could open a fresh
-- workspace to restart the 14-day trial. Platform admins are exempt, and
-- accounts that already own several workspaces keep them; only new ones are
-- blocked. Being invited into other shops as a non-owner is unaffected.

do $$
begin
  if to_regclass('public.organization_members') is null
    or to_regclass('public.platform_admins') is null then
    raise exception 'Backline schema 26 needs the team and platform admin schemas first.';
  end if;
end $$;

create or replace function public.enforce_single_owned_workspace()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  owner_user uuid;
begin
  if coalesce(auth.role(), '') = 'service_role' or coalesce(public.is_platform_admin(), false) then
    return new;
  end if;

  if tg_table_name = 'organizations' then
    owner_user := new.owner_id;
  elsif new.role = 'owner' then
    owner_user := new.user_id;
  else
    return new;
  end if;

  -- Serialize concurrent bootstraps for the same account.
  perform pg_advisory_xact_lock(hashtextextended('backline-owned-workspace:' || owner_user::text, 0));

  -- Only workspaces with an owner membership count, so a bootstrap that failed
  -- halfway (workspace row, no membership) never locks the account out.
  if exists (
    select 1
    from public.organization_members member
    where member.user_id = owner_user
      and member.role = 'owner'
      and (tg_table_name = 'organizations' or member.organization_id <> new.organization_id)
  ) then
    raise exception 'Each Backline account can own one workspace. Contact Backline support if you need another.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists backline_single_owned_workspace_guard on public.organizations;
create trigger backline_single_owned_workspace_guard
before insert on public.organizations
for each row execute function public.enforce_single_owned_workspace();

drop trigger if exists backline_single_owned_workspace_guard on public.organization_members;
create trigger backline_single_owned_workspace_guard
before insert on public.organization_members
for each row execute function public.enforce_single_owned_workspace();

revoke all on function public.enforce_single_owned_workspace() from public;

notify pgrst, 'reload schema';
