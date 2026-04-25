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
