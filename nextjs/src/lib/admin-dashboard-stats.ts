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

type OrderRow = {
  id: string;
  total: number | string;
  created_at: string;
  status: string;
  email: string;
};
type HistoryRow = {
  total: number | string;
  order_date: string;
  status: string;
  customer_email: string | null;
  items: unknown;
};
type ItemRow = {
  product_name: string;
  product_id?: string | null;
  quantity: number;
  line_total: number | string;
  order_id: string;
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
  /** All order rows (current + history), every status — for status donut context */
  allOrdersCount: number;
  /** Orders that contribute to revenue (paid + selected Woo statuses) */
  revenueOrderCount: number;
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

function parseHistoryLineItems(raw: unknown): Array<{ name: string; qty: number; lineTotal: number }> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ name: string; qty: number; lineTotal: number }> = [];
  for (const it of raw) {
    if (!it || typeof it !== "object") continue;
    const o = it as Record<string, unknown>;
    const name = String(o.name ?? o.product_name ?? o.Product ?? "Unknown product");
    const qty = Math.max(1, toNumber(o.quantity ?? o.qty ?? 1));
    const lineTotal = toNumber(o.line_total ?? o.total ?? o.line_subtotal ?? o.subtotal ?? 0);
    out.push({ name, qty, lineTotal });
  }
  return out;
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

  const [products, reviews, lowStock, currentOrders, historyOrders, customers] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
    supabase
      .from("products")
      .select("id, name, stock_status")
      .eq("stock_status", "out_of_stock")
      .eq("is_published", true)
      .limit(20),
    supabase.from("orders").select("id, total, created_at, status, email"),
    supabase.from("order_history").select("total, order_date, status, customer_email, items"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  if (products.error) loadErrors.push(`products: ${products.error.message}`);
  if (reviews.error) loadErrors.push(`reviews: ${reviews.error.message}`);
  if (lowStock.error) loadErrors.push(`out-of-stock products: ${lowStock.error.message}`);
  if (currentOrders.error) loadErrors.push(`orders: ${currentOrders.error.message}`);
  if (historyOrders.error) loadErrors.push(`order_history: ${historyOrders.error.message}`);
  if (customers.error) loadErrors.push(`customers: ${customers.error.message}`);

  const productCount = products.error ? 0 : products.count ?? 0;
  const pendingReviews = reviews.error ? 0 : reviews.count ?? 0;
  const outOfStock = lowStock.error ? [] : (lowStock.data ?? []);
  const customerCount = customers.error ? 0 : customers.count ?? 0;

  const currentRows: OrderRow[] = currentOrders.error ? [] : ((currentOrders.data ?? []) as OrderRow[]);
  const historyRows: HistoryRow[] = historyOrders.error ? [] : ((historyOrders.data ?? []) as HistoryRow[]);

  const allOrdersCount = currentRows.length + historyRows.length;

  const revenueCurrent = currentRows.filter((r) => countsAsRevenueCurrent(r.status));
  const revenueHistory = historyRows.filter((r) => countsAsRevenueWc(r.status ?? ""));

  const revenueOrderCount = revenueCurrent.length + revenueHistory.length;

  const allRevenueEvents = [
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

  const productTotals = new Map<string, { units: number; revenue: number }>();

  const paidIds = revenueCurrent.map((r) => r.id).filter(Boolean);
  if (paidIds.length > 0) {
    const { data: itemRows } = await supabase
      .from("order_items")
      .select("product_name, product_id, quantity, line_total, order_id")
      .in("order_id", paidIds);
    for (const it of (itemRows ?? []) as ItemRow[]) {
      const name = it.product_name || "Unknown";
      const cur = productTotals.get(name) ?? { units: 0, revenue: 0 };
      cur.units += it.quantity ?? 0;
      cur.revenue += toNumber(it.line_total);
      productTotals.set(name, cur);
    }
  }

  for (const row of revenueHistory) {
    for (const li of parseHistoryLineItems(row.items)) {
      const cur = productTotals.get(li.name) ?? { units: 0, revenue: 0 };
      cur.units += li.qty;
      cur.revenue += li.lineTotal;
      productTotals.set(li.name, cur);
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
    "Revenue and product/customer rankings include Woo orders in Completed, Processing, or On hold (treated as shipped sales), plus On-line store orders marked Paid. Cancelled, refunded, failed, and pending payment are excluded. Markup ranking uses ESTIMATED_GROSS_MARGIN_PCT (no cost field in the database).";

  return {
    productCount,
    pendingReviews,
    outOfStock,
    customerCount,
    totalRevenue,
    allOrdersCount,
    revenueOrderCount,
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
