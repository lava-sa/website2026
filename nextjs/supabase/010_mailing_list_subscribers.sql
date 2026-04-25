-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Mailing List Subscribers
-- Run once in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

create table if not exists mailing_list_subscribers (
  id                uuid default gen_random_uuid() primary key,
  email             text not null unique,
  first_name        text,
  source            text,  -- e.g. footer, homepage, contact
  opted_in          boolean not null default true,
  opted_in_at       timestamptz not null default now(),
  unsubscribed_at   timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_mailing_list_opted_in
  on mailing_list_subscribers(opted_in, opted_in_at desc);

create trigger mailing_list_subscribers_updated_at
  before update on mailing_list_subscribers
  for each row execute function update_updated_at();

alter table mailing_list_subscribers enable row level security;

