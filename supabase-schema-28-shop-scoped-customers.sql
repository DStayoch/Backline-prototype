-- Backline shop-scoped customers.
-- Run after schemas 01 through 27. Customer IDs come from the phone number,
-- and the customers table used the ID alone as its key, so one phone number
-- could be a customer in only ONE workspace across all of Backline. A second
-- shop saving the same person was refused with "Customer belongs to a
-- different workspace", which also revealed that another shop had them.
--
-- Customers are now unique per workspace (organization_id + id). Each shop
-- keeps its own record of the same person, invisible to every other shop.
-- Safe to re-run.

do $$
declare
  constraint_row record;
begin
  if to_regclass('public.customers') is null or to_regclass('public.jobs') is null then
    raise exception 'Backline schema 28 needs the core tables first.';
  end if;

  -- Drop every foreign key that points at customers, whatever it is named.
  for constraint_row in
    select conrelid::regclass as table_name, conname
    from pg_constraint
    where contype = 'f' and confrelid = 'public.customers'::regclass
  loop
    execute format('alter table %s drop constraint %I', constraint_row.table_name, constraint_row.conname);
  end loop;

  -- Replace the single-column key with a per-workspace key.
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.customers'::regclass
      and contype = 'p'
      and pg_get_constraintdef(oid) = 'PRIMARY KEY (organization_id, id)'
  ) then
    for constraint_row in
      select conname from pg_constraint
      where conrelid = 'public.customers'::regclass and contype = 'p'
    loop
      execute format('alter table public.customers drop constraint %I', constraint_row.conname);
    end loop;
    alter table public.customers add constraint customers_pkey primary key (organization_id, id);
  end if;
end $$;

-- A job or file may only point at a customer in its own workspace. Clear any
-- link that does not (none are expected; the old key made them impossible to
-- create normally).
update public.jobs job
set customer_id = null
where job.customer_id is not null
  and not exists (
    select 1 from public.customers customer
    where customer.organization_id = job.organization_id and customer.id = job.customer_id
  );

update public.job_files file
set customer_id = null
where file.customer_id is not null
  and not exists (
    select 1 from public.customers customer
    where customer.organization_id = file.organization_id and customer.id = file.customer_id
  );

alter table public.jobs
add constraint jobs_customer_fkey
foreign key (organization_id, customer_id)
references public.customers (organization_id, id)
on delete set null (customer_id);

alter table public.job_files
add constraint job_files_customer_fkey
foreign key (organization_id, customer_id)
references public.customers (organization_id, id)
on delete set null (customer_id);

-- Same rules as schema 22, with every lookup scoped to the workspace.
create or replace function public.sync_customer_if_revision(input_row jsonb, expected_revision bigint)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  input_id text := nullif(btrim(input_row->>'id'), '');
  input_org uuid := public.safe_uuid(input_row->>'organization_id');
  input_payload jsonb := input_row->'payload';
  existing public.customers%rowtype;
  saved public.customers%rowtype;
begin
  if input_id is null or input_org is null or jsonb_typeof(input_payload) <> 'object' then
    raise exception 'Invalid Backline customer sync request.' using errcode = '22023';
  end if;
  if not public.is_org_member(input_org) then
    raise exception 'You do not have access to this workspace.' using errcode = '42501';
  end if;
  if nullif(input_payload->>'id', '') is distinct from input_id then
    raise exception 'Customer identity does not match its payload.' using errcode = '22023';
  end if;

  -- A customer is identified within its own workspace. Another shop may have
  -- a customer with the same ID (the same phone number); that is a separate
  -- record this shop can neither see nor collide with.
  select * into existing
  from public.customers
  where organization_id = input_org and id = input_id
  for update;
  if found and existing.revision <> coalesce(expected_revision, 0) then
    return jsonb_build_object('status', 'conflict', 'id', input_id, 'revision', existing.revision, 'payload', existing.payload);
  end if;
  if found and not public.org_has_permission(input_org, 'customer-profile') then
    raise exception 'Your role cannot edit customer records.' using errcode = '42501';
  end if;
  if not found and not (public.org_has_permission(input_org, 'createJob') or public.org_has_permission(input_org, 'customer-profile')) then
    raise exception 'Your role cannot create customer records.' using errcode = '42501';
  end if;

  if found then
    update public.customers
    set name = coalesce(nullif(input_payload->>'name', ''), existing.name),
        phone = nullif(input_payload->>'phone', ''),
        email = nullif(input_payload->>'email', ''),
        address = nullif(input_payload->>'address', ''),
        last_job_id = nullif(input_payload->>'lastJobId', ''),
        last_job_status = nullif(input_payload->>'lastJobStatus', ''),
        last_job_at = nullif(input_payload->>'lastJobAt', '')::timestamptz,
        total_value = coalesce(nullif(input_payload->>'totalValue', '')::numeric, 0),
        job_count = coalesce(nullif(input_payload->>'jobCount', '')::integer, 0),
        payload = input_payload,
        revision = existing.revision + 1,
        updated_at = now()
    where organization_id = input_org and id = input_id
    returning * into saved;
  else
    insert into public.customers (
      id, organization_id, name, phone, email, address, last_job_id, last_job_status,
      last_job_at, total_value, job_count, payload, created_at, updated_at, revision
    ) values (
      input_id, input_org, coalesce(nullif(input_payload->>'name', ''), 'Customer'),
      nullif(input_payload->>'phone', ''), nullif(input_payload->>'email', ''), nullif(input_payload->>'address', ''),
      nullif(input_payload->>'lastJobId', ''), nullif(input_payload->>'lastJobStatus', ''),
      nullif(input_payload->>'lastJobAt', '')::timestamptz,
      coalesce(nullif(input_payload->>'totalValue', '')::numeric, 0),
      coalesce(nullif(input_payload->>'jobCount', '')::integer, 0),
      input_payload, coalesce(nullif(input_payload->>'createdAt', '')::timestamptz, now()), now(), 1
    ) returning * into saved;
  end if;

  return jsonb_build_object('status', 'saved', 'id', saved.id, 'revision', saved.revision, 'updatedAt', saved.updated_at);
end;
$$;

revoke all on function public.sync_customer_if_revision(jsonb, bigint) from public;
grant execute on function public.sync_customer_if_revision(jsonb, bigint) to authenticated;

notify pgrst, 'reload schema';
