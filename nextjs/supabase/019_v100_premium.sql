-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Re-add V.100 Premium (discontinued, limited stock)
-- Run in Supabase SQL Editor (idempotent)
-- Price: R6,495 incl. VAT | Stock: 6 units (per Anneke, Jun 2026)
-- ═══════════════════════════════════════════════════════

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
  weight_kg,
  length_cm,
  width_cm,
  height_cm,
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
  'VL0100P',
  'LAVA V.100 Premium',
  'v100-premium',
  'Discontinued model — limited stock remaining. Entry-level domestic vacuum sealer with manual operation, double seal and German engineering. Ideal for home users who don''t need to vacuum pack large quantities.',
  '<p>The <strong>LAVA V.100 Premium</strong> is the perfect entry-level vacuum sealer for home users looking for quality food preservation without needing to vacuum pack large quantities. <strong>Made in Germany</strong> with a <strong>2-year warranty</strong>, this reliable machine offers excellent value for everyday kitchen use.</p>
<p>Key features include:</p>
<ul>
<li><strong>Manual operation</strong> — simple, intuitive controls for ease of use</li>
<li><strong>Double seal system</strong> — each seal strip 5mm wide for reliable food preservation</li>
<li><strong>Magnetic lid system</strong> — minimal pressure required during operation</li>
<li><strong>Compatible with bags and rolls</strong> — accommodates materials up to 30cm wide</li>
<li><strong>Fast performance</strong> — removes air from medium bags in approximately 10 seconds</li>
<li><strong>Visual indicator</strong> — shows when full vacuum is reached for proper sealing</li>
<li><strong>Container capability</strong> — includes vacuum pump attachment for acrylic containers</li>
</ul>
<p><em>Note: This model has been discontinued. Remaining stock is limited.</em></p>',
  6495,
  NULL,
  'in_stock',
  6,
  3.95,
  41,
  21,
  9.8,
  '/images/products/machines/lava-vacuum-sealer-v100-premium.webp',
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'vacuum-machines' LIMIT 1),
  0,
  'LAVA V.100 Premium Vacuum Sealer | Entry-Level Food Preservation',
  'The LAVA V.100 Premium is a German-made semi-automatic vacuum sealer perfect for home kitchens. Features double sealing, LED indicator, and container capability. Ideal for beginners with 2-year warranty.',
  jsonb_build_object(
    'pumps', '1',
    'suction_power', '35 ltr/min',
    'max_vacuum', '-0.80 bar',
    'gauge', 'LED indicator',
    'seal_width', '300 mm',
    'double_seal', 'Yes',
    'manual_seal', 'Yes',
    'auto_seal', 'No',
    'fluid_extract', 'Yes',
    'colour', 'White & Blue',
    'voltage', '230 V',
    'power', '400 W',
    'dimensions', '410 × 210 × 98 mm',
    'weight', '3.95 kg',
    'warranty', '2 years',
    'made_in', 'Germany'
  ),
  ARRAY['entry-level', 'home', 'compact', 'manual', 'V100', 'discontinued', 'limited-stock']::text[],
  ARRAY['kitchen', 'hunting', 'fishing', 'biltong', 'outdoor']::text[],
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
  stock_quantity = EXCLUDED.stock_quantity,
  weight_kg = EXCLUDED.weight_kg,
  length_cm = EXCLUDED.length_cm,
  width_cm = EXCLUDED.width_cm,
  height_cm = EXCLUDED.height_cm,
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

-- ── Gallery image ───────────────────────────────────────────────────────────

DELETE FROM product_images
WHERE product_id IN (SELECT id FROM products WHERE slug = 'v100-premium');

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT p.id, v.url, v.alt, v.is_primary, v.sort_order
FROM (
  VALUES
    ('v100-premium', '/images/products/machines/lava-vacuum-sealer-v100-premium.webp', 'LAVA V.100 Premium vacuum sealer', true, 0)
) AS v(slug, url, alt, is_primary, sort_order)
JOIN products p ON p.slug = v.slug;
