-- Run in Supabase SQL Editor
-- Adds payment method tracking to orders table

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'payfast';

-- Backfill existing orders as payfast
UPDATE orders SET payment_method = 'payfast' WHERE payment_method IS NULL;

-- Also add 'awaiting_payment' as a valid status for bank transfer orders
-- (no constraint change needed if status is a plain text column)
