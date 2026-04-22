export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, ShoppingBag, TrendingUp } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { calculatePointValue } from "@/lib/rewards-config";
import SignOutButton from "./SignOutButton";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "View your Lava Points balance, purchase history, and redemptions.",
  robots: { index: false, follow: false },
};

type Order = {
  id: string;
  order_number: string | null;
  created_at: string;
  total: number;
  status: string;
  order_items: { product_name: string }[];
};

type PointsTx = {
  id: string;
  type: string;
  points: number;
  description: string | null;
  created_at: string;
};

export default async function DashboardPage() {
  // ── Auth check ──────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login");

  // ── Customer record ─────────────────────────────────────────────────────
  const service = createServiceClient();

  const { data: customer } = await service
    .from("customers")
    .select("id, first_name, last_name, email, points_balance, lifetime_points, total_spent, order_count, registered_at, is_vip")
    .eq("email", user.email!)
    .single();

  // ── Orders (most recent 10) ──────────────────────────────────────────────
  const { data: orders } = await service
    .from("orders")
    .select("id, order_number, created_at, total, status, order_items(product_name)")
    .eq("email", user.email!)
    .order("created_at", { ascending: false })
    .limit(10);

  // ── Points transactions (most recent 10) ────────────────────────────────
  let pointsTxs: PointsTx[] = [];
  if (customer?.id) {
    const { data } = await service
      .from("points_transactions")
      .select("id, type, points, description, created_at")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(10);
    pointsTxs = (data as PointsTx[]) ?? [];
  }

  const displayName = customer
    ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") || user.email
    : user.email;

  const pointsBalance = customer?.points_balance ?? 0;
  const totalSpent = customer?.total_spent ?? 0;
  const pointsValue = calculatePointValue(pointsBalance);
  const memberSince = customer?.registered_at
    ? new Date(customer.registered_at).toLocaleDateString("en-ZA", { month: "long", year: "numeric" })
    : new Date(user.created_at).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });

  const typedOrders = (orders ?? []) as unknown as Order[];

  return (
    <main className="min-h-screen bg-surface/30">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-10">
        <div className="section-container">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-1">
                Welcome Back
              </p>
              <h1 className="font-heading text-3xl font-bold">{displayName}</h1>
              {customer?.is_vip && (
                <span className="inline-block mt-2 bg-secondary text-white text-[10px] font-bold uppercase px-2.5 py-1 tracking-wider">
                  VIP Member
                </span>
              )}
            </div>
            <SignOutButton />
          </div>
          <p className="text-white/70 text-sm">Member since {memberSince}</p>
        </div>
      </section>

      {/* ── Points Cards ────────────────────────────────────────────────────── */}
      <section className="section-container py-10">
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {/* Points Balance */}
          <div className="bg-white border-2 border-primary p-8">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-6 w-6 text-secondary" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">
                Points Balance
              </p>
            </div>
            <p className="text-4xl font-black text-primary mb-2">
              {pointsBalance.toLocaleString("en-ZA")}
            </p>
            <p className="text-sm text-copy-muted mb-4">
              Worth <strong className="text-primary">R{pointsValue.toFixed(2)}</strong> in discounts
              <span className="block text-xs mt-1 text-copy-muted/70">100 points = R5 off your next order</span>
            </p>
            <Link
              href="/rewards"
              className="text-xs font-bold text-secondary hover:text-primary transition-colors"
            >
              How points work →
            </Link>
          </div>

          {/* Total Spent */}
          <div className="bg-white border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingBag className="h-6 w-6 text-copy-muted" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-copy-muted">
                Total Spent
              </p>
            </div>
            <p className="text-4xl font-black text-primary mb-2">
              R{Number(totalSpent).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-copy-muted">Since {memberSince}</p>
          </div>

          {/* Status */}
          <div className="bg-white border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-copy-muted" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-copy-muted">
                Status
              </p>
            </div>
            <p className="text-4xl font-black text-primary mb-2">
              {customer?.is_vip ? "VIP" : "Loyal"}
            </p>
            <p className="text-sm text-copy-muted">
              {customer?.is_vip
                ? "Top-tier Lava member"
                : `${(customer?.order_count ?? 0).toLocaleString("en-ZA")} orders placed`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Order History & Points Transactions ─────────────────────────────── */}
      <section className="section-container pb-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order History */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              Order History
            </h2>

            {typedOrders.length === 0 ? (
              <div className="bg-white border border-border p-8 text-center">
                <p className="text-copy-muted mb-4">No orders found for this account.</p>
                <Link
                  href="/products/vacuum-machines"
                  className="inline-block bg-primary text-white font-bold px-6 py-3 text-sm hover:bg-primary/90 transition-colors"
                >
                  Shop Vacuum Machines
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {typedOrders.map((order) => {
                  const firstItem = order.order_items?.[0]?.product_name ?? "Lava Order";
                  const itemCount = order.order_items?.length ?? 0;
                  const label = itemCount > 1 ? `${firstItem} + ${itemCount - 1} more` : firstItem;
                  const statusColor =
                    order.status === "delivered" || order.status === "wc-completed" || order.status === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : order.status === "shipped"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : order.status === "cancelled" || order.status === "wc-cancelled"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200";

                  return (
                    <div key={order.id} className="bg-white border border-border p-6 hover:border-primary transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-primary">{label}</p>
                          <p className="text-xs text-copy-muted">
                            {order.order_number ? `#${order.order_number}` : `ORD-${order.id.slice(0, 8).toUpperCase()}`}
                          </p>
                        </div>
                        <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 border ${statusColor}`}>
                          {order.status.replace(/^wc-/, "").replace(/-/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-copy-muted text-xs">
                          {new Date(order.created_at).toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="font-bold text-primary">
                          R{Number(order.total).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Link
              href="/products/vacuum-machines"
              className="mt-6 inline-block text-primary font-bold hover:text-secondary transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>

          {/* Points Transactions */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              Points Activity
            </h2>

            {pointsTxs.length === 0 ? (
              <div className="bg-white border border-border p-6 text-center">
                <p className="text-copy-muted mb-3">No points activity yet.</p>
                <Link
                  href="/rewards"
                  className="text-sm font-bold text-primary hover:text-secondary transition-colors"
                >
                  Learn how to earn →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {pointsTxs.map((tx) => (
                  <div key={tx.id} className="bg-white border border-border p-4">
                    <p className="text-sm font-bold text-primary mb-1">
                      {tx.description ?? (tx.type === "earned" ? "Points earned" : tx.type)}
                    </p>
                    <p className="text-xs text-copy-muted mb-2">
                      {new Date(tx.created_at).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className={`text-xs font-bold ${tx.points > 0 ? "text-secondary" : "text-red-600"}`}>
                      {tx.points > 0 ? "+" : ""}{tx.points.toLocaleString("en-ZA")} points
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Account Settings ────────────────────────────────────────────────── */}
      <section className="section-container pb-16">
        <div className="bg-white border border-border p-8 max-w-2xl">
          <h2 className="font-heading text-xl font-bold text-primary mb-4">
            Account Settings
          </h2>

          <div className="space-y-4">
            <div className="pb-4 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-1">
                Email Address
              </p>
              <p className="text-primary font-semibold">{user.email}</p>
            </div>

            {customer && (
              <div className="pb-4 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-1">
                  Name
                </p>
                <p className="text-primary font-semibold">{displayName}</p>
              </div>
            )}

            <div className="pb-4 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-1">
                Password
              </p>
              <Link
                href="/account/login"
                onClick={async () => {}}
                className="text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                Change password →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Help ────────────────────────────────────────────────────────────── */}
      <section className="section-container pb-16">
        <div className="bg-surface/50 border border-border/60 p-8 max-w-2xl">
          <h3 className="font-bold text-primary mb-4">Need Help?</h3>
          <p className="text-copy-muted mb-4">
            Questions about your points, orders, or account?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="flex-1 text-center bg-primary text-white font-bold py-2 px-4 hover:bg-primary/90 transition-colors text-sm"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/27721605556"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center border-2 border-primary text-primary font-bold py-2 px-4 hover:bg-primary/5 transition-colors text-sm"
            >
              WhatsApp Anneke
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
