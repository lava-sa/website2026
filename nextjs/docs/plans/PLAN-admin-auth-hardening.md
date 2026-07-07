# PLAN-admin-auth-hardening

> Hand this file to Cursor Auto on its own. Do not batch with other plans.

## Goal
Replace the constant, forgeable admin session cookie (`admin_session=authenticated`) with a signed, expiring token so admin access cannot be trivially spoofed.

## Why it matters for go-live
Admin auth is gated everywhere by the same check:
```
store.get("admin_session")?.value === "authenticated"
```
(see `src/lib/admin-auth.ts`, `src/middleware.ts` line 83, and ~20 `/api/admin/*` route handlers). The cookie value is a **hard-coded constant string**. It is `httpOnly` and only set after a correct password (`src/app/api/admin/login/route.ts`), which is good — but because the value is a guessable constant, anyone who can set a cookie on the domain (via any future XSS, a malicious browser extension, a shared machine, or a subdomain cookie-injection) becomes a full admin with access to 1,285 customer records, orders, and CSV exports. There is no signature, no expiry binding, no per-session secret. This is the kind of latent hole that is cheap to close now and expensive after a breach.

## Files to READ first
- `src/lib/admin-auth.ts` (`isAdminAuthed`)
- `src/app/api/admin/login/route.ts` (sets the cookie; reads `ADMIN_USERNAME` / `ADMIN_PASSWORD`)
- `src/middleware.ts` (lines 72–91 — the `/admin` + `/lava-sa` gate reading `admin_session`)
- Every `/api/admin/*` route (they inline `store.get("admin_session")?.value === "authenticated"`; grep: `admin_session`)

## Files to MODIFY
- `src/lib/admin-auth.ts` (add a `createAdminSessionToken()` + `verifyAdminSessionToken()` pair; make `isAdminAuthed()` verify)
- `src/app/api/admin/login/route.ts` (set cookie to a signed token, not the literal string)
- `src/middleware.ts` (verify the signed token instead of `=== "authenticated"`)
- The inline checks in `/api/admin/*` routes → replace each with a call to the shared `isAdminAuthed()` so there is ONE verification implementation.

## Implementation order
1. Add a server-only secret `ADMIN_SESSION_SECRET` to Vercel env (document it; do not hard-code). Fail closed if unset in production.
2. In `admin-auth.ts`, implement an HMAC-signed token: payload = `{ exp }` (issued-at + 8h, matching the current `maxAge`), signature = `HMAC-SHA256(payload, ADMIN_SESSION_SECRET)`, encoded as `base64url(payload).base64url(sig)`. Use Node `crypto` (or Web Crypto in the Edge middleware — see edge caveat below).
3. `verifyAdminSessionToken(token)` → recompute HMAC, constant-time compare, reject if signature invalid OR `exp` in the past.
4. `login/route.ts` → on success, `response.cookies.set("admin_session", createAdminSessionToken(), { httpOnly, secure: prod, sameSite: "lax", maxAge: 8h, path: "/" })`.
5. `middleware.ts` → replace `session !== "authenticated"` with `!verifyAdminSessionToken(session)`.
6. Replace every inline `store.get("admin_session")?.value === "authenticated"` in `/api/admin/*` with `await isAdminAuthed()` (single source of truth). Keep behaviour identical (401/redirect).
7. `npm run build`.

## Edge cases a weaker model will miss
- **Edge runtime in middleware:** Next.js middleware runs on the Edge runtime, which does NOT have Node's `crypto` module — use **Web Crypto** (`crypto.subtle.importKey` + `sign`/`verify`) for the middleware verification path, or verify with a shared helper written against Web Crypto that also works server-side. Do not `import crypto from "crypto"` in middleware; the build will fail.
- **Constant-time comparison:** never compare signatures with `===` on the raw string in a way that short-circuits; use `crypto.timingSafeEqual` (Node) / a length-checked constant-time compare (Edge).
- **Fail closed:** if `ADMIN_SESSION_SECRET` is missing in production, `verifyAdminSessionToken` must return `false` (lock everyone out) rather than defaulting to allow. In local dev you may allow a documented dev secret.
- **Existing logged-in admins** holding the old `=="authenticated"` cookie will be logged out on deploy — expected; Anneke just logs in again. Note this in the handoff so it's not mistaken for a bug.
- **Do not weaken `secure`/`httpOnly`/`sameSite`** — keep the current flags.
- Password comparison in `login/route.ts` is currently `password !== expectedPass` (plain compare). Out of scope to change the credential store, but if trivial, make that compare constant-time too. Do NOT introduce a new auth provider in this plan.

## Acceptance criteria (how to verify PASS)
1. After deploy, logging in at `/admin/login` with correct `ADMIN_USERNAME`/`ADMIN_PASSWORD` grants access to `/admin` and `/api/admin/stats` returns data.
2. Manually setting `document.cookie = "admin_session=authenticated"` (the OLD constant) and reloading `/admin` → **redirected to login** (spoof no longer works).
3. Tampering one character of a valid token cookie → redirected to login / 401 from `/api/admin/*`.
4. After 8 hours (or by temporarily shortening `exp` in a local test) the token is rejected.
5. With `ADMIN_SESSION_SECRET` unset in a production-like build, all admin routes deny access (fail closed).
6. `grep -rn '"authenticated"' src/app/api/admin src/middleware.ts src/lib/admin-auth.ts` shows no remaining constant-string equality checks.
7. `npm run build` passes (no Node-`crypto`-in-Edge error).

## Risk if skipped
**Medium.** No known active exploit today (cookie is httpOnly and password-gated), but the constant value means any single client-side foothold escalates straight to full admin over customer PII and order data. Low cost to fix now; high blast radius if left.
