-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Sous Vide products (PDP slugs / cart / search)
-- Run in Supabase SQL Editor (idempotent)
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, sort_order)
VALUES ('Sous Vide', 'sous-vide', 50)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- ── Upsert LX 20 Stick ─────────────────────────────────────────────────────────

INSERT INTO products (
  sku,
  name,
  slug,
  short_description,
  description,
  regular_price,
  sale_price,
  stock_status,
  stock_quantity,
  primary_image_url,
  is_published,
  is_featured,
  category_id,
  sort_order,
  seo_title,
  seo_description,
  specs,
  tags,
  industries,
  updated_at
)
VALUES (
  'LX0020',
  'LX 20 Sous Vide Stick',
  'lx20-sous-vide-stick',
  'Professional precision immersion circulator. Set your temperature, seal your food with LAVA vacuum bags, and achieve restaurant-quality results every time.',
  '<p>The LAVA LX 20 sous vide stick clips to almost any pot or basin and holds water within ±0.1°C of your target — perfect for steak, fish, vegetables and meal prep.</p><p>Pair it with your LAVA vacuum sealer and embossed bags for safe, repeatable low-temperature cooking.</p>',
  4240,
  NULL,
  'in_stock',
  NULL,
  '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20.webp',
  true,
  false,
  (SELECT id FROM categories WHERE slug = 'sous-vide' LIMIT 1),
  100,
  'LX 20 Sous Vide Stick — Lava-SA',
  'Buy the LAVA LX 20 sous vide precision cooker — ±0.1°C accuracy, 1,200 W, nationwide delivery from Lava-SA.',
  jsonb_build_object(
    'temperature_range', '25°C – 95°C',
    'temperature_accuracy', '±0.1°C',
    'flow_rate', '8 litres / min',
    'max_container_size', '15 litres',
    'power', '1,200 W',
    'display', 'Digital LED',
    'timer', 'Up to 99 hours'
  ),
  ARRAY['sous-vide', 'kitchen']::text[],
  ARRAY['kitchen']::text[],
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  sale_price = EXCLUDED.sale_price,
  stock_status = EXCLUDED.stock_status,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  specs = EXCLUDED.specs,
  tags = EXCLUDED.tags,
  industries = EXCLUDED.industries,
  updated_at = now();

-- ── Upsert Set XXL ────────────────────────────────────────────────────────────

INSERT INTO products (
  sku,
  name,
  slug,
  short_description,
  description,
  regular_price,
  sale_price,
  stock_status,
  stock_quantity,
  primary_image_url,
  is_published,
  is_featured,
  category_id,
  sort_order,
  seo_title,
  seo_description,
  specs,
  tags,
  industries,
  updated_at
)
VALUES (
  'LX0033',
  'Sous Vide Set XXL',
  'lx33-sous-vide-set',
  'Everything you need to start sous vide: LX 20 stick, 12-litre basin, rack and insulation cover — ready out of the box.',
  '<p>This complete set includes the LX 20 immersion circulator plus a matched basin, rack and insulation cover so you can start precision cooking immediately — no hunting for the right container.</p><p>Ideal if you want one box with everything matched to LAVA quality.</p>',
  6210,
  NULL,
  'in_stock',
  NULL,
  '/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl.webp',
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'sous-vide' LIMIT 1),
  101,
  'Sous Vide Set XXL — Lava-SA',
  'LAVA sous vide complete set with LX 20 stick, basin, rack and cover — German precision, SA support.',
  jsonb_build_object(
    'includes', 'LX 20 Stick + Basin + Rack + Insulation',
    'basin_capacity', '12 litres',
    'temperature_range', '25°C – 95°C',
    'temperature_accuracy', '±0.1°C',
    'power', '1,200 W',
    'timer', 'Up to 99 hours'
  ),
  ARRAY['sous-vide', 'kitchen']::text[],
  ARRAY['kitchen']::text[],
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  sale_price = EXCLUDED.sale_price,
  stock_status = EXCLUDED.stock_status,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  specs = EXCLUDED.specs,
  tags = EXCLUDED.tags,
  industries = EXCLUDED.industries,
  updated_at = now();

-- ── Gallery images (replace existing rows for these products) ───────────────

DELETE FROM product_images
WHERE product_id IN (
  SELECT id FROM products WHERE slug IN ('lx20-sous-vide-stick', 'lx33-sous-vide-set')
);

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT p.id, v.url, v.alt, v.is_primary, v.sort_order
FROM (
  VALUES
    ('lx20-sous-vide-stick', '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20.webp', 'LX 20 Sous Vide Stick', true, 0),
    ('lx20-sous-vide-stick', '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20-01.webp', 'LX 20 Sous Vide Stick', false, 1),
    ('lx20-sous-vide-stick', '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20-02.webp', 'LX 20 Sous Vide Stick', false, 2),
    ('lx20-sous-vide-stick', '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20-03.webp', 'LX 20 Sous Vide Stick', false, 3),
    ('lx20-sous-vide-stick', '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20-04.webp', 'LX 20 Sous Vide Stick', false, 4),
    ('lx20-sous-vide-stick', '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20-05.webp', 'LX 20 Sous Vide Stick', false, 5),
    ('lx20-sous-vide-stick', '/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20-06.webp', 'LX 20 Sous Vide Stick', false, 6),
    ('lx33-sous-vide-set', '/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl.webp', 'Sous Vide Set XXL', true, 0),
    ('lx33-sous-vide-set', '/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl-01.webp', 'Sous Vide Set XXL', false, 1),
    ('lx33-sous-vide-set', '/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl-02.webp', 'Sous Vide Set XXL', false, 2),
    ('lx33-sous-vide-set', '/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl-03.webp', 'Sous Vide Set XXL', false, 3),
    ('lx33-sous-vide-set', '/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl-04.webp', 'Sous Vide Set XXL', false, 4),
    ('lx33-sous-vide-set', '/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl-05.webp', 'Sous Vide Set XXL', false, 5)
) AS v(slug, url, alt, is_primary, sort_order)
JOIN products p ON p.slug = v.slug;
