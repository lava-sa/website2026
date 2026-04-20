-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Orders Schema
-- Run once in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════

CREATE TABLE orders (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number   text UNIQUE NOT NULL,
  -- Customer details
  first_name     text NOT NULL,
  last_name      text NOT NULL,
  email          text NOT NULL,
  phone          text,
  address        text,
  city           text,
  province       text,
  postal_code    text,
  notes          text,
  -- Financials (stored in ZAR cents as decimal)
  subtotal       decimal(10,2) NOT NULL,
  shipping       decimal(10,2) NOT NULL DEFAULT 0,
  total          decimal(10,2) NOT NULL,
  -- PayFast
  pf_payment_id  text,
  status         text NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','paid','failed','cancelled','refunded')),
  -- Meta
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id       uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id     uuid REFERENCES products(id),
  product_name   text NOT NULL,
  product_sku    text,
  quantity       int  NOT NULL CHECK (quantity > 0),
  unit_price     decimal(10,2) NOT NULL,
  line_total     decimal(10,2) NOT NULL
);

-- Auto-update updated_at
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Service role (API routes) can do everything — no anon policies needed
-- (all writes come through the service role key in API routes)
