import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Award, HelpCircle, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Lava account, view your Lava Points, and track your orders.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Logged-in users go straight to the dashboard
  if (user) {
    redirect("/account/dashboard");
  }

  // Not logged in — show sign-in landing
  return (
    <main className="min-h-screen bg-surface/30">
      <section className="section-container py-16 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            My Account
          </h1>
          <p className="text-copy-muted mb-12">
            Sign in to view your Lava Points balance, track your orders, and manage your account.
          </p>

          {/* Sign In CTA */}
          <Link
            href="/account/login"
            className="flex items-center gap-4 p-8 bg-primary text-white hover:bg-primary/90 transition-all mb-6"
          >
            <div className="h-12 w-12 bg-white/15 flex items-center justify-center shrink-0">
              <LogIn className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">Sign In to My Account</p>
              <p className="text-white/70 text-sm">
                Access your Lava Points, order history, and account settings.
              </p>
            </div>
            <span className="font-bold text-white/80 text-lg">→</span>
          </Link>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Dashboard preview */}
            <div className="flex flex-col p-8 bg-white border border-border opacity-60">
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h2 className="font-bold text-lg text-primary mb-2">My Dashboard</h2>
              <p className="text-sm text-copy-muted flex-1">
                View your points balance, purchase history, and redemptions.
              </p>
            </div>

            {/* Points preview */}
            <Link
              href="/rewards"
              className="flex flex-col p-8 bg-white border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <Award className="h-8 w-8 text-secondary mb-4" />
              <h2 className="font-bold text-lg text-primary mb-2">Lava Points</h2>
              <p className="text-sm text-copy-muted flex-1 mb-4">
                Earn 1 point per R5 spent. Redeem for discounts on future orders.
              </p>
              <span className="text-sm font-bold text-secondary">Explore Lava Points →</span>
            </Link>

            {/* Help */}
            <Link
              href="/contact"
              className="sm:col-span-2 flex flex-col p-8 bg-white border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <HelpCircle className="h-8 w-8 text-copy-muted mb-4" />
              <h2 className="font-bold text-lg text-primary mb-2">Need Help?</h2>
              <p className="text-sm text-copy-muted flex-1 mb-4">
                Contact Anneke directly — real people, not chatbots.
              </p>
              <span className="text-sm font-bold text-primary">Contact Support →</span>
            </Link>
          </div>

          <p className="text-center text-xs text-copy-muted mt-8">
            Already ordered before?{" "}
            <Link href="/account/login" className="text-primary font-bold hover:underline">
              Set up your account
            </Link>{" "}
            to access your order history and Lava Points.
          </p>
        </div>
      </section>
    </main>
  );
}
