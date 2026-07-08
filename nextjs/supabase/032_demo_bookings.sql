-- LAVA-SA — Book a Demonstration (Tue/Wed/Thu, 10:00 / 11:00 / 12:00)
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.demo_bookings (
  id              uuid         default gen_random_uuid() primary key,
  reference       text         not null unique,
  demo_type       text         not null,
  demo_slug       text         not null,
  customer_name   text         not null,
  customer_email  text         not null,
  customer_phone  text         not null,
  date            date         not null,
  time_slot       text         not null,
  notes           text,
  status          text         not null default 'confirmed',
  created_at      timestamptz  default now() not null
);

create index if not exists demo_bookings_date_idx on public.demo_bookings (date);
create index if not exists demo_bookings_status_idx on public.demo_bookings (status);

-- One active booking per slot (race-condition guard at DB level)
create unique index if not exists demo_bookings_active_slot_idx
  on public.demo_bookings (date, time_slot)
  where status <> 'cancelled';

alter table public.demo_bookings enable row level security;
