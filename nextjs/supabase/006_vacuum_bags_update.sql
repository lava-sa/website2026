-- ── Vacuum Bags: update images + add missing products ─────────────────────────
-- Run in Supabase SQL Editor.
-- Updates primary_image_url for all 12 bags to new local images.
-- Inserts the 6 missing products if they don't exist yet.
-- Uses ON CONFLICT (slug) DO UPDATE so existing products are safe to re-run.

-- ── 1. Get the vacuum-bags category ID ───────────────────────────────────────
-- (used in INSERT statements below)

-- ── 2. Update images for products that already exist ─────────────────────────

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-13-x-22.5-cm-50-bags.webp'
  WHERE slug = '13-x-22-5-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-15-x-45-cm-50-bags.jpg'
  WHERE slug = '15-x-45-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-16-x-25-cm-50-bags.jpg'
  WHERE slug = '16-x-25-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-20-x-30-cm-50-bags.jpg'
  WHERE slug = '20-x-30-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-25-x-35-cm-50-bags.jpg'
  WHERE slug = '25-x-35-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-25-x-40-cm-50-bags.jpg'
  WHERE slug = '25-x-40-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-30-x-40-cm-50-bags.jpg'
  WHERE slug = '30-x-40-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-30-x-50-cm-50-bags.jpg'
  WHERE slug = '30-x-50-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-35-x-50-cm-50-bags.jpg'
  WHERE slug = '35-x-50-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-40-x-60-cm-50-bags.jpg'
  WHERE slug = '40-x-60-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-60-x-80-cm-10-bags.jpg'
  WHERE slug = '60-x-80-cm-10-bags-embossed-vacuum-bags';

UPDATE products SET primary_image_url = '/images/products/bags/embossed-vacuum-bags-70-x-100-cm-10-bags.jpg'
  WHERE slug = '70-x-100-cm-10-bags-embossed-vacuum-bags';


-- ── 3. Insert the 6 missing bag products (safe to re-run — ON CONFLICT skips) ─

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0022',
  'Embossed Vacuum Bags 15 × 45 cm — 50 Bags',
  '15-x-45-cm-50-bags-embossed-vacuum-bags',
  'Long 15 × 45 cm embossed vacuum bags — ideal for sausages, biltong strips, and whole fish. Pack of 50.',
  NULL,
  420.00, NULL, 'in_stock', 50,
  '/images/products/bags/embossed-vacuum-bags-15-x-45-cm-50-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  regular_price     = EXCLUDED.regular_price,
  is_published      = EXCLUDED.is_published,
  updated_at        = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0021',
  'Embossed Vacuum Bags 16 × 25 cm — 50 Bags',
  '16-x-25-cm-50-bags-embossed-vacuum-bags',
  'Compact 16 × 25 cm embossed vacuum bags — great for individual steaks, chicken fillets, and portions. Pack of 50.',
  NULL,
  265.00, NULL, 'in_stock', 50,
  '/images/products/bags/embossed-vacuum-bags-16-x-25-cm-50-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  regular_price     = EXCLUDED.regular_price,
  is_published      = EXCLUDED.is_published,
  updated_at        = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0027',
  'Embossed Vacuum Bags 30 × 50 cm — 50 Bags',
  '30-x-50-cm-50-bags-embossed-vacuum-bags',
  'Large 30 × 50 cm embossed vacuum bags — for whole chickens, large roasts, and game portions. Pack of 50.',
  NULL,
  595.00, NULL, 'in_stock', 50,
  '/images/products/bags/embossed-vacuum-bags-30-x-50-cm-50-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  regular_price     = EXCLUDED.regular_price,
  is_published      = EXCLUDED.is_published,
  updated_at        = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0028',
  'Embossed Vacuum Bags 35 × 50 cm — 50 Bags',
  '35-x-50-cm-50-bags-embossed-vacuum-bags',
  'Extra-large 35 × 50 cm embossed vacuum bags — fits legs of lamb, large game portions, and bulk packs. Pack of 50.',
  NULL,
  995.00, NULL, 'in_stock', 50,
  '/images/products/bags/embossed-vacuum-bags-35-x-50-cm-50-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  regular_price     = EXCLUDED.regular_price,
  is_published      = EXCLUDED.is_published,
  updated_at        = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0029',
  'Embossed Vacuum Bags 40 × 60 cm — 50 Bags',
  '40-x-60-cm-50-bags-embossed-vacuum-bags',
  'Commercial-size 40 × 60 cm embossed vacuum bags — for whole game, large cuts, and production use. Pack of 50.',
  NULL,
  1310.00, NULL, 'in_stock', 50,
  '/images/products/bags/embossed-vacuum-bags-40-x-60-cm-50-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  regular_price     = EXCLUDED.regular_price,
  is_published      = EXCLUDED.is_published,
  updated_at        = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0031',
  'Embossed Vacuum Bags 60 × 80 cm — 10 Bags',
  '60-x-80-cm-10-bags-embossed-vacuum-bags',
  'Heavy-duty 60 × 80 cm embossed vacuum bags — for whole carcases, large game, and butchery use. Pack of 10.',
  NULL,
  590.00, NULL, 'in_stock', 10,
  '/images/products/bags/embossed-vacuum-bags-60-x-80-cm-10-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  regular_price     = EXCLUDED.regular_price,
  is_published      = EXCLUDED.is_published,
  updated_at        = NOW();
