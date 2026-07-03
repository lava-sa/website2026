export type FunnelDiscountPercent = 10 | 15 | 20 | 25;

export interface FunnelStepConfig {
  title: string;
  description: string;
  productIds: string[];
  discountPercent: FunnelDiscountPercent;
}

export interface FunnelConfig {
  enabled: boolean;
  steps: FunnelStepConfig[];
}

export const DEFAULT_FUNNEL_CONFIG: FunnelConfig = {
  enabled: false,
  steps: [{ title: "Step 1 Offer", description: "", productIds: [], discountPercent: 10 }],
};

export function parseFunnelConfig(raw: unknown): FunnelConfig {
  if (!raw || typeof raw !== "string") return DEFAULT_FUNNEL_CONFIG;
  try {
    const parsed = JSON.parse(raw) as Partial<FunnelConfig>;
    const enabled = Boolean(parsed.enabled);
    const steps = Array.isArray(parsed.steps)
      ? parsed.steps.slice(0, 3).map((step) => ({
          title: typeof step.title === "string" && step.title.trim().length > 0
            ? step.title.trim()
            : "Funnel Offer",
          description: typeof step.description === "string" ? step.description.trim() : "",
          productIds: Array.isArray(step.productIds) ? step.productIds.slice(0, 3) : [],
          discountPercent: [10, 15, 20, 25].includes(Number(step.discountPercent))
            ? (Number(step.discountPercent) as FunnelDiscountPercent)
            : 10,
        }))
      : DEFAULT_FUNNEL_CONFIG.steps;
    return { enabled, steps: steps.length ? steps : DEFAULT_FUNNEL_CONFIG.steps };
  } catch {
    return DEFAULT_FUNNEL_CONFIG;
  }
}

export function applyFunnelDiscount(price: number, discountPercent: FunnelDiscountPercent): number {
  return Math.round(price * (1 - discountPercent / 100));
}

/** Cart line items added via /buy/[slug] carry this metadata. */
export interface CartItemFunnelMeta {
  sourceSlug: string;
  baseProductId: string;
  baseName: string;
  /** Price before funnel discount (usually regular_price). */
  regularPrice: number;
  /** Normal storefront price without funnel bundle (sale_price or regular_price). */
  catalogPrice: number;
  discountPercent: FunnelDiscountPercent;
}

const FUNNEL_ID_RE = /^(.+)__funnel_(.+)_step(\d+)$/;
const FUNNEL_NAME_RE = /\s*\(Funnel Offer -(\d+)%\)\s*$/;

export function parseFunnelCartItemId(id: string): {
  baseProductId: string;
  sourceSlug: string;
  step: number;
} | null {
  const match = id.match(FUNNEL_ID_RE);
  if (!match) return null;
  return {
    baseProductId: match[1],
    sourceSlug: match[2],
    step: Number(match[3]),
  };
}

export function isFunnelCartItem(item: { id: string; name: string; funnel?: CartItemFunnelMeta }): boolean {
  return Boolean(item.funnel) || item.name.includes("Funnel Offer") || Boolean(parseFunnelCartItemId(item.id));
}

export function getFunnelSourceSlug(item: {
  id: string;
  funnel?: CartItemFunnelMeta;
}): string | null {
  if (item.funnel?.sourceSlug) return item.funnel.sourceSlug;
  return parseFunnelCartItemId(item.id)?.sourceSlug ?? null;
}

export function isPrimaryForFunnelSource(
  item: { slug: string; id: string; name: string; funnel?: CartItemFunnelMeta },
  sourceSlug: string
): boolean {
  return item.slug === sourceSlug && !isFunnelCartItem(item);
}

/** Infer funnel metadata for cart rows persisted before meta existed. */
export function inferFunnelMeta(item: {
  id: string;
  name: string;
  price: number;
}): CartItemFunnelMeta | undefined {
  const parsed = parseFunnelCartItemId(item.id);
  if (!parsed) return undefined;

  const nameMatch = item.name.match(FUNNEL_NAME_RE);
  const discountPercent = (
    nameMatch && [10, 15, 20, 25].includes(Number(nameMatch[1]))
      ? Number(nameMatch[1])
      : 10
  ) as FunnelDiscountPercent;

  const baseName = item.name.replace(FUNNEL_NAME_RE, "").trim();
  const regularPrice = Math.round(item.price / (1 - discountPercent / 100));

  return {
    sourceSlug: parsed.sourceSlug,
    baseProductId: parsed.baseProductId,
    baseName,
    regularPrice,
    catalogPrice: regularPrice,
    discountPercent,
  };
}

/** Restore funnel line to normal catalog pricing when the primary product is removed. */
export function stripFunnelDiscountFromItem<T extends {
  id: string;
  name: string;
  price: number;
  funnel?: CartItemFunnelMeta;
}>(item: T): T {
  const meta = item.funnel ?? inferFunnelMeta(item);
  if (!meta) return item;

  return {
    ...item,
    id: meta.baseProductId,
    name: meta.baseName,
    price: meta.catalogPrice,
    funnel: undefined,
  };
}

/** Drop funnel discounts when their primary product is no longer in the cart. */
export function reconcileFunnelDiscounts<T extends {
  id: string;
  slug: string;
  name: string;
  price: number;
  funnel?: CartItemFunnelMeta;
}>(items: T[]): T[] {
  const sourceSlugs = new Set(
    items
      .map((item) => getFunnelSourceSlug(item))
      .filter((slug): slug is string => Boolean(slug))
  );

  if (sourceSlugs.size === 0) return items;

  let result = items;
  for (const sourceSlug of sourceSlugs) {
    const hasPrimary = result.some((item) => isPrimaryForFunnelSource(item, sourceSlug));
    if (hasPrimary) continue;

    result = result.map((item) => {
      const itemSource = getFunnelSourceSlug(item);
      if (itemSource === sourceSlug && isFunnelCartItem(item)) {
        return stripFunnelDiscountFromItem(item);
      }
      return item;
    });
  }

  return mergeCartLinesById(result);
}

/** After stripping funnel ids, merge duplicate catalog lines. */
export function mergeCartLinesById<T extends { id: string; quantity: number }>(items: T[]): T[] {
  const merged = new Map<string, T>();
  for (const item of items) {
    const existing = merged.get(item.id);
    if (existing) {
      merged.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
    } else {
      merged.set(item.id, item);
    }
  }
  return Array.from(merged.values());
}

/** Categories excluded from post-purchase funnel upsells. */
export const FUNNEL_EXCLUDED_CATEGORY_SLUGS = ["butchery-accessories"] as const;

export function isFunnelExcludedCategory(categorySlug: string | null | undefined): boolean {
  if (!categorySlug) return false;
  return (FUNNEL_EXCLUDED_CATEGORY_SLUGS as readonly string[]).includes(categorySlug);
}
