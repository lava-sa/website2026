-- Add category/industry fields for targeted mailing campaigns
alter table if exists mailing_list_subscribers
  add column if not exists interest_category text,
  add column if not exists machine_industry text;

create index if not exists idx_mailing_list_interest_category
  on mailing_list_subscribers(interest_category);
