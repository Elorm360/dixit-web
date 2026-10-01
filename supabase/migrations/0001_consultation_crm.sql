create extension if not exists pgcrypto;

create type public.consultation_status as enum (
  'new',
  'contacted',
  'consultation_scheduled',
  'in_progress',
  'converted',
  'closed'
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index clients_email_lower_unique
  on public.clients (lower(email));

create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete restrict,
  service text not null,
  occasion text not null,
  event_date date,
  consultation_type text not null check (consultation_type in ('Atelier', 'Remote')),
  preferred_date date not null,
  preferred_time time not null,
  details text,
  status public.consultation_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index consultation_requests_client_id_idx
  on public.consultation_requests (client_id);

create index consultation_requests_status_created_at_idx
  on public.consultation_requests (status, created_at desc);

alter table public.clients enable row level security;
alter table public.consultation_requests enable row level security;

-- No anonymous or authenticated browser policies are created intentionally.
-- Public consultation submissions are written by the Next.js server using
-- the Supabase service-role credential, which must never be exposed client-side.
