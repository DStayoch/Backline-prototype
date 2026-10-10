-- Backline customer email log: allow the "invoice-ready" email kind.
-- Run after schemas 01 through 29. The send-customer-email Edge Function can
-- now email a customer that their invoice is ready. The log's list of allowed
-- kinds has to include it, or those emails would be sent but not counted
-- toward the sending limits. Safe to re-run.

do $$
declare
  constraint_row record;
begin
  if to_regclass('public.customer_email_log') is null then
    raise exception 'Backline schema 30 needs schema 29 (customer_email_log) first.';
  end if;

  -- Replace whichever check currently limits the kind column.
  for constraint_row in
    select conname
    from pg_constraint
    where conrelid = 'public.customer_email_log'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%kind%'
  loop
    execute format('alter table public.customer_email_log drop constraint %I', constraint_row.conname);
  end loop;

  alter table public.customer_email_log
  add constraint customer_email_log_kind_check
  check (kind in ('portal-link', 'portal-update', 'approval-request', 'payment-request', 'invoice-ready'));
end $$;

notify pgrst, 'reload schema';

-- Check: the definition should list five kinds, ending with invoice-ready.
select conname as name, pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.customer_email_log'::regclass and contype = 'c';
