-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Product slug redirects (301 when slug changes)
-- Run in Supabase SQL Editor (idempotent)
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS product_slug_redirects (
  old_slug   text PRIMARY KEY,
  new_slug   text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_slug_redirects_new_slug_idx
  ON product_slug_redirects (new_slug);

ALTER TABLE product_slug_redirects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_product_slug_redirects" ON product_slug_redirects;
CREATE POLICY "public_read_product_slug_redirects"
  ON product_slug_redirects FOR SELECT USING (true);
