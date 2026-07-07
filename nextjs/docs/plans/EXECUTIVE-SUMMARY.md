# EXECUTIVE-SUMMARY — LAVA-SA Pre-Launch Code Review

**Reviewed:** 14 May 2026 · **Reviewer:** Claude (read-only audit, no fixes applied)
**Scope:** `nextjs/` codebase + documented QA status (`site-info` page, dated 30 June 2026)
**Verdict:** Not launch-ready as-is. One critical revenue defect, several PENDING verifications. All fixable — see the 5 PLAN files + IMPLEMENTATION-QUEUE.md.

> Payments rule observed throughout: EFT / Direct Bank Transfer ONLY for any testing. Never card/PayFast with real details.

## Top 10 issues, ranked by launch risk

| # | Issue | Label | Evidence | Plan |
|---|-------|-------|----------|------|
| 1 | **Checkout trusts client-supplied prices.** Cart `price` is never re-validated against the DB; PayFast ITN amount check compares against a total already built from tampered prices. A buyer can pay R1 for any product. | **FAIL** | `api/checkout/route.ts:61–99, 122–130`; `api/payfast/itn/route.ts:59–66` | PLAN-checkout-price-integrity |
| 2 | **Contact + footer forms never verified on production.** Localhost returns 500 (Resend off locally); shares order-email path but "should work" ≠ verified. Silent lead loss if prod env misconfigured. | **PENDING** | `api/contact/route.ts:30–33`; `site-info` QA rows | PLAN-production-forms-and-test-orders |
| 3 | **8 test orders ORD-6137→6144 still live** as PENDING rows; will pollute revenue + points. | **PENDING** | `site-info` CLEANUP list | PLAN-production-forms-and-test-orders |
| 4 | **Fabricated `AggregateRating` (5.0/3) + fake named testimonials** on every product with no real reviews → Google structured-data policy violation, site-wide rich-result risk. | **FAIL** | `products/[slug]/page.tsx:127–131, 243–247`; `lib/seo.ts:166–174` | PLAN-remove-fabricated-ratings |
| 5 | **`orders.payment_method` migration may be un-run;** checkout swallows the error silently, so orders can lose their EFT/PayFast tag. | **PENDING** | `api/checkout/route.ts:116–119` | PLAN-db-migrations-launch |
| 6 | **`027_points_launch_july_2026.sql` may be un-run;** risk of retroactive points on 1,285 migrated customers. | **PENDING** | `site-info` CLEANUP; `api/payfast/itn/route.ts:98` | PLAN-db-migrations-launch |
| 7 | **Admin session cookie is a constant string** (`admin_session=authenticated`) — not signed/expiring; any cookie-set foothold = full admin over customer PII. | **FAIL (latent)** | `lib/admin-auth.ts:5`; `middleware.ts:83`; ~20 `/api/admin/*` routes | PLAN-admin-auth-hardening |
| 8 | **Mailing-list signup not confirmed end-to-end on production** (validates on localhost; needs one live signup → admin list check). | **PENDING** | `site-info` QA rows | PLAN-production-forms-and-test-orders |
| 9 | **Courier tracking number is a placeholder** on the customer order page — not wired to any carrier. Acceptable for launch IF messaging doesn't over-promise live tracking. | **PENDING (post-launch OK)** | `site-info` QA + BUILT notes | Deferred — noted, not a launch blocker |
| 10 | **Latest local fixes not yet deployed** (magic-link accounts, footer form, member modal, PDP tables, site-info). Nothing is verified on prod until this ships. | **PENDING** | `site-info` CRITICAL list | Precondition for #2/#3/#5 verification |

## What's solid (spot-checked PASS)
- Legacy-host 308 redirects (`lava-sa.co.za`, `.online` → `lava-sa.com`) in `middleware.ts` — correct.
- Noindex on all non-production hosts + admin/account/checkout — correct; the "missing metadata" pages are all intentionally noindex, not SEO gaps.
- Duplicate-looking `/v300-premium-x` and `/pages/lava-vacuum-sealer-v-300-x` routes are pure `redirect()` shims → no duplicate-content problem.
- PayFast ITN verifies signature + does a server-side validate call before trusting status.
- Public forms have honeypot + Turnstile + suspicious-name/email guards.
- Sub-category system (tags, not `category_id`) is coherent; `product-subcategories.ts` preserves unrelated tags on save.

## Not blockers (defer to post-launch)
- Courier tracking wiring (#9), GBP/Search Console/review-request emails (already post-launch by design), old WordPress decommission, `/search` page metadata.

## Bottom line
Fix **#1 before any real order is possible.** Then verify forms + reverse test orders (#2/#3), remove fake ratings (#4), run migrations (#5/#6). Admin auth (#7) is the one "no active exploit but close it now" item. Work the queue one plan at a time.
