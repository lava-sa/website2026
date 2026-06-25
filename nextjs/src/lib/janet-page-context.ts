/** Structured page context Janet reads instead of guessing from scraped text. */

export type JanetListingItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  canAddToCart: boolean;
};

export type JanetPageProduct = {
  type: "product";
  id: string;
  slug: string;
  name: string;
  price: number;
  sku: string | null;
  image: string | null;
  canAddToCart: boolean;
  category?: string;
};

export type JanetPageListing = {
  type: "listing";
  pageTitle?: string;
  products: JanetListingItem[];
};

export type JanetPageContext =
  | JanetPageProduct
  | JanetPageListing
  | { type: "page"; path: string; title?: string };

declare global {
  interface Window {
    __JANET_PAGE__?: JanetPageContext;
  }
}

export function setJanetPageContext(ctx: JanetPageContext) {
  if (typeof window !== "undefined") {
    window.__JANET_PAGE__ = ctx;
  }
}

export function clearJanetPageContext(slug?: string) {
  if (typeof window === "undefined") return;
  const current = window.__JANET_PAGE__;
  if (!current) return;
  if (current.type === "product" && slug && current.slug !== slug) return;
  delete window.__JANET_PAGE__;
}

function parseListingItem(raw: string): JanetListingItem | null {
  try {
    const item = JSON.parse(raw) as JanetListingItem;
    if (item?.id && item?.slug && item?.name && typeof item.price === "number") {
      return item;
    }
  } catch {
    // ignore
  }
  return null;
}

/** Read product cards injected via data-janet-listing-item on category grids. */
export function scrapeListingFromDom(): JanetListingItem[] {
  if (typeof document === "undefined") return [];

  const seen = new Set<string>();
  const items: JanetListingItem[] = [];

  for (const el of document.querySelectorAll<HTMLElement>("[data-janet-listing-item]")) {
    const raw = el.dataset.janetListingItem;
    if (!raw) continue;
    const item = parseListingItem(raw);
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }

  return items;
}

/** Read product context from window, data attributes, or listing cards on the page. */
export function getJanetPageContext(): JanetPageContext | null {
  if (typeof document === "undefined") return null;

  const productEl = document.querySelector<HTMLElement>("[data-janet-product]");
  if (productEl?.dataset.janetProduct) {
    try {
      return JSON.parse(productEl.dataset.janetProduct) as JanetPageProduct;
    } catch {
      // fall through
    }
  }

  const windowCtx = typeof window !== "undefined" ? window.__JANET_PAGE__ : null;
  if (windowCtx?.type === "product") return windowCtx;
  if (windowCtx?.type === "listing" && windowCtx.products.length > 0) return windowCtx;

  const listing = scrapeListingFromDom();
  if (listing.length > 0) {
    return { type: "listing", products: listing };
  }

  return windowCtx ?? null;
}

export function formatJanetPageContextForPrompt(
  ctx: JanetPageContext | null,
  urlPath: string
): string {
  if (!ctx) {
    return `Page path: ${urlPath}\n(No structured catalog on this page — use visible text and the machine catalog in your instructions.)`;
  }

  if (ctx.type === "listing") {
    const lines = ctx.products
      .map(
        (p) =>
          `• ${p.name} — ${p.price} Rand (slug: ${p.slug})${
            p.canAddToCart ? "" : " [on-order — WhatsApp only]"
          }`
      )
      .join("\n");

    return `STRUCTURED PAGE CONTEXT — PRODUCT LISTING (authoritative)
- Page path: ${urlPath}
${ctx.pageTitle ? `- Page: ${ctx.pageTitle}\n` : ""}- ${ctx.products.length} products on this page:

${lines}

SHOPPING BEHAVIOUR ON LISTINGS (like a premium retail AI demo):
- When they state a need, suggest 2–4 matching products FROM THIS LIST with prices.
- Offer to scroll: "I can scroll down to the products — shall I?" then call scroll_to_section.
- To add to cart, use add_to_cart with the correct slug from this list.
- Compare products honestly with prices when asked "which is better?"`;
  }

  if (ctx.type !== "product") {
    return `Page path: ${urlPath}\n${ctx.title ? `Page: ${ctx.title}` : ""}`;
  }

  const purchaseNote = ctx.canAddToCart
    ? `When they agree to buy, confirm product and quantity (usually 1), then call add_to_cart with productId="${ctx.slug}", productName="${ctx.name}", price=${ctx.price}.`
    : `This product is on-order only — do NOT call add_to_cart. Offer WhatsApp or a callback instead.`;

  return `STRUCTURED PAGE CONTEXT — PRODUCT DETAIL (authoritative)
- Page type: Product detail page
- Product UUID: ${ctx.id}
- Slug for add_to_cart productId: ${ctx.slug}
- Product name: ${ctx.name}
- Price ZAR incl VAT: ${ctx.price}
- SKU: ${ctx.sku ?? "n/a"}
- Category: ${ctx.category ?? "n/a"}
- Path: ${urlPath}
- Can add to cart: ${ctx.canAddToCart ? "yes" : "no"}

The visitor is viewing THIS product. Greet them about ${ctx.name} by name. ${purchaseNote}`;
}
