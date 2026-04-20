import type { Metadata } from "next";
import Link from "next/link";
import { Gift, TrendingUp, Zap, Award, ArrowRight } from "lucide-react";
import { calculatePointValue, getRedemptionExamples } from "@/lib/rewards-config";

export const metadata: Metadata = {
  title: "Lava Points",
  description: "Earn Lava Points on every purchase and redeem for discounts on vacuum sealers, bags, and accessories.",
};

export default function RewardsPage() {
  const examples = getRedemptionExamples();

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="bg-primary text-white py-16 sm:py-20">
        <div className="section-container">
          <div className="max-w-2xl">
            <p className="text-secondary font-bold uppercase tracking-[0.15em] text-sm mb-3">
              Lava Points
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl font-black leading-tight mb-5">
              Every Rand You Spend<br />
              <span className="text-secondary">Works Harder for You</span>
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
              Earn Lava Points on every purchase — automatically credited to your Lava Points balance and redeemable towards discounts on your next order.
            </p>
            <Link
              href="#signup"
              className="inline-block bg-secondary text-white font-bold py-3 px-8 hover:bg-secondary/90 transition-colors"
            >
              Join Now for Free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-surface/30">
        <div className="section-container">
          <h2 className="font-heading text-3xl font-bold text-primary mb-12 text-center">
            How It Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col">
              <div className="mb-5 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-lg text-primary mb-3">Buy or Use a Coupon</h3>
              <p className="text-copy-muted leading-relaxed flex-1">
                Visit us in store, shop online, or use a Lava Points discount coupon. Your account is created automatically.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col">
              <div className="mb-5 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-lg text-primary mb-3">Earn Points Automatically</h3>
              <p className="text-copy-muted leading-relaxed flex-1">
                Earn 1 point for every R5 spent. Points are instantly credited to your Lava Points balance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col">
              <div className="mb-5 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-lg text-primary mb-3">Redeem Anytime</h3>
              <p className="text-copy-muted leading-relaxed flex-1">
                Check your balance and redeem points for discounts towards any Lava product or service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Earning Rates ──────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="section-container">
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl">
            {/* Earn Rate */}
            <div className="bg-surface/50 border border-border rounded-lg p-8">
              <Award className="h-8 w-8 text-secondary mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary mb-2">
                Earning Rate
              </p>
              <h3 className="text-4xl font-black text-primary mb-2">1 Point</h3>
              <p className="text-copy-muted">Per R5 you spend</p>
            </div>

            {/* Redemption Value */}
            <div className="bg-surface/50 border border-border rounded-lg p-8">
              <Gift className="h-8 w-8 text-secondary mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary mb-2">
                Redemption Value
              </p>
              <h3 className="text-4xl font-black text-primary mb-2">R0.05</h3>
              <p className="text-copy-muted">Per point redeemed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Redemption Examples ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-surface/30">
        <div className="section-container">
          <h2 className="font-heading text-3xl font-bold text-primary mb-4">
            What You Can Earn
          </h2>
          <p className="text-copy-muted mb-10 max-w-2xl">
            Here are some examples of what your points are worth:
          </p>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            <div className="bg-white border border-border p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-secondary mb-3">
                On Treatments & Products
              </p>
              <div className="space-y-4">
                {examples.map((example, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
                    <span className="text-sm text-copy">{example.points.toLocaleString("en-ZA")} Points</span>
                    <span className="font-bold text-primary">R{example.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Calculator */}
            <div className="bg-white border border-border p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-secondary mb-3">
                Earnings Calculator
              </p>
              <p className="text-sm text-copy-muted mb-4">
                Enter any product price to see what you'd earn:
              </p>
              <input
                type="number"
                placeholder="e.g. 1900"
                defaultValue="0"
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const points = Math.floor(val / 5);
                  const value = points * 0.05;
                  e.target.nextElementSibling!.textContent = points.toLocaleString("en-ZA") + " points (R" + value.toFixed(2) + ")";
                }}
                className="w-full border border-border px-4 py-2 mb-3 text-sm"
              />
              <div className="text-sm font-bold text-primary">
                0 points (R0.00)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="section-container max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-primary mb-10 text-center">
            Member Benefits
          </h2>

          <div className="space-y-4">
            {[
              { icon: Zap, title: "Instant Points", desc: "Points credited immediately on every purchase" },
              { icon: TrendingUp, title: "Bonus Earning Opportunities", desc: "Special point multipliers on seasonal sales and exclusive events" },
              { icon: Gift, title: "Flexible Redemptions", desc: "Redeem anytime — there's no expiration or minimum requirement" },
              { icon: Award, title: "VIP Access", desc: "Early access to new products and exclusive Lava member discounts" },
            ].map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="flex gap-4 p-4 border border-border/40 hover:border-primary transition-colors">
                  <Icon className="h-6 w-6 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-primary mb-1">{benefit.title}</h3>
                    <p className="text-sm text-copy-muted">{benefit.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Signup Section ──────────────────────────────────────────────────── */}
      <section id="signup" className="bg-primary text-white py-16 sm:py-20">
        <div className="section-container max-w-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Start Earning Today
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Your Lava Points account is created automatically with your first purchase or signup. Start earning points with every rand you spend.
          </p>

          <div className="space-y-3 sm:flex gap-4">
            <Link
              href="/products/vacuum-machines"
              className="flex-1 inline-block bg-secondary text-white font-bold py-4 px-8 text-center hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="flex-1 inline-block border-2 border-white text-white font-bold py-4 px-8 text-center hover:bg-white/10 transition-colors"
            >
              Questions? Contact Us
            </Link>
          </div>

          <p className="text-sm text-white/60 mt-6">
            Already a member? <Link href="/account/dashboard" className="text-secondary hover:underline font-bold">Check your balance →</Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-surface/30">
        <div className="section-container max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-primary mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "How do I sign up for Lava Points?",
                a: "Your account is created automatically when you make your first purchase. You can also sign up on this page to start earning immediately.",
              },
              {
                q: "When are my points credited?",
                a: "Points are credited instantly after your purchase is confirmed. You can check your balance anytime on your dashboard.",
              },
              {
                q: "How long are my points valid?",
                a: "Your Lava Points never expire. They stay in your account indefinitely until you choose to redeem them.",
              },
              {
                q: "Can I transfer my points to someone else?",
                a: "Points are personal to your account and cannot be transferred. However, you can use them to purchase items as gifts.",
              },
              {
                q: "What if I want to return a product?",
                a: "If you return a product, the associated points will be deducted from your account. You'll receive a refund for the purchase amount.",
              },
              {
                q: "Can I earn points on orders placed with a discount?",
                a: "Yes! Points are calculated on the final purchase price, after any discounts or promotions have been applied.",
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-bold text-primary mb-2">{item.q}</h3>
                <p className="text-copy-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
