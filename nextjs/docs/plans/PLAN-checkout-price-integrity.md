# PLAN-checkout-price-integrity

> Hand this file to Cursor Auto on its own. Do not batch with other plans.

## Goal
Re-validate every cart line price and stock against the Supabase `products` table on the server before an order is created, so a customer cannot tamper with prices sent from the browser.

## Why it matters for go-live
`src/app/api/checkout/route.ts` currently trusts the `price` value that arrives in the request body (`item.price` from the client cart). Both payment paths use it:
- **Bank transfer:** the order `total` is written straight from client prices; Anneke sends bank details for whatever total the browser submitted.
- **PayFast:** the ITN handler (`src/app/api/payfast/itn/route.ts` lines 59–66) only checks that `amount_gross` equals `order.total` — but `order.total` was itself computed from the tampered client price, so the check passes for a manipulated amount.

Result: a technical customer can buy a V.500 for R1. This directly affects revenue and must be fixed before real orders flow.

## Files to READ first
- `src/app/api/checkout/route.ts` (the insert flow — lines 52–177)
- `src/lib/cart-context.ts` (the `CartItem` shape: `id`, `price`, `quantity`, `sku`, `name`)
- `src/lib/products.ts` (existing Supabase product fetch helpers — reuse `getProductById` / equivalent; find the exact export name before writing)
- `src/lib/shipping.ts` (`getShipping` — keep using it, but feed it the server subtotal)
- `src/app/api/payfast/itn/route.ts` (no change needed once totals are trusted, but read to confirm)

## Files to MODIFY
- `src/app/api/checkout/route.ts` (only this file)

## Implementation order
1. In `src/lib/products.ts`, confirm there is a helper that fetches a product's authoritative price + stock by `id`. If one exists (e.g. `getProductById`), reuse it. If not, add `getProductsByIds(ids: string[])` that returns `id, regular_price, sale_price, stock_status, name, sku` for the given ids in a single `.in("id", ids)` query. Use `createServiceClient()`.
2. In `checkout/route.ts`, after parsing `body` and before calculating totals (before current line 67), collect `const ids = cart.map(i => i.id)` and fetch authoritative rows.
3. Build a `Map<id, row>`. For each cart item:
   - If the id is missing from the map → return `400 { error: "One or more items are no longer available" }`.
   - Compute `serverPrice = row.sale_price ?? row.regular_price`.
   - If `row.stock_status === "out_of_stock"` → return `400 { error: "<name> is out of stock" }`.
   - Ignore `item.price` from the client entirely — use `serverPrice`.
4. Recompute `subtotal` from `serverPrice * item.quantity`. Recompute `shipping = getShipping(subtotal, customer.province)` and `total`.
5. Use `serverPrice` when building `itemRows` (`unit_price`, `line_total`) so the stored order matches the trusted price.
6. Use `row.name`/`row.sku` for `product_name`/`product_sku` too (don't trust client display strings).
7. Leave the PayFast signature block unchanged — it will now sign the trusted `total`.

## Edge cases a weaker model will miss
- **Quantity is still client-supplied** — clamp it: reject `quantity < 1` or non-integer; cap at a sane max (e.g. 99) to stop negative-quantity total manipulation.
- **`sale_price` of 0 is valid-looking but wrong** — treat `sale_price` as "on sale" only when it is a positive number less than `regular_price`; otherwise fall back to `regular_price`. A `0` or `null` sale_price must NOT make the item free.
- **Rounding** — keep the existing `.toFixed(2)` only at the PayFast `amount` boundary; do arithmetic in numbers, not strings, to avoid float concatenation.
- **Empty fetch result** (DB momentarily unreachable) — if the products query errors, return `503 { error: "Could not verify your cart, please try again" }`; never fall through to client prices.
- **Duplicate ids in cart** (same product added twice as separate lines) — the `.in()` map lookup still works; don't assume one row per cart line.
- Do **not** change `generateOrderNumber` or the account-provisioning / email blocks.

## Acceptance criteria (how to verify PASS)
Payments rule: **EFT / Direct Bank Transfer ONLY. Never card/PayFast with real details.**
1. Local build passes: `npm run build` with no type errors in `checkout/route.ts`.
2. Tamper test (localhost or preview): using browser devtools or curl, POST to `/api/checkout` with `payment_method: "bank_transfer"`, a valid `customer` block using a test inbox (e.g. `ava@itools247.co.za`, phone `082 111 1001`), and a cart line whose `price` is set to `1` for a real product id whose true price is thousands.
   - **PASS** = the created order's `total` in Supabase (and the confirmation email) reflects the TRUE product price, not R1.
3. Out-of-stock test: POST a cart line for a product whose `stock_status` is `out_of_stock` → expect `400` and NO order row created.
4. Email delivery: run `python imap_check.py` (project root) against the itools247 catch-all and confirm the order confirmation email arrived with the corrected total.
5. Negative/zero quantity POST → `400`, no order created.

## Risk if skipped
**Critical.** Direct revenue loss and fraud exposure from day one of real trading. A single shared exploit URL could let buyers set any price. This is the highest-leverage fix in the queue.
