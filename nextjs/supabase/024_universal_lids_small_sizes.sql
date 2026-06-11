-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Universal vacuum lids: small sizes (XS + S)
-- Source: la-va.com / LAVA 2024 order form
-- Run in Supabase SQL Editor (idempotent)
--
-- SA pricing formula (from VL0085 anchor):
--   R850 ÷ €27.95 ≈ 30.41 — rounded to nearest R10
--   VL0180 €7.95  → R240
--   VL0181 €10.95 → R330
-- Confirm with Anneke before finalising.
-- Images: public/images/products/lids/
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, sort_order)
VALUES ('Containers & Lids', 'containers-lids', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- ── VL0180 — 4.7–11.2 cm (47–112 mm) ───────────────────────────────────────

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  primary_image_url, is_published, is_featured, category_id,
  sort_order, seo_title, seo_description, specs, tags, industries, updated_at
)
VALUES (
  'VL0180',
  'LAVA Universal Vacuum Lid 47–112mm',
  'acrylic-container-lid-47-112mm',
  'Small universal vacuum lid for jars, cans and bowls with a rim diameter of 47–112 mm. BPA-free polycarbonate with integrated valve.',
  '<p>The <strong>LAVA universal vacuum lid (47–112 mm)</strong> vacuum-seals small household containers — preserving jars, cans, ramekins and small bowls with a smooth, flat rim.</p>
<ul>
<li><strong>Fits rim diameter:</strong> 47–112 mm (4.7–11.2 cm)</li>
<li>Shatterproof BPA-free polycarbonate with wide sealing rim</li>
<li>Integrated vacuum valve — works with all LAVA machines and the Easy Pump</li>
<li>Suitable for refrigerator and freezer storage</li>
<li>Container must have a smooth, flat rim and be sturdy enough for vacuum pressure</li>
</ul>',
  240,
  NULL,
  'in_stock',
  NULL,
  '/images/products/lids/lava-sa-vacuum-container-acrylic-lid-47-112mm-vl0180.webp',
  true,
  false,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1),
  9,
  'LAVA Universal Vacuum Lid 47–112mm — Lava-SA',
  'Small LAVA universal vacuum lid for jars and bowls 47–112 mm diameter. BPA-free, fits all LAVA sealers and Easy Pump.',
  jsonb_build_object(
    'fits_diameter', '47–112 mm (4.7–11.2 cm)',
    'material', 'BPA-free polycarbonate',
    'valve', 'Integrated vacuum valve',
    'compatibility', 'All LAVA vacuum sealers and Easy Pump'
  ),
  ARRAY['lid', 'acrylic', 'universal', 'replacement', '47-112mm']::text[],
  ARRAY['kitchen']::text[],
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  specs = EXCLUDED.specs,
  tags = EXCLUDED.tags,
  updated_at = now();

-- ── VL0181 — 7.6–14.3 cm (76–143 mm) ───────────────────────────────────────

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  primary_image_url, is_published, is_featured, category_id,
  sort_order, seo_title, seo_description, specs, tags, industries, updated_at
)
VALUES (
  'VL0181',
  'LAVA Universal Vacuum Lid 76–143mm',
  'acrylic-container-lid-76-143mm',
  'Medium universal vacuum lid for bowls and preserving jars with a rim diameter of 76–143 mm. BPA-free polycarbonate with integrated valve.',
  '<p>The <strong>LAVA universal vacuum lid (76–143 mm)</strong> fits medium bowls, preserving jars and kitchen containers — sealing almost any vessel with a smooth, flat rim under professional vacuum.</p>
<ul>
<li><strong>Fits rim diameter:</strong> 76–143 mm (7.6–14.3 cm)</li>
<li>Shatterproof BPA-free polycarbonate with wide sealing rim</li>
<li>Integrated vacuum valve — works with all LAVA machines and the Easy Pump</li>
<li>Suitable for refrigerator and freezer storage</li>
<li>Extra-wide sealing rim fits several container sizes within the range</li>
</ul>',
  330,
  NULL,
  'in_stock',
  NULL,
  '/images/products/lids/lava-sa-vacuum-container-acrylic-lid-76-143mm-vl0181.webp',
  true,
  false,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1),
  10,
  'LAVA Universal Vacuum Lid 76–143mm — Lava-SA',
  'Medium LAVA universal vacuum lid for bowls and jars 76–143 mm diameter. BPA-free, fits all LAVA sealers and Easy Pump.',
  jsonb_build_object(
    'fits_diameter', '76–143 mm (7.6–14.3 cm)',
    'material', 'BPA-free polycarbonate',
    'valve', 'Integrated vacuum valve',
    'compatibility', 'All LAVA vacuum sealers and Easy Pump'
  ),
  ARRAY['lid', 'acrylic', 'universal', 'replacement', '76-143mm']::text[],
  ARRAY['kitchen']::text[],
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  specs = EXCLUDED.specs,
  tags = EXCLUDED.tags,
  updated_at = now();

-- Gallery placeholders
DELETE FROM product_images
WHERE product_id IN (
  SELECT id FROM products
  WHERE slug IN ('acrylic-container-lid-47-112mm', 'acrylic-container-lid-76-143mm')
);

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT p.id, v.url, v.alt, v.is_primary, v.sort_order
FROM (
  VALUES
    ('acrylic-container-lid-47-112mm', '/images/products/lids/lava-sa-vacuum-container-acrylic-lid-47-112mm-vl0180.webp', 'LAVA Universal Vacuum Lid 47–112mm', true, 0),
    ('acrylic-container-lid-76-143mm', '/images/products/lids/lava-sa-vacuum-container-acrylic-lid-76-143mm-vl0181.webp', 'LAVA Universal Vacuum Lid 76–143mm', true, 0)
) AS v(slug, url, alt, is_primary, sort_order)
JOIN products p ON p.slug = v.slug;
