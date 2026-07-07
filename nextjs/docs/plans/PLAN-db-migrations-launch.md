# PLAN-db-migrations-launch

> Hand this file to Cursor Auto on its own. Do not batch with other plans.

## Goal
Apply the two outstanding Supabase migrations — the `orders.payment_method` column and `027_points_launch_july_2026.sql` — so order tagging and Lava Points behave correctly, and remove the silent "column not found" fallback in checkout once the column exists.

## Why it matters for go-live
1. `src/app/api/checkout/route.ts` (lines 116–119) writes `payment_method` in a **fire-and-forget** update that swallows the error if the column is missing (`console.warn("payment_method column not found …")`). If the migration never ran, every order silently lacks its PayFast-vs-EFT tag, and the admin Orders view can't reliably show the payment badge.
2. `027_points_launch_july_2026.sql` enforces "no retroactive Lava Points before 1 July 2026." If it hasn't run, the ITN handler's `awardPointsForPaidOrder` (`src/app/api/payfast/itn/route.ts` line 98) may award points against pre-launch/historical orders, corrupting the loyalty ledger for 1,285 migrated customers.

## Files / assets to READ first
- `supabase/027_points_launch_july_2026.sql` (read the full migration before running — understand what it changes)
- Any file named like `supabase/*payment-method*.sql` or `supabase-orders-payment-method.sql` (referenced in the checkout comment — locate the exact file; if it does not exist, the column migration must be written)
- `src/app/api/checkout/route.ts` (lines 116–119 — the silent update)
- `src/lib/points-award.ts` (`awardPointsForPaidOrder` — confirm it relies on the migration's date guard)
- `src/app/api/payfast/itn/route.ts` (line 98 — where points are awarded)

## Steps (run in this order)
1. **Confirm current DB state** in Supabase SQL editor:
   `select column_name from information_schema.columns where table_name = 'orders' and column_name = 'payment_method';`
   - If it returns a row, the column exists → skip step 2.
2. **If missing**, run:
   `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'payfast';`
   (or run the located `*payment-method*.sql` file if present — prefer the committed file over an ad-hoc statement).
3. **Check whether 027 has run.** Read the migration; if it creates a table/column/trigger, query for that object's existence first. Only run `027_points_launch_july_2026.sql` if its objects are absent (migrations here are not idempotent-guaranteed — verify before running to avoid duplicate-object errors).
4. **After the column exists**, harden checkout: change lines 116–119 so `payment_method` is part of the INITIAL insert object (add `payment_method` to the `.insert({...})` at lines 82–97) and delete the separate fire-and-forget update + its warning. This removes the "silent" path now that the column is guaranteed.
5. Re-run `npm run build`.

## Edge cases a weaker model will miss
- **Do NOT assume the migrations haven't run.** The site has been trading in test mode; someone may have applied them. Always query `information_schema` / object existence first. Running `027` twice could error or double-apply a points rule.
- **`DEFAULT 'payfast'` back-fills existing rows** as payfast — acceptable, but note that historical EFT test orders (ORD-6137→6144) will show as payfast unless separately corrected. Not worth fixing; they're being reversed in PLAN-production-forms-and-test-orders.
- **Points date guard is timezone-sensitive** — "before 1 July 2026" should be evaluated in Africa/Johannesburg, not UTC. Confirm the migration/`points-award.ts` uses the intended boundary; a UTC midnight cutoff is 2 hours off SAST.
- **Moving `payment_method` into the insert** must keep the retry loop intact (the insert is inside a `for` loop handling `23505` unique-collisions) — add the field to the object, don't restructure the loop.
- This is a **destructive-capable** step (schema + data). Take a Supabase backup/snapshot before running 027.

## Acceptance criteria (how to verify PASS)
Payments rule: any verification order uses **EFT / Direct Bank Transfer ONLY**.
1. `information_schema` query confirms `orders.payment_method` exists.
2. A fresh EFT test order (via test inbox e.g. `william@itools247.co.za`, or reuse the PLAN-checkout tamper test) shows `payment_method = 'bank_transfer'` in the row, set on INSERT (no warning in Vercel logs).
3. Admin → Orders shows the correct EFT vs PayFast badge for that order.
4. 027 objects confirmed present via a targeted existence query; a paid order dated before 2026-07-01 (SAST) awards **zero** points; a paid order on/after awards points at 1 pt per R5 on full-price items only.
5. `npm run build` passes; the `console.warn("payment_method column not found…")` line no longer exists in `checkout/route.ts`.

## Risk if skipped
**Medium-high for ops/data integrity.** Untagged orders weaken admin reporting; un-run points migration corrupts the loyalty ledger for the migrated customer base — hard to unwind once real points accrue.
