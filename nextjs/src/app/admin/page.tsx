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
  Monitor,
} from "lucide-react";
import { formatZAR, formatNumber } from "@/lib/format";
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
              href="/admin/display"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-800 text-xs font-bold px-4 py-2.5 hover:border-primary hover:text-primary transition-colors"
            >
              <Monitor className="h-3.5 w-3.5" />
              Numbers display (new tab)
            </Link>
            <Link
              href="/admin/import"
              className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              Import order history
            </Link>
          </div>
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
