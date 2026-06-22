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

create or replace function public.is_org_admin(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_org
      and user_id = auth.uid()
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.accept_team_invite()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_row public.team_invites%rowtype;
  current_email text;
  current_display_name text;
begin
  current_email := lower(coalesce(auth.jwt()->>'email', ''));
  current_display_name := coalesce(
    nullif(auth.jwt()->'user_metadata'->>'display_name', ''),
    nullif(auth.jwt()->'user_metadata'->>'full_name', ''),
    split_part(current_email, '@', 1)
  );

  if current_email = '' then
    return null;
  end if;

  select *
  into invite_row
  from public.team_invites
  where lower(email) = current_email
    and status = 'pending'
  order by created_at asc
  limit 1
  for update;

  if invite_row.id is null then
    return null;
  end if;

  insert into public.organization_members (organization_id, user_id, email, display_name, role)
  values (invite_row.organization_id, auth.uid(), current_email, current_display_name, invite_row.role)
  on conflict (organization_id, user_id)
  do update set
    email = excluded.email,
    display_name = excluded.display_name,
    role = excluded.role;

  update public.team_invites
  set status = 'accepted',
      accepted_by = auth.uid(),
      accepted_at = now()
  where id = invite_row.id;

  return invite_row.organization_id;
end;
$$;
