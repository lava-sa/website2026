-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Customers & Loyalty Points Schema
-- Run once in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════

-- Customers table (migrated from WordPress/WooCommerce)
CREATE TABLE IF NOT EXISTS customers (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wp_user_id            int UNIQUE,              -- Original WordPress user ID (for reference)
  wp_customer_id        int,                     -- Original WC customer_id

  -- Identity
  email                 text UNIQUE NOT NULL,
  first_name            text,
  last_name             text,
  display_name          text,
  phone                 text,

  -- Address (billing)
  billing_address_1     text,
  billing_address_2     text,
  billing_city          text,
  billing_state         text,
  billing_postcode      text,
  billing_country       text DEFAULT 'ZA',
  billing_company       text,

  -- Address (shipping)
  shipping_address_1    text,
  shipping_address_2    text,
  shipping_city         text,
  shipping_state        text,
  shipping_postcode     text,
  shipping_country      text DEFAULT 'ZA',

  -- Loyalty Points
  points_balance        int DEFAULT 0,           -- Current available points
  lifetime_points       int DEFAULT 0,           -- Total points ever earned (never reduces)
  points_redeemed       int DEFAULT 0,           -- Total points redeemed

  -- Stats (migrated from WC)
  total_spent           decimal(10,2) DEFAULT 0,
  order_count           int DEFAULT 0,
  last_order_date       timestamptz,

  -- Status
  is_active             boolean DEFAULT true,
  is_vip                boolean DEFAULT false,
  marketing_opt_in      boolean DEFAULT false,

  -- Timestamps
  registered_at         timestamptz DEFAULT now(),
  last_active_at        timestamptz,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE INDEX idx_customers_email   ON customers(email);
CREATE INDEX idx_customers_wp_user ON customers(wp_user_id);
CREATE INDEX idx_customers_points  ON customers(points_balance DESC);

-- Points transactions log (audit trail for every points change)
CREATE TABLE IF NOT EXISTS points_transactions (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id    uuid REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  type           text NOT NULL CHECK (type IN (
                   'earned',         -- Points earned from a purchase
                   'redeemed',       -- Points used for discount
                   'bonus',          -- Bonus/promotional points
                   'adjustment',     -- Manual admin adjustment
                   'expired',        -- Points expired
                   'migration'       -- Points from historical WP data
                 )),
  points         int NOT NULL,      -- Positive for earn, negative for redeem
  balance_after  int NOT NULL,
  description    text,
  order_id       uuid REFERENCES orders(id) ON DELETE SET NULL,
  created_at     timestamptz DEFAULT now()
);

CREATE INDEX idx_points_tx_customer ON points_transactions(customer_id, created_at DESC);
CREATE INDEX idx_points_tx_type     ON points_transactions(type);

-- Auto-update updated_at on customers
CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- Add customer_id reference to orders table (so we can link)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
