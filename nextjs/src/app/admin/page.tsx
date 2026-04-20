import AdminShell from "@/components/admin/AdminShell";
import MonthlyRevenueChart, { MonthlyDataPoint } from "@/components/admin/charts/MonthlyRevenueChart";
import OrderStatusDonut, { StatusDataPoint } from "@/components/admin/charts/OrderStatusDonut";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  AlertTriangle,
  Users,
  Wallet,
  Calendar,
  BarChart3,
  Trophy,
} from "lucide-react";
import { formatZAR, formatNumber, formatMonthShort } from "@/lib/format";

export const revalidate = 60; // refresh dashboard every minute

// ─── Configuration ────────────────────────────────────────────────────────────
// Statuses that count as real revenue (money collected or en route)
const REVENUE_STATUSES_CURRENT = ["paid", "processing", "shipped", "delivered"];
// Historical WooCommerce statuses that count as revenue
const REVENUE_STATUSES_WC = ["wc-completed", "wc-processing", "wc-on-hold"];

// Colour palette for the status donut
const STATUS_COLOURS: Record<string, string> = {
  pending:    "#f59e0b", // amber
  paid:       "#3b82f6", // blue
  processing: "#8b5cf6", // purple
  shipped:    "#6366f1", // indigo
  delivered:  "#10b981", // emerald
  "on-hold":  "#fbbf24", // yellow
  completed:  "#059669", // emerald dark
  cancelled:  "#ef4444", // red
  refunded:   "#6b7280", // gray
  failed:     "#dc2626", // red dark
};

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderRow = { total: number | string; created_at: string; status: string };
type HistoryRow = { total: number | string; order_date: string; status: string };
type ItemRow = { product_name: string; product_id?: string | null; quantity: number; line_total: number | string };

interface DashboardStats {
  // Product / review / customer counts
  productCount: number;
  pendingReviews: number;
  outOfStock: Array<{ id: string; name: string; stock_status: string }>;
  customerCount: number;
  // Revenue KPIs
  totalRevenue: number;
  totalOrders: number;
  revenue2026: number;
  revenue2025: number;
  revenue2024: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  avgOrderValue: number;
  // Chart data
  monthlyData: MonthlyDataPoint[];
  statusData: StatusDataPoint[];
  topProducts: Array<{ name: string; units: number; revenue: number }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toNumber(v: number | string | null | undefined): number {
  if (v == null) return 0;
  return typeof v === "number" ? v : parseFloat(v) || 0;
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function getStats(): Promise<DashboardStats> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const [
    products,
    reviews,
    lowStock,
    currentOrders,
    historyOrders,
    customers,
    currentItems,
  ] = await Promise.allSettled([
    // Published product count
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true),
    // Pending review count
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("approved", false),
    // Out-of-stock products list
    supabase
      .from("products")
      .select("id, name, stock_status")
      .eq("stock_status", "out_of_stock")
      .eq("is_published", true)
      .limit(20),
    // All current orders (post-launch)
    supabase.from("orders").select("total, created_at, status"),
    // All historical orders (from WP migration)
    supabase.from("order_history").select("total, order_date, status"),
    // Customer count
    supabase.from("customers").select("id", { count: "exact", head: true }),
    // Current order items (for top products)
    supabase.from("order_items").select("product_name, product_id, quantity, line_total"),
  ]);

  // ─── Unwrap fetched data (graceful fallback if table missing) ───────────────
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

  // ─── Normalise into a single revenue stream ─────────────────────────────────
  const allRevenueEvents = [
    ...currentRows
      .filter((r) => REVENUE_STATUSES_CURRENT.includes(r.status))
      .map((r) => ({ date: new Date(r.created_at), total: toNumber(r.total) })),
    ...historyRows
      .filter((r) => REVENUE_STATUSES_WC.includes(r.status))
      .map((r) => ({ date: new Date(r.order_date), total: toNumber(r.total) })),
  ];

  // ─── Totals ─────────────────────────────────────────────────────────────────
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

  // ─── Monthly chart data (last 12 months rolling) ────────────────────────────
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

  // ─── Status breakdown (current + historical, normalised) ────────────────────
  const statusCounts = new Map<string, number>();
  for (const r of currentRows) {
    statusCounts.set(r.status, (statusCounts.get(r.status) ?? 0) + 1);
  }
  for (const r of historyRows) {
    // Strip "wc-" prefix so historical & current roll up under one label
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

  // ─── Top products by revenue (from current order_items only) ────────────────
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

// ─── Small presentational helpers ─────────────────────────────────────────────
interface KPIProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  color: string;
  sub?: string;
}

function KPICard({ label, value, icon: Icon, href, color, sub }: KPIProps) {
  const content = (
    <>
      <div className={`h-10 w-10 ${color} flex items-center justify-center mb-3`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="text-2xl font-black text-gray-900 tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-0.5 group-hover:text-primary transition-colors">
        {label}
      </p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{sub}</p>}
    </>
  );

  const classes =
    "bg-white border border-gray-200 p-5 hover:border-primary hover:shadow-sm transition-all group block";

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return <div className={classes}>{content}</div>;
}

function PanelHeader({
  icon: Icon,
  title,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className={`h-4 w-4 ${accent ?? "text-primary"}`} />
      <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <AdminShell>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, Anneke. Here&apos;s how Lava-SA is performing.
          </p>
        </div>

        {/* Row 1 — Primary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <KPICard
            label="Total Revenue"
            value={formatZAR(stats.totalRevenue)}
            icon={Wallet}
            color="bg-primary"
            sub="All-time (paid + completed)"
          />
          <KPICard
            label="Revenue This Month"
            value={formatZAR(stats.revenueThisMonth)}
            icon={TrendingUp}
            color="bg-emerald-600"
            sub={`${stats.ordersThisMonth} orders`}
          />
          <KPICard
            label="Total Orders"
            value={formatNumber(stats.totalOrders)}
            icon={ShoppingCart}
            color="bg-indigo-600"
            href="/admin/orders"
          />
          <KPICard
            label="Customers"
            value={formatNumber(stats.customerCount)}
            icon={Users}
            color="bg-amber-500"
            sub={`Avg order: ${formatZAR(stats.avgOrderValue)}`}
          />
        </div>

        {/* Row 2 — Period comparisons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <KPICard
            label="2026 Sales (YTD)"
            value={formatZAR(stats.revenue2026)}
            icon={Calendar}
            color="bg-primary-dark"
          />
          <KPICard
            label="2025 Sales"
            value={formatZAR(stats.revenue2025)}
            icon={Calendar}
            color="bg-primary-mid"
          />
          <KPICard
            label="2024 Sales"
            value={formatZAR(stats.revenue2024)}
            icon={Calendar}
            color="bg-primary-light"
          />
        </div>

        {/* Row 3 — Product / Review / Stock / AOV cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Published Products"
            value={formatNumber(stats.productCount)}
            icon={Package}
            color="bg-primary"
            href="/admin/products"
          />
          <KPICard
            label="Pending Reviews"
            value={formatNumber(stats.pendingReviews)}
            icon={Star}
            color="bg-amber-500"
            href="/admin/reviews"
          />
          <KPICard
            label="Out of Stock"
            value={formatNumber(stats.outOfStock.length)}
            icon={AlertTriangle}
            color="bg-red-500"
            href="/admin/products?filter=out_of_stock"
          />
          <KPICard
            label="Avg Order Value"
            value={formatZAR(stats.avgOrderValue)}
            icon={BarChart3}
            color="bg-emerald-600"
          />
        </div>

        {/* Row 4 — Monthly chart + Order status donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly revenue chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6">
            <PanelHeader icon={TrendingUp} title="Monthly Revenue (Last 12 months)" />
            <MonthlyRevenueChart data={stats.monthlyData} />
          </div>

          {/* Order status donut */}
          <div className="bg-white border border-gray-200 p-6">
            <PanelHeader icon={ShoppingCart} title="Orders by Status" />
            <OrderStatusDonut data={stats.statusData} />
          </div>
        </div>

        {/* Row 5 — Top products + Out of stock / Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top products */}
          <div className="bg-white border border-gray-200 p-6">
            <PanelHeader icon={Trophy} title="Top 5 Products by Revenue" accent="text-secondary" />
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-gray-500 py-6">
                No orders yet. Top products will appear here once customers start buying.
              </p>
            ) : (
              <div className="space-y-2">
                {stats.topProducts.map((p, i) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 text-sm"
                  >
                    <span className="h-6 w-6 bg-primary-wash text-primary font-black text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-gray-400 tabular-nums">{p.units} sold</span>
                    <span className="font-bold text-primary tabular-nums w-24 text-right">
                      {formatZAR(p.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Out of stock alert */}
          {stats.outOfStock.length > 0 ? (
            <div className="bg-white border border-gray-200 p-6">
              <PanelHeader icon={AlertTriangle} title="Out of Stock" accent="text-red-500" />
              <ul className="space-y-2">
                {stats.outOfStock.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate pr-3">{p.name}</span>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs font-bold text-primary hover:text-secondary transition-colors shrink-0"
                    >
                      Update →
                    </Link>
                  </li>
                ))}
                {stats.outOfStock.length > 6 && (
                  <li className="pt-2">
                    <Link
                      href="/admin/products?filter=out_of_stock"
                      className="text-xs font-bold text-primary hover:text-secondary"
                    >
                      View all {stats.outOfStock.length} →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 p-6">
              <PanelHeader icon={TrendingUp} title="Quick Actions" />
              <div className="space-y-2">
                {[
                  ["Update product prices", "/admin/products"],
                  ["Check new orders", "/admin/orders"],
                  ["Approve reviews", "/admin/reviews"],
                  ["View live website", "/"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm text-gray-700 hover:text-primary transition-colors group"
                  >
                    {label}
                    <span className="text-gray-300 group-hover:text-primary transition-colors">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
