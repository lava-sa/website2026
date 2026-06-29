export type OrderLifecycleStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "failed"
  | "completed"
  | "wc-completed"
  | "wc-cancelled"
  | string;

export type OrderTimelineStep = {
  key: string;
  label: string;
  detail: string;
  state: "complete" | "current" | "upcoming";
};

function normalizeStatus(status: string): string {
  return status.replace(/^wc-/, "").toLowerCase();
}

const STATUS_RANK: Record<string, number> = {
  pending: 1,
  paid: 2,
  processing: 3,
  shipped: 4,
  delivered: 5,
  completed: 5,
  cancelled: 0,
  refunded: 0,
  failed: 0,
};

function rankFor(status: string): number {
  return STATUS_RANK[normalizeStatus(status)] ?? 1;
}

export function buildOrderTimeline(
  status: OrderLifecycleStatus,
  paymentMethod?: string | null
): OrderTimelineStep[] {
  const normalized = normalizeStatus(status);
  const rank = rankFor(status);
  const isEft = paymentMethod === "bank_transfer";
  const isTerminal =
    normalized === "cancelled" || normalized === "refunded" || normalized === "failed";

  if (isTerminal) {
    return [
      {
        key: "placed",
        label: "Order placed",
        detail: "We received your order on the website.",
        state: "complete",
      },
      {
        key: "cancelled",
        label: normalized === "refunded" ? "Refunded" : "Cancelled",
        detail: "This order is no longer active.",
        state: "current",
      },
    ];
  }

  const steps: Omit<OrderTimelineStep, "state">[] = [
    {
      key: "placed",
      label: "Order placed",
      detail: isEft
        ? "Your order is reserved. Complete EFT payment using your order number as reference."
        : "We received your order and payment details.",
    },
    {
      key: "paid",
      label: isEft ? "Payment received" : "Payment confirmed",
      detail: isEft
        ? "We verify your EFT when it reflects in our bank account."
        : "PayFast payment confirmed — your order moves into fulfilment.",
    },
    {
      key: "processing",
      label: "Preparing for dispatch",
      detail: "Anneke and the team are picking, packing, and quality-checking your order.",
    },
    {
      key: "shipped",
      label: "Shipped",
      detail: "Your parcel has left our Bryanston warehouse. Courier tracking will appear here soon.",
    },
    {
      key: "delivered",
      label: "Delivered",
      detail: "Your order has been delivered. Thank you for choosing LAVA-SA.",
    },
  ];

  return steps.map((step) => {
    const stepRank = STATUS_RANK[step.key] ?? 0;
    let state: OrderTimelineStep["state"] = "upcoming";
    if (stepRank < rank) state = "complete";
    else if (stepRank === rank) state = "current";
    return { ...step, state };
  });
}

export function formatOrderStatusLabel(status: string): string {
  return normalizeStatus(status).replace(/-/g, " ");
}
