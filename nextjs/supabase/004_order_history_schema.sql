-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Historical Orders (from WordPress migration)
-- Stores past purchase history as text only.
-- Does NOT link to current products table (different catalog).
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS order_history (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id          uuid REFERENCES customers(id) ON DELETE CASCADE,

  -- Original WP order reference
  wp_order_id          int UNIQUE NOT NULL,
  wp_order_number      text,

  -- Denormalized customer email (for guest orders with no user account)
  customer_email       text,
  customer_first_name  text,
  customer_last_name   text,

  -- Order details
  order_date           timestamptz NOT NULL,
  status               text,                          -- wc-completed, wc-processing, wc-cancelled, etc.
  num_items            int DEFAULT 0,
  subtotal             decimal(10,2) DEFAULT 0,
  tax_total            decimal(10,2) DEFAULT 0,
  shipping_total       decimal(10,2) DEFAULT 0,
  total                decimal(10,2) NOT NULL,

  -- Line items as plain JSON (product names only — not linked to current catalog)
  items                jsonb DEFAULT '[]',

  -- Retroactive points awarded
  points_awarded       int DEFAULT 0,

  -- Meta
  migrated_at          timestamptz DEFAULT now()
);

CREATE INDEX idx_order_history_customer  ON order_history(customer_id);
CREATE INDEX idx_order_history_email     ON order_history(customer_email);
CREATE INDEX idx_order_history_date      ON order_history(order_date DESC);
CREATE INDEX idx_order_history_status    ON order_history(status);

ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
