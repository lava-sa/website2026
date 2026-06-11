-- ═══════════════════════════════════════════════════════
-- LAVA-SA — G-Line glass + Electric Easy Pump (containers-lids category)
-- Source: la-va.com (Jun 2026)
-- After running this file, also run 022_gline_pump_to_containers.sql if products were previously sous-vide
-- Run in Supabase SQL Editor (idempotent)
-- Images: add tonight — paths below are placeholders
-- Prices: provisional (EUR × ~22) — confirm with Anneke
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, sort_order)
VALUES ('Sous Vide', 'sous-vide', 50)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- Tag existing circulators for page sections
UPDATE products
SET tags = CASE
  WHEN COALESCE(tags, '{}') @> ARRAY['circulator']::text[] THEN tags
  ELSE array_append(COALESCE(tags, '{}'), 'circulator')
END,
updated_at = now()
WHERE slug IN ('lx20-sous-vide-stick', 'lx33-sous-vide-set');

-- ── Electric vacuum pump (Easy Pump) VL2050 ─────────────────────────────────

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  weight_kg, length_cm, width_cm, height_cm,
  primary_image_url, is_published, is_featured, category_id, sort_order,
  seo_title, seo_description, specs, tags, industries, updated_at
)
VALUES (
  'VL2050',
  'LAVA Electric Vacuum Pump (Easy Pump)',
  'electric-vacuum-pump',
  'Electric hand pump for vacuum sealing without a vacuum sealer. Ideal for G-Line glass containers and Flex jar sealer — rechargeable, compact, auto shut-off.',
  '<p>The <strong>LAVA Easy Pump</strong> vacuum-seals G-Line glass containers, vacuum lids and the Flex jar sealer at the push of a button — no vacuum sealer machine required.</p>
<p>Perfect alongside sous vide prep: marinate and vacuum-seal in G-Line glass, then cook precision-low-temperature in your water bath.</p>
<ul>
<li><strong>One-button operation</strong> — automatically switches off at maximum vacuum</li>
<li><strong>Rechargeable</strong> lithium-ion battery with USB-C charging cable included</li>
<li><strong>Compact</strong> — use in the kitchen or on the go</li>
<li><strong>Compatible</strong> with all LAVA vacuum containers, lids and Flex jar sealer</li>
</ul>
<p><strong>Included:</strong> Electric vacuum pump, USB-C charging cable.</p>',
  445,
  NULL,
  'in_stock',
  NULL,
  0.18,
  4.3,
  4.3,
  15.0,
  '/images/products/sous-vide/electric-vacuum-pump/lava-electric-vacuum-pump-easy-pump-vl2050.webp',
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1),
  110,
  'LAVA Electric Vacuum Pump Easy Pump — Lava-SA',
  'Rechargeable LAVA Easy Pump for G-Line glass containers and jar sealer. Vacuum seal without a machine — USB-C, auto shut-off, nationwide delivery.',
  jsonb_build_object(
    'material', 'ABS plastic and BPA-free silicone',
    'dimensions', '43 × 43 × 150 mm',
    'weight', '180 g',
    'battery', 'Rechargeable lithium-ion',
    'charging', 'USB-C (cable included)',
    'operation', 'Button press — auto shut-off at max vacuum',
    'compatible_with', 'G-Line containers, vacuum lids, Flex jar sealer, all LAVA machines via hose'
  ),
  ARRAY['electric-pump', 'g-line', 'accessory', 'easy-pump', 'glass-accessory']::text[],
  ARRAY['kitchen']::text[],
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description,
  description = EXCLUDED.description, regular_price = EXCLUDED.regular_price,
  stock_status = EXCLUDED.stock_status, weight_kg = EXCLUDED.weight_kg,
  length_cm = EXCLUDED.length_cm, width_cm = EXCLUDED.width_cm, height_cm = EXCLUDED.height_cm,
  primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured, category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order, seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description, specs = EXCLUDED.specs,
  tags = EXCLUDED.tags, industries = EXCLUDED.industries, updated_at = now();

-- ── G-Line glass container — black lid VL2008 ────────────────────────────────

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  weight_kg, length_cm, width_cm, height_cm,
  primary_image_url, is_published, is_featured, category_id, sort_order,
  seo_title, seo_description, specs, tags, industries, updated_at
)
VALUES (
  'VL2008',
  'LAVA G-Line Glass Vacuum Container — Black Lid (1.565 L)',
  'g-line-glass-vacuum-container-black',
  'Borosilicate glass vacuum container with black lid. Vacuum or ventilation mode, leak-proof sealing flaps, oven-safe glass to +400°C. Ideal for sous vide prep and marinating.',
  '<p>The <strong>LAVA G-Line glass vacuum container</strong> stores delicate and liquid foods airtight — or in ventilation mode for produce that needs air exchange.</p>
<p>Locking side flaps keep it leak-proof even without vacuum. Vacuum effortlessly with the <strong>Electric Easy Pump</strong> or any LAVA vacuum sealer.</p>
<ul>
<li><strong>1.565 L capacity</strong> — 225 × 175 × 75 mm</li>
<li><strong>Borosilicate glass</strong> — oven-safe to +400°C (without lid)</li>
<li><strong>Integrated ventilation mode</strong> for gas-releasing fruit and vegetables</li>
<li><strong>Stackable</strong> — fridge, freezer, microwave and dishwasher safe</li>
<li><strong>Black ABS lid</strong> with food-grade silicone seal — 100% BPA-free</li>
</ul>
<p><strong>Included:</strong> Glass container, black lid with sealing flaps.</p>',
  645,
  NULL,
  'in_stock',
  NULL,
  1.0,
  22.5,
  17.5,
  7.5,
  '/images/products/sous-vide/g-line-glass-black/lava-g-line-glass-vacuum-container-black-vl2008.webp',
  true,
  false,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1),
  111,
  'G-Line Glass Vacuum Container Black — Lava-SA',
  'LAVA G-Line borosilicate glass vacuum container with black lid. 1.565 L, oven-safe, ventilation mode, pairs with Easy Pump or vacuum sealer.',
  jsonb_build_object(
    'capacity', '1.565 L',
    'dimensions', '225 × 175 × 75 mm (L × W × H)',
    'weight', 'approx. 1.0 kg',
    'glass', 'Heat-resistant borosilicate — oven to +400°C without lid',
    'lid', 'Black ABS with silicone seal and locking flaps',
    'lid_colour', 'Black',
    'modes', 'Vacuum seal or ventilation',
    'dishwasher_safe', 'Yes (container and lid)'
  ),
  ARRAY['g-line', 'glass', 'container', 'black-lid']::text[],
  ARRAY['kitchen']::text[],
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description,
  description = EXCLUDED.description, regular_price = EXCLUDED.regular_price,
  stock_status = EXCLUDED.stock_status, weight_kg = EXCLUDED.weight_kg,
  length_cm = EXCLUDED.length_cm, width_cm = EXCLUDED.width_cm, height_cm = EXCLUDED.height_cm,
  primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured, category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order, seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description, specs = EXCLUDED.specs,
  tags = EXCLUDED.tags, industries = EXCLUDED.industries, updated_at = now();

-- ── G-Line glass container — white lid VL2007 ───────────────────────────────

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  weight_kg, length_cm, width_cm, height_cm,
  primary_image_url, is_published, is_featured, category_id, sort_order,
  seo_title, seo_description, specs, tags, industries, updated_at
)
VALUES (
  'VL2007',
  'LAVA G-Line Glass Vacuum Container — White Lid (1.565 L)',
  'g-line-glass-vacuum-container-white',
  'Borosilicate glass vacuum container with white lid. Vacuum or ventilation mode, leak-proof sealing flaps, oven-safe glass to +400°C. Ideal for sous vide prep and marinating.',
  '<p>The <strong>LAVA G-Line glass vacuum container</strong> stores delicate and liquid foods airtight — or in ventilation mode for produce that needs air exchange.</p>
<p>Locking side flaps keep it leak-proof even without vacuum. Vacuum effortlessly with the <strong>Electric Easy Pump</strong> or any LAVA vacuum sealer.</p>
<ul>
<li><strong>1.565 L capacity</strong> — 225 × 175 × 75 mm</li>
<li><strong>Borosilicate glass</strong> — oven-safe to +400°C (without lid)</li>
<li><strong>Integrated ventilation mode</strong> for gas-releasing fruit and vegetables</li>
<li><strong>Stackable</strong> — fridge, freezer, microwave and dishwasher safe</li>
<li><strong>White ABS lid</strong> with food-grade silicone seal — 100% BPA-free</li>
</ul>
<p><strong>Included:</strong> Glass container, white lid with sealing flaps.</p>',
  645,
  NULL,
  'in_stock',
  NULL,
  1.0,
  22.5,
  17.5,
  7.5,
  '/images/products/sous-vide/g-line-glass-white/lava-g-line-glass-vacuum-container-white-vl2007.webp',
  true,
  false,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1),
  112,
  'G-Line Glass Vacuum Container White — Lava-SA',
  'LAVA G-Line borosilicate glass vacuum container with white lid. 1.565 L, oven-safe, ventilation mode, pairs with Easy Pump or vacuum sealer.',
  jsonb_build_object(
    'capacity', '1.565 L',
    'dimensions', '225 × 175 × 75 mm (L × W × H)',
    'weight', 'approx. 1.0 kg',
    'glass', 'Heat-resistant borosilicate — oven to +400°C without lid',
    'lid', 'White ABS with silicone seal and locking flaps',
    'lid_colour', 'White',
    'modes', 'Vacuum seal or ventilation',
    'dishwasher_safe', 'Yes (container and lid)'
  ),
  ARRAY['g-line', 'glass', 'container', 'white-lid']::text[],
  ARRAY['kitchen']::text[],
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description,
  description = EXCLUDED.description, regular_price = EXCLUDED.regular_price,
  stock_status = EXCLUDED.stock_status, weight_kg = EXCLUDED.weight_kg,
  length_cm = EXCLUDED.length_cm, width_cm = EXCLUDED.width_cm, height_cm = EXCLUDED.height_cm,
  primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured, category_id = EXCLUDED.category_id,
  sort_order = EXCLUDED.sort_order, seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description, specs = EXCLUDED.specs,
  tags = EXCLUDED.tags, industries = EXCLUDED.industries, updated_at = now();

-- ── Gallery placeholders (update URLs when images are ready) ─────────────────

DELETE FROM product_images
WHERE product_id IN (
  SELECT id FROM products WHERE slug IN (
    'electric-vacuum-pump',
    'g-line-glass-vacuum-container-black',
    'g-line-glass-vacuum-container-white'
  )
);

INSERT INTO product_images (product_id, url, alt, is_primary, sort_order)
SELECT p.id, v.url, v.alt, v.is_primary, v.sort_order
FROM (
  VALUES
    ('electric-vacuum-pump', '/images/products/sous-vide/electric-vacuum-pump/lava-electric-vacuum-pump-easy-pump-vl2050.webp', 'LAVA Electric Vacuum Pump Easy Pump', true, 0),
    ('g-line-glass-vacuum-container-black', '/images/products/sous-vide/g-line-glass-black/lava-g-line-glass-vacuum-container-black-vl2008.webp', 'LAVA G-Line Glass Vacuum Container Black Lid', true, 0),
    ('g-line-glass-vacuum-container-white', '/images/products/sous-vide/g-line-glass-white/lava-g-line-glass-vacuum-container-white-vl2007.webp', 'LAVA G-Line Glass Vacuum Container White Lid', true, 0)
) AS v(slug, url, alt, is_primary, sort_order)
JOIN products p ON p.slug = v.slug;
