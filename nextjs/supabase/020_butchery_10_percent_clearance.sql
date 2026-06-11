-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Butchery range: 10% off + clearance tag
-- Run in Supabase SQL Editor (idempotent)
--
-- Sets sale_price to 90% of regular_price and adds the
-- "clearance" tag so products appear in Special Offers →
-- Clearance without duplicating product rows or URLs.
-- ═══════════════════════════════════════════════════════

UPDATE products
SET
  sale_price = ROUND(regular_price * 0.9, 0),
  tags = CASE
    WHEN COALESCE(tags, '{}') @> ARRAY['clearance']::text[] THEN tags
    ELSE array_append(COALESCE(tags, '{}'), 'clearance')
  END,
  updated_at = now()
WHERE category_id = (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1)
  AND is_published = true
  AND regular_price > 0;

-- Optional: include discontinued / limited-stock machines in Clearance listing
-- (same PDP URL — no duplicate rows)
UPDATE products
SET
  tags = CASE
    WHEN COALESCE(tags, '{}') @> ARRAY['clearance']::text[] THEN tags
    ELSE array_append(COALESCE(tags, '{}'), 'clearance')
  END,
  updated_at = now()
WHERE is_published = true
  AND (
    COALESCE(tags, '{}') @> ARRAY['discontinued']::text[]
    OR COALESCE(tags, '{}') @> ARRAY['limited-stock']::text[]
  )
  AND NOT (COALESCE(tags, '{}') @> ARRAY['clearance']::text[]);
