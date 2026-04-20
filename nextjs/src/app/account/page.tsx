import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, LogIn, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account | Lava South Africa",
  description: "Manage your Lava account, view your Lava Points, and track orders.",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-surface/30">
      <section className="section-container py-16 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            My Account
          </h1>
          <p className="text-copy-muted mb-12">
            Manage your Lava account, view your Lava Points, and track your orders.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Dashboard */}
            <Link
              href="/account/dashboard"
              className="flex flex-col p-8 bg-white border-2 border-primary hover:shadow-lg transition-all"
            >
              <BarChart3 className="h-8 w-8 text-primary mb-4" />
              <h2 className="font-bold text-lg text-primary mb-2">
                My Dashboard
              </h2>
              <p className="text-sm text-copy-muted flex-1 mb-4">
                View your points balance, purchase history, and redemptions.
              </p>
              <span className="text-sm font-bold text-primary">
                View Dashboard →
              </span>
            </Link>

            {/* Rewards */}
            <Link
              href="/rewards"
              className="flex flex-col p-8 bg-white border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <LogIn className="h-8 w-8 text-secondary mb-4" />
              <h2 className="font-bold text-lg text-primary mb-2">
                Lava Points
              </h2>
              <p className="text-sm text-copy-muted flex-1 mb-4">
                Learn how to earn and redeem Lava Points on your purchases.
              </p>
              <span className="text-sm font-bold text-secondary">
                Learn More →
              </span>
            </Link>

            {/* Help */}
            <Link
              href="/contact"
              className="sm:col-span-2 flex flex-col p-8 bg-white border border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <HelpCircle className="h-8 w-8 text-copy-muted mb-4" />
              <h2 className="font-bold text-lg text-primary mb-2">
                Need Help?
              </h2>
              <p className="text-sm text-copy-muted flex-1 mb-4">
                Contact us with any questions about your account or orders.
              </p>
              <span className="text-sm font-bold text-primary">
                Contact Support →
              </span>
            </Link>
          </div>

          {/* Authentication Note */}
          <div className="mt-12 p-6 bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <p className="font-bold mb-2">Note:</p>
            <p>
              This is a preview of the account dashboard. In production, you'll need to log in with your email address to access your personal account information, points balance, and purchase history.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
