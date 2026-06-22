-- Backline schema 12: business-owned customizable pricebook.
-- Run this in Supabase after the base schema if pricebook sync is not available yet.

create table if not exists public.pricebook_items (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text not null default 'General',
  unit text not null default 'each',
  unit_price numeric not null default 0,
  active boolean not null default true,
  taxable boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pricebook_items enable row level security;

drop policy if exists "Members can manage pricebook items" on public.pricebook_items;
create policy "Members can manage pricebook items"
on public.pricebook_items for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create index if not exists pricebook_items_org_idx on public.pricebook_items(organization_id);
create index if not exists pricebook_items_category_idx on public.pricebook_items(organization_id, category);
