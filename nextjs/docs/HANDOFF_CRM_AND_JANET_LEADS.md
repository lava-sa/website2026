# Handoff — Janet leads, admin tables & CRM direction

_Use this file at the start of a new chat so context isn’t lost._

## Quick answers (your three options)

1. **Prompt-only**  
   Adjust Janet’s **system prompt / script** so she **asks** for first name, last name, email, industry (when relevant, e.g. vacuum enquiry → industry).  
   **Does not by itself** fill database columns — it only affects **what gets said** and therefore what appears in the **transcript**.

2. **Extraction job**  
   **After** the session ends, a **server-side step** reads the **transcript** and tries to **fill structured fields** (`first_name`, `last_name`, `phone`, `email`, `industry`) using rules, regex, or an LLM — not just “keywords”, but **mapping dialogue → columns**.

3. **Telephony placeholder columns**  
   Extra columns on the lead/chat row for when **real phone infrastructure** (e.g. Twilio) is connected: e.g. **`caller_id_number`** (PSTN number from carrier), **`phone_source`** (`spoken` | `caller_id` | `manual`), **`destination`** for forwards.  
   Browsers/mic-only voice **do not** provide PSTN caller ID; that needs webhooks from a telco provider.

## Where is the call transcript?

- **Primary for admin UI:** `janet_support_chats.transcript`  
- Written when a Janet voice session ends via **`POST /api/janet-session`** (mirrors into `janet_support_chats`; legacy **`voice_sessions`** may still exist).
- **Admin:** `/admin/janet-chats` — table shows transcript + editable contact fields + action taken.

## DB migration already applied (production)

- `nextjs/supabase/016_janet_admin_tables.sql` — `janet_support_chats`, `janet_call_events`, **RLS enabled** (service role only via Next.js admin).

## CRM vision (agreed direction — future work)

Single backend truth for people identifiers; evolve toward:

1. **Leads** vs **Customers** (lifecycle).
2. **Email engine** — send from backend (e.g. Resend already in stack).
3. **Email templates**.
4. **Campaigns** — industry-based or scheduled nurture.

Janet/voice + chat rows are **lead-generation inputs**; unify into **one contacts/leads model** rather than duplicating name/email per feature forever.

## Related code paths (repo)

- Janet UI / telemetry: `nextjs/src/components/layout/JanetAgent.tsx`, `nextjs/src/app/api/janet-session/route.ts`
- Admin nav: `Janet support chats`, `Janet calls` — `nextjs/src/components/admin/AdminShell.tsx`
- Admin pages: `nextjs/src/app/admin/janet-chats/`, `nextjs/src/app/admin/janet-calls/`
- PATCH lead fields: `nextjs/src/app/api/admin/janet-chats/[id]/route.ts`

## Suggested next steps (pick one thread in new chat)

- A) **Prompt tweaks** only (conversation flow).  
- B) **Post-session extraction** into `janet_support_chats` columns.  
- C) **Schema**: `phone_source`, `caller_id_number`, link `lead_id` → future `leads` table.  
- D) **CRM skeleton**: `leads`, `customers`, optional link from `janet_support_chats`.

---

_End of handoff — May 2026_
