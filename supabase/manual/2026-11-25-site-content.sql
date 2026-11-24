-- Editable website content, managed from the studio dashboard.
--   site_content   one row per section (contact, pricing, founder, homepage), stored as JSON
--   testimonials   client quotes for the home page
--   journal_posts  journal articles
--   storage "site" photos for the hero, founder and journal
-- Everyone can read published content; only staff can change it.

begin;

create table if not exists public.site_content (
  key text primary key check (key in ('contact', 'pricing', 'founder', 'homepage')),
  value jsonb not null default '{}'::jsonb check (jsonb_typeof(value) = 'object' and pg_column_size(value) < 65536),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
alter table public.site_content enable row level security;

drop policy if exists "Anyone can read site content" on public.site_content;
create policy "Anyone can read site content" on public.site_content
  for select to anon, authenticated using (true);
drop policy if exists "Staff can add site content" on public.site_content;
create policy "Staff can add site content" on public.site_content
  for insert to authenticated with check ((select public.is_staff()));
drop policy if exists "Staff can edit site content" on public.site_content;
create policy "Staff can edit site content" on public.site_content
  for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null check (char_length(quote) between 1 and 600),
  name text not null check (char_length(name) between 1 and 80),
  detail text check (char_length(detail) <= 120),
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;

drop policy if exists "Public can read published testimonials" on public.testimonials;
create policy "Public can read published testimonials" on public.testimonials
  for select to anon using (published);
drop policy if exists "Signed-in read published testimonials, staff all" on public.testimonials;
create policy "Signed-in read published testimonials, staff all" on public.testimonials
  for select to authenticated using (published or (select public.is_staff()));
drop policy if exists "Staff manage testimonials" on public.testimonials;
create policy "Staff manage testimonials" on public.testimonials
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;

create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 160),
  excerpt text not null default '' check (char_length(excerpt) <= 400),
  body text not null default '' check (char_length(body) <= 30000),
  image text check (image is null or image ~ '^journal/[0-9a-f-]{36}\.(jpe?g|png|webp|avif)$'),
  published_on date not null default current_date,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.journal_posts enable row level security;

drop policy if exists "Public can read published posts" on public.journal_posts;
create policy "Public can read published posts" on public.journal_posts
  for select to anon using (published);
drop policy if exists "Signed-in read published posts, staff all" on public.journal_posts;
create policy "Signed-in read published posts, staff all" on public.journal_posts
  for select to authenticated using (published or (select public.is_staff()));
drop policy if exists "Staff manage posts" on public.journal_posts;
create policy "Staff manage posts" on public.journal_posts
  for all to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

grant select on public.journal_posts to anon, authenticated;
grant insert, update, delete on public.journal_posts to authenticated;

-- Photos for the hero, founder and journal: anyone can view, only staff can change.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site', 'site', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

drop policy if exists "Staff can list site photos" on storage.objects;
create policy "Staff can list site photos" on storage.objects
  for select to authenticated using (bucket_id = 'site' and (select public.is_staff()));
drop policy if exists "Staff can upload site photos" on storage.objects;
create policy "Staff can upload site photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'site' and (select public.is_staff()));
drop policy if exists "Staff can update site photos" on storage.objects;
create policy "Staff can update site photos" on storage.objects
  for update to authenticated using (bucket_id = 'site' and (select public.is_staff()));
drop policy if exists "Staff can delete site photos" on storage.objects;
create policy "Staff can delete site photos" on storage.objects
  for delete to authenticated using (bucket_id = 'site' and (select public.is_staff()));

commit;

insert into supabase_migrations.schema_migrations (version, name) values ('20261125090000', 'dixit_site_content') on conflict do nothing;
