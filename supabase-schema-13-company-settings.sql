-- Backline workspace/company settings.
-- Run after the base schema if your project was created before company settings existed.

alter table public.organizations
add column if not exists payload jsonb not null default '{}'::jsonb;

select pg_notify('pgrst', 'reload schema');
