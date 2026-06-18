-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Lava Flex Sealer for Jars
-- Source: https://la-va.com/en/lava-flex-sealer-for-jars/
-- Category: containers-lids → /products/glass-jar-sealer
-- Run in Supabase SQL Editor (idempotent)
-- Images: add to public/images/products/containers/lava-flex-sealer-for-jars/
-- Price: provisional (EUR × ~22) — confirm with Anneke
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, sort_order)
VALUES ('Containers & Lids', 'containers-lids', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

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
  'VL1193',
  'LAVA Flex Sealer for Jars',
  'lava-flex-sealer-for-jars',
  'Versatile flex jar sealer for twist-off and mason jars up to 106 mm diameter — round, oval, square or conical. Works with your LAVA vacuum sealer or Easy Pump.',
  '<p>The <strong>LAVA Flex Jar-Sealer</strong> (patent pending) offers an especially easy way to vacuum-seal jars of various sizes and shapes under a professional vacuum — independent of shape, size, or lid type.</p>
<h3>Flexible use — suitable for a wide range of jar shapes</h3>
<p>The jar-sealer is suitable for twist-off jars or mason jars with a diameter of up to <strong>106 mm</strong> and a height of up to <strong>150 mm</strong>. Whether the jar is round, oval, square, or conical, the jar-sealer ensures a reliable vacuum seal. Both coloured and transparent jars can be vacuum sealed with ease.</p>
<p>Depending on their size, multiple jars can be vacuum sealed at the same time, as long as they fit together under the jar-sealer. Vacuum sealing is effortless with the <strong>electric hand pump (Easy Pump)</strong> or a LAVA vacuum sealer.</p>
<h3>How it works</h3>
<ol>
<li><strong>Connection:</strong> Attach the jar-sealer to the LAVA vacuum sealer using the hose.</li>
<li><strong>Preparation:</strong> Place the clean and dry lid with the sealing ring on the jar, or, if using a screw-top jar, screw it on loosely. Then place the jar on a flat surface.</li>
<li><strong>Vacuum sealing:</strong> Operate the vacuum sealer in container mode, place the jar-sealer over the jar, and press it down firmly.</li>
<li><strong>Finish:</strong> Once the device has reached its maximum vacuum pressure, end the process by removing the hose either from the top of the jar-sealer or from the device.</li>
</ol>
<p><strong>Included:</strong> Flex jar-sealer with integrated silicone seal and vacuum hose (approx. 80 cm).</p>',
  699,
  NULL,
  'in_stock',
  NULL,
  '/images/products/containers/lava-flex-sealer-for-jars/lava-flex-sealer-for-jars.webp',
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1),
  48,
  'LAVA Flex Sealer for Jars — Lava-SA',
  'Vacuum-seal twist-off and mason jars of almost any shape with the LAVA Flex Jar-Sealer. Fits jars up to 106 mm diameter. Works with all LAVA machines and the Easy Pump.',
  jsonb_build_object(
    'material', 'ABS plastic housing with flexible silicone seal',
    'hose_length', 'Approx. 80 cm',
    'internal_diameter', 'Up to 106 mm',
    'internal_height', 'Up to 150 mm',
    'jar_types', 'Twist-off and mason jars — round, oval, square or conical',
    'compatibility', 'All LAVA vacuum sealers (container mode) and LAVA Easy Pump'
  ),
  ARRAY['jar-sealer', 'flex-sealer', 'glass', 'accessory', 'sustainable']::text[],
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

-- Gallery placeholders — replace URLs when images are uploaded
DELETE FROM product_images
WHERE product_id IN (SELECT id FROM products WHERE slug = 'lava-flex-sealer-for-jars');

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT p.id, v.url, v.alt, v.is_primary, v.sort_order
FROM (
  VALUES
    ('lava-flex-sealer-for-jars', '/images/products/containers/lava-flex-sealer-for-jars/lava-flex-sealer-for-jars.webp', 'LAVA Flex Sealer for Jars', true, 0),
    ('lava-flex-sealer-for-jars', '/images/products/containers/lava-flex-sealer-for-jars/lava-flex-sealer-for-jars-01.webp', 'LAVA Flex Sealer for Jars — detail', false, 1),
    ('lava-flex-sealer-for-jars', '/images/products/containers/lava-flex-sealer-for-jars/lava-flex-sealer-for-jars-02.webp', 'LAVA Flex Sealer for Jars — in use', false, 2)
) AS v(slug, url, alt, is_primary, sort_order)
JOIN products p ON p.slug = v.slug;
