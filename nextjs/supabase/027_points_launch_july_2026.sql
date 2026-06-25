-- Lava Points launch rules (1 July 2026)
-- Run in Supabase SQL Editor before go-live

-- Track points credited per order (prevents double-award)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS points_awarded int;

-- Remove retroactive balances calculated from historical WooCommerce spend
UPDATE customers
SET
  points_balance = 0,
  lifetime_points = 0,
  updated_at = now()
WHERE points_balance > 0 OR lifetime_points > 0;

UPDATE order_history SET points_awarded = 0 WHERE points_awarded IS NOT NULL AND points_awarded > 0;

-- Optional: clear pre-launch earn rows if any were imported
DELETE FROM points_transactions
WHERE type IN ('earned', 'migration')
  AND created_at < '2026-07-01T00:00:00+02:00';
