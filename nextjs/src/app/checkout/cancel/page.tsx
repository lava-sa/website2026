import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import ReportFailedPayment from "@/components/checkout/ReportFailedPayment";
import { getEftBankDetails } from "@/lib/bank-details";
import { ANNEKE_PHONE } from "@/lib/contact";

export const metadata: Metadata = { title: "Payment Not Completed" };

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; token?: string }>;
}) {
  const { order, token } = await searchParams;
  const BANK = getEftBankDetails();

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center py-20">
      {/* Tells the server this payment did not complete → order cancelled + both parties emailed */}
      {order && token && <ReportFailedPayment orderNumber={order} token={token} />}

      <div className="section-container max-w-xl space-y-6">
        <div className="bg-white border-4 border-red-600 p-10 text-center">

          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-2">
            Payment Not Completed
          </p>
          <h1 className="text-3xl font-bold text-red-700 mb-4">Your payment was not successful</h1>

          {order && (
            <p className="text-xs text-copy-muted font-mono mb-4">Order ref: {order}</p>
          )}

          <p className="text-copy leading-relaxed font-semibold">
            No money was taken and this order is <strong className="text-red-700">not paid</strong>.
            Your cart items are still saved — you can try again, pay by EFT, or call us.
          </p>
        </div>

        <div className="bg-white border border-border p-6">
          <h2 className="font-bold text-primary mb-3">Prefer to pay by EFT?</h2>
          <p className="text-sm text-copy-muted mb-4">
            Use <strong>{order ?? "your order number"}</strong> as your payment reference and email
            proof of payment to <strong>info@lava-sa.com</strong>.
          </p>
          <dl className="space-y-1.5 text-sm">
            {[
              { label: "Bank", value: BANK.bank },
              { label: "Account Name", value: BANK.accountName },
              { label: "Account Number", value: BANK.accountNo },
              { label: "Branch Code", value: BANK.branchCode },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <dt className="w-36 shrink-0 text-copy-muted font-medium">{label}:</dt>
                <dd className="font-bold text-primary">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-copy-muted mt-4">
            Or speak to Anneke directly on <strong>{ANNEKE_PHONE.displayLocal}</strong> to arrange
            another payment method.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
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
