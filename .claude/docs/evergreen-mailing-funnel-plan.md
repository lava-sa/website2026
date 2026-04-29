# LAVA-SA Evergreen Mailing Funnel Plan

## Current State (Important)

- Mailing list signups are stored in `mailing_list_subscribers`.
- They are visible in Admin at **Mailing List** (`/admin/mailing-list`).
- The **Customers** CRM page (`/admin/customers`) is sourced from `customers` and order history.
- Current signup flow only updates `customers.marketing_opt_in` for an email that already exists in `customers`; it does **not** create a new customer lead row yet.

### What this means

- New newsletter-only leads are visible in **Mailing List Admin**.
- They are not guaranteed to appear in **Customers CRM** unless they already existed there.

## Desired Target State

1. Every mailing signup is captured with interest metadata.
2. Every mailing signup is also represented as a CRM lead (in `customers` or a dedicated leads table).
3. Evergreen sequences are triggered by:
   - selected `interest_category`
   - `machine_industry` (only for vacuum machine interest)
4. Launch newsletter goes first; evergreen automation starts immediately after launch send.

## Segmentation Rules (v1)

### Category options

- `vacuum_machines`
- `vacuum_bags_rolls`
- `containers_lids`
- `butchery_accessories`
- `sous_vide`

### Conditional field

- If category = `vacuum_machines`, require `machine_industry`.
- For all other categories, `machine_industry` is null/blank.

### Messaging rule

- Never send butchery-focused content to vacuum-machine leads unless their stated industry is butchery/meat.
- Use industry language examples for machine leads (food production, retail, hunting, clothing/textiles, etc.).

## Evergreen Funnel Blueprint

## Phase 1 — Welcome / Indoctrination (2-3 emails)

Goal: establish brand trust and relevance.

- Email 1: Welcome + what LAVA stands for + what they can expect.
- Email 2: Category-specific starter guide.
- Email 3: Case story tied to their category (and machine industry if provided).

## Phase 2 — Value Sequence (ongoing, usually 3-5 emails to start)

Goal: teach practical wins and build authority.

- Educational tips by category.
- Industry-specific use cases for vacuum machines.
- Common mistakes and fixes.
- Light CTA to browse relevant category pages.

## Phase 3 — Pitch Sequence (3-5 emails)

Goal: convert warm subscribers.

- Product recommendation stack by segment.
- Benefits + outcomes + testimonials.
- Offer framing (bonus, bundle, deadline, or stock window).
- Strong CTA to product or collection page.

## Phase 4 — Evergreen Nurture

Goal: keep non-buyers warm and recycle into future pitches.

- Weekly/bi-weekly value newsletter.
- Rotation by category theme.
- Trigger pitch windows around promos, seasonality, and stock arrivals.

## Data Model Notes

- `mailing_list_subscribers.interest_category` (text)
- `mailing_list_subscribers.machine_industry` (text, nullable)
- Keep `source` for attribution.
- Keep `opted_in`, `opted_in_at`, `unsubscribed_at` for POPIA compliance.

## Post-Launch Execution Checklist

1. Finalize updated Evergreen scripts from your YouTube source.
2. Create category + industry email templates.
3. Add CRM lead sync behavior:
   - option A: upsert into `customers` for newsletter-only leads
   - option B: create dedicated `crm_leads` table and link by email
4. Add admin filters for `interest_category` and `machine_industry`.
5. Add broadcast segment types:
   - by category
   - by machine industry
6. QA end-to-end flow:
   - signup -> appears in admin mailing list
   - lead appears in CRM
   - enters correct evergreen sequence
   - unsubscribe flow works

## Decision on Skill/Agent

- A custom Skill is optional.
- Best workflow now:
  - Keep this doc as the source of truth.
  - Build implementation in small tasks (schema, CRM sync, segmentation, automation).
  - Use an agent for execution once launch newsletter is sent.

