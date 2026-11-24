-- Adds "Womenswear" to the allowed consultation services (the form now offers it).

begin;

alter table public.consultation_requests
  drop constraint if exists consultation_requests_service_check;

alter table public.consultation_requests
  add constraint consultation_requests_service_check
  check (service in (
    'Bespoke',
    'Womenswear',
    'Menswear',
    'Ready to Wear',
    'Occasion Wear',
    'Styling',
    'Other'
  ));

commit;
