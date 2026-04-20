-- Run in Supabase SQL Editor
-- Adds company and city columns to reviews table

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS city    text;
