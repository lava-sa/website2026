# PLAN-production-forms-and-test-orders

> Hand this file to Cursor Auto on its own. Do not batch with other plans.

## Goal
Get every lead-capture form (contact page, homepage footer form, mailing-list signup) verified working end-to-end on production, and reverse the 8 pre-launch test orders so real orders start from a clean slate.

## Why it matters for go-live
Lead capture is how Anneke makes money between checkouts. The contact and footer forms have only ever been exercised on localhost, where Turnstile and Resend are intentionally off (`src/app/api/contact/route.ts` returns `500 "Email service not configured"` when `getResendClient()` is null locally). They share the same Resend code path as order emails (which work on Vercel), but "should work" is not "verified." If the production Resend `from`/domain or Turnstile keys are misconfigured, silent lead loss follows. Separately, test orders ORD-6137→6144 are live PENDING rows that will mix into real order reports and Lava Points if not reversed.

## Files to READ first
- `src/app/api/contact/route.ts` (contact handler + guard usage)
- `src/lib/security/public-form-guard.ts` (`GATED_WRITE_API_PREFIXES`, Turnstile + honeypot logic)
- `src/lib/email-config.ts` (`getResendClient`, `getEmailConfig` → `fromEmail`, `adminEmails`)
- `src/lib/security/turnstile.ts` (`isTurnstileConfigured`, `verifyTurnstileToken`)
- The contact page + footer form components (find the ones POSTing to `/api/contact`) and the mailing-list form (POSTs to `/api/mailing-list`)
- `src/app/site-info/page.tsx` (QA_RESULTS + CRITICAL lists — update statuses here when done)

## Files to MODIFY
- Likely **none in code** — this is primarily a verification + data-cleanup + env-check task. Only touch code if a concrete defect is found (e.g. footer form not sending `turnstileToken`, or `adminEmails` empty). If a fix is needed, change the smallest surface and record it.
- `src/app/site-info/page.tsx` — flip the three PENDING form rows to PASS once verified (documentation only).

## Implementation order
1. **Env check (no code):** confirm on Vercel that `RESEND_API_KEY`, the Resend `from` domain, `adminEmails` (info@lava-sa.com), and both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` are set for production. Report any missing.
2. **Contact form live test:** on `https://www.lava-sa.com/contact`, submit once with a test inbox (`noah@itools247.co.za`, phone `082 111 1005`, retry `+27 82 111 1005` if rejected). Pass the Turnstile widget.
3. **Footer form live test:** on the homepage footer, submit once with a different test inbox (`oliver@itools247.co.za`).
4. **Mailing-list live test:** submit `isabella@itools247.co.za` via the footer/mailing signup; then confirm the subscriber appears in Admin → Mailing list.
5. **Verify delivery:** run `python imap_check.py` (project root) and confirm each submission arrived at the info@ / catch-all inbox. Log PASS/FAIL per form.
6. **Reverse test orders:** in Admin → Orders, locate ORD-6137 → ORD-6144 (notes contain "TEST ORDER — do NOT fulfil"). Set each to cancelled/trashed per the admin's reversal flow so they drop out of revenue and never award points. Do **not** delete if the admin flow prefers a "cancelled" status — match existing convention.
7. Update `site-info/page.tsx` QA rows to reflect verified reality.

## Edge cases a weaker model will miss
- **Honeypot silent-success:** `guardFailureResponse` returns `{ ok: true, success: true }` with HTTP 200 when the honeypot `website` field is filled. A form that mistakenly binds a visible field to `website` will *appear* to submit but send nothing. When testing, leave the honeypot empty and confirm a real email arrives — a 200 alone does NOT prove delivery. Always cross-check IMAP.
- **Turnstile token single-use:** don't reuse a captcha token across two submits; each live test needs a fresh page load.
- **`adminEmails` may be a comma list** — confirm info@lava-sa.com is actually in it, not just the from-address.
- **Test orders may already have Lava Points implications** — only relevant after `027_points_launch_july_2026.sql` runs, but reverse them regardless so historical reports are clean.
- **Do NOT place any new test order** to verify checkout here — that is covered by PLAN-checkout-price-integrity. This plan only reverses the existing 8.

## Acceptance criteria (how to verify PASS)
Payments rule: **EFT / Direct Bank Transfer ONLY. Never card/PayFast with real details** (not exercised in this plan at all).
1. Contact form: one live submit on `https://www.lava-sa.com/contact` → email received at info@lava-sa.com, confirmed by `imap_check.py`. Log PASS.
2. Footer form: one live submit → email received, IMAP-confirmed. Log PASS.
3. Mailing list: one live signup → subscriber visible in Admin → Mailing list AND (if a welcome/confirm email is claimed) IMAP-confirmed. Log PASS.
4. ORD-6137 → ORD-6144 all show a reversed/cancelled status in Admin → Orders; total revenue figure on the admin dashboard drops accordingly.
5. `site-info` page no longer shows those three forms as PENDING.

## Risk if skipped
**High for ops.** Silent lead loss (customers who "contacted us" but whose message never arrived) and polluted revenue/points data from test orders. Both erode Anneke's trust in the platform in week one.
