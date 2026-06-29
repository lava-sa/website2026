---
description: Pre-launch stress test of lava-sa.com — products via manual EFT, contact form, mailing list — with verified email delivery.
---

# /stress-test — LAVA-SA pre-launch stress test

Run in GOAL mode: keep working until the Definition of Done is confirmed by a SEPARATE verification
pass. Do not self-certify. (For the strongest guarantee you can also invoke this under /goal.)

## Target
BASE_URL = https://www.lava-sa.com   (public; custom Next.js build — DISCOVER menus, fields, and
payment options live; do NOT assume WooCommerce/BACS selectors.)

## Recipient inboxes (the "customer" email on forms/checkout — rotate through these)
@itools247.co.za : ava, denice, ethan, isabella, noah, oliver, teddybear, william
Phones: 082 111 1001–1008  (if a local format is rejected, retry as +27 82 ...)

## Operating rules
- Headed Playwright so the user can watch.
- EVIDENCE, NOT ASSERTIONS: every test → a screenshot AND a logged result line, saved to
  ./stress-test-evidence/lava-sa/<today>/.
- PAYMENT SAFETY (CRITICAL): LAVA checkout shows TWO options — **"Direct Bank Transfer"** and
  **"PayFast"**. ALWAYS select **Direct Bank Transfer** (creates a PENDING / awaiting-payment order,
  no money moves). **NEVER select PayFast** — it is an instant-EFT/card gateway where REAL money
  moves. NEVER enter card or bank-login details. If Direct Bank Transfer is missing, has disappeared,
  or won't produce a PENDING order → STOP and report; do not fall back to PayFast.
- TRACK everything created (order numbers, form submissions) for cleanup.

## Test 1 — Products via manual EFT (top 15)
For each product: open → screenshot → add to cart → verify cart (product/qty/price) → checkout →
fill customer + shipping (courier; rotate inboxes) → select **Direct Bank Transfer** (NOT PayFast)
→ place order → verify a
confirmation page, order number, and PENDING status → screenshot. Record product, price, inbox,
order number, status, PASS/FAIL.
Edge cases across the runs: qty 2–3 on a couple (totals update); one order with a required field
blank (expect validation, then fix); one invalid coupon (expect graceful rejection).

## Test 2 — Contact form (fields: name, phone/WhatsApp, "what can we help with" dropdown, message)
Run + screenshot each: (1) valid baseline; (2) empty required fields → validation; (3) malformed
email; (4) ~2,000-char message → no layout break; (5) special chars `< > & " '` and `<b>test</b>`
→ confirm escaped/sanitised; (6) double-submit → no duplicate/error. Log PASS/FAIL each.

## Test 3 — Mailing list (interest-category dropdown + email)
Run + screenshot each: (1) valid email → success; (2) invalid email → rejected; (3) already-
subscribed (reuse #1) → note behaviour; (4) empty → validation.

## Email delivery verification
After the tests, run the catch-all check on the itools247 mailbox:
  python imap_check.py --since-min 30 --subject "order"
  python imap_check.py --since-min 30 --subject "contact"   (adjust to real subjects discovered)
Confirm each expected email ARRIVED. **Flag any email the site CLAIMED to send that never landed.**

## Definition of Done (don't stop until ALL true)
- [ ] 15 products purchased via manual EFT; every order PENDING (none charged); a screenshot each.
- [ ] Contact: all 6 cases run, screenshot + PASS/FAIL each.
- [ ] Mailing list: all 4 cases run, screenshot + PASS/FAIL each.
- [ ] Email check produced; any claimed-but-missing emails flagged.
- [ ] Results table printed: test | input | expected | actual | PASS/FAIL | screenshot path.
- [ ] Cleanup list printed: every order number + form submission created.
- [ ] A SECOND pass re-opened the evidence and confirmed the above. Done is SHOWN, not asserted.

## Output
1. Results table  2. Cleanup list  3. Email table  4. Honest notes (anything thin/missing/worth actioning).
