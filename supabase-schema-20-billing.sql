-- Backline subscription billing. Stripe writes this through Edge Functions only.

create table if not exists public.organization_billing (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan_key text,
  status text not null default 'inactive' check (status in (
    'inactive', 'trialing', 'active', 'past_due', 'unpaid', 'paused',
    'canceled', 'incomplete', 'incomplete_expired'
  )),
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  trial_end timestamptz,
  latest_invoice_id text,
  last_stripe_event_created_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stripe_webhook_events (
  id text primary key,
  event_type text not null,
  created_at_stripe timestamptz,
  processed_at timestamptz not null default now()
);

alter table public.organization_billing enable row level security;
alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Workspace members can read billing status" on public.organization_billing;
create policy "Workspace members can read billing status"
on public.organization_billing
for select
to authenticated
using (exists (
  select 1
  from public.organization_members member
  where member.organization_id = organization_billing.organization_id
    and member.user_id = auth.uid()
));

-- No client-side insert/update/delete policies: only the Stripe webhook and
-- authenticated billing Edge Functions use the service role for writes.

create index if not exists organization_billing_subscription_idx
on public.organization_billing (stripe_subscription_id)
where stripe_subscription_id is not null;

notify pgrst, 'reload schema';
