-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Recalculate clearance sale prices after June 2026 price sync
-- Run after 026_price_list_june_2026.sql
--
-- Problem: 020_butchery_10_percent_clearance.sql set sale_price once from
-- old regular_price (e.g. R302 → R272). When regular_price moved to R399,
-- sale_price was left stale. 10% off R399 = R359, not R272.
-- ═══════════════════════════════════════════════════════

-- Butchery clearance: always 90% of current regular_price
UPDATE products
SET
  sale_price = ROUND(regular_price * 0.9, 0),
  updated_at = NOW()
WHERE category_id = (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1)
  AND is_published = true
  AND regular_price > 0
  AND COALESCE(tags, '{}') @> ARRAY['clearance']::text[];

-- Any other clearance-tagged product with a stale sale_price
UPDATE products
SET
  sale_price = ROUND(regular_price * 0.9, 0),
  updated_at = NOW()
WHERE is_published = true
  AND regular_price > 0
  AND sale_price IS NOT NULL
  AND sale_price > 0
  AND COALESCE(tags, '{}') @> ARRAY['clearance']::text[]
  AND sale_price <> ROUND(regular_price * 0.9, 0);

-- Remove sale_price where it equals or exceeds regular (invalid sale)
UPDATE products
SET sale_price = NULL, updated_at = NOW()
WHERE sale_price IS NOT NULL
  AND regular_price > 0
  AND sale_price >= regular_price;
