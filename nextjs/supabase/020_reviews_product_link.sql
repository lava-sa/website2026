-- Link reviews to products and store structured Q&A for display
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS product_slug text;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_scope text NOT NULL DEFAULT 'product';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS answers_json jsonb;

COMMENT ON COLUMN reviews.product_slug IS 'Product slug when review_scope = product; null for general service reviews';
COMMENT ON COLUMN reviews.review_scope IS 'general = service/support; product = specific machine or product';
COMMENT ON COLUMN reviews.answers_json IS 'Array of {question, answer} objects for structured display';

CREATE INDEX IF NOT EXISTS reviews_product_slug_approved
  ON reviews (product_slug, created_at DESC)
  WHERE approved = true;

CREATE INDEX IF NOT EXISTS reviews_scope_approved
  ON reviews (review_scope, created_at DESC)
  WHERE approved = true;
