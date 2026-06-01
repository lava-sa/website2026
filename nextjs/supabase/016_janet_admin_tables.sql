-- Janet admin: support chats (voice + future text) and telephony events (missed / forwarding)
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS janet_support_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  session_id text,
  page_url text,
  source text NOT NULL DEFAULT 'voice' CHECK (source IN ('voice', 'text')),
  first_name text,
  last_name text,
  phone text,
  email text,
  industry text,
  transcript text,
  action_taken text
);

CREATE INDEX IF NOT EXISTS janet_support_chats_created_at_idx ON janet_support_chats (created_at DESC);

CREATE TABLE IF NOT EXISTS janet_call_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_type text NOT NULL CHECK (event_type IN ('missed_answered', 'forwarding')),
  caller_number text,
  destination text,
  duration_seconds int,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS janet_call_events_created_at_idx ON janet_call_events (created_at DESC);

-- Lock down: browser/anon must not query these directly. Next.js admin uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
ALTER TABLE janet_support_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE janet_call_events ENABLE ROW LEVEL SECURITY;
-- Intentionally no policies for anon/authenticated — only service role can read/write.
