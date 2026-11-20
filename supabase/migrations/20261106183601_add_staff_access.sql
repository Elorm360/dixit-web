-- Recovered from the production migration history.
create schema if not exists private;

revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create table private.staff_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table private.staff_members enable row level security;

revoke all on table private.staff_members from public, anon, authenticated;

create function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from private.staff_members where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_staff() from public, anon;
grant execute on function private.is_staff() to authenticated;

grant select, update (status) on table public.consultation_requests to authenticated;

create policy "Staff can read consultation requests"
  on public.consultation_requests
  for select
  to authenticated
  using ((select private.is_staff()));

create policy "Staff can update consultation status"
  on public.consultation_requests
  for update
  to authenticated
  using ((select private.is_staff()))
  with check ((select private.is_staff()));
