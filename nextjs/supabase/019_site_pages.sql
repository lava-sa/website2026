-- Editable marketing & content pages (admin → /admin/pages)
create table if not exists public.site_pages (
  slug text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

comment on table public.site_pages is 'CMS JSON for static pages edited in /admin/pages';

alter table public.site_pages enable row level security;

create policy "site_pages_public_read"
  on public.site_pages
  for select
  to anon, authenticated
  using (true);
