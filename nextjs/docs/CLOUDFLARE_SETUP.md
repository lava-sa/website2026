# Cloudflare setup for lava-sa.com

This site uses Cloudflare for DNS/proxy (DDoS, CDN, bot filtering) and **Turnstile** for form spam protection — same pattern as Star Aesthetic Centre.

## 1. DNS (orange cloud → Vercel)

In Cloudflare **DNS** for `lava-sa.com`:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` | `76.76.21.21` | Proxied (orange) |
| CNAME | `www` | `cname.vercel-dns.com` | Proxied (orange) |

Vercel project must have `lava-sa.com` and `www.lava-sa.com` as production domains.

**SSL/TLS** → Overview: **Full (strict)**.

## 2. Turnstile widget

1. Cloudflare dashboard → **Turnstile** → **Add widget**
2. **Widget name:** `Lava-SA public forms`
3. **Domains:** `lava-sa.com`, `www.lava-sa.com` (add `localhost` for local testing if needed)
4. **Widget mode:** Managed (recommended)
5. Copy **Site key** and **Secret key**

## 3. Vercel environment variables

Add to the **Production** environment (and Preview if you test forms there):

```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>
TURNSTILE_SECRET_KEY=<secret key>
```

Redeploy after saving env vars.

Protected endpoints:

- `POST /api/contact`
- `POST /api/reviews`
- `POST /api/mailing-list`

Each also uses a honeypot field and basic email/name spam checks.

## 4. Optional Cloudflare hardening

**Security** → **Settings**

- Security Level: Medium or High
- Bot Fight Mode: On (if no false positives on checkout)

**WAF** → custom rule (optional): challenge or block obvious bot paths.

**Speed** → enable Auto Minify (HTML/CSS/JS) if not conflicting with Vercel.

## 5. Preview / site-access gate

When `SITE_ACCESS_PASSWORD` is set, middleware blocks public write APIs unless the visitor has the site-access cookie — so bots cannot bypass the HTML password gate.

Remove `SITE_ACCESS_PASSWORD` (or set `SITE_ACCESS_ENABLED=false`) when going fully live.

## 6. Verify

1. Submit contact form on production — Turnstile checkbox appears and submission succeeds.
2. Check response headers include `X-Frame-Options`, `Strict-Transport-Security` (production only).
3. In Cloudflare **Analytics**, confirm traffic is proxied (orange cloud).

## Local development

Without Turnstile keys, the widget shows a dev notice and the API skips captcha verification. Add keys to `.env.local` to test the full flow.
