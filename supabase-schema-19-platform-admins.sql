-- Backline platform/creator access.
-- Run after the core workspace schemas. This table is intentionally separate
-- from organization_members so shop owners cannot grant creator access.

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

alter table public.platform_admins enable row level security;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_admins admin
    where admin.user_id = auth.uid()
  );
$$;

drop policy if exists "Platform admins can read platform admins" on public.platform_admins;
create policy "Platform admins can read platform admins"
on public.platform_admins
for select
to authenticated
using (public.is_platform_admin());

grant execute on function public.is_platform_admin() to authenticated;

-- Bootstrap a creator manually from the SQL editor after their auth account exists:
-- insert into public.platform_admins (user_id, email, display_name)
-- select id, email, 'Backline creator'
-- from auth.users
-- where lower(email) = lower('you@example.com')
-- on conflict (user_id) do update
-- set email = excluded.email,
--     display_name = excluded.display_name;

notify pgrst, 'reload schema';
