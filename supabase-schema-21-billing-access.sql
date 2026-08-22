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
