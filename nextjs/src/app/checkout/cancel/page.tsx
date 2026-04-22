import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center py-20">
      <div className="section-container max-w-xl">
        <div className="bg-white border border-border p-10 text-center">

          <XCircle className="h-16 w-16 text-amber-500 mx-auto mb-6" />

          <p className="overline mb-3">Payment Cancelled</p>
          <h1 className="text-3xl font-bold text-primary mb-4">Your payment was cancelled</h1>

          {order && (
            <p className="text-xs text-copy-muted font-mono mb-4">Order ref: {order}</p>
          )}

          <p className="text-copy-muted leading-relaxed mb-8">
            No payment was taken. Your cart items are still saved — you can
            return to your cart and try again, or contact us if you need help.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cart" className="btn-primary px-8 py-3">
              Return to Cart
            </Link>
            <Link href="/contact" className="btn-ghost px-8 py-3">
              Contact Us
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
