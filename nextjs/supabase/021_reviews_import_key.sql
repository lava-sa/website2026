-- Track imported legacy reviews (reviews.json, homepage) and avoid duplicate imports
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS legacy_import_key text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'customer';

CREATE UNIQUE INDEX IF NOT EXISTS reviews_legacy_import_key_unique
  ON reviews (legacy_import_key)
  WHERE legacy_import_key IS NOT NULL;

COMMENT ON COLUMN reviews.legacy_import_key IS 'Stable key for idempotent imports e.g. static:v300-premium-x:0';
COMMENT ON COLUMN reviews.source IS 'customer = submitted via form; imported = migrated from reviews.json or homepage';
