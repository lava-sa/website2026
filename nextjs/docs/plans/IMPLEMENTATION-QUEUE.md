# IMPLEMENTATION-QUEUE — LAVA-SA Pre-Launch

**Hand these PLAN files to Cursor Auto ONE AT A TIME. Do not batch unrelated changes.**
Each plan is self-contained (goal, files, steps, edge cases, acceptance criteria). Finish and verify one before starting the next. Payments rule for every plan: **EFT / Direct Bank Transfer ONLY — never card/PayFast with real details.**

---

## ▶ START HERE — #1

### 1. PLAN-checkout-price-integrity.md
- **Leverage:** blocks revenue/orders (highest). A buyer can currently pay R1 for any product.
- **Type:** code fix, one file (`api/checkout/route.ts`) + one helper (`lib/products.ts`).
- **Gate to next:** tamper test proves stored order total = true DB price; out-of-stock rejected; IMAP-confirmed email shows correct total.

---

### 2. PLAN-production-forms-and-test-orders.md
- **Leverage:** blocks Anneke's daily ops (lead capture) + cleans revenue data.
- **Type:** verification + data cleanup; code changes only if a real defect is found.
- **Depends on:** latest build being deployed to production first (see note below).
- **Gate to next:** contact + footer + mailing-list each IMAP-verified on `lava-sa.com`; ORD-6137→6144 reversed.

---

### 3. PLAN-remove-fabricated-ratings.md
- **Leverage:** SEO/trust — removes a site-wide Google structured-data policy violation.
- **Type:** code fix (`products/[slug]/page.tsx`, optionally `lib/seo.ts`).
- **Gate to next:** Rich Results Test on a no-review product shows no `AggregateRating`/`Review`; real-review products unchanged; `FALLBACK_REVIEWS` deleted.

---

### 4. PLAN-db-migrations-launch.md
- **Leverage:** ops/data integrity — order tagging + Lava Points correctness for 1,285 migrated customers.
- **Type:** Supabase migration (verify-before-run) + small checkout hardening.
- **Caution:** destructive-capable — snapshot DB first; query `information_schema`/object existence before running each migration (not guaranteed idempotent).
- **Gate to next:** `payment_method` set on INSERT; 027 objects confirmed; pre-2026-07-01 order awards 0 points.

---

### 5. PLAN-admin-auth-hardening.md
- **Leverage:** security — closes a forgeable constant admin cookie. No known active exploit, but high blast radius.
- **Type:** code fix (`lib/admin-auth.ts`, `login/route.ts`, `middleware.ts`, `/api/admin/*`).
- **Caution:** middleware runs on Edge → use Web Crypto, not Node `crypto`; fail closed if secret unset.
- **Gate:** old `admin_session=authenticated` cookie no longer grants access; tampered token rejected.

---

## Cross-cutting precondition (do before verifying #2, #3, #5 on prod)
Deploy the current local build to production (magic-link accounts, footer form, member modal, PDP tables, site-info). Nothing that touches production behaviour can be *verified* until this ships. This is a deploy action, not a code change — but it gates the verification steps in plans #2 and #4.

## Ranking rationale
1. **Revenue/orders** — PLAN-checkout-price-integrity
2. **Anneke's daily ops** — PLAN-production-forms-and-test-orders
3. **SEO/trust** — PLAN-remove-fabricated-ratings
4. **Data integrity (ops)** — PLAN-db-migrations-launch
5. **Security hardening** — PLAN-admin-auth-hardening

Fixes preferred over new features throughout. Courier tracking, GBP/Search Console, and WordPress decommission are intentionally **out of this queue** (post-launch).

## Test assets (from CLAUDE.md)
- Dummy inboxes: `{ava,denice,ethan,isabella,noah,oliver,teddybear,william}@itools247.co.za`
- Phones: `082 111 1001`–`1008` (retry as `+27 82 …` if rejected)
- Email delivery verified via `python imap_check.py` (project root) reading the itools247 catch-all.
- EFT bank path only: Nedbank · LAVA VIDE SA (PTY) LTD · reference = order number.
