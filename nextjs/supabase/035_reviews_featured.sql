-- Fix: production `reviews` was created from the legacy supabase-reviews-table.sql,
-- which has no `featured` column. 009_reviews_table.sql declares it, but that file
-- uses CREATE TABLE IF NOT EXISTS, so it silently no-op'd on the existing table.
-- Every other column 009 introduced (company, city, review_type, video_url) got a
-- follow-up ALTER patch; `featured` never did. Hence:
--   fetchApprovedDbReviews: column reviews.featured does not exist
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
