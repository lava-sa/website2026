-- Private bucket for site-review session recordings
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-review-recordings',
  'site-review-recordings',
  false,
  209715200,
  ARRAY['audio/webm', 'audio/ogg', 'audio/mp4', 'video/webm', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public             = false,
  file_size_limit    = 209715200,
  allowed_mime_types = ARRAY['audio/webm', 'audio/ogg', 'audio/mp4', 'video/webm', 'video/mp4'];
