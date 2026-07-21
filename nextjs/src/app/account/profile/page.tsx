export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, ShoppingBag, TrendingUp } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { calculatePointValue } from "@/lib/rewards-config";
import { fetchAccountOrders } from "@/lib/account-orders";
import OrderHistoryTable from "@/components/account/OrderHistoryTable";
import CustomerReviewsPanel from "@/components/account/CustomerReviewsPanel";
import SignOutButton from "../dashboard/SignOutButton";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View your order history, Lava Points, reviews, and account settings.",
  robots: { index: false, follow: false },
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

type PointsTx = {
  id: string;
  type: string;
  points: number;
  description: string | null;
  created_at: string;
};

export default async function AccountProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/account/login");

  const userEmail = normalizeEmail(user.email);
  const service = createServiceClient();

  const { data: customer } = await service
    .from("customers")
    .select(
      "id, first_name, last_name, email, points_balance, lifetime_points, total_spent, order_count, registered_at, is_vip"
    )
    .ilike("email", userEmail)
    .maybeSingle();

  const [orders, reviewsResult, pointsTxResult] = await Promise.all([
    fetchAccountOrders(service, userEmail, customer?.id),
    service
      .from("reviews")
      .select(
        "id, headline, rating, review_type, approved, created_at, product_slug, machine, review_scope"
      )
      .ilike("email", userEmail)
      .order("created_at", { ascending: false })
      .limit(20),
    customer?.id
      ? service
          .from("points_transactions")
          .select("id, type, points, description, created_at")
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as PointsTx[], error: null }),
  ]);

  const pointsTxs = (pointsTxResult.data as PointsTx[]) ?? [];
  const reviews = reviewsResult.data ?? [];

  const firstName =
    customer?.first_name?.trim() ||
    userEmail.split("@")[0]?.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "there";
  const fullName = customer
    ? [customer.first_name, customer.last_name].filter(Boolean).join(" ").trim()
    : "";
  const displayName = fullName || user.email;
  const profileIncomplete = !customer?.first_name?.trim();

  const pointsBalance = customer?.points_balance ?? 0;
  const totalSpent = customer?.total_spent ?? 0;
  const pointsValue = calculatePointValue(pointsBalance);
  const memberSince = customer?.registered_at
    ? new Date(customer.registered_at).toLocaleDateString("en-ZA", {
        month: "long",
        year: "numeric",
      })
    : new Date(user.created_at).toLocaleDateString("en-ZA", {
        month: "long",
        year: "numeric",
      });

  const orderCount = orders.length;

  return (
    <main className="min-h-screen bg-surface/30">
      <section className="bg-primary text-white py-10">
        <div className="section-container">
          <div className="flex justify-between items-start gap-6 mb-6">
            <div className="max-w-2xl">
              <p className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">
                Your personal member profile
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold leading-tight">
                Hi {firstName} — welcome to Lava-SA
              </h1>
              <p className="mt-4 text-white/85 text-base leading-relaxed">
                This is your private space on lava-sa.com. Monitor your orders, Lava Points, and
                reviews here whenever you return.
              </p>
              {profileIncomplete ? (
                <p className="mt-3 text-secondary/95 text-sm leading-relaxed">
                  Tip: when you place an order we save your full name on this profile. Until then,
                  your email below is your member login.
                </p>
              ) : null}
              {customer?.is_vip ? (
                <span className="inline-block mt-4 bg-secondary text-white text-[10px] font-bold uppercase px-2.5 py-1 tracking-wider">
                  VIP Member
                </span>
              ) : null}
            </div>
            <SignOutButton />
          </div>
          <p className="text-white/70 text-sm">Member since {memberSince}</p>
        </div>
      </section>

      <section className="section-container py-10">
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
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

          <div className="bg-white border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-copy-muted" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-copy-muted">
                Orders
              </p>
            </div>
            <p className="text-4xl font-black text-primary mb-2">
              {orderCount.toLocaleString("en-ZA")}
            </p>
            <p className="text-sm text-copy-muted">
              {customer?.is_vip ? "Top-tier Lava member" : "In your purchase history"}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">Order History</h2>
              <p className="text-sm text-copy-muted mt-1">
                Click a row to expand line items. Recent orders include tracking details.
              </p>
            </div>
            <Link
              href="/products/vacuum-machines"
              className="text-sm font-bold text-primary hover:text-secondary transition-colors shrink-0"
            >
              Continue Shopping →
            </Link>
          </div>
          <OrderHistoryTable orders={orders} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <CustomerReviewsPanel reviews={reviews} />
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">Points Activity</h2>
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
                    <p
                      className={`text-xs font-bold ${tx.points > 0 ? "text-secondary" : "text-red-600"}`}
                    >
                      {tx.points > 0 ? "+" : ""}
                      {tx.points.toLocaleString("en-ZA")} points
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-border p-8 max-w-2xl mb-10">
          <h2 className="font-heading text-xl font-bold text-primary mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="pb-4 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-1">
                Email Address
              </p>
              <p className="text-primary font-semibold">{user.email}</p>
            </div>
            {customer ? (
              <div className="pb-4 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-1">Name</p>
                <p className="text-primary font-semibold">{displayName}</p>
              </div>
            ) : null}
            <div className="pb-4 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-1">
                Password
              </p>
              <Link
                href="/account/login?mode=reset"
                className="text-sm font-bold text-primary hover:text-secondary transition-colors"
              >
                Change password →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-surface/50 border border-border/60 p-8 max-w-2xl">
          <h3 className="font-bold text-primary mb-4">Need Help?</h3>
          <p className="text-copy-muted mb-4">Questions about your points, orders, or account?</p>
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
