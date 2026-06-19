-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Sous Vide Set XXL Stainless Steel (LX0035)
-- Source: https://la-va.com/en/sous-vide-set-xxl-stainless-steel/
-- Price: R6,210 — same as LX0033 pending Anneke confirmation (la-va.de €209 vs €175 standard)
-- Images: public/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/
-- Run in Supabase SQL Editor after 012_sous_vide_products.sql (idempotent)
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, sort_order)
VALUES ('Sous Vide', 'sous-vide', 50)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Tag existing sets for category page filtering
UPDATE products
SET tags = CASE
  WHEN COALESCE(tags, '{}') @> ARRAY['complete-set']::text[] THEN tags
  ELSE array_append(COALESCE(tags, '{}'), 'complete-set')
END,
updated_at = now()
WHERE slug = 'lx33-sous-vide-set';

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
  'LX0035',
  'Sous Vide Set XXL — Stainless Steel',
  'sous-vide-set-xxl-stainless-steel',
  'Premium 6-piece sous vide set with a 12-litre stainless steel basin, LX 20 stick, lids, bag holder and neoprene cover.',
  '<p>The <strong>LAVA Sous Vide Set XXL Stainless Steel</strong> is the premium complete kit for precision low-temperature cooking — everything matched and ready out of the box.</p>
<p><strong>6-piece set includes:</strong></p>
<ul>
<li>LX 20 sous vide immersion circulator (1,200 W, ±0.1°C accuracy, 34 dB)</li>
<li>12-litre heat-resistant <strong>stainless steel basin</strong> (320 × 260 × 200 mm)</li>
<li>Stainless steel lid with handle</li>
<li>Plastic lid with recess for the LX 20 stick — reduces evaporation on long cooks</li>
<li>Stainless steel wire bag holder — fixes up to 5 cooking bags at once</li>
<li>Neoprene insulation cover — reduces heat loss and protects surfaces</li>
</ul>
<p>Ideal for steak, fish, vegetables and multi-bag family meals. Pair with LAVA vacuum bags for restaurant-quality results at home.</p>
<p><em>Price matches the standard Sous Vide Set XXL (LX0033) until confirmed with Lava-SA — the stainless steel basin is the premium upgrade on la-va.com.</em></p>',
  6210,
  NULL,
  'in_stock',
  NULL,
  '/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/lava-sous-vide-set-xxl-stainless-steel.webp',
  true,
  false,
  (SELECT id FROM categories WHERE slug = 'sous-vide' LIMIT 1),
  102,
  'Sous Vide Set XXL Stainless Steel — Lava-SA',
  'LAVA stainless steel sous vide complete set — LX 20 stick, 12 L SS basin, lids, bag holder and neoprene cover. German precision, SA support.',
  jsonb_build_object(
    'includes', 'LX 20 Stick + 12 L SS Basin + SS Lid + Plastic Lid + Bag Holder + Neoprene Cover',
    'basin_material', 'Stainless steel',
    'basin_capacity', '12 litres',
    'basin_dimensions', '320 × 260 × 200 mm (L × W × H)',
    'bag_holder_capacity', 'Up to 5 bags',
    'temperature_range', '0°C – 90°C',
    'temperature_accuracy', '±0.1°C',
    'power', '1,200 W',
    'noise_level', '34 dB',
    'water_protection', 'IPX7',
    'timer', 'Up to 99 h 59 min',
    'water_volume', '5 – 20 litres'
  ),
  ARRAY['sous-vide', 'kitchen', 'complete-set', 'stainless-steel']::text[],
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

DELETE FROM product_images
WHERE product_id = (SELECT id FROM products WHERE slug = 'sous-vide-set-xxl-stainless-steel' LIMIT 1);

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT p.id, v.url, v.alt, v.is_primary, v.sort_order
FROM (
  VALUES
    ('/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/lava-sous-vide-set-xxl-stainless-steel.webp', 'Sous Vide Set XXL Stainless Steel', true, 0),
    ('/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/lava-sous-vide-set-xxl-stainless-steel-01.webp', 'Sous Vide Set XXL Stainless Steel', false, 1),
    ('/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/lava-sous-vide-set-xxl-stainless-steel-02.webp', 'Sous Vide Set XXL Stainless Steel', false, 2),
    ('/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/lava-sous-vide-set-xxl-stainless-steel-03.webp', 'Sous Vide Set XXL Stainless Steel', false, 3),
    ('/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/lava-sous-vide-set-xxl-stainless-steel-04.webp', 'Sous Vide Set XXL Stainless Steel', false, 4),
    ('/images/products/sous-vide/sous-vide-set-xxl-stainless-steel/lava-sous-vide-set-xxl-stainless-steel-05.webp', 'Sous Vide Set XXL Stainless Steel', false, 5)
) AS v(url, alt, is_primary, sort_order)
CROSS JOIN products p
WHERE p.slug = 'sous-vide-set-xxl-stainless-steel';
