-- Recovered from the production migration history.
create table public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'scheduled', 'completed', 'archived')),
  service text not null
    check (service in (
      'Suit',
      'Traditional / Fusion',
      'Wedding',
      'Occasion Wear',
      'Smart Casual',
      'Styling',
      'Other'
    )),
  occasion text not null check (char_length(occasion) between 1 and 200),
  event_date date,
  consultation_type text not null check (consultation_type in ('Atelier', 'Remote')),
  preferred_date date not null,
  preferred_time time not null,
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 5 and 40),
  location text not null check (char_length(location) between 1 and 120),
  details text check (char_length(details) <= 3000)
);

comment on table public.consultation_requests is
  'Private consultation requests submitted through the website. Written only by the server with the secret key.';

create index consultation_requests_created_at_idx
  on public.consultation_requests (created_at desc);

create index consultation_requests_status_idx
  on public.consultation_requests (status);

alter table public.consultation_requests enable row level security;

revoke all on table public.consultation_requests from anon, authenticated;
