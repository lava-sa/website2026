-- Run this in Supabase → SQL Editor to create the reviews table

create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  machine     text,
  rating      int  not null check (rating between 1 and 5),
  headline    text not null,
  review      text not null,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index for fast unapproved lookups
create index if not exists reviews_approved_idx on reviews (approved);

-- Disable public read access (only service role can read)
alter table reviews enable row level security;

-- Allow service role full access (used by Next.js API routes)
create policy "service_role_all" on reviews
  for all
  using (true)
  with check (true);
