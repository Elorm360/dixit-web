create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 2 and 100),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  phone text check (phone is null or char_length(phone) between 7 and 32),
  interest text not null check (
    interest in ('bespoke', 'ready-to-wear', 'occasion-wear', 'other')
  ),
  message text not null check (
    char_length(btrim(message)) between 10 and 2000
  )
);

alter table public.consultation_requests enable row level security;

revoke all on table public.consultation_requests from anon, authenticated;
grant insert on table public.consultation_requests to anon, authenticated;

drop policy if exists "Visitors can submit consultation requests"
  on public.consultation_requests;

create policy "Visitors can submit consultation requests"
  on public.consultation_requests
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(name)) between 2 and 100
    and char_length(email) <= 254
    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and (phone is null or char_length(phone) between 7 and 32)
    and interest in ('bespoke', 'ready-to-wear', 'occasion-wear', 'other')
    and char_length(btrim(message)) between 10 and 2000
  );
