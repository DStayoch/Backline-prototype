create index if not exists customers_org_idx on public.customers(organization_id);
create index if not exists jobs_org_idx on public.jobs(organization_id);
create index if not exists jobs_customer_idx on public.jobs(customer_id);
create index if not exists jobs_schedule_idx on public.jobs(schedule_date);
create index if not exists approval_links_job_idx on public.approval_links(job_id);
