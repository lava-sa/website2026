// ─────────────────────────────────────────────────────────────────────────────
// LAVA POINTS REWARDS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

/** Official programme start — 1 July 2026, 00:00 South Africa (SAST, UTC+2). */
export const POINTS_LAUNCH_AT = new Date("2026-07-01T00:00:00+02:00");

export const REWARDS_CONFIG = {
  // Points earning rate: 1 point per R5 spent on eligible (non-promotional) items
  POINTS_PER_RAND: 1 / 5,
  POINTS_PER_PURCHASE_UNIT: 1,
  RAND_PER_POINT: 0.05,
  PURCHASE_PER_POINT: 5,
} as const;

const PROMO_TAGS = new Set(["clearance", "discontinued", "limited-stock"]);

export type PointsEligibleProduct = {
  regular_price: number;
  sale_price: number | null;
  tags?: string[];
};

/** Programme is live for orders placed on or after the launch date. */
export function isPointsProgramLive(at: Date = new Date()): boolean {
  return at >= POINTS_LAUNCH_AT;
}

export function orderQualifiesForPoints(orderDate: Date | string): boolean {
  const d = typeof orderDate === "string" ? new Date(orderDate) : orderDate;
  return isPointsProgramLive(d);
}

/** Points only on full-price catalogue items — not sale, clearance, or limited-stock promos. */
export function isProductEligibleForPoints(product: PointsEligibleProduct): boolean {
  if (product.tags?.some((t) => PROMO_TAGS.has(t.toLowerCase()))) return false;
  if (
    product.sale_price != null &&
    product.sale_price > 0 &&
    product.sale_price < product.regular_price
  ) {
    return false;
  }
  return true;
}

/** Line must be charged at regular price (not a promotional checkout price). */
export function isLineItemChargedAtRegularPrice(
  unitPrice: number,
  regularPrice: number
): boolean {
  return unitPrice + 0.01 >= regularPrice;
}

/**
 * Calculate points earned for an eligible spend amount (Rand).
 * @returns Points earned (rounded down)
 */
export function calculatePointsEarned(eligibleAmount: number): number {
  if (eligibleAmount <= 0) return 0;
  return Math.floor(eligibleAmount / REWARDS_CONFIG.PURCHASE_PER_POINT);
}

export type ProductPointsDisplay = {
  show: boolean;
  points: number;
  note?: string;
};

/** UI helper — whether to show the Lava Points badge on a product card or PDP. */
export function getProductPointsDisplay(product: PointsEligibleProduct): ProductPointsDisplay {
  if (!isPointsProgramLive()) {
    if (!isProductEligibleForPoints(product)) {
      return { show: false, points: 0 };
    }
    return {
      show: true,
      points: calculatePointsEarned(product.regular_price),
      note: "Lava Points earn from 1 July 2026 on full-price items",
    };
  }

  if (!isProductEligibleForPoints(product)) {
    return {
      show: false,
      points: 0,
      note: "Promotional price — Lava Points do not apply",
    };
  }

  return {
    show: true,
    points: calculatePointsEarned(product.regular_price),
  };
}

export function calculatePointValue(points: number): number {
  return Math.round(points * REWARDS_CONFIG.RAND_PER_POINT * 100) / 100;
}

export function formatPointsDisplay(purchaseAmount: number): string {
  const points = calculatePointsEarned(purchaseAmount);
  return `EARN ${points.toLocaleString("en-ZA")} LAVA POINTS`;
}

export function getRedemptionExamples() {
  return [
    { points: 100, value: calculatePointValue(100), description: "R5 discount" },
    { points: 200, value: calculatePointValue(200), description: "R10 discount" },
    { points: 500, value: calculatePointValue(500), description: "R25 discount" },
    { points: 1000, value: calculatePointValue(1000), description: "R50 discount" },
    { points: 2000, value: calculatePointValue(2000), description: "R100 discount" },
  ];
}

export const POINTS_PROGRAM_SUMMARY =
  "Lava Points earn from 1 July 2026 on paid orders. Only full-price (non-promotional) items qualify — sale, clearance, and limited-stock offers are excluded.";
