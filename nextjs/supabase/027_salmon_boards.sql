-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Gold/Black Salmon Display Boards (VL0295–97)
-- June 2026 price list. Run in Supabase SQL Editor (idempotent)
-- Images: upload to public/images/products/butchery/ (see paths below)
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, sort_order)
VALUES ('Butchery Accessories', 'butchery-accessories', 5)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  primary_image_url, is_published, is_featured, category_id, sort_order,
  tags, updated_at
)
VALUES (
  'VL0295',
  'Gold/Black Salmon Board 12 × 26.5 cm (Pack of 5)',
  'salmon-board-12x26-5cm-pack-5',
  'Elegant black and gold presentation boards for smoked salmon, charcuterie and deli display. Pack of 5.',
  '<p>Professional <strong>gold and black salmon display boards</strong> — the classic presentation surface for smoked salmon, trout, charcuterie and deli portions.</p><ul><li><strong>Size:</strong> 12 × 26.5 cm</li><li><strong>Pack:</strong> 5 boards</li><li>Black base with gold trim</li><li>Ideal for retail display and catering</li></ul>',
  150, NULL, 'in_stock', 10,
  '/images/products/butchery/gold-black-salmon-board-12x26-5cm-pack-5-vl0295.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1),
  30,
  ARRAY['cutting-board', 'display-board', 'salmon-board']::text[],
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  tags = EXCLUDED.tags,
  updated_at = NOW();

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  primary_image_url, is_published, is_featured, category_id, sort_order,
  tags, updated_at
)
VALUES (
  'VL0296',
  'Gold/Black Salmon Board 18.5 × 53 cm (Pack of 5)',
  'salmon-board-18x53cm-pack-5',
  'Medium gold and black presentation boards for smoked salmon and deli display. Pack of 5.',
  '<p>Medium-sized <strong>gold and black salmon display boards</strong> for whole fillets, sliced salmon and charcuterie platters.</p><ul><li><strong>Size:</strong> 18.5 × 53 cm</li><li><strong>Pack:</strong> 5 boards</li><li>Black base with gold trim</li><li>Ideal for retail display and catering</li></ul>',
  200, NULL, 'in_stock', 10,
  '/images/products/butchery/gold-black-salmon-board-18x53cm-pack-5-vl0296.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1),
  31,
  ARRAY['cutting-board', 'display-board', 'salmon-board']::text[],
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  tags = EXCLUDED.tags,
  updated_at = NOW();

INSERT INTO products (
  sku, name, slug, short_description, description,
  regular_price, sale_price, stock_status, stock_quantity,
  primary_image_url, is_published, is_featured, category_id, sort_order,
  tags, updated_at
)
VALUES (
  'VL0297',
  'Gold/Black Salmon Board 21 × 57 cm (Pack of 5)',
  'salmon-board-21x57cm-pack-5',
  'Large gold and black presentation boards for full salmon sides and deli display. Pack of 5.',
  '<p>Large <strong>gold and black salmon display boards</strong> — suited to full sides, large fillets and premium deli presentation.</p><ul><li><strong>Size:</strong> 21 × 57 cm</li><li><strong>Pack:</strong> 5 boards</li><li>Black base with gold trim</li><li>Ideal for retail display and catering</li></ul>',
  230, NULL, 'in_stock', 10,
  '/images/products/butchery/gold-black-salmon-board-21x57cm-pack-5-vl0297.webp',
  true, false,
  (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1),
  32,
  ARRAY['cutting-board', 'display-board', 'salmon-board']::text[],
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  sku = EXCLUDED.sku,
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  regular_price = EXCLUDED.regular_price,
  primary_image_url = EXCLUDED.primary_image_url,
  is_published = EXCLUDED.is_published,
  tags = EXCLUDED.tags,
  updated_at = NOW();
