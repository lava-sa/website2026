-- Create the videos storage bucket for video testimonials
-- Run in Supabase SQL Editor → Storage section must be enabled first

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  104857600,  -- 100 MB limit
  ARRAY['video/webm', 'video/mp4', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public             = true,
  file_size_limit    = 104857600,
  allowed_mime_types = ARRAY['video/webm', 'video/mp4', 'video/quicktime'];

-- Allow public read access
CREATE POLICY "Public read access for videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

-- Allow server-side uploads (service role bypasses RLS, but policy needed for anon)
CREATE POLICY "Service role can upload videos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'videos');
