-- Collection pieces managed from the admin dashboard.

begin;

create table if not exists public.pieces (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection in (
    'womenswear', 'menswear', 'signature', 'bespoke', 'ready-to-wear', 'occasion-wear'
  )),
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  description text check (char_length(description) <= 2000),
  details text[] not null default '{}',
  price numeric(12, 2) check (price is null or price >= 0),
  images text[] not null default '{}',
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (collection, slug)
);

alter table public.pieces enable row level security;

drop policy if exists "Public can read published pieces" on public.pieces;
create policy "Public can read published pieces" on public.pieces
  for select to anon, authenticated using (published or public.is_staff());

drop policy if exists "Staff can insert pieces" on public.pieces;
create policy "Staff can insert pieces" on public.pieces
  for insert to authenticated with check (public.is_staff());

drop policy if exists "Staff can update pieces" on public.pieces;
create policy "Staff can update pieces" on public.pieces
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "Staff can delete pieces" on public.pieces;
create policy "Staff can delete pieces" on public.pieces
  for delete to authenticated using (public.is_staff());

grant select on public.pieces to anon;
grant select, insert, update, delete on public.pieces to authenticated;

-- Photo storage: anyone can view, only staff can upload or remove.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pieces', 'pieces', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

-- Storage needs read access to remove files (public URLs work without it).
drop policy if exists "Staff can list piece photos" on storage.objects;
create policy "Staff can list piece photos" on storage.objects
  for select to authenticated using (bucket_id = 'pieces' and public.is_staff());

drop policy if exists "Staff can upload piece photos" on storage.objects;
create policy "Staff can upload piece photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'pieces' and public.is_staff());

drop policy if exists "Staff can update piece photos" on storage.objects;
create policy "Staff can update piece photos" on storage.objects
  for update to authenticated using (bucket_id = 'pieces' and public.is_staff());

drop policy if exists "Staff can delete piece photos" on storage.objects;
create policy "Staff can delete piece photos" on storage.objects
  for delete to authenticated using (bucket_id = 'pieces' and public.is_staff());

commit;
