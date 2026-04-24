-- List all vacuum bag products to find the extra one
SELECT
  p.name,
  p.slug,
  p.sku,
  p.regular_price,
  p.is_published,
  c.name as category
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
WHERE c.slug = 'vacuum-bags'
   OR c.slug = 'embossed-vacuum-bags'
ORDER BY p.regular_price ASC;
