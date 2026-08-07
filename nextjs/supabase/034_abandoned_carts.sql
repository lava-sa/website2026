-- ═══════════════════════════════════════════════════════
-- LAVA-SA — 034: Abandoned cart capture & recovery
-- Run once in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════
--
-- Carts live in localStorage, so an abandoned basket leaves no trace and there
-- is no address to remind. This table is the server-side record, written only
-- once a customer has typed their email into checkout — i.e. they have shown
-- clear intent to buy from us. One row per email, so a customer can never
-- receive two reminders for the same basket.

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  email                  text NOT NULL,
  first_name             text,
  phone                  text,

  -- Snapshot of the basket. Prices are re-validated at checkout, never trusted
  -- from here; this is for the reminder's contents only.
  items                  jsonb NOT NULL DEFAULT '[]',
  item_count             int NOT NULL DEFAULT 0,
  subtotal               numeric(10,2) NOT NULL DEFAULT 0,

  -- Lifecycle
  last_activity_at       timestamptz NOT NULL DEFAULT now(),
  reminder_sent_at       timestamptz,          -- exactly one reminder, ever
  recovered_order_number text,                 -- they came back and ordered
  recovered_at           timestamptz,
  dismissed_at           timestamptz,          -- unsubscribed / opted out

  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

-- One live record per person — the upsert target, and a hard guard against
-- sending the same customer several reminders. A plain column constraint (not
-- lower(email)) so PostgREST upserts can name it via onConflict; the API always
-- writes the address lower-cased.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'abandoned_carts_email_key'
  ) THEN
    ALTER TABLE abandoned_carts ADD CONSTRAINT abandoned_carts_email_key UNIQUE (email);
  END IF;
END $$;

-- The cron sweep: not yet reminded, not recovered, gone quiet.
CREATE INDEX IF NOT EXISTS abandoned_carts_due_idx
  ON abandoned_carts (last_activity_at)
  WHERE reminder_sent_at IS NULL AND recovered_at IS NULL AND dismissed_at IS NULL;

COMMENT ON TABLE abandoned_carts IS
  'Checkout baskets captured after email entry. One reminder maximum per email; never emailed if an order followed.';
COMMENT ON COLUMN abandoned_carts.reminder_sent_at IS
  'Set the moment the reminder is dispatched. NULL = not yet reminded. Never reset.';

ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;
-- No anon policies: all access is via the service role in API routes.
