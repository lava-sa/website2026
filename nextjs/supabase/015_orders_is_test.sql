-- Manual test-order flag for admin filtering and cleanup
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS orders_is_test_idx ON orders(is_test);
