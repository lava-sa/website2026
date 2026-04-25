import { createServiceClient } from "@/lib/supabase";
import { formatMonthShort } from "@/lib/format";
import type { MonthlyDataPoint } from "@/components/admin/charts/MonthlyRevenueChart";
import type { StatusDataPoint } from "@/components/admin/charts/OrderStatusDonut";

const REVENUE_STATUSES_CURRENT = ["paid", "processing", "shipped", "delivered"];
const REVENUE_STATUSES_WC = ["wc-completed", "wc-processing", "wc-on-hold"];

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

type OrderRow = { total: number | string; created_at: string; status: string };
type HistoryRow = { total: number | string; order_date: string; status: string };
type ItemRow = { product_name: string; product_id?: string | null; quantity: number; line_total: number | string };

export interface DashboardStats {
  productCount: number;
  pendingReviews: number;
  outOfStock: Array<{ id: string; name: string; stock_status: string }>;
  customerCount: number;
  totalRevenue: number;
  totalOrders: number;
  revenue2026: number;
  revenue2025: number;
  revenue2024: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  avgOrderValue: number;
  monthlyData: MonthlyDataPoint[];
  statusData: StatusDataPoint[];
  topProducts: Array<{ name: string; units: number; revenue: number }>;
}

function toNumber(v: number | string | null | undefined): number {
  if (v == null) return 0;
  return typeof v === "number" ? v : parseFloat(String(v)) || 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceClient();

  const [
    products,
    reviews,
    lowStock,
    currentOrders,
    historyOrders,
    customers,
    currentItems,
  ] = await Promise.allSettled([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
    supabase
      .from("products")
      .select("id, name, stock_status")
      .eq("stock_status", "out_of_stock")
      .eq("is_published", true)
      .limit(20),
    supabase.from("orders").select("total, created_at, status"),
    supabase.from("order_history").select("total, order_date, status"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("order_items").select("product_name, product_id, quantity, line_total"),
  ]);

  const productCount = products.status === "fulfilled" ? (products.value.count ?? 0) : 0;
  const pendingReviews = reviews.status === "fulfilled" ? (reviews.value.count ?? 0) : 0;
  const outOfStock = lowStock.status === "fulfilled" ? (lowStock.value.data ?? []) : [];
  const customerCount = customers.status === "fulfilled" ? (customers.value.count ?? 0) : 0;

  const currentRows: OrderRow[] =
    currentOrders.status === "fulfilled" && currentOrders.value.data ? currentOrders.value.data : [];
  const historyRows: HistoryRow[] =
    historyOrders.status === "fulfilled" && historyOrders.value.data ? historyOrders.value.data : [];
  const itemRows: ItemRow[] =
    currentItems.status === "fulfilled" && currentItems.value.data ? currentItems.value.data : [];

  const allRevenueEvents = [
    ...currentRows
      .filter((r) => REVENUE_STATUSES_CURRENT.includes(r.status))
      .map((r) => ({ date: new Date(r.created_at), total: toNumber(r.total) })),
    ...historyRows
      .filter((r) => REVENUE_STATUSES_WC.includes(r.status))
      .map((r) => ({ date: new Date(r.order_date), total: toNumber(r.total) })),
  ];

  const totalRevenue = allRevenueEvents.reduce((s, e) => s + e.total, 0);
  const totalOrders = currentRows.length + historyRows.length;

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

  const thisMonthOrdersAll = [
    ...currentRows.map((r) => ({ date: new Date(r.created_at) })),
    ...historyRows.map((r) => ({ date: new Date(r.order_date) })),
  ].filter((r) => r.date.getFullYear() === currentYear && r.date.getMonth() === currentMonth);
  const ordersThisMonth = thisMonthOrdersAll.length;

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
  for (const it of itemRows) {
    const name = it.product_name || "Unknown";
    const cur = productTotals.get(name) ?? { units: 0, revenue: 0 };
    cur.units += it.quantity ?? 0;
    cur.revenue += toNumber(it.line_total);
    productTotals.set(name, cur);
  }
  const topProducts = Array.from(productTotals.entries())
    .map(([name, v]) => ({ name, units: v.units, revenue: v.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    productCount,
    pendingReviews,
    outOfStock,
    customerCount,
    totalRevenue,
    totalOrders,
    revenue2026,
    revenue2025,
    revenue2024,
    revenueThisMonth,
    ordersThisMonth,
    avgOrderValue,
    monthlyData,
    statusData,
    topProducts,
  };
}
