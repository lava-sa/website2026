-- ═══════════════════════════════════════════════════════
-- LAVA-SA — 033: Per-product shipping toggle + payment-result tracking
-- Run once in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════

-- ── 1. Products: allow Anneke to turn delivery off per product ─────────────
-- shipping_enabled = false  →  collection-only item (no courier option, no delivery fee)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS shipping_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN products.shipping_enabled IS
  'false = collection only. Product cannot be couriered; checkout forces collection and charges no delivery fee.';

-- ── 2. Orders: customer chose delivery or collection ───────────────────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivery_method text NOT NULL DEFAULT 'delivery';

-- Backfill: every historical order was a delivery
UPDATE orders SET delivery_method = 'delivery' WHERE delivery_method IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_delivery_method_check'
  ) THEN
    ALTER TABLE orders
      ADD CONSTRAINT orders_delivery_method_check
      CHECK (delivery_method IN ('delivery', 'collection'));
  END IF;
END $$;

-- ── 3. Orders: payment-result email guard (send exactly once) ──────────────
-- Set the moment the PayFast outcome email (paid OR unsuccessful) is dispatched.
-- Claimed atomically so a duplicate ITN / page refresh can never re-send.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_result_email_sent_at timestamptz;

-- Which outcome was announced ('paid' | 'unsuccessful'). The guard is per-outcome:
-- a failed attempt that is later paid still gets its confirmation email, but the
-- same outcome can never be emailed twice.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_result_email_outcome text;

-- Raw PayFast payment_status (COMPLETE / FAILED / CANCELLED / PENDING) for audit.
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_status_detail text;

COMMENT ON COLUMN orders.payment_result_email_sent_at IS
  'Guard: order outcome email already sent. NULL = not yet notified.';

-- ── 4. Orders: allow the full admin lifecycle in the status CHECK ──────────
-- The original 002 schema only allowed pending/paid/failed/cancelled/refunded,
-- but admin can set processing/shipped/delivered. Make the constraint match.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_status_check'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_status_check;
  END IF;

  -- NOT VALID: enforced on new writes, never fails on pre-existing rows.
  ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
    CHECK (status IN (
      'pending', 'paid', 'processing', 'shipped', 'delivered',
      'failed', 'cancelled', 'refunded', 'completed'
    )) NOT VALID;
END $$;

-- ── 5. Index for the pending-payment sweep in admin ────────────────────────
CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders (status, created_at DESC);
