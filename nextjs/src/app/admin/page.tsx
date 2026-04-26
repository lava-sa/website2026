export const dynamic = "force-dynamic";
import type { ComponentType } from "react";
import AdminShell from "@/components/admin/AdminShell";
import MonthlyRevenueChart from "@/components/admin/charts/MonthlyRevenueChart";
import OrderStatusDonut from "@/components/admin/charts/OrderStatusDonut";
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
  Upload,
  Target,
  Sparkles,
  CircleDollarSign,
} from "lucide-react";
import { formatZAR, formatNumber, formatPercent } from "@/lib/format";
import { getDashboardStats } from "@/lib/admin-dashboard-stats";

export const revalidate = 60; // refresh dashboard every minute

// ─── Small presentational helpers ─────────────────────────────────────────────
interface KPIProps {
  label: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
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
  icon: ComponentType<{ className?: string }>;
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
  const stats = await getDashboardStats();

  return (
    <AdminShell>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, Anneke. Here&apos;s how Lava-SA is performing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/import"
              className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Import order history
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-gray-700 leading-relaxed">
          <p className="font-bold text-primary mb-1">How revenue is counted here</p>
          <p>{stats.revenueLensExplanation}</p>
          <p className="mt-2 text-xs text-gray-500">
            WooCommerce “Completed” is best for accounting, but including <strong>Processing</strong> and{" "}
            <strong>On hold</strong> matches day-to-day shipped sales when orders are not marked completed.
          </p>
        </div>

        {/* Row 1 — Primary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <KPICard
            label="Total Revenue"
            value={formatZAR(stats.totalRevenue)}
            icon={Wallet}
            color="bg-primary"
            sub="Eligible orders only (see note above)"
          />
          <KPICard
            label="Revenue This Month"
            value={formatZAR(stats.revenueThisMonth)}
            icon={TrendingUp}
            color="bg-emerald-600"
            sub={`${stats.ordersThisMonth} eligible orders`}
          />
          <KPICard
            label="Orders (revenue)"
            value={formatNumber(stats.revenueOrderCount)}
            icon={ShoppingCart}
            color="bg-indigo-600"
            href="/admin/orders"
            sub={`${formatNumber(stats.allOrdersCount)} rows incl. cancelled / pending`}
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

        {/* Highlights — largest order, best month, 2026 targets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-5">
            <PanelHeader icon={Sparkles} title="Largest eligible order" />
            {stats.largestRevenueOrder ? (
              <>
                <p className="text-2xl font-black text-gray-900 tabular-nums">
                  {formatZAR(stats.largestRevenueOrder.amount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stats.largestRevenueOrder.dateLabel}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No data yet.</p>
            )}
          </div>
          <div className="bg-white border border-gray-200 p-5">
            <PanelHeader icon={Calendar} title="Best revenue month (all-time)" />
            {stats.bestRevenueMonth ? (
              <>
                <p className="text-xl font-black text-gray-900">{stats.bestRevenueMonth.label}</p>
                <p className="text-lg font-bold text-primary tabular-nums mt-1">
                  {formatZAR(stats.bestRevenueMonth.revenue)}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No data yet.</p>
            )}
          </div>
          <div className="bg-white border border-gray-200 p-5 md:col-span-2 lg:col-span-1">
            <PanelHeader icon={Target} title="2026 target (vs 2025)" />
            <p className="text-xs text-gray-500 mb-2">
              Full-year goal {formatZAR(stats.targets2026.fullYearTarget)} (
              {formatPercent(stats.targets2026.yoyGrowthPct * 100, 0)} vs 2025). YTD{" "}
              {formatZAR(stats.targets2026.ytd2026)} — gap {formatZAR(stats.targets2026.gapRemaining)} over{" "}
              {stats.targets2026.monthsRemainingInYear} month(s).
            </p>
            <p className="text-sm font-bold text-primary">
              Straight-line pace: {formatZAR(stats.targets2026.linearMonthlyPace)} / month
            </p>
            <p className="text-[10px] text-gray-400 mt-2 leading-snug">
              Large retailers often blend <strong>top-down</strong> annual quota, <strong>YoY</strong> growth, and{" "}
              <strong>seasonality</strong> (last year’s monthly mix). Below: your gap split using 2025 seasonality
              (fallback if a month was empty).
            </p>
          </div>
        </div>

        {stats.targets2026.seasonalMonthlyTargets.length > 0 && (
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <PanelHeader icon={Target} title="Suggested monthly targets — rest of 2026" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-2">
              {stats.targets2026.seasonalMonthlyTargets.map((row) => (
                <div key={row.monthLabel} className="border border-gray-100 bg-gray-50/80 px-3 py-2 rounded">
                  <p className="text-[10px] font-bold uppercase text-gray-500">{row.monthLabel}</p>
                  <p className="text-sm font-black text-primary tabular-nums">{formatZAR(row.targetZar)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6">
            <PanelHeader icon={Users} title="Top 5 customers (by eligible revenue)" />
            {stats.topCustomers.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No customer email totals yet.</p>
            ) : (
              <ul className="space-y-2">
                {stats.topCustomers.map((c, i) => (
                  <li
                    key={c.email}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-100 pb-2 text-sm"
                  >
                    <span className="text-gray-600 truncate max-w-[60%]">
                      <span className="font-black text-primary mr-2">{i + 1}.</span>
                      {c.email}
                    </span>
                    <span className="font-bold text-gray-900 tabular-nums">{formatZAR(c.revenue)}</span>
                    <span className="text-[10px] text-gray-400 w-full">
                      {c.orders} eligible order{c.orders === 1 ? "" : "s"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white border border-gray-200 p-6">
            <PanelHeader icon={CircleDollarSign} title={`Top 5 products by est. gross (${stats.estimatedMarginPct}% margin)`} />
            <p className="text-[10px] text-gray-400 mb-3 -mt-2">
              No cost-of-goods in the database — ranking is revenue × margin. Set{" "}
              <code className="bg-gray-100 px-1">ESTIMATED_GROSS_MARGIN_PCT</code> in Vercel env.
            </p>
            {stats.topProductsByEstProfit.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No line-item history yet (import Woo items JSON for history).</p>
            ) : (
              <ul className="space-y-2">
                {stats.topProductsByEstProfit.map((p, i) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 text-sm"
                  >
                    <span className="text-gray-700 truncate flex-1">
                      <span className="font-black text-secondary mr-2">{i + 1}.</span>
                      {p.name}
                    </span>
                    <span className="font-bold text-emerald-700 tabular-nums shrink-0">
                      {formatZAR(p.estProfit)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
