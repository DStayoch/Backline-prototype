drop policy if exists "Admins can update memberships" on public.organization_members;
create policy "Admins can update memberships"
on public.organization_members for update
to authenticated
using (public.is_org_admin(organization_id) and role <> 'owner')
with check (public.is_org_admin(organization_id) and role <> 'owner');

drop policy if exists "Admins can remove memberships" on public.organization_members;
create policy "Admins can remove memberships"
on public.organization_members for delete
to authenticated
using (public.is_org_admin(organization_id) and role <> 'owner');

drop policy if exists "Members can read team invites" on public.team_invites;
create policy "Members can read team invites"
on public.team_invites for select
to authenticated
using (public.is_org_member(organization_id));

drop policy if exists "Admins can create team invites" on public.team_invites;
create policy "Admins can create team invites"
on public.team_invites for insert
to authenticated
with check (public.is_org_admin(organization_id));

drop policy if exists "Admins can update team invites" on public.team_invites;
create policy "Admins can update team invites"
on public.team_invites for update
to authenticated
using (public.is_org_admin(organization_id))
with check (public.is_org_admin(organization_id));

drop policy if exists "Admins can delete team invites" on public.team_invites;
create policy "Admins can delete team invites"
on public.team_invites for delete
to authenticated
using (public.is_org_admin(organization_id));

create unique index if not exists team_invites_one_pending_email_idx
on public.team_invites (organization_id, (lower(email)))
where status = 'pending';

create index if not exists team_invites_org_idx on public.team_invites(organization_id);
create index if not exists team_invites_email_idx on public.team_invites((lower(email)));

grant execute on function public.accept_team_invite() to authenticated;

notify pgrst, 'reload schema';
