# Handoff — SEO work (start next chat here)

_Use this file at the start of a new chat when working through SEO fixes for Lava-SA._

**Internal dashboard:** `http://localhost:3000/site-info` (production: `https://lava-sa.com/site-info`) — `noindex`, for Anneke/Ignatius only.

**Audit baseline on site-info:** 28 May 2026 (codebase analysis). **Fresh specialist audits:** ~2 June 2026 (live site checks; some findings may differ after deploys).

---

## Goal for next session

Work through SEO results in priority order: fix blockers first, then on-page/schema/local, then homepage architecture (Core 30 / GBP alignment).

---

## Scores (site-info baseline vs fresh audit)

| Area | site-info (May) | Fresh audit (Jun) | Notes |
|------|-----------------|-------------------|--------|
| Overall | **69** | ~66–69 range | Align after sitemap + schema fixes |
| Technical | 70 | blocked by sitemap 500 | **Fix sitemap first** |
| On-Page | 61 | weak H1/homepage | See `/home2` concept |
| Schema | 64 | **65** | www mismatch, fake ratings, BlogPosting logo |
| Content / E-E-A-T | 74 | **66** | SA reviews, broken app images |
| GEO / AI | 71 | **58** | FAQ/Article schema, llms-full, YouTube |
| Local | — | **41** | GBP name wrong, Place ID env missing |
| Sitemap | — | **35** | 500 error, dead URLs, ~21 missing pages |
| SXO | — | **46** | Homepage ≠ category intent; Core 30 gap |

---

## P0 — Fix immediately (blocking)

1. **`/sitemap.xml` returns 500** — Google/AI cannot discover URLs. File: `nextjs/src/app/sitemap.ts`.
2. **Remove from sitemap:** `/lp/v300-premium-x`, `/v300-premium-x` (noindex/redirect).
3. **Fix 8 dead sitemap URLs** (wrong butchery slugs / removed paths).
4. **Add ~21 missing URLs** to `STATIC_ROUTES`: full `/vacuum-packaging/*`, `/about/*` subs, butchery category pages.
5. **www vs non-www in schema** — `layout.tsx` LocalBusiness uses `https://www.lava-sa.com`; canonical is `https://lava-sa.com` (3 fields: url, logo, image).
6. **Remove fabricated `AggregateRating`** on product pages without real reviews (Google policy risk). Listed on site-info TODO.

---

## P1 — High impact (week 1)

### Schema (`nextjs/src/lib/seo.ts`, `layout.tsx`, product/blog pages)

- BlogPosting `publisher.logo` → `ImageObject` with width/height.
- Product `Offer`: add `shippingDetails` + `hasMerchantReturnPolicy`.
- `openingHoursSpecification` on LocalBusiness (Mon–Fri 09:00–17:00; **closed Saturday**).
- FAQPage schema on `/help/faq` (20 Q&A — strong AI Overview feed).
- Article + author on blog posts; HowTo on step-by-step guides.
- VideoObject on `/lava-tv` and product videos.
- Link Organization ↔ LocalBusiness with `@id`.

### Local / GBP (site-info CRITICAL)

- Rename GBP: **"La.va Vacuum Packaging" → "Lava South Africa"** (Nadine: promote `lavasaonline@gmail.com` to Owner).
- Set Vercel: `NEXT_PUBLIC_GBP_URL`, `NEXT_PUBLIC_GBP_PLACE_ID`.
- NAP consistency: pick **Johannesburg vs Sandton** once; fix footer, contact, schema.
- Mount `ContactMapSection` on `/contact` (component exists, not imported).
- Add YouTube URL to `sameAs` in org/local schema + llms.txt.

### On-page (site-info TODO still valid)

- Homepage title **≤60 chars** (was ~89).
- Blog index H1: keyword-rich, not generic "Lava Blog".

### Technical / trust

- Dual domain: ensure **lava-sa.co.za → lava-sa.com** 301 (split authority risk).
- Homepage: missing `og:image`, Twitter → `summary_large_image`.
- Applications pages: fix **broken "Image needed"** placeholders in production.

---

## P2 — Content & SXO (Core 30 / Caleb Ulku video)

**Concept:** Homepage + GBP should mirror **categories and services** (Core 30): one strong page per GBP category/service, geo + topical relevance for Johannesburg / nationwide SA.

**Homepage problems (fresh SXO):**

- H1 too brand-vague vs SERP (competitors show PLPs / buying guides).
- Should lead with **why hire us** + proof, not history lesson.
- Category architecture not obvious above the fold.

**Draft solution (do not replace `/` yet):**

- **`/home2`** — `nextjs/src/app/home2/page.tsx` (noindex). Strong H1 + **H2 per category** (machines, bags, rolls, containers, butchery, sous vide) with images + links. Compare with current `/` before swap.

**Also recommended:**

- Dedicated category landing strength (bags, machines) already exist under `/products/*`.
- Comparison content: LAVA vs cheap sealers (Milex/Verimark).
- More **SA customer reviews** on homepage (not only DE testimonials).
- Build/guide pages linked from nav (some app links were 404 in audit — verify live).

---

## GEO / llms.txt

- Add **`OAI-SearchBot`** to `robots.ts`.
- Create **`/llms-full.txt`** + RSL license line in `llms.txt`.
- Remove visible **"Image needed — …"** from blog body (biltong article cited).
- External citations for stats in articles; author bio pages.

---

## Key file paths

| Topic | Path |
|-------|------|
| site-info page | `nextjs/src/app/site-info/page.tsx` |
| Sitemap | `nextjs/src/app/sitemap.ts` |
| robots | `nextjs/src/app/robots.ts` |
| llms.txt | `nextjs/public/llms.txt` |
| Global schema | `nextjs/src/app/layout.tsx` |
| SEO helpers | `nextjs/src/lib/seo.ts` |
| Homepage current | `nextjs/src/app/page.tsx` |
| Homepage v2 test | `nextjs/src/app/home2/page.tsx` |
| FAQ content | `nextjs/src/app/help/faq/page.tsx` |
| Product meta | `nextjs/src/app/products/[slug]/page.tsx` |

---

## Canvases from audit (optional deep-dive)

In workspace `canvases/` (if still present):

- `lava-sa-eeeat-audit.canvas.tsx`
- `schema-audit.canvas.tsx`

---

## Git / deploy note

- Push from **GitHub Desktop** (lava-sa account); Cursor terminal may 403 as `star-aesthetic-centre`.
- Many SEO fixes from this chat may be **local only** until pushed; verify `git status` before next session.
- Vercel project: **website2026** (not `website2026-yude`).

---

## Suggested next-chat opener

> Read `nextjs/docs/HANDOFF_SEO_NEXT_CHAT.md` and `site-info`. Start with P0 sitemap + schema www fix + fake AggregateRating. Then update `/site-info` scores/checklist as we complete items.

---

## Out of scope for SEO chat (done elsewhere)

- Janet voice (bag sizes, lead capture, `/contact` callback time) — see `HANDOFF_CRM_AND_JANET_LEADS.md`
- Rewards signup → `/account/login?mode=setup`
- Machine bag/roll compatibility table on product pages
- "About this Product" heading (was "About This Machine")

---

_Last updated: June 2026 — condensed from Cursor session before new SEO chat._
