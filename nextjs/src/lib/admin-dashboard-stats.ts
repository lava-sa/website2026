import { createServiceClient } from "@/lib/supabase";
import { formatMonthShort, formatMonthYear } from "@/lib/format";
import type { MonthlyDataPoint } from "@/components/admin/charts/MonthlyRevenueChart";
import type { StatusDataPoint } from "@/components/admin/charts/OrderStatusDonut";

/** New Supabase checkout — only paid counts as revenue (no Woo-style “processing” state in DB). */
const REVENUE_STATUSES_CURRENT = new Set(["paid"]);

/**
 * WooCommerce history — Anneke often leaves orders in Processing after dispatch.
 * We treat completed + processing + on-hold as “realised / operational” sales (excludes pending payment, cancelled, refunded).
 * Accept both `wc-*` and plain slugs (some CSVs / DB rows omit the prefix).
 */
const REVENUE_STATUSES_WC = new Set([
  "wc-completed",
  "wc-processing",
  "wc-on-hold",
  "completed",
  "processing",
  "on-hold",
]);

const STATUS_COLOURS: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#6366f1",
  delivered: "#10b981",
  "on-hold": "#fbbf24",
  completed: "#059669",
  cancelled: "#ef4444",
  refunded: "#6b7280",
  failed: "#dc2626",
};

const VAT_RATE = 0.15;

type OrderRow = {
  id: string;
  order_number: string;
  total: number | string;
  created_at: string;
  status: string;
  email: string;
  trashed_at?: string | null;
};
type HistoryRow = {
  wp_order_id: number;
  wp_order_number: string | null;
  total: number | string;
  order_date: string;
  status: string;
  customer_email: string | null;
  items: unknown;
};
type ItemRow = {
  product_name: string;
  product_id?: string | null;
  product_sku?: string | null;
  quantity: number;
  line_total: number | string;
  order_id: string;
};
type ProductCostRow = {
  id: string;
  sku: string | null;
  cost_price: number | string | null;
};
type RevenueEvent = {
  date: Date;
  total: number;
  email: string;
};
type LineProfitInput = {
  name: string;
  sku: string | null;
  productId: string | null;
  qty: number;
  lineTotalIncl: number;
  orderDate: Date;
};

export interface MonthlyTargetRow {
  monthLabel: string;
  targetZar: number;
}

export interface DashboardStats {
  productCount: number;
  pendingReviews: number;
  outOfStock: Array<{ id: string; name: string; stock_status: string }>;
  customerCount: number;
  /** Sum of line totals / order totals for revenue-eligible orders only */
  totalRevenue: number;
  /** Unique order rows (live + history, deduped when same order # appears in both) */
  allOrdersCount: number;
  /** History rows skipped because the same order # exists in Orders */
  dedupedHistoryCount: number;
  /** Orders that contribute to revenue (paid + selected Woo statuses) */
  revenueOrderCount: number;
  /** Gross profit from line items with known cost_price (ex-VAT revenue minus NET cost) */
  totalGrossProfit: number;
  grossProfitThisMonth: number;
  grossProfit2026: number;
  /** Share of product-line revenue where a cost_price was found (0–100) */
  profitCoveragePct: number;
  usesActualCost: boolean;
  revenue2026: number;
  revenue2025: number;
  revenue2024: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  /** totalRevenue / revenueOrderCount */
  avgOrderValue: number;
  monthlyData: MonthlyDataPoint[];
  statusData: StatusDataPoint[];
  topProducts: Array<{ name: string; units: number; revenue: number }>;
  topProductsByEstProfit: Array<{ name: string; units: number; revenue: number; estProfit: number }>;
  topProductsByProfit: Array<{ name: string; units: number; revenue: number; profit: number }>;
  topCustomers: Array<{ email: string; revenue: number; orders: number }>;
  largestRevenueOrder: { amount: number; dateLabel: string } | null;
  bestRevenueMonth: { label: string; revenue: number } | null;
  /** Rough gross profit rank — needs ESTIMATED_GROSS_MARGIN_PCT (no COGS in DB) */
  estimatedMarginPct: number;
  targets2026: {
    basisRevenue2025: number;
    yoyGrowthPct: number;
    fullYearTarget: number;
    ytd2026: number;
    gapRemaining: number;
    monthsRemainingInYear: number;
    linearMonthlyPace: number;
    seasonalMonthlyTargets: MonthlyTargetRow[];
  };
  revenueLensExplanation: string;
  /** Populated when any Supabase query failed (wrong keys, RLS, missing table, etc.) */
  loadErrors: string[];
}

function toNumber(v: number | string | null | undefined): number {
  if (v == null) return 0;
  return typeof v === "number" ? v : parseFloat(String(v)) || 0;
}

function countsAsRevenueCurrent(status: string): boolean {
  return REVENUE_STATUSES_CURRENT.has(status);
}

function countsAsRevenueWc(status: string): boolean {
  const raw = (status ?? "").trim().toLowerCase().replace(/\s+/g, "-");
  if (!raw) return false;
  if (REVENUE_STATUSES_WC.has(raw)) return true;
  const normalized = raw.startsWith("wc-") ? raw : `wc-${raw}`;
  return REVENUE_STATUSES_WC.has(normalized);
}

function parseHistoryLineItems(raw: unknown): Array<{ name: string; sku: string | null; qty: number; lineTotal: number }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ name: string; sku: string | null; qty: number; lineTotal: number }> = [];
  for (const it of raw) {
    if (!it || typeof it !== "object") continue;
    const o = it as Record<string, unknown>;
    const name = String(o.name ?? o.product_name ?? o.Product ?? "Unknown product");
    const skuRaw = o.sku ?? o.SKU ?? o.product_sku;
    const sku = skuRaw != null && String(skuRaw).trim() ? String(skuRaw).trim() : null;
    const qty = Math.max(1, toNumber(o.quantity ?? o.qty ?? 1));
    const lineTotal = toNumber(o.line_total ?? o.total ?? o.line_subtotal ?? o.subtotal ?? 0);
    out.push({ name, sku, qty, lineTotal });
  }
  return out;
}

/** Normalize Woo / shop order numbers for cross-table dedup (6127, #6127, ORD-6127). */
function normalizeOrderKey(v: string | number | null | undefined): string {
  if (v == null) return "";
  return String(v)
    .trim()
    .replace(/^#/, "")
    .replace(/^ORD-/i, "")
    .replace(/\s+/g, "");
}

function buildPrimaryOrderKeys(currentRows: Pick<OrderRow, "order_number">[]): Set<string> {
  const keys = new Set<string>();
  for (const row of currentRows) {
    const key = normalizeOrderKey(row.order_number);
    if (key) keys.add(key);
  }
  return keys;
}

function historyDuplicatesPrimary(row: Pick<HistoryRow, "wp_order_id" | "wp_order_number">, primaryKeys: Set<string>): boolean {
  const wpId = normalizeOrderKey(row.wp_order_id);
  const wpNum = normalizeOrderKey(row.wp_order_number);
  return (wpId !== "" && primaryKeys.has(wpId)) || (wpNum !== "" && primaryKeys.has(wpNum));
}

function lineRevenueExVat(lineTotalIncl: number): number {
  return lineTotalIncl / (1 + VAT_RATE);
}

function buildCostLookups(products: ProductCostRow[]) {
  const byId = new Map<string, number>();
  const bySku = new Map<string, number>();
  let withCost = 0;
  for (const p of products) {
    const cost = toNumber(p.cost_price);
    if (cost <= 0) continue;
    withCost += 1;
    byId.set(p.id, cost);
    if (p.sku) {
      const sku = p.sku.trim().toUpperCase();
      bySku.set(sku, cost);
      const base = sku.replace(/\(.*\)/, "");
      if (base !== sku && !bySku.has(base)) bySku.set(base, cost);
    }
  }
  return { byId, bySku, withCost };
}

function resolveUnitCost(
  line: Pick<LineProfitInput, "productId" | "sku">,
  byId: Map<string, number>,
  bySku: Map<string, number>
): number | null {
  if (line.productId) {
    const byProduct = byId.get(line.productId);
    if (byProduct != null) return byProduct;
  }
  if (line.sku) {
    const sku = line.sku.trim().toUpperCase();
    const direct = bySku.get(sku);
    if (direct != null) return direct;
    const base = sku.replace(/\(.*\)/, "").replace(/-1$/, "");
    return bySku.get(base) ?? null;
  }
  return null;
}

function accumulateLineProfit(
  line: LineProfitInput,
  byId: Map<string, number>,
  bySku: Map<string, number>,
  productTotals: Map<string, { units: number; revenue: number; profit: number; profitKnown: boolean }>,
  profitEvents: Array<{ date: Date; profit: number; revenueExVat: number }>,
  coverage: { revenueExVat: number; revenueExVatWithCost: number }
) {
  const name = line.name || "Unknown";
  const cur = productTotals.get(name) ?? { units: 0, revenue: 0, profit: 0, profitKnown: false };
  cur.units += line.qty;
  cur.revenue += line.lineTotalIncl;

  const revenueExVat = lineRevenueExVat(line.lineTotalIncl);
  coverage.revenueExVat += revenueExVat;

  const unitCost = resolveUnitCost(line, byId, bySku);
  if (unitCost != null) {
    const profit = revenueExVat - unitCost * line.qty;
    cur.profit += profit;
    cur.profitKnown = true;
    coverage.revenueExVatWithCost += revenueExVat;
    profitEvents.push({ date: line.orderDate, profit, revenueExVat });
  }

  productTotals.set(name, cur);
}

function getEstimatedMarginPct(): number {
  const raw = process.env.ESTIMATED_GROSS_MARGIN_PCT?.trim();
  const n = raw ? parseFloat(raw) : NaN;
  if (Number.isFinite(n) && n >= 0 && n <= 95) return n;
  return 35;
}

function getTargetYoYGrowth(): number {
  const raw = process.env.SALES_TARGET_YOY_GROWTH?.trim();
  const n = raw ? parseFloat(raw) : NaN;
  if (Number.isFinite(n) && n > -0.9 && n < 5) return n;
  return 0.1;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceClient();
  const estimatedMarginPct = getEstimatedMarginPct();
  const yoyGrowthPct = getTargetYoYGrowth();
  const loadErrors: string[] = [];

  const [products, reviews, lowStock, historyOrders, customers, productCosts] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
    supabase
      .from("products")
      .select("id, name, stock_status")
      .eq("stock_status", "out_of_stock")
      .eq("is_published", true)
      .limit(20),
    supabase
      .from("order_history")
      .select("wp_order_id, wp_order_number, total, order_date, status, customer_email, items"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id, sku, cost_price"),
  ]);

  let currentOrders = await supabase
    .from("orders")
    .select("id, order_number, total, created_at, status, email, trashed_at");
  let hasTrashedColumn = true;
  if (currentOrders.error && (currentOrders.error as { code?: string }).code === "42703") {
    hasTrashedColumn = false;
    currentOrders = await supabase
      .from("orders")
      .select("id, order_number, total, created_at, status, email");
  }

  if (products.error) loadErrors.push(`products: ${products.error.message}`);
  if (reviews.error) loadErrors.push(`reviews: ${reviews.error.message}`);
  if (lowStock.error) loadErrors.push(`out-of-stock products: ${lowStock.error.message}`);
  if (currentOrders.error) loadErrors.push(`orders: ${currentOrders.error.message}`);
  if (historyOrders.error) loadErrors.push(`order_history: ${historyOrders.error.message}`);
  if (customers.error) loadErrors.push(`customers: ${customers.error.message}`);
  if (productCosts.error && (productCosts.error as { code?: string }).code !== "42703") {
    loadErrors.push(`product costs: ${productCosts.error.message}`);
  }

  const productCount = products.error ? 0 : products.count ?? 0;
  const pendingReviews = reviews.error ? 0 : reviews.count ?? 0;
  const outOfStock = lowStock.error ? [] : (lowStock.data ?? []);
  const customerCount = customers.error ? 0 : customers.count ?? 0;

  const currentRowsBase: OrderRow[] = currentOrders.error ? [] : ((currentOrders.data ?? []) as OrderRow[]);
  const currentRows: OrderRow[] = hasTrashedColumn
    ? currentRowsBase.filter((row) => !row.trashed_at)
    : currentRowsBase;
  const historyRowsAll: HistoryRow[] = historyOrders.error ? [] : ((historyOrders.data ?? []) as HistoryRow[]);

  const primaryOrderKeys = buildPrimaryOrderKeys(currentRows);
  const historyRows = historyRowsAll.filter((row) => !historyDuplicatesPrimary(row, primaryOrderKeys));
  const dedupedHistoryCount = historyRowsAll.length - historyRows.length;

  const allOrdersCount = currentRows.length + historyRows.length;

  const revenueCurrent = currentRows.filter((r) => countsAsRevenueCurrent(r.status));
  const revenueHistory = historyRows.filter((r) => countsAsRevenueWc(r.status ?? ""));

  const revenueOrderCount = revenueCurrent.length + revenueHistory.length;

  const allRevenueEvents: RevenueEvent[] = [
    ...revenueCurrent.map((r) => ({
      date: new Date(r.created_at),
      total: toNumber(r.total),
      email: r.email?.trim().toLowerCase() || "",
    })),
    ...revenueHistory.map((r) => ({
      date: new Date(r.order_date),
      total: toNumber(r.total),
      email: (r.customer_email ?? "").trim().toLowerCase(),
    })),
  ];

  const totalRevenue = allRevenueEvents.reduce((s, e) => s + e.total, 0);
  const avgOrderValue = revenueOrderCount > 0 ? totalRevenue / revenueOrderCount : 0;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const revenue2026 = allRevenueEvents.filter((e) => e.date.getFullYear() === 2026).reduce((s, e) => s + e.total, 0);
  const revenue2025 = allRevenueEvents.filter((e) => e.date.getFullYear() === 2025).reduce((s, e) => s + e.total, 0);
  const revenue2024 = allRevenueEvents.filter((e) => e.date.getFullYear() === 2024).reduce((s, e) => s + e.total, 0);

  const thisMonthEvents = allRevenueEvents.filter(
    (e) => e.date.getFullYear() === currentYear && e.date.getMonth() === currentMonth
  );
  const revenueThisMonth = thisMonthEvents.reduce((s, e) => s + e.total, 0);
  const ordersThisMonth = thisMonthEvents.length;

  const monthlyBuckets = new Map<string, { revenue: number; orders: number; date: Date }>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    monthlyBuckets.set(key, { revenue: 0, orders: 0, date: d });
  }
  for (const e of allRevenueEvents) {
    const key = `${e.date.getFullYear()}-${String(e.date.getMonth()).padStart(2, "0")}`;
    const bucket = monthlyBuckets.get(key);
    if (bucket) {
      bucket.revenue += e.total;
      bucket.orders += 1;
    }
  }
  const monthlyData: MonthlyDataPoint[] = Array.from(monthlyBuckets.values()).map((b) => ({
    month: formatMonthShort(b.date),
    revenue: b.revenue,
    orders: b.orders,
  }));

  const statusCounts = new Map<string, number>();
  for (const r of currentRows) {
    statusCounts.set(r.status, (statusCounts.get(r.status) ?? 0) + 1);
  }
  for (const r of historyRows) {
    const key = r.status?.replace(/^wc-/, "") || "unknown";
    statusCounts.set(key, (statusCounts.get(key) ?? 0) + 1);
  }
  const statusData: StatusDataPoint[] = Array.from(statusCounts.entries())
    .map(([status, count]) => ({
      status,
      count,
      color: STATUS_COLOURS[status] ?? "#9ca3af",
    }))
    .sort((a, b) => b.count - a.count);

  const { byId: costById, bySku: costBySku, withCost: productsWithCost } = buildCostLookups(
    productCosts.error ? [] : ((productCosts.data ?? []) as ProductCostRow[])
  );
  const usesActualCost = productsWithCost > 0;

  const productTotals = new Map<string, { units: number; revenue: number; profit: number; profitKnown: boolean }>();
  const profitEvents: Array<{ date: Date; profit: number; revenueExVat: number }> = [];
  const coverage = { revenueExVat: 0, revenueExVatWithCost: 0 };

  const revenueCurrentById = new Map(revenueCurrent.map((r) => [r.id, r]));

  const paidIds = revenueCurrent.map((r) => r.id).filter(Boolean);
  if (paidIds.length > 0) {
    const { data: itemRows } = await supabase
      .from("order_items")
      .select("product_name, product_id, product_sku, quantity, line_total, order_id")
      .in("order_id", paidIds);
    for (const it of (itemRows ?? []) as ItemRow[]) {
      const parent = revenueCurrentById.get(it.order_id);
      if (!parent) continue;
      accumulateLineProfit(
        {
          name: it.product_name || "Unknown",
          sku: it.product_sku ?? null,
          productId: it.product_id ?? null,
          qty: it.quantity ?? 0,
          lineTotalIncl: toNumber(it.line_total),
          orderDate: new Date(parent.created_at),
        },
        costById,
        costBySku,
        productTotals,
        profitEvents,
        coverage
      );
    }
  }

  for (const row of revenueHistory) {
    const orderDate = new Date(row.order_date);
    for (const li of parseHistoryLineItems(row.items)) {
      accumulateLineProfit(
        {
          name: li.name,
          sku: li.sku,
          productId: null,
          qty: li.qty,
          lineTotalIncl: li.lineTotal,
          orderDate,
        },
        costById,
        costBySku,
        productTotals,
        profitEvents,
        coverage
      );
    }
  }

  const topProducts = Array.from(productTotals.entries())
    .map(([name, v]) => ({ name, units: v.units, revenue: v.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const mPct = estimatedMarginPct / 100;
  const topProductsByEstProfit = Array.from(productTotals.entries())
    .map(([name, v]) => ({
      name,
      units: v.units,
      revenue: v.revenue,
      estProfit: v.revenue * mPct,
    }))
    .sort((a, b) => b.estProfit - a.estProfit)
    .slice(0, 5);

  const topProductsByProfit = Array.from(productTotals.entries())
    .filter(([, v]) => v.profitKnown)
    .map(([name, v]) => ({
      name,
      units: v.units,
      revenue: v.revenue,
      profit: v.profit,
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  const totalGrossProfit = profitEvents.reduce((s, e) => s + e.profit, 0);
  const grossProfitThisMonth = profitEvents
    .filter((e) => e.date.getFullYear() === currentYear && e.date.getMonth() === currentMonth)
    .reduce((s, e) => s + e.profit, 0);
  const grossProfit2026 = profitEvents
    .filter((e) => e.date.getFullYear() === 2026)
    .reduce((s, e) => s + e.profit, 0);
  const profitCoveragePct =
    coverage.revenueExVat > 0 ? (coverage.revenueExVatWithCost / coverage.revenueExVat) * 100 : 0;

  const customerTotals = new Map<string, { revenue: number; orders: number }>();
  for (const e of allRevenueEvents) {
    if (!e.email) continue;
    const cur = customerTotals.get(e.email) ?? { revenue: 0, orders: 0 };
    cur.revenue += e.total;
    cur.orders += 1;
    customerTotals.set(e.email, cur);
  }
  const topCustomers = Array.from(customerTotals.entries())
    .map(([email, v]) => ({ email, revenue: v.revenue, orders: v.orders }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  let largestRevenueOrder: { amount: number; dateLabel: string } | null = null;
  for (const r of revenueCurrent) {
    const amt = toNumber(r.total);
    if (!largestRevenueOrder || amt > largestRevenueOrder.amount) {
      largestRevenueOrder = { amount: amt, dateLabel: formatMonthYear(new Date(r.created_at)) };
    }
  }
  for (const r of revenueHistory) {
    const amt = toNumber(r.total);
    if (!largestRevenueOrder || amt > largestRevenueOrder.amount) {
      largestRevenueOrder = { amount: amt, dateLabel: formatMonthYear(new Date(r.order_date)) };
    }
  }

  const globalMonthBuckets = new Map<string, number>();
  for (const e of allRevenueEvents) {
    const key = `${e.date.getFullYear()}-${String(e.date.getMonth()).padStart(2, "0")}`;
    globalMonthBuckets.set(key, (globalMonthBuckets.get(key) ?? 0) + e.total);
  }
  let bestRevenueMonth: { label: string; revenue: number } | null = null;
  for (const [key, rev] of globalMonthBuckets) {
    if (!bestRevenueMonth || rev > bestRevenueMonth.revenue) {
      const [y, m] = key.split("-").map(Number);
      const d = new Date(y, m, 1);
      bestRevenueMonth = { label: formatMonthYear(d), revenue: rev };
    }
  }

  const fullYearTarget = revenue2025 * (1 + yoyGrowthPct);
  const gapRemaining = Math.max(0, fullYearTarget - revenue2026);
  const monthsRemainingInYear = Math.max(1, 12 - currentMonth);
  const linearMonthlyPace = gapRemaining / monthsRemainingInYear;

  const monthly2025 = new Array(12).fill(0);
  for (const e of allRevenueEvents) {
    if (e.date.getFullYear() === 2025) {
      monthly2025[e.date.getMonth()] += e.total;
    }
  }
  const futureIdx: number[] = [];
  for (let m = currentMonth; m < 12; m++) futureIdx.push(m);
  const weights = futureIdx.map((m) => Math.max(monthly2025[m], linearMonthlyPace * 0.15));
  const wsum = weights.reduce((a, b) => a + b, 0);
  const seasonalMonthlyTargets: MonthlyTargetRow[] = futureIdx.map((m, i) => ({
    monthLabel: formatMonthYear(new Date(currentYear, m, 1)),
    targetZar: wsum > 0 ? (gapRemaining * weights[i]) / wsum : gapRemaining / futureIdx.length,
  }));

  const revenueLensExplanation =
    "Revenue counts Woo orders in Completed, Processing, or On hold, plus new-site orders marked Paid. Cancelled, refunded, failed, and pending payment are excluded. When the same order number exists in Orders and Order History, only the Orders row is counted (no double-counting). Gross profit uses product cost_price (NET ex-VAT from the June 2026 price list) against line revenue ex-VAT; shipping and lines without a known cost are excluded from profit.";

  return {
    productCount,
    pendingReviews,
    outOfStock,
    customerCount,
    totalRevenue,
    allOrdersCount,
    dedupedHistoryCount,
    revenueOrderCount,
    totalGrossProfit,
    grossProfitThisMonth,
    grossProfit2026,
    profitCoveragePct,
    usesActualCost,
    revenue2026,
    revenue2025,
    revenue2024,
    revenueThisMonth,
    ordersThisMonth,
    avgOrderValue,
    monthlyData,
    statusData,
    topProducts,
    topProductsByEstProfit,
    topProductsByProfit,
    topCustomers,
    largestRevenueOrder,
    bestRevenueMonth,
    estimatedMarginPct,
    targets2026: {
      basisRevenue2025: revenue2025,
      yoyGrowthPct,
      fullYearTarget,
      ytd2026: revenue2026,
      gapRemaining,
      monthsRemainingInYear,
      linearMonthlyPace,
      seasonalMonthlyTargets,
    },
    revenueLensExplanation,
    loadErrors,
  };
}
