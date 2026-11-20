-- DIXIT admin dashboard: staff accounts and enquiry management.

begin;

-- Staff are Supabase Auth users listed here. Add someone with:
--   insert into public.staff (user_id, name) select id, 'Name' from auth.users where email = 'person@example.com';
create table if not exists public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;
revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

drop policy if exists "Staff can read staff" on public.staff;
create policy "Staff can read staff" on public.staff
  for select to authenticated using (public.is_staff());

-- Enquiry management fields.
alter table public.consultation_requests add column if not exists notes text;
alter table public.consultation_requests add column if not exists updated_at timestamptz;

drop policy if exists "Staff can read DIXIT consultation requests" on public.consultation_requests;
create policy "Staff can read DIXIT consultation requests" on public.consultation_requests
  for select to authenticated using (public.is_staff());

drop policy if exists "Staff can update DIXIT consultation requests" on public.consultation_requests;
create policy "Staff can update DIXIT consultation requests" on public.consultation_requests
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

grant select on public.staff to authenticated;
grant select on public.consultation_requests to authenticated;
grant update (status, notes, updated_at) on public.consultation_requests to authenticated;

commit;
