-- Combined review import schema (safe to run if 020/021 were skipped)
-- Required before "Import site reviews" in /admin/reviews
--
-- Production may have been created from supabase-reviews-table.sql (email/headline NOT NULL).
-- The import code supplies placeholder email + derived headline for legacy rows; optional relax:

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS product_slug text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_scope text NOT NULL DEFAULT 'product';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS answers_json jsonb;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS legacy_import_key text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'customer';

-- Allow video testimonials without headline (customer form still requires headline)
ALTER TABLE reviews ALTER COLUMN headline DROP NOT NULL;
ALTER TABLE reviews ALTER COLUMN email DROP NOT NULL;

COMMENT ON COLUMN reviews.product_slug IS 'Product slug when review_scope = product; null for general service reviews';
COMMENT ON COLUMN reviews.review_scope IS 'general = service/support; product = specific machine or product';
COMMENT ON COLUMN reviews.answers_json IS 'Array of {question, answer} objects for structured display';
COMMENT ON COLUMN reviews.legacy_import_key IS 'Stable key for idempotent imports e.g. static:v300-premium-x:0';
COMMENT ON COLUMN reviews.source IS 'customer = submitted via form; imported = migrated from reviews.json or homepage';

CREATE UNIQUE INDEX IF NOT EXISTS reviews_legacy_import_key_unique
  ON reviews (legacy_import_key)
  WHERE legacy_import_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS reviews_product_slug_approved
  ON reviews (product_slug, created_at DESC)
  WHERE approved = true;

CREATE INDEX IF NOT EXISTS reviews_scope_approved
  ON reviews (review_scope, created_at DESC)
  WHERE approved = true;
