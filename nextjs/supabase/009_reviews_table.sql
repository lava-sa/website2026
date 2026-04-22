-- Reviews table for written reviews and video testimonials
CREATE TABLE IF NOT EXISTS reviews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  name         text NOT NULL,
  email        text,
  machine      text,
  company      text,
  city         text,
  review_type  text NOT NULL DEFAULT 'written',  -- 'written' | 'video'
  rating       smallint,
  headline     text,
  review       text,
  video_url    text,
  approved     boolean NOT NULL DEFAULT false,
  featured     boolean NOT NULL DEFAULT false
);

-- Index for admin queries (unapproved first, newest first)
CREATE INDEX IF NOT EXISTS reviews_approved_created ON reviews (approved, created_at DESC);

-- RLS: only service role can read/write (admin uses service role)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
