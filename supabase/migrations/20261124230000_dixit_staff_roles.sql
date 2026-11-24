-- Staff roles for the studio dashboard.
--   super_admin: everything, including managing the team
--   staff:       enquiries and pieces
-- All team management goes through the functions below, which check the caller
-- is a super admin. private.staff_members stays unreachable from the API.

begin;

alter table private.staff_members
  add column if not exists role text not null default 'staff';
alter table private.staff_members
  drop constraint if exists staff_members_role_check;
alter table private.staff_members
  add constraint staff_members_role_check check (role in ('super_admin', 'staff'));

-- Whoever set the dashboard up so far becomes a super admin
-- (only when there is none yet, so re-running this never promotes anyone else).
update private.staff_members set role = 'super_admin'
where not exists (select 1 from private.staff_members where role = 'super_admin');

create or replace function private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.staff_members
    where user_id = (select auth.uid()) and role = 'super_admin'
  );
$$;
revoke execute on function private.is_super_admin() from public, anon;
grant execute on function private.is_super_admin() to authenticated;

-- The signed-in user's role, or null when they are not staff.
create or replace function public.my_staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from private.staff_members where user_id = (select auth.uid());
$$;
revoke execute on function public.my_staff_role() from public, anon;
grant execute on function public.my_staff_role() to authenticated;

create or replace function public.list_staff()
returns table (user_id uuid, email text, role text, added_at timestamptz, last_sign_in_at timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_super_admin() then
    raise exception 'Only a super admin can view the team.' using errcode = '42501';
  end if;
  return query
    select s.user_id, s.email, s.role, s.created_at, u.last_sign_in_at
    from private.staff_members s
    left join auth.users u on u.id = s.user_id
    order by (s.role = 'super_admin') desc, s.created_at;
end;
$$;
revoke execute on function public.list_staff() from public, anon;
grant execute on function public.list_staff() to authenticated;

-- Gives an existing account dashboard access (or changes its role).
create or replace function public.grant_staff(p_email text, p_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid;
  target_email text;
begin
  if not private.is_super_admin() then
    raise exception 'Only a super admin can add team members.' using errcode = '42501';
  end if;
  if p_role not in ('super_admin', 'staff') then
    raise exception 'Unknown role.' using errcode = '22023';
  end if;

  select id, email into target, target_email
  from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if target is null then
    raise exception 'no_account' using errcode = 'P0002';
  end if;

  if target = (select auth.uid()) and p_role <> 'super_admin' then
    raise exception 'You cannot remove your own super admin role.' using errcode = '42501';
  end if;

  insert into private.staff_members (user_id, email, role)
  values (target, target_email, p_role)
  on conflict (user_id) do update set role = excluded.role, email = excluded.email;
end;
$$;
revoke execute on function public.grant_staff(text, text) from public, anon;
grant execute on function public.grant_staff(text, text) to authenticated;

create or replace function public.revoke_staff(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_super_admin() then
    raise exception 'Only a super admin can remove team members.' using errcode = '42501';
  end if;
  if p_user_id = (select auth.uid()) then
    raise exception 'You cannot remove yourself.' using errcode = '42501';
  end if;
  delete from private.staff_members where user_id = p_user_id;
end;
$$;
revoke execute on function public.revoke_staff(uuid) from public, anon;
grant execute on function public.revoke_staff(uuid) to authenticated;

commit;
