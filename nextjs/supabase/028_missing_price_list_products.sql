-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Missing June 2026 price list products
-- Run in Supabase SQL Editor after 027_salmon_boards.sql (idempotent)
-- Images: public/images/products/accessories/ and butchery/
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, sort_order)
VALUES
  ('Vacuum Accessories', 'accessories', 6),
  ('Butchery Accessories', 'butchery-accessories', 5),
  ('Containers & Lids', 'containers-lids', 4)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- ── Vacuum bag & film accessories ───────────────────────────────────────────

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0099',
  'LAVA Labels and Permanent Marker',
  'lava-labels-and-marker',
  '100 self-adhesive freezer-safe labels on a roll plus waterproof permanent marker — orderly labelling for vacuum bags and rolls.',
  '<p>Original <strong>LAVA labels</strong> with five fields (content, date, weight, price, basic price). Washable, freezer-safe and ideal for direct marketing. Includes a waterproof permanent marker.</p><ul><li>100 self-adhesive labels on roll</li><li>Label size: 60 × 70 mm</li><li>Permanent marker included</li><li>High adhesion — freezer safe</li></ul>',
  320, 'in_stock', 20,
  '/images/products/accessories/lava-labels-and-marker-vl0099.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 1,
  ARRAY['accessories', 'labels', 'bags']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0002',
  'LAVA Fluid Stop (30 cm × 12 m)',
  'lava-fluid-stop',
  'Liquid stop film for safe vacuum sealing of moist foods — protects the seal area for up to 600 bags.',
  '<p><strong>LAVA Fluid Stop</strong> creates a protective barrier when vacuum sealing products with high liquid content — marinades, wet fish, portioned stews and more.</p><ul><li>Roll: 30 cm × 12 m</li><li>Enough for up to 600 bags</li><li>Compatible with all LAVA machines</li></ul>',
  726, 'in_stock', 15,
  '/images/products/accessories/lava-fluid-stop-vl0002.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 2,
  ARRAY['accessories', 'bags', 'liquid']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0003',
  'LAVA Bone Protection Cloth (10 cm × 5 m)',
  'lava-bone-protection',
  'Bone protection cloth for vacuum sealing sharp-edged products — prevents punctures and protects your machine.',
  '<p><strong>LAVA Bone Protection</strong> wraps around sharp bones and edges before vacuum sealing — essential for ribs, T-bone steaks, game and butchery portions.</p><ul><li>Size: 10 cm × 5 m</li><li>Reusable cloth strip</li><li>Compatible with all embossed bags and rolls</li></ul>',
  325, 'in_stock', 15,
  '/images/products/accessories/lava-bone-protection-vl0003.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 3,
  ARRAY['accessories', 'bags', 'butchery']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0090',
  'LAVA Wine Sealers (Pack of 2)',
  'lava-wine-sealers',
  'Vacuum bottle stoppers — reseal opened wine, juice or vinegar bottles under vacuum. Pack of 2.',
  '<p>Keep opened bottles fresh longer with <strong>LAVA wine sealers</strong>. Fits most standard bottles — works with your LAVA machine via container mode or with the hand pump.</p><ul><li>Pack of 2 stoppers</li><li>For wine, juice, vinegar and oils</li><li>Compatible with all LAVA vacuum sealers</li></ul>',
  260, 'in_stock', 20,
  '/images/products/accessories/lava-wine-sealers-vl0090.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 4,
  ARRAY['accessories', 'wine', 'containers']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0008',
  'LAVA Roll Dispenser (15–30 cm)',
  'lava-roll-dispenser',
  'Roll cutter and dispenser for vacuum rolls 15–30 cm wide — clean, straight cuts every time.',
  '<p>The <strong>LAVA roll dispenser</strong> holds and cuts embossed vacuum rolls from 15 cm to 30 cm width — essential for tidy bag preparation in home and catering kitchens.</p><ul><li>Fits roll widths 15–30 cm</li><li>Built-in cutter</li><li>Stable bench-top design</li></ul>',
  915, 'in_stock', 5,
  '/images/products/accessories/lava-roll-dispenser-vl0008.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 5,
  ARRAY['accessories', 'rolls']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0056',
  'LAVA Manual Hand Pump',
  'lava-manual-hand-pump',
  'Manual vacuum hand pump for containers, jar sealers and universal lids — no electricity required.',
  '<p>The <strong>LAVA manual hand pump</strong> vacuum-seals acrylic containers, universal lids, jar attachments and the Flex jar sealer without a vacuum machine.</p><ul><li>Lightweight manual operation</li><li>Works with all LAVA container accessories</li><li>Ideal for travel and secondary kitchens</li></ul>',
  400, 'in_stock', 10,
  '/images/products/accessories/lava-manual-hand-pump-vl0056.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'accessories' LIMIT 1), 6,
  ARRAY['accessories', 'containers', 'jar-sealer', 'hand-pump']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

-- ── Container & jar accessories ─────────────────────────────────────────────

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0193',
  'LAVA Vacuum Bell for Glass Jars',
  'glass-jar-vacuum-bell-vl0193',
  'Standard vacuum bell for twist-off and preserving jars — simple jar vacuum sealing with your LAVA machine.',
  '<p>The <strong>LAVA vacuum bell for glass jars</strong> fits twist-off and preserving jars for airtight vacuum storage of jams, pickles, dry goods and more.</p><ul><li>Works with all LAVA vacuum sealers (container mode)</li><li>Also compatible with manual hand pump</li><li>Includes vacuum hose connection</li></ul>',
  630, 'in_stock', 8,
  '/images/products/containers/glass-jar-vacuum-bell-vl0193.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1), 45,
  ARRAY['jar-sealer', 'glass', 'accessories']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0007',
  'LAVA 1.52 L Glass Vacuum Container',
  'glass-vacuum-container-1520ml',
  '1.52 litre glass vacuum container (220 × 165 × 66 mm) — heat-resistant borosilicate glass with vacuum valve.',
  '<p>Premium <strong>1.52 L glass vacuum container</strong> for marinating, storing and reheating — oven, microwave and dishwasher safe when lid removed.</p><ul><li><strong>Capacity:</strong> 1.52 L</li><li><strong>Dimensions:</strong> 220 × 165 × 66 mm</li><li>Borosilicate glass</li><li>Compatible with LAVA pump attachment</li></ul>',
  1225, 'in_stock', 5,
  '/images/products/containers/glass-vacuum-container-1520ml-vl0007.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1), 46,
  ARRAY['glass', 'container']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'VL0057',
  'LAVA 640 ml Round Acrylic Vacuum Container',
  'acrylic-container-640ml-round',
  '640 ml round acrylic vacuum container (13 × 10 cm) — compact size for portions, cheese and deli items.',
  '<p>Compact <strong>640 ml round acrylic container</strong> with integrated vacuum valve — crystal-clear, BPA-free and dishwasher safe.</p><ul><li><strong>Capacity:</strong> 640 ml</li><li><strong>Size:</strong> 13 × 10 cm (W × H)</li><li>Lid included</li><li>Works with all LAVA machines</li></ul>',
  520, 'in_stock', 10,
  '/images/products/containers/lava-640ml-round-acrylic-vacuum-container-vl0057.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1), 47,
  ARRAY['acrylic', 'container', '640ml', 'round']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

-- ── Butchery: knife sets ──────────────────────────────────────────────────────

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'Z11060',
  'Knife Set (3 Butcher''s Knives) — Yellow Handle',
  'butcher-knife-set-yellow-3pc',
  'Professional 3-piece butcher knife set with high-visibility yellow handles — boning, cutting and utility blades.',
  '<p>Complete <strong>3-piece butcher knife set</strong> with ergonomic yellow handles for wet-hand grip and easy identification in busy processing environments.</p><ul><li>3 professional butcher knives</li><li>High-visibility yellow handles</li><li>Stainless steel blades</li></ul>',
  750, 'on_order', 0,
  '/images/products/butchery/butcher-knife-set-yellow-3pc-z11060.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 40,
  ARRAY['knife', 'knife-set', 'butchery']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

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
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'Z11061',
  '3-Piece White Handle LAVA Kitchen Knife Set',
  'kitchen-knife-set-white-3pc',
  '3-piece white-handle kitchen knife set — versatile blades for home and catering prep.',
  '<p><strong>3-piece LAVA kitchen knife set</strong> with white handles — ideal for everyday kitchen and light butchery tasks.</p><ul><li>3 kitchen knives</li><li>White ergonomic handles</li><li>Stainless steel blades</li></ul>',
  500, 'in_stock', 5,
  NULL,
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 42,
  ARRAY['knife', 'knife-set', 'kitchen']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

-- ── Butchery: polyethylene cutting boards ───────────────────────────────────

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES
  ('Z99051', 'Professional Cutting Board 400 × 250 × 20 mm', 'cutting-board-400x250x20', 'Cut-resistant polyethylene cutting board 400 × 250 × 20 mm — knife-friendly, hygienic workstation surface.', '<p>Professional <strong>polyethylene cutting board</strong> — durable, knife-friendly and easy to sanitise.</p><ul><li>400 × 250 × 20 mm</li><li>Food-safe HDPE</li><li>Dishwasher safe</li></ul>', 503, 'in_stock', 5, '/images/products/butchery/cutting-board-400x250x20-z99051.webp', true, false, (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 50, ARRAY['cutting-board', 'poly-board']::text[], NOW()),
  ('Z99053', 'Professional Cutting Board 500 × 300 × 20 mm', 'cutting-board-500x300x20', 'Cut-resistant polyethylene cutting board 500 × 300 × 20 mm — ideal everyday butchery size.', '<p>Medium <strong>polyethylene cutting board</strong> for daily portioning and trimming work.</p><ul><li>500 × 300 × 20 mm</li><li>Food-safe HDPE</li></ul>', 705, 'in_stock', 5, '/images/products/butchery/cutting-board-500x300x20-z99053.webp', true, false, (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 51, ARRAY['cutting-board', 'poly-board']::text[], NOW()),
  ('Z99055', 'Professional Cutting Board 500 × 400 × 20 mm', 'cutting-board-500x400x20', 'Large polyethylene cutting board 500 × 400 × 20 mm — extra workspace for busy stations.', '<p>Large <strong>polyethylene cutting board</strong> with generous workspace for breaking down primals.</p><ul><li>500 × 400 × 20 mm</li><li>Food-safe HDPE</li></ul>', 918, 'in_stock', 3, '/images/products/butchery/cutting-board-500x400x20-z99055.webp', true, false, (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 52, ARRAY['cutting-board', 'poly-board']::text[], NOW()),
  ('Z99057', 'Professional Cutting Board 600 × 400 × 20 mm', 'cutting-board-600x400x20', 'Extra-large polyethylene cutting board 600 × 400 × 20 mm — commercial butchery workstation size.', '<p>Extra-large <strong>polyethylene cutting board</strong> for commercial butchery and high-volume processing.</p><ul><li>600 × 400 × 20 mm</li><li>Food-safe HDPE</li></ul>', 1059, 'on_order', 0, '/images/products/butchery/cutting-board-600x400x20-z99057.webp', true, false, (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 53, ARRAY['cutting-board', 'poly-board']::text[], NOW())
ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

-- ── Butchery: XS gloves + meat mincer ───────────────────────────────────────

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, updated_at)
VALUES (
  'Z33014',
  'Professional Cut-Resistant Gloves — XS (Level 5)',
  'cut-resistant-gloves-xs',
  'Level 5 cut-resistant gloves in extra-small — essential hand protection for butchery and game processing.',
  '<p><strong>Level 5 cut-resistant gloves</strong> in extra-small — maximum hand protection during deboning, skinning and knife work.</p><ul><li>Size: XS</li><li>Level 5 cut protection (EN388)</li><li>Fits left or right hand</li></ul>',
  399, 'in_stock', 3,
  '/images/products/butchery/professional-cut-resistant-gloves-xs-level-5-protection.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 28,
  ARRAY['protective', 'gloves', 'cut-resistant', 'xs']::text[], NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, tags = EXCLUDED.tags, category_id = EXCLUDED.category_id, updated_at = NOW();

INSERT INTO products (sku, name, slug, short_description, description, regular_price, stock_status, stock_quantity, primary_image_url, is_published, is_featured, category_id, sort_order, tags, industries, updated_at)
VALUES (
  'Z66130',
  'Pro-Star Meat Mincer (90 kg/h)',
  'pro-star-meat-mincer-90kg',
  'Pro-Star electric meat mincer — 90 kg/h throughput. Compact, powerful and built for home butchery and small commercial use.',
  '<p>The <strong>Pro-Star meat mincer</strong> processes up to 90 kg per hour — ideal for sausage making, pet food prep and small-scale butchery.</p><ul><li>Throughput: 90 kg/h</li><li>Compact footprint</li><li>Stainless steel components</li><li>Special order — contact for availability</li></ul>',
  4650, 'on_order', 0,
  '/images/products/butchery/pro-star-meat-mincer-90kg-z66130.webp',
  true, true,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1), 35,
  ARRAY['machinery', 'mincer', 'butchery']::text[],
  ARRAY['butchery', 'food_prod']::text[],
  NOW()
) ON CONFLICT (slug) DO UPDATE SET sku = EXCLUDED.sku, name = EXCLUDED.name, short_description = EXCLUDED.short_description, description = EXCLUDED.description, regular_price = EXCLUDED.regular_price, primary_image_url = EXCLUDED.primary_image_url, is_published = EXCLUDED.is_published, is_featured = EXCLUDED.is_featured, tags = EXCLUDED.tags, industries = EXCLUDED.industries, category_id = EXCLUDED.category_id, updated_at = NOW();
