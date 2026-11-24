-- Lets staff pick pieces to feature on the home page.
-- Existing row-level security already limits updates to staff.

begin;

alter table public.pieces
  add column if not exists featured boolean not null default false;

create index if not exists pieces_published_featured_idx
  on public.pieces (featured desc, sort_order)
  where published;

commit;
