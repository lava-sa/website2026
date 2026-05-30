-- Site review rooms: voice + screen-share sessions (magic link)
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_review_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  token text NOT NULL UNIQUE,
  title text NOT NULL DEFAULT 'Website review',
  host_label text NOT NULL DEFAULT 'Host',
  guest_label text NOT NULL DEFAULT 'Guest',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  expires_at timestamptz,
  ended_at timestamptz,
  recording_path text,
  recording_url text,
  transcript text,
  ai_summary text,
  action_items jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS site_review_rooms_created_at_idx ON site_review_rooms (created_at DESC);
CREATE INDEX IF NOT EXISTS site_review_rooms_token_idx ON site_review_rooms (token);

CREATE TABLE IF NOT EXISTS site_review_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES site_review_rooms (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  sender_name text NOT NULL,
  sender_role text NOT NULL CHECK (sender_role IN ('host', 'guest')),
  body text NOT NULL
);

CREATE INDEX IF NOT EXISTS site_review_messages_room_id_idx ON site_review_messages (room_id, created_at);

CREATE TABLE IF NOT EXISTS site_review_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES site_review_rooms (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  text text NOT NULL,
  done boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_by text,
  assignee text
);

CREATE INDEX IF NOT EXISTS site_review_tasks_room_id_idx ON site_review_tasks (room_id, sort_order);

ALTER TABLE site_review_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_review_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_review_tasks ENABLE ROW LEVEL SECURITY;
