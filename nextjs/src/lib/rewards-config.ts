// ─────────────────────────────────────────────────────────────────────────────
// LAVA POINTS REWARDS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

export const REWARDS_CONFIG = {
  // Points earning rate: 1 point per R5 spent
  POINTS_PER_RAND: 1 / 5, // = 0.2 points per R1
  POINTS_PER_PURCHASE_UNIT: 1, // 1 point earned per R5 spent

  // Redemption value: 1 point = R0.05
  RAND_PER_POINT: 0.05, // = R0.05 value per point

  // Convenience
  PURCHASE_PER_POINT: 5, // R5 purchase = 1 point
} as const;

/**
 * Calculate points earned for a purchase amount
 * @param purchaseAmount - Amount in Rand
 * @returns Number of points earned (rounded down)
 */
export function calculatePointsEarned(purchaseAmount: number): number {
  return Math.floor(purchaseAmount / REWARDS_CONFIG.PURCHASE_PER_POINT);
}

/**
 * Calculate Rand value of points
 * @param points - Number of points
 * @returns Value in Rand
 */
export function calculatePointValue(points: number): number {
  return Math.round(points * REWARDS_CONFIG.RAND_PER_POINT * 100) / 100;
}

/**
 * Format points display with description
 * @param purchaseAmount - Amount in Rand
 * @returns Formatted string like "EARN 2 200 LAVA POINTS"
 */
export function formatPointsDisplay(purchaseAmount: number): string {
  const points = calculatePointsEarned(purchaseAmount);
  return `EARN ${points.toLocaleString("en-ZA")} LAVA POINTS`;
}

/**
 * Get redemption examples for display
 */
export function getRedemptionExamples() {
  return [
    { points: 100, value: calculatePointValue(100), description: "R5 discount" },
    { points: 200, value: calculatePointValue(200), description: "R10 discount" },
    { points: 500, value: calculatePointValue(500), description: "R25 discount" },
    { points: 1000, value: calculatePointValue(1000), description: "R50 discount" },
    { points: 2000, value: calculatePointValue(2000), description: "R100 discount" },
  ];
}
