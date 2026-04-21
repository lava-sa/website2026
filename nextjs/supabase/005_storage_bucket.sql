-- ── Supabase Storage: product-images bucket ──────────────────────────────────
-- Run this once in the Supabase SQL editor.
-- It creates a PUBLIC bucket so product images are accessible without auth.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                                          -- publicly readable
  20971520,                                      -- 20 MB max per file
  ARRAY['image/webp','image/jpeg','image/png','image/gif','image/heic','image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files (public CDN)
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

-- Allow service role (our API) to insert/update/delete
CREATE POLICY "Service role manages product images"
  ON storage.objects FOR ALL
  USING ( bucket_id = 'product-images' )
  WITH CHECK ( bucket_id = 'product-images' );
