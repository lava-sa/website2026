# PLAN-remove-fabricated-ratings

> Hand this file to Cursor Auto on its own. Do not batch with other plans.

## Goal
Stop emitting fake `AggregateRating` structured data (and fake star UI) on product pages that have no real reviews, so the site complies with Google's structured-data policy.

## Why it matters for go-live
`src/app/products/[slug]/page.tsx` (around lines 243–247) falls back to a hard-coded block when a product has no entry in `reviews.json`:
```
{ average_rating: 5.0, total_reviews: 3, reviews: FALLBACK_REVIEWS }
```
This is passed to `productSchema(product, productReviews)` in `src/lib/seo.ts`, which attaches an `aggregateRating` whenever `total_reviews > 0`. Every product without genuine reviews therefore ships a **fabricated 5.0/3-review rating** in JSON-LD and shows invented "Thomas S. / Caroline D." testimonials in the UI. Google treats self-serving fake review markup as a structured-data violation → risk of a manual action, loss of rich-result eligibility site-wide, and a trust/credibility problem if a customer notices identical "reviews" on every product.

## Files to READ first
- `src/app/products/[slug]/page.tsx` (`FALLBACK_REVIEWS` const ~lines 127–131; `productReviews` fallback ~243–247; reviews `<section id="reviews">` ~669–721; `prodLd` build ~249)
- `src/lib/seo.ts` (`productSchema` — the `if (reviews && reviews.total_reviews > 0)` aggregateRating block ~166–174)
- `src/data/reviews.json` (shape of a real review entry — keys `average_rating`, `total_reviews`, `reviews[]`)

## Files to MODIFY
- `src/app/products/[slug]/page.tsx`
- (Optional) `src/lib/seo.ts` only if you choose to harden the guard there too.

## Implementation order
1. Split the concept of "reviews for display" from "reviews for schema."
2. Introduce `const realReviews = (reviewsData as any)[product.slug] ?? null;` — the actual entry, or null.
3. **Schema:** pass `realReviews` (nullable) to `productSchema`. When null, no `aggregateRating` is emitted. Confirm `productSchema` already no-ops on null/`total_reviews === 0` (it does today — keep it that way).
4. **UI reviews section:** decide the intended behaviour and implement one:
   - **Preferred:** when `realReviews` is null, render a "Be the first to review this product" state with the existing `/submit-review` CTA, and DO NOT render invented testimonials or a fake star average.
   - If a soft social-proof block is still wanted, it must be clearly generic ("Trusted by 350,000+ Lava customers worldwide") and must NOT be marked up as `Review`/`AggregateRating` or attributed to fake named individuals.
5. **Delete `FALLBACK_REVIEWS`** (the "Thomas S. / Caroline D. / Riël A." array) entirely once nothing references it.
6. Keep the real path intact: products that DO have a `reviews.json` entry keep their stars, testimonials, and aggregateRating.
7. Confirm the "Translated from la-va.com" accreditation line only shows when `realReviews` exists (it already gates on `(reviewsData as any)[product.slug]`).

## Edge cases a weaker model will miss
- **The purchase-panel star row** near the top of the page (~lines 331–341) also uses `productReviews.average_rating`. If you null out the fallback, guard THIS block too or it will crash / show `0.0`. Either hide the star row when no real reviews, or show nothing — never a fabricated 5.0.
- **`prodLd` is built once** (~line 249) and injected via `<JsonLd data={[prodLd, crumbLd]} />`. Make sure the nulled reviews object flows into `productSchema` there, not a second stale variable.
- **`reviews.json` entries with `total_reviews: 0`** must behave like "no reviews" (no aggregateRating) — verify the guard is `> 0`, not "truthy object exists."
- Don't remove the whole `#reviews` section — the `/submit-review` CTA and the anchor target from the star row must survive.
- V.100 rich content (PLAN dependency): the machine FAQ/tests sections are separate from reviews — do not touch `machine-content.ts`.

## Acceptance criteria (how to verify PASS)
1. Pick a product with NO `reviews.json` entry. View source / use Google's Rich Results Test on its URL (e.g. a spare part or a container): **no `AggregateRating` and no `Review` nodes** in the Product JSON-LD.
2. Same page UI: no invented named testimonials, no fabricated 5.0 star average; a "be the first to review" CTA is shown instead.
3. Pick a product WITH a real `reviews.json` entry (e.g. `v300-premium-x` if present): stars, testimonials, and `aggregateRating` still render correctly.
4. `grep -r "FALLBACK_REVIEWS" src/` returns nothing.
5. `npm run build` passes with no type errors.

## Risk if skipped
**High for SEO/trust.** Ongoing Google structured-data policy violation across the whole catalogue; a manual action would strip rich results from the entire site, not just one page. Also a credibility landmine if a customer spots identical "reviews" everywhere.
