import type { Metadata } from "next";
import Link from "next/link";
import { Award, ShoppingBag, TrendingUp, LogOut } from "lucide-react";
import { calculatePointValue } from "@/lib/rewards-config";

export const metadata: Metadata = {
  title: "My Lava Points Dashboard | Lava South Africa",
  description: "View your Lava Points balance, purchase history, and redeem your points.",
};

// Mock data — in production, this would come from Supabase auth + database
const mockCustomer = {
  name: "John Uys",
  email: "john@example.com",
  pointsBalance: 4850,
  totalSpent: 24250,
  memberSince: "January 2025",
};

const mockPurchases = [
  {
    id: "ORD-2026-001",
    date: "17 April 2026",
    product: "V.300® Premium X",
    amount: 14500,
    pointsEarned: 2900,
    status: "Delivered",
  },
  {
    id: "ORD-2026-002",
    date: "10 April 2026",
    product: "Embossed Vacuum Bags 20×30cm (50pk)",
    amount: 365,
    pointsEarned: 73,
    status: "Delivered",
  },
  {
    id: "ORD-2026-003",
    date: "2 April 2026",
    product: "Bone Protection Linen",
    amount: 325,
    pointsEarned: 65,
    status: "Delivered",
  },
  {
    id: "ORD-2026-004",
    date: "28 March 2026",
    product: "Glass Vacuum Container 1520ml",
    amount: 1225,
    pointsEarned: 245,
    status: "Delivered",
  },
  {
    id: "ORD-2026-005",
    date: "15 March 2026",
    product: "V.100® Premium X",
    amount: 11000,
    pointsEarned: 2200,
    status: "Delivered",
  },
];

const mockRedemptions = [
  {
    id: "RED-2026-001",
    date: "5 April 2026",
    description: "R50 discount on order ORD-2026-002",
    pointsRedeemed: 1000,
  },
];

export default function DashboardPage() {
  const pointsValue = calculatePointValue(mockCustomer.pointsBalance);

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
              <h1 className="font-heading text-3xl font-bold">{mockCustomer.name}</h1>
            </div>
            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <p className="text-white/70 text-sm">
            Member since {mockCustomer.memberSince}
          </p>
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
              {mockCustomer.pointsBalance.toLocaleString("en-ZA")}
            </p>
            <p className="text-sm text-copy-muted mb-4">
              Worth <strong className="text-primary">R{pointsValue.toFixed(2)}</strong> in discounts
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
              R{mockCustomer.totalSpent.toLocaleString("en-ZA")}
            </p>
            <p className="text-sm text-copy-muted">
              Since {mockCustomer.memberSince}
            </p>
          </div>

          {/* Next Tier */}
          <div className="bg-white border border-border p-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-copy-muted" />
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-copy-muted">
                Status
              </p>
            </div>
            <p className="text-4xl font-black text-primary mb-2">Loyal</p>
            <p className="text-sm text-copy-muted">
              Keep earning to reach VIP tier
            </p>
          </div>
        </div>
      </section>

      {/* ── Purchase History & Redemptions ──────────────────────────────────── */}
      <section className="section-container pb-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Purchase History */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              Purchase History
            </h2>

            <div className="space-y-3">
              {mockPurchases.map((purchase) => (
                <div key={purchase.id} className="bg-white border border-border p-6 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-primary">{purchase.product}</p>
                      <p className="text-xs text-copy-muted">{purchase.id}</p>
                    </div>
                    <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-1 border border-emerald-200">
                      {purchase.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-copy-muted text-xs">{purchase.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">R{purchase.amount.toLocaleString("en-ZA")}</p>
                      <p className="text-xs text-secondary">
                        +{purchase.pointsEarned.toLocaleString("en-ZA")} points
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/products/vacuum-machines"
              className="mt-6 inline-block text-primary font-bold hover:text-secondary transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>

          {/* Redemption History */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary mb-6">
              Redemptions
            </h2>

            {mockRedemptions.length > 0 ? (
              <div className="space-y-3">
                {mockRedemptions.map((redemption) => (
                  <div key={redemption.id} className="bg-white border border-border p-4">
                    <p className="text-sm font-bold text-primary mb-2">
                      {redemption.description}
                    </p>
                    <p className="text-xs text-copy-muted mb-2">{redemption.date}</p>
                    <p className="text-xs font-bold text-secondary">
                      -{redemption.pointsRedeemed.toLocaleString("en-ZA")} points
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-border p-6 text-center">
                <p className="text-copy-muted mb-3">No redemptions yet</p>
                <Link
                  href="/rewards"
                  className="text-sm font-bold text-primary hover:text-secondary transition-colors"
                >
                  Learn how to redeem →
                </Link>
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
              <p className="text-primary font-semibold">{mockCustomer.email}</p>
            </div>

            <div className="pb-4 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-1">
                Member ID
              </p>
              <p className="text-primary font-semibold font-mono text-sm">LAVA-{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>

            <div>
              <button className="text-sm font-bold text-primary hover:text-secondary transition-colors">
                Edit Profile →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Help Section ────────────────────────────────────────────────────── */}
      <section className="section-container pb-16">
        <div className="bg-surface/50 border border-border/60 p-8 max-w-2xl">
          <h3 className="font-bold text-primary mb-4">Need Help?</h3>
          <p className="text-copy-muted mb-4">
            Have questions about your points or account?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="flex-1 text-center bg-primary text-white font-bold py-2 px-4 hover:bg-primary-mid transition-colors text-sm"
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
