-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Mini CRM Broadcasts + Templates
-- Run once in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

create table if not exists marketing_email_templates (
  key         text primary key,
  name        text not null,
  subject     text not null,
  html_body   text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger marketing_email_templates_updated_at
  before update on marketing_email_templates
  for each row execute function update_updated_at();

alter table marketing_email_templates enable row level security;

create table if not exists marketing_broadcasts (
  id              uuid default gen_random_uuid() primary key,
  name            text not null,
  segment_type    text not null check (segment_type in ('opted_in', 'purchasers', 'region')),
  region          text,
  template_key    text not null references marketing_email_templates(key),
  subject         text not null,
  html_body       text not null,
  status          text not null default 'draft' check (status in ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_for   timestamptz,
  sent_at         timestamptz,
  recipient_count integer not null default 0,
  sent_count      integer not null default 0,
  failed_count    integer not null default 0,
  last_error      text,
  created_by      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_marketing_broadcasts_status_schedule
  on marketing_broadcasts(status, scheduled_for asc);

create trigger marketing_broadcasts_updated_at
  before update on marketing_broadcasts
  for each row execute function update_updated_at();

alter table marketing_broadcasts enable row level security;

insert into marketing_email_templates (key, name, subject, html_body)
values
  (
    'product-news',
    'Product News',
    'LAVA update: New products and practical tips',
    '<p style="margin:0 0 12px;">Hi {{first_name}},</p><p style="margin:0 0 12px;">We have fresh updates from LAVA South Africa.</p><p style="margin:0;">Edit this content in Admin before sending.</p>'
  ),
  (
    'special-offer',
    'Special Offer',
    'Limited-time offer from LAVA South Africa',
    '<p style="margin:0 0 12px;">Hi {{first_name}},</p><p style="margin:0 0 12px;">We are running a short offer for our mailing list members.</p><p style="margin:0;">Edit this offer details before sending.</p>'
  ),
  (
    'customer-check-in',
    'Customer Check-in',
    'How can we help with your packaging setup?',
    '<p style="margin:0 0 12px;">Hi {{first_name}},</p><p style="margin:0 0 12px;">Quick check-in from the LAVA team. Reply if you want help with product recommendations.</p><p style="margin:0;">Edit this message before sending.</p>'
  )
on conflict (key) do nothing;
