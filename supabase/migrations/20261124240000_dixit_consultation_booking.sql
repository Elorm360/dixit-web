-- Confirmed consultation time, set by staff when they book a client in.
-- The client's preferred date/time stays as they submitted it.

begin;

alter table public.consultation_requests
  add column if not exists consultation_at timestamptz;

grant update (consultation_at) on table public.consultation_requests to authenticated;

create index if not exists consultation_requests_consultation_at_idx
  on public.consultation_requests (consultation_at)
  where consultation_at is not null;

-- Client history looks enquiries up by email and phone.
create index if not exists consultation_requests_email_idx
  on public.consultation_requests (lower(email));

commit;
