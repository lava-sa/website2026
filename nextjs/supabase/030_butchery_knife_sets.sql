-- 030: Butchery knife sets from June 2026 Landig price list
-- Z11061  3 Piece white handle Lava Kitchen Knife set     R500  (no image yet — pending from Anneke)
-- Z11060  Knife set (3 butcher's knives) Yellow Handle    R750
-- Z11052  Knife set (3 butcher's knives) Black Handle    R1,315
--
-- Run in Supabase SQL editor after 026 if knife sets are missing from /products/butchery-knives

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'Z11060',
  'Knife Set (3 Butcher''s Knives) — Yellow Handle',
  'butcher-knife-set-yellow-3pc',
  'Professional 3-piece butcher knife set with high-visibility yellow handles.',
  '<p>Complete <strong>3-piece butcher knife set</strong> with ergonomic yellow handles for wet-hand grip and easy identification in busy processing environments.</p><ul><li>3 professional butcher knives</li><li>High-visibility yellow handles</li><li>Stainless steel blades</li></ul>',
  750, 'on_order', 0,
  '/images/products/butchery/butcher-knife-set-yellow-3pc-z11060.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 40,
  ARRAY['knife', 'knife-set', 'butchery']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  tags = EXCLUDED.tags,
  category_id = EXCLUDED.category_id,
  updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'Z11052',
  'Knife Set (3 Butcher''s Knives) — Black Handle',
  'butcher-knife-set-black-3pc',
  'Premium 3-piece butcher knife set with black handles — professional meat processing essentials.',
  '<p>Premium <strong>3-piece butcher knife set</strong> with black ergonomic handles — the professional choice for daily meat processing.</p><ul><li>3 professional butcher knives</li><li>Ergonomic black handles</li><li>High-carbon stainless steel</li></ul>',
  1315, 'on_order', 0,
  '/images/products/butchery/butcher-knife-set-black-3pc-z11052.webp',
  true, true,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 41,
  ARRAY['knife', 'knife-set', 'butchery']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  tags = EXCLUDED.tags,
  category_id = EXCLUDED.category_id,
  updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'Z11061',
  '3-Piece White Handle LAVA Kitchen Knife Set',
  'kitchen-knife-set-white-3pc',
  '3-piece white-handle LAVA kitchen knife set — versatile blades for home and catering prep.',
  '<p><strong>3-piece LAVA kitchen knife set</strong> with white handles — ideal for everyday kitchen and light butchery tasks.</p><ul><li>3 kitchen knives</li><li>White ergonomic handles</li><li>Stainless steel blades</li></ul>',
  500, 'in_stock', 5,
  NULL,
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 42,
  ARRAY['knife', 'knife-set', 'kitchen']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  tags = EXCLUDED.tags,
  category_id = EXCLUDED.category_id,
  updated_at = NOW();
