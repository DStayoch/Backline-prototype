create extension if not exists pgcrypto;

create or replace function public.safe_uuid(input_text text)
returns uuid
language plpgsql
immutable
as $$
begin
  return input_text::uuid;
exception
  when others then
    return null;
end;
$$;

insert into storage.buckets (id, name, public)
values ('job-files', 'job-files', false)
on conflict (id) do nothing;

create table if not exists public.job_files (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  job_id text not null references public.jobs(id) on delete cascade,
  customer_id text references public.customers(id) on delete set null,
  file_name text not null,
  file_type text,
  file_size bigint,
  storage_path text not null,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.job_files enable row level security;

drop policy if exists "Members can manage job files" on public.job_files;
create policy "Members can manage job files"
on public.job_files for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

drop policy if exists "Members can upload job files" on storage.objects;
create policy "Members can upload job files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Members can read job files" on storage.objects;
create policy "Members can read job files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Members can update job files" on storage.objects;
create policy "Members can update job files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
)
with check (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
);

drop policy if exists "Members can delete job files" on storage.objects;
create policy "Members can delete job files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'job-files'
  and public.is_org_member(public.safe_uuid((storage.foldername(name))[1]))
);

grant execute on function public.safe_uuid(text) to authenticated;

create index if not exists job_files_org_idx on public.job_files(organization_id);
create index if not exists job_files_job_idx on public.job_files(job_id);
