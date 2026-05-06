-- Add soft-delete support for admin order trash.
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS trashed_at timestamptz;

CREATE INDEX IF NOT EXISTS orders_trashed_at_idx ON orders(trashed_at);
