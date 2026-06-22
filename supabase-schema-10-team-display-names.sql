alter table public.organization_members
add column if not exists display_name text;

update public.organization_members om
set display_name = coalesce(
  nullif(u.raw_user_meta_data->>'display_name', ''),
  nullif(u.raw_user_meta_data->>'full_name', ''),
  split_part(u.email, '@', 1)
)
from auth.users u
where om.user_id = u.id
  and (om.display_name is null or om.display_name = '');

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

grant execute on function public.accept_team_invite() to authenticated;

create or replace function public.sync_member_display_name(
  target_org uuid,
  input_display_name text,
  input_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.organization_members
  set
    display_name = nullif(btrim(input_display_name), ''),
    email = lower(nullif(btrim(input_email), ''))
  where organization_id = target_org
    and user_id = auth.uid();
end;
$$;

grant execute on function public.sync_member_display_name(uuid, text, text) to authenticated;

select pg_notify('pgrst', 'reload schema');
