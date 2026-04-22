-- Add 3 missing vacuum bag products
-- Run in Supabase SQL Editor

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0032',
  'Embossed Vacuum Bags 25 × 35 cm — 50 Bags',
  '25-x-35-cm-50-bags-embossed-vacuum-bags',
  'Popular 25 × 35 cm embossed vacuum bags — ideal for large steaks, pork chops, and whole fish. Pack of 50.',
  NULL,
  520.00, NULL, 'in_stock', 50,
  '/images/products/bags/embossed-vacuum-bags-25-x-35-cm-50-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = true,
  updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0033',
  'Embossed Vacuum Bags 30 × 40 cm — 50 Bags',
  '30-x-40-cm-50-bags-embossed-vacuum-bags',
  'Large 30 × 40 cm embossed vacuum bags — for whole chickens, shoulders, and large roasts. Pack of 50.',
  NULL,
  655.00, NULL, 'in_stock', 50,
  '/images/products/bags/embossed-vacuum-bags-30-x-40-cm-50-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = true,
  updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, sale_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, updated_at)
VALUES (
  'VL0131',
  'Embossed Vacuum Bags 70 × 100 cm — 10 Bags',
  '70-x-100-cm-10-bags-embossed-vacuum-bags',
  'Extra-large 70 × 100 cm embossed vacuum bags — for whole game carcases and industrial butchery use. Pack of 10.',
  NULL,
  910.00, NULL, 'in_stock', 10,
  '/images/products/bags/embossed-vacuum-bags-70-x-100-cm-10-bags.jpg',
  true, false,
  (SELECT id FROM categories WHERE slug = 'vacuum-bags' LIMIT 1),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = true,
  updated_at = NOW();
