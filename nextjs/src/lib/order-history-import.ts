/**
 * Maps CSV / JSON rows into `order_history` inserts (historical WooCommerce or other exports).
 * Does not link product IDs — line items are stored as JSON text (names/qty/prices).
 */

export type OrderHistoryInsert = {
  wp_order_id: number;
  wp_order_number: string | null;
  customer_email: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  order_date: string;
  status: string | null;
  num_items: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  total: number;
  items: unknown;
};

function normHeader(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

function pick(row: Record<string, string>, aliases: string[]): string {
  const map = new Map(
    Object.entries(row).map(([k, v]) => [normHeader(k), (v ?? "").trim()])
  );
  for (const a of aliases) {
    const v = map.get(normHeader(a));
    if (v) return v;
  }
  return "";
}

function parseMoney(s: string): number {
  const cleaned = s.replace(/[^\d.,-]/g, "").replace(",", "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function parseIntSafe(s: string, fallback: number): number {
  const n = parseInt(String(s).replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseDateIso(s: string): string | null {
  const t = s.trim();
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function parseItemsJson(s: string): unknown {
  const t = s.trim();
  if (!t) return [];
  try {
    const j = JSON.parse(t);
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

/** WooCommerce exports often use `processing` instead of `wc-processing` — dashboard stats expect wc-* */
function normalizeWooOrderStatus(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return "wc-completed";
  if (s.startsWith("wc-")) return s;
  const map: Record<string, string> = {
    processing: "wc-processing",
    completed: "wc-completed",
    "on-hold": "wc-on-hold",
    pending: "wc-pending",
    cancelled: "wc-cancelled",
    canceled: "wc-cancelled",
    refunded: "wc-refunded",
    failed: "wc-failed",
    trash: "wc-cancelled",
  };
  return map[s] ?? `wc-${s.replace(/\s+/g, "-")}`;
}

/**
 * WP All Export / Woo wide CSVs: columns like "Product Item 1 Name", "Product Item 1 Quantity", "Product Item 1 Total".
 */
function buildItemsFromWooProductColumns(row: Record<string, string>): Array<Record<string, unknown>> {
  const map = new Map(Object.entries(row).map(([k, v]) => [normHeader(k), (v ?? "").trim()]));
  const out: Array<Record<string, unknown>> = [];
  for (let i = 1; i <= 40; i++) {
    const name = map.get(`product item ${i} name`) ?? "";
    if (!name) continue;
    const qtyRaw = map.get(`product item ${i} quantity`) ?? "1";
    const totalRaw =
      map.get(`product item ${i} total`) ?? map.get(`product item ${i} subtotal`) ?? "0";
    const quantity = Math.max(1, parseIntSafe(qtyRaw, 1));
    const line_total = parseMoney(totalRaw) || 0;
    out.push({ name, quantity, line_total });
  }
  return out;
}

export type BuildRowResult =
  | { ok: true; row: OrderHistoryInsert }
  | { ok: false; rowNumber: number; message: string };

/**
 * Build one DB row from a flat CSV object. `rowNumber` is 1-based (for error messages).
 */
export function buildOrderHistoryRow(
  row: Record<string, string>,
  rowNumber: number
): BuildRowResult {
  const idRaw = pick(row, [
    "wp_order_id",
    "Order ID",
    "order_id",
    "id",
    "WC Order ID",
    "woocommerce order id",
  ]);
  const wpOrderId = parseIntSafe(idRaw, NaN);
  if (!Number.isFinite(wpOrderId) || wpOrderId <= 0) {
    return { ok: false, rowNumber, message: `Missing or invalid order id (need positive integer): "${idRaw}"` };
  }

  const totalRaw = pick(row, ["total", "order_total", "Order Total", "Total", "order total"]);
  const total = parseMoney(totalRaw);
  if (!Number.isFinite(total)) {
    return { ok: false, rowNumber, message: `Invalid total: "${totalRaw}"` };
  }

  const dateRaw = pick(row, [
    "order_date",
    "Order Date",
    "date",
    "date_paid",
    "Date",
    "created_at",
    "post_date",
  ]);
  const orderDate = parseDateIso(dateRaw);
  if (!orderDate) {
    return { ok: false, rowNumber, message: `Invalid order date: "${dateRaw}"` };
  }

  const statusRaw = pick(row, ["status", "order_status", "Order Status", "post_status"]) || "wc-completed";
  const status = normalizeWooOrderStatus(statusRaw);

  const email = pick(row, [
    "customer_email",
    "email",
    "billing_email",
    "Billing Email",
    "Customer Email",
    "user_email",
  ]) || null;

  const first = pick(row, ["customer_first_name", "first_name", "billing_first_name", "First Name"]) || null;
  const last = pick(row, ["customer_last_name", "last_name", "billing_last_name", "Last Name"]) || null;

  const orderNumber =
    pick(row, ["wp_order_number", "order_number", "Order Number", "order key"]) || null;

  const subtotal =
    parseMoney(
      pick(row, ["subtotal", "order_subtotal", "Subtotal", "cart_subtotal", "Order Subtotal"]) || "0"
    ) || 0;
  const taxTotal = parseMoney(pick(row, ["tax_total", "Tax Total", "total_tax", "Order Tax"]) || "0") || 0;
  const shippingTotal =
    parseMoney(pick(row, ["shipping_total", "Shipping Total", "shipping", "Order Shipping"]) || "0") || 0;

  const itemsRaw = pick(row, ["items", "line_items", "Line Items JSON"]);
  let items: unknown = itemsRaw ? parseItemsJson(itemsRaw) : [];
  if (!Array.isArray(items) || items.length === 0) {
    const fromCols = buildItemsFromWooProductColumns(row);
    if (fromCols.length) items = fromCols;
  }

  const numItemsRaw = pick(row, ["num_items", "line_item_count", "Item Count"]);
  const numItems = numItemsRaw
    ? parseIntSafe(numItemsRaw, 0)
    : Array.isArray(items)
      ? items.length
      : 0;

  return {
    ok: true,
    row: {
      wp_order_id: wpOrderId,
      wp_order_number: orderNumber,
      customer_email: email,
      customer_first_name: first,
      customer_last_name: last,
      order_date: orderDate,
      status,
      num_items: numItems,
      subtotal,
      tax_total: taxTotal,
      shipping_total: shippingTotal,
      total,
      items,
    },
  };
}

export const ORDER_HISTORY_CSV_TEMPLATE = [
  "wp_order_id,wp_order_number,order_date,status,total,customer_email,customer_first_name,customer_last_name,subtotal,tax_total,shipping_total,num_items,items",
  "1001,LS-1001,2019-03-15T10:00:00.000Z,wc-completed,1299.00,buyer@example.com,Anneke,Uys,1100.00,0.00,199.00,2,[]",
  "1002,LS-1002,2019-04-02T14:30:00.000Z,wc-completed,450.00,other@example.com,John,Doe,400.00,0.00,50.00,1,[]",
].join("\n");
