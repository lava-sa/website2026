import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Clock, Phone, Mail, Building2, Copy } from "lucide-react";

export const metadata: Metadata = { title: "Order Confirmed" };

// ── Bank details — Wilco to fill these in ────────────────────────────────────
const BANK = {
  bank:        "Nedbank",
  accountName: "LAVA VIDE SA (PTY) LTD",
  accountNo:   "1123920508",
  branchCode:  "198765",  // Nedbank universal branch code
  accountType: "Cheque / Current",
};

function BankRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
      <span className="w-36 shrink-0 text-xs text-copy-muted font-medium pt-0.5">{label}</span>
      <span className={`text-sm font-bold flex-1 ${highlight ? "text-secondary text-base" : "text-primary"}`}>
        {value}
      </span>
    </div>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; method?: string }>;
}) {
  const { order, method } = await searchParams;
  const isEFT = method === "eft";

  return (
    <main className="min-h-screen bg-surface py-20">
      <div className="section-container max-w-2xl">

        {isEFT ? (
          /* ── Bank Transfer Success ─────────────────────────────────── */
          <div className="space-y-6">

            {/* Confirmation header */}
            <div className="bg-white border border-border p-8 text-center">
              <div className="h-16 w-16 bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">
                Order Reserved
              </p>
              <h1 className="text-3xl font-bold text-primary mb-3">
                Almost there — one step left!
              </h1>
              <p className="text-copy-muted leading-relaxed max-w-md mx-auto">
                Your order has been reserved. Please make your EFT payment using the
                details below. We will dispatch your order as soon as payment reflects
                in our account.
              </p>
            </div>

            {/* Order number */}
            {order && (
              <div className="bg-primary p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Your order reference — use this as your payment reference
                </p>
                <p className="text-3xl font-black text-secondary font-mono tracking-wider">
                  {order}
                </p>
                <p className="text-xs text-white/50 mt-2">
                  ⚠️ Use this EXACTLY as your payment reference so we can match your payment
                </p>
              </div>
            )}

            {/* Bank details */}
            <div className="bg-white border-2 border-secondary p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-secondary" />
                <h2 className="font-bold text-primary">Payment Details</h2>
              </div>

              <BankRow label="Bank"           value={BANK.bank} />
              <BankRow label="Account Name"   value={BANK.accountName} />
              <BankRow label="Account Number" value={BANK.accountNo} />
              <BankRow label="Branch Code"    value={BANK.branchCode} />
              <BankRow label="Account Type"   value={BANK.accountType} />
              <BankRow
                label="Payment Reference"
                value={order ?? "Use your order number"}
                highlight
              />

              <div className="mt-5 bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-xs font-bold text-amber-800 mb-1">
                  Important — please read:
                </p>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• Use your order number <strong>{order}</strong> as the payment reference — no other reference</li>
                  <li>• Payment must reflect within <strong>3 business days</strong> or the order will be cancelled</li>
                  <li>• Send your proof of payment to <strong>info@lava-sa.co.za</strong> to speed up processing</li>
                </ul>
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-white border border-border p-6">
              <h3 className="font-bold text-primary mb-4">What happens next?</h3>
              <ol className="space-y-3">
                {[
                  { step: "1", text: "Make your EFT payment using the details above" },
                  { step: "2", text: `Email your proof of payment to info@lava-sa.co.za with reference ${order ?? "your order number"}` },
                  { step: "3", text: "We verify payment and dispatch your order within 1–2 business days" },
                  { step: "4", text: "You receive a shipping confirmation with tracking details" },
                ].map(({ step, text }) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="h-6 w-6 bg-secondary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {step}
                    </span>
                    <p className="text-sm text-copy leading-relaxed">{text}</p>
                  </li>
                ))}
              </ol>
            </div>

          </div>
        ) : (
          /* ── PayFast Success ───────────────────────────────────────── */
          <div className="bg-white border border-border p-10 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
            <p className="overline mb-3">Payment Successful</p>
            <h1 className="text-3xl font-bold text-primary mb-4">Thank you for your order!</h1>
            {order && (
              <div className="bg-surface border border-border px-6 py-4 mb-6 inline-block">
                <p className="text-xs font-bold uppercase tracking-widest text-copy-muted mb-1">Order Number</p>
                <p className="text-xl font-bold text-primary font-mono">{order}</p>
              </div>
            )}
            <p className="text-copy-muted leading-relaxed mb-8">
              Your payment has been received. We will process and dispatch your order
              within <strong>1–2 business days</strong>. A confirmation email has been sent by PayFast.
            </p>
          </div>
        )}

        {/* Contact + nav — shown for both */}
        <div className="bg-white border border-border p-6 mt-6">
          <p className="text-sm font-semibold text-primary mb-4 text-center">Questions? Contact Anneke directly:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <a href="tel:+27721605556"
              className="flex items-center gap-2 text-sm text-copy-muted hover:text-primary transition-colors">
              <Phone className="h-4 w-4" /> +27 72 160 5556
            </a>
            <a href="mailto:info@lava-sa.co.za"
              className="flex items-center gap-2 text-sm text-copy-muted hover:text-primary transition-colors">
              <Mail className="h-4 w-4" /> info@lava-sa.co.za
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary px-8 py-3">Back to Home</Link>
            <Link href="/products/vacuum-machines" className="btn-ghost px-8 py-3">Browse Machines</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
