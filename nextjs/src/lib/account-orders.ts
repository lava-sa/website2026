import type { SupabaseClient } from "@supabase/supabase-js";
import { orderQualifiesForPoints } from "@/lib/rewards-config";

export type AccountOrderItem = {
  name: string;
  quantity?: number;
  lineTotal?: number;
};

export type AccountOrderRow = {
  id: string;
  source: "live" | "history";
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  paymentMethod: string | null;
  pointsAwarded: number | null;
  items: AccountOrderItem[];
  detailHref: string | null;
};

type HistoryItemJson = {
  name?: string;
  product_name?: string;
  quantity?: number;
  line_total?: number;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function parseHistoryItems(raw: unknown): AccountOrderItem[] {
  if (!Array.isArray(raw)) return [];
  const items: AccountOrderItem[] = [];
  for (const entry of raw) {
    const row = entry as HistoryItemJson;
    const name = (row.name ?? row.product_name ?? "Item").trim();
    if (!name) continue;
    items.push({
      name,
      quantity: row.quantity,
      lineTotal: row.line_total != null ? Number(row.line_total) : undefined,
    });
  }
  return items;
}

function summarizeItems(items: AccountOrderItem[]): string {
  if (items.length === 0) return "Lava Order";
  const first = items[0].name;
  if (items.length === 1) return first;
  return `${first} + ${items.length - 1} more`;
}

export { summarizeItems };

export function getOrderPointsDisplay(
  pointsAwarded: number | null | undefined,
  orderDate: string,
  status: string
): { text: string; muted: boolean } {
  if (pointsAwarded != null && pointsAwarded > 0) {
    return { text: pointsAwarded.toLocaleString("en-ZA"), muted: false };
  }
  if (pointsAwarded === 0) {
    return { text: "0", muted: true };
  }
  if (!orderQualifiesForPoints(orderDate)) {
    return { text: "—", muted: true };
  }
  const earnedStatuses = new Set([
    "paid",
    "delivered",
    "shipped",
    "completed",
    "wc-completed",
    "processing",
    "wc-processing",
  ]);
  if (earnedStatuses.has(status)) {
    return { text: "Pending", muted: true };
  }
  return { text: "—", muted: true };
}

/**
 * Fetch live + historical orders for a signed-in customer (case-insensitive email).
 * Live orders win when the same order number appears in both tables.
 */
export async function fetchAccountOrders(
  service: SupabaseClient,
  userEmail: string,
  customerId?: string | null
): Promise<AccountOrderRow[]> {
  const email = normalizeEmail(userEmail);

  const livePromise = service
    .from("orders")
    .select(
      "id, order_number, created_at, total, status, payment_method, points_awarded, order_items(product_name, quantity, line_total)"
    )
    .ilike("email", email)
    .order("created_at", { ascending: false })
    .limit(100);

  const historyByEmailPromise = service
    .from("order_history")
    .select(
      "id, wp_order_id, wp_order_number, order_date, total, status, points_awarded, items, num_items"
    )
    .ilike("customer_email", email)
    .order("order_date", { ascending: false })
    .limit(100);

  const historyByCustomerPromise = customerId
    ? service
        .from("order_history")
        .select(
          "id, wp_order_id, wp_order_number, order_date, total, status, points_awarded, items, num_items"
        )
        .eq("customer_id", customerId)
        .order("order_date", { ascending: false })
        .limit(100)
    : Promise.resolve({ data: [] as never[], error: null });

  const [{ data: liveOrders }, { data: historyByEmail }, { data: historyByCustomer }] =
    await Promise.all([livePromise, historyByEmailPromise, historyByCustomerPromise]);

  const liveOrderNumbers = new Set<string>();
  const rows: AccountOrderRow[] = [];

  for (const order of liveOrders ?? []) {
    const items = (order.order_items ?? []).map((item) => ({
      name: item.product_name,
      quantity: item.quantity ?? undefined,
      lineTotal: item.line_total != null ? Number(item.line_total) : undefined,
    }));
    const orderNumber =
      order.order_number?.trim() ||
      `ORD-${String(order.id).slice(0, 8).toUpperCase()}`;
    if (order.order_number) {
      liveOrderNumbers.add(order.order_number.trim().toLowerCase());
    }

    rows.push({
      id: order.id,
      source: "live",
      orderNumber,
      date: order.created_at,
      total: Number(order.total),
      status: order.status,
      paymentMethod: order.payment_method,
      pointsAwarded: order.points_awarded,
      items,
      detailHref: order.order_number ? `/account/orders/${order.order_number}` : null,
    });
  }

type HistoryRow = {
  id: string;
  wp_order_id: number;
  wp_order_number: string | null;
  order_date: string;
  total: number;
  status: string | null;
  points_awarded: number | null;
  items: unknown;
  num_items: number | null;
};

  const historyMap = new Map<string, HistoryRow>();
  for (const row of [...(historyByEmail ?? []), ...(historyByCustomer ?? [])] as HistoryRow[]) {
    historyMap.set(row.id, row);
  }

  for (const hist of historyMap.values()) {
    const histNumber = (hist.wp_order_number ?? String(hist.wp_order_id)).trim();
    if (liveOrderNumbers.has(histNumber.toLowerCase())) continue;

    const items = parseHistoryItems(hist.items);
    rows.push({
      id: hist.id,
      source: "history",
      orderNumber: histNumber,
      date: hist.order_date,
      total: Number(hist.total),
      status: hist.status ?? "completed",
      paymentMethod: null,
      pointsAwarded: hist.points_awarded,
      items,
      detailHref: null,
    });
  }

  rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return rows;
}
