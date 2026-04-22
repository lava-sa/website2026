-- ── Lava-SA Data Backup Export ──────────────────────────────────────────────
-- Run in Supabase SQL Editor to verify data counts and spot-check records.
-- For a full backup: Supabase Dashboard → Settings → Database → Backups.

-- Products
SELECT 'products' AS table_name, COUNT(*) AS row_count FROM products
UNION ALL
SELECT 'categories',  COUNT(*) FROM categories
UNION ALL
SELECT 'orders',      COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'customers',   COUNT(*) FROM customers
UNION ALL
SELECT 'reviews',     COUNT(*) FROM reviews;

-- ── Published products list ──────────────────────────────────────────────────
-- SELECT sku, name, regular_price, stock_status, is_published FROM products
-- WHERE is_published = true ORDER BY category_id, regular_price;

-- ── Recent orders ────────────────────────────────────────────────────────────
-- SELECT order_number, first_name, last_name, total, status, created_at
-- FROM orders ORDER BY created_at DESC LIMIT 20;
