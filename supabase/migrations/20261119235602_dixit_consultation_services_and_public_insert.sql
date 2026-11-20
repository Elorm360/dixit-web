-- Recovered from the production migration history.
begin;

alter table public.consultation_requests
  drop constraint if exists consultation_requests_service_check;

alter table public.consultation_requests
  add constraint consultation_requests_service_check
  check (
    service in (
      'Bespoke',
      'Menswear',
      'Ready to Wear',
      'Occasion Wear',
      'Styling',
      'Other'
    )
  );

alter table public.consultation_requests enable row level security;

drop policy if exists "Public can submit DIXIT consultation requests"
  on public.consultation_requests;

create policy "Public can submit DIXIT consultation requests"
  on public.consultation_requests
  for insert
  to anon
  with check (status = 'new');

grant usage on schema public to anon;

revoke insert on table public.consultation_requests from anon;

grant insert (
  service,
  occasion,
  event_date,
  consultation_type,
  preferred_date,
  preferred_time,
  full_name,
  email,
  phone,
  location,
  details
)
on table public.consultation_requests
to anon;

comment on table public.consultation_requests is
  'Private consultation requests. Public visitors may submit new requests only; staff access is governed by RLS.';

commit;
