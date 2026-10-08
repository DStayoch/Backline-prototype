-- Backline customer email log.
-- Run after schemas 01 through 28. The send-customer-email Edge Function
-- records every email it sends to a shop's customer here. The log is what
-- its sending limits count (per workspace per day, per job per hour), and it
-- lets a shop see when a customer was emailed.
--
-- Only the Edge Function writes to it, using the service role. Workspace
-- members can read their own workspace's rows. Safe to re-run.

do $$
begin
  if to_regclass('public.organizations') is null or to_regclass('public.jobs') is null then
    raise exception 'Backline schema 29 needs the core tables first.';
  end if;
end $$;

create table if not exists public.customer_email_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id text not null,
  kind text not null check (kind in ('portal-link', 'portal-update', 'approval-request', 'payment-request')),
  recipient text not null,
  sent_by uuid references auth.users(id) on delete set null,
  provider_message_id text,
  created_at timestamptz not null default now()
);

alter table public.customer_email_log enable row level security;

drop policy if exists "Members can read their workspace email log" on public.customer_email_log;
create policy "Members can read their workspace email log"
on public.customer_email_log
for select
to authenticated
using (public.can_access_job(organization_id, job_id));

-- No insert, update, or delete policies: clients cannot write or erase the
-- log, so the sending limits cannot be reset from the browser.

create index if not exists customer_email_log_org_created_idx
on public.customer_email_log (organization_id, created_at desc);

create index if not exists customer_email_log_job_created_idx
on public.customer_email_log (organization_id, job_id, created_at desc);

-- Supabase grants broad table rights by default. Leave read-only access for
-- signed-in members; row-level security above limits it to their workspace.
revoke all on public.customer_email_log from anon, authenticated;
grant select on public.customer_email_log to authenticated;

notify pgrst, 'reload schema';
