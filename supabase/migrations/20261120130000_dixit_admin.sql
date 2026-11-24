-- DIXIT studio dashboard: enquiry notes and the "in progress" status.
-- Staff access uses the existing private.staff_members / public.is_staff() setup.
-- Add a staff member with:
--   insert into private.staff_members (user_id, email)
--   select id, email from auth.users where email = 'person@example.com';

begin;

alter table public.consultation_requests
  drop constraint if exists consultation_requests_status_check;
alter table public.consultation_requests
  add constraint consultation_requests_status_check
  check (status in ('new', 'contacted', 'scheduled', 'in_progress', 'completed', 'archived'));

alter table public.consultation_requests add column if not exists notes text
  check (char_length(notes) <= 10000);
alter table public.consultation_requests add column if not exists updated_at timestamptz;

-- Staff already have table-wide SELECT and may update status; allow the new fields too.
grant update (status, notes, updated_at) on table public.consultation_requests to authenticated;

commit;
