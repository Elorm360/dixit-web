-- Base enquiries table. Already exists in production; kept so a fresh
-- (local) database can be built from migrations alone.
create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  service text not null,
  occasion text not null,
  event_date date,
  consultation_type text not null,
  preferred_date date not null,
  preferred_time time not null,
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  details text
);
