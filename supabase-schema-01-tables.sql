create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'dispatcher', 'tech')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.customers (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  address text,
  last_job_id text,
  last_job_status text,
  last_job_at timestamptz,
  total_value numeric not null default 0,
  job_count integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id text primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id text references public.customers(id) on delete set null,
  status text not null default 'open',
  trade text,
  job_type text,
  urgency text,
  schedule_date date,
  start_time text,
  technician text,
  estimated_value numeric not null default 0,
  approval_status text not null default 'not_sent',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.approval_links (
  token text primary key default encode(gen_random_bytes(24), 'hex'),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.customers enable row level security;
alter table public.jobs enable row level security;
alter table public.approval_links enable row level security;
