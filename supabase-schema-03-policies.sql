drop policy if exists "Users can create their own organizations" on public.organizations;
create policy "Users can create their own organizations"
on public.organizations for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Members can read organizations" on public.organizations;
create policy "Members can read organizations"
on public.organizations for select
to authenticated
using (public.is_org_member(id) or owner_id = auth.uid());

drop policy if exists "Owners can update organizations" on public.organizations;
create policy "Owners can update organizations"
on public.organizations for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Users can create own membership" on public.organization_members;
create policy "Users can create own membership"
on public.organization_members for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.organizations
    where id = organization_id
      and owner_id = auth.uid()
  )
);

drop policy if exists "Members can read memberships" on public.organization_members;
create policy "Members can read memberships"
on public.organization_members for select
to authenticated
using (public.is_org_member(organization_id) or user_id = auth.uid());

drop policy if exists "Members can manage customers" on public.customers;
create policy "Members can manage customers"
on public.customers for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

drop policy if exists "Members can manage jobs" on public.jobs;
create policy "Members can manage jobs"
on public.jobs for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

drop policy if exists "Members can manage approval links" on public.approval_links;
create policy "Members can manage approval links"
on public.approval_links for all
to authenticated
using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));
