-- Backline plan capacity enforcement.
-- Run after schemas 01 through 21. This is intentionally database-side so a
-- browser, REST request, or invite-acceptance RPC cannot exceed paid seats.

do $$
begin
  if to_regclass('public.organization_billing') is null
    or to_regclass('public.organization_members') is null
    or to_regclass('public.team_invites') is null then
    raise exception 'Backline schema 25 needs the billing and team schemas first.';
  end if;
end $$;

-- Stripe is the source of truth for this value. Shop starts with ten members;
-- this stores the quantity of the $15 additional-member subscription item.
alter table public.organization_billing
add column if not exists additional_seat_quantity integer not null default 0
check (additional_seat_quantity >= 0);

create or replace function public.backline_subscription_member_limit(target_org uuid)
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  billing_plan text;
  additional_seats integer;
begin
  select lower(coalesce(plan_key, '')), greatest(coalesce(additional_seat_quantity, 0), 0)
  into billing_plan, additional_seats
  from public.organization_billing
  where organization_id = target_org;

  case billing_plan
    when 'crew' then return 5;
    when 'shop' then return 10 + additional_seats;
    when 'solo' then return 1;
    else return 1;
  end case;
end;
$$;

-- Each table has its own trigger function. One function shared between
-- team_invites and organization_members fails with `record "new" has no field
-- "user_id"` on invites, because plpgsql resolves every column in an
-- expression even when an earlier condition is false.

create or replace function public.enforce_backline_invite_seat_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_count integer;
  pending_invite_count integer;
  member_limit integer;
begin
  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  -- Only a newly pending invite takes a seat.
  if new.status <> 'pending' then
    return new;
  end if;
  if tg_op = 'UPDATE' then
    if old.status = 'pending' and old.organization_id = new.organization_id then
      return new;
    end if;
  end if;

  member_limit := public.backline_subscription_member_limit(new.organization_id);
  select count(*) into member_count
  from public.organization_members
  where organization_id = new.organization_id;
  select count(*) into pending_invite_count
  from public.team_invites
  where organization_id = new.organization_id and status = 'pending';

  if member_count + pending_invite_count >= member_limit then
    raise exception 'Your current Backline plan allows % team members. Remove a pending invite or update billing before inviting another person.', member_limit
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create or replace function public.enforce_backline_member_seat_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  member_count integer;
  member_limit integer;
begin
  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.organization_id = new.organization_id then
      return new;
    end if;
  end if;

  -- The owner membership is created before a subscription exists. Schema 21
  -- already allows that one creation; every additional seat requires billing.
  if new.role = 'owner'
    and new.user_id = auth.uid()
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

  member_limit := public.backline_subscription_member_limit(new.organization_id);
  select count(*) into member_count
  from public.organization_members
  where organization_id = new.organization_id;

  if member_count >= member_limit then
    raise exception 'Your current Backline plan allows % team members. Update billing before adding another person.', member_limit
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists backline_team_invite_capacity_guard on public.team_invites;
create trigger backline_team_invite_capacity_guard
before insert or update on public.team_invites
for each row execute function public.enforce_backline_invite_seat_capacity();

drop trigger if exists backline_member_capacity_guard on public.organization_members;
create trigger backline_member_capacity_guard
before insert or update on public.organization_members
for each row execute function public.enforce_backline_member_seat_capacity();

-- Remove the original shared function, which broke team invites.
drop function if exists public.enforce_backline_team_seat_capacity();

revoke all on function public.enforce_backline_invite_seat_capacity() from public, anon, authenticated;
revoke all on function public.enforce_backline_member_seat_capacity() from public, anon, authenticated;
revoke execute on function public.backline_subscription_member_limit(uuid) from public, anon;

grant execute on function public.backline_subscription_member_limit(uuid) to authenticated;

notify pgrst, 'reload schema';
