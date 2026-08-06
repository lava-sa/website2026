/**
 * Courier delivery — Anneke policy (2026): flat rate by province, excl. VAT at source;
 * checkout charges incl. 15% VAT (product prices are also VAT-inclusive).
 */

export const VAT_RATE = 0.15;

/** Excl. VAT — Gauteng */
export const SHIPPING_GAUTENG_EX_VAT = 190;

/** Excl. VAT — all other provinces */
export const SHIPPING_OTHER_EX_VAT = 250;

/** How the customer receives the order. */
export type DeliveryMethod = "delivery" | "collection";

export function isDeliveryMethod(value: unknown): value is DeliveryMethod {
  return value === "delivery" || value === "collection";
}

/** Collection point — customers who prefer to fetch their own order. */
export const COLLECTION_POINT = {
  name: "LAVA South Africa",
  street: "5 Stirling Road",
  suburb: "Bryanston",
  city: "Johannesburg",
  province: "Gauteng",
  postalCode: "2191",
  hours: "Mon–Fri, 08:00–15:30",
  /** Single-line form for emails and summaries */
  oneLine: "5 Stirling Road, Bryanston, Johannesburg, 2191",
  lines: ["5 Stirling Road", "Bryanston, Johannesburg", "2191, Gauteng"],
} as const;

export function isGautengProvince(province: string | null | undefined): boolean {
  return province?.trim().toLowerCase() === "gauteng";
}

export function getShippingExVat(province: string | null | undefined): number {
  return isGautengProvince(province) ? SHIPPING_GAUTENG_EX_VAT : SHIPPING_OTHER_EX_VAT;
}

/** Delivery fee added to order total (incl. VAT, whole rands). No free-shipping threshold. */
export function getShipping(_subtotal: number, province?: string | null): number {
  const exVat = getShippingExVat(province ?? null);
  return Math.round(exVat * (1 + VAT_RATE));
}

/**
 * Delivery fee for an order, honouring the customer's chosen method.
 * Collection is always free — nothing is couriered.
 */
export function getShippingForMethod(
  method: DeliveryMethod,
  subtotal: number,
  province?: string | null
): number {
  return method === "collection" ? 0 : getShipping(subtotal, province);
}

/** @deprecated Use getShipping(subtotal, province). Kept for imports that referenced a flat fee. */
export const SHIPPING_FEE = getShipping(0, null);

export const SHIPPING_INCL_GAUTENG = getShipping(0, "Gauteng");
export const SHIPPING_INCL_OTHER = getShipping(0, "Eastern Cape");

/** Conservative estimate when province unknown (cart drawer). */
export function getShippingCartEstimate(): number {
  return SHIPPING_INCL_OTHER;
}

export function formatShippingExVat(province: string | null | undefined): string {
  return `R\u00a0${getShippingExVat(province).toLocaleString("en-ZA")}`;
}

export function formatShippingInclVat(province: string | null | undefined): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(getShipping(0, province));
}

/** Short line for product / category trust rows */
export const SHIPPING_TRUST_LINE =
  "Courier delivery — R190 excl. VAT (Gauteng) · R250 excl. VAT (rest of SA)";

export const SHIPPING_PRODUCT_BADGE_TITLE = "Courier Delivery";
export const SHIPPING_PRODUCT_BADGE_SUB = "R190 / R250 excl. VAT by province";

/**
 * Estimated courier delivery window (from dispatch) by province.
 * Single source of truth — keep /help/delivery, /legal/shipping-returns and FAQ aligned.
 */
export function getDeliveryEstimate(province: string | null | undefined): string {
  const p = province?.trim().toLowerCase() ?? "";
  if (p === "gauteng") return "3–5 business days";
  if (["western cape", "kwazulu-natal", "eastern cape", "free state"].includes(p)) {
    return "5–7 business days";
  }
  // Limpopo, Mpumalanga, North West, Northern Cape + unknown
  return "7–10 business days";
}
