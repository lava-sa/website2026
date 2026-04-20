-- Run this in Supabase SQL Editor
-- Adds video support columns to the existing reviews table

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS review_type text DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS video_url   text;

-- Backfill existing rows as text type
UPDATE reviews SET review_type = 'text' WHERE review_type IS NULL;
