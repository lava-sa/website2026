import type { Metadata } from "next";
import Link from "next/link";
import OrderTrackingCTA from "@/components/checkout/OrderTrackingCTA";
import PaymentStatusWatcher from "@/components/checkout/PaymentStatusWatcher";
import PhoneNumbers from "@/components/layout/PhoneNumbers";
import { CheckCircle, Clock, Phone, Mail, Building2, XCircle } from "lucide-react";
import { getEftBankDetails } from "@/lib/bank-details";
import { createServiceClient } from "@/lib/supabase";
import { verifyOrderAccessToken } from "@/lib/order-access-token";
import { ANNEKE_PHONE } from "@/lib/contact";

export const metadata: Metadata = { title: "Order Confirmed" };

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

/**
 * Payment status straight from the database. Landing on this URL proves nothing —
 * only a PayFast ITN marked "paid" does. Access is authorised by the signed token
 * from the PayFast return URL, or by the email that was used for the order.
 */
async function loadOrderStatus(
  orderNumber: string | undefined,
  token: string | undefined,
  emailHint: string | undefined
): Promise<{ status: string; total: number } | null> {
  if (!orderNumber) return null;

  const verified = token ? verifyOrderAccessToken(token) : null;
  const tokenMatches = verified?.orderNumber === orderNumber;
  if (!tokenMatches && !emailHint) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("status, total, email")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!data) return null;

  const orderEmail = String(data.email ?? "").trim().toLowerCase();
  const authorised =
    (tokenMatches && verified!.email === orderEmail) ||
    (!!emailHint && emailHint.trim().toLowerCase() === orderEmail);

  if (!authorised) return null;

  return { status: String(data.status ?? "pending"), total: Number(data.total ?? 0) };
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; method?: string; email?: string; token?: string }>;
}) {
  const { order, method, email, token } = await searchParams;
  const isEFT = method === "eft";
  const BANK = getEftBankDetails();

  const orderState = isEFT ? null : await loadOrderStatus(order, token, email);
  const status = orderState?.status ?? "unknown";
  const isPaid = status === "paid" || status === "processing" || status === "shipped" || status === "delivered" || status === "completed";
  const isFailed = status === "failed" || status === "cancelled";
  const isAwaitingConfirmation = !isEFT && !isPaid && !isFailed;

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
                  <li>• Send your proof of payment to <strong>info@lava-sa.com</strong> to speed up processing</li>
                </ul>
              </div>
            </div>

            {/* Next steps */}
            <div className="bg-white border border-border p-6">
              <h3 className="font-bold text-primary mb-4">What happens next?</h3>
              <ol className="space-y-3">
                {[
                  { step: "1", text: "Make your EFT payment using the details above" },
                  { step: "2", text: `Email your proof of payment to info@lava-sa.com with reference ${order ?? "your order number"}` },
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
        ) : isFailed ? (
          /* ── PayFast payment did NOT succeed ───────────────────────── */
          <div className="space-y-6">
            <div className="bg-white border-4 border-red-600 p-8 text-center">
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-2">
                Payment Unsuccessful
              </p>
              <h1 className="text-3xl font-bold text-red-700 mb-4">
                Your PayFast payment did not go through
              </h1>
              {order && (
                <p className="text-xs text-copy-muted font-mono mb-4">Order ref: {order}</p>
              )}
              <p className="text-copy leading-relaxed font-semibold">
                No money was taken and this order is <strong className="text-red-700">not paid</strong>.
                Nothing will be dispatched until payment is completed.
              </p>
            </div>

            <div className="bg-white border border-border p-6">
              <h2 className="font-bold text-primary mb-4">How to complete your order</h2>
              <ol className="space-y-3 text-sm text-copy leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="h-6 w-6 bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Try again with the same or another card — your cart is still saved.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-6 w-6 bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Pay by EFT using the details below with reference <strong>{order}</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-6 w-6 bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Call Anneke on {ANNEKE_PHONE.displayLocal} to arrange another payment method.</span>
                </li>
              </ol>

              <div className="mt-6 border-t border-border pt-5">
                <BankRow label="Bank"           value={BANK.bank} />
                <BankRow label="Account Name"   value={BANK.accountName} />
                <BankRow label="Account Number" value={BANK.accountNo} />
                <BankRow label="Branch Code"    value={BANK.branchCode} />
                <BankRow label="Payment Reference" value={order ?? "Your order number"} highlight />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link href="/cart" className="btn-primary px-8 py-3">Return to Cart</Link>
                <Link href="/contact" className="btn-ghost px-8 py-3">Contact Us</Link>
              </div>
            </div>
          </div>
        ) : isAwaitingConfirmation ? (
          /* ── Returned from PayFast, outcome not confirmed yet ──────── */
          <div className="bg-white border border-border p-10 text-center">
            <Clock className="h-16 w-16 text-amber-500 mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2">
              Confirming Payment
            </p>
            <h1 className="text-3xl font-bold text-primary mb-4">We are confirming your payment</h1>
            {order && (
              <div className="bg-surface border border-border px-6 py-4 mb-6 inline-block">
                <p className="text-xs font-bold uppercase tracking-widest text-copy-muted mb-1">Order Number</p>
                <p className="text-xl font-bold text-primary font-mono">{order}</p>
              </div>
            )}
            <p className="text-copy-muted leading-relaxed mb-6">
              PayFast has not confirmed the result of this payment yet. This usually takes a few
              seconds. <strong>Please do not pay again</strong> — we will email you as soon as the
              payment is confirmed, or if it did not succeed.
            </p>
            {order && token && <PaymentStatusWatcher orderNumber={order} token={token} />}
          </div>
        ) : (
          /* ── PayFast payment confirmed ─────────────────────────────── */
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
              Your payment has been confirmed by PayFast. We will process and dispatch your order
              within <strong>1–2 business days</strong>, and your confirmation email is on its way.
            </p>
          </div>
        )}

        {/* Contact + nav — shown for both */}
        <div className="bg-white border border-border p-6 mt-6">
          {order && (
            <OrderTrackingCTA orderNumber={order} emailHint={email} />
          )}
          <p className="text-sm font-semibold text-primary mb-4 text-center">Questions? Contact Anneke directly:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-copy-muted">
              <Phone className="h-4 w-4 shrink-0" />
              <PhoneNumbers layout="stacked" linkClassName="hover:text-primary transition-colors" />
            </div>
            <a href="mailto:info@lava-sa.com"
              className="flex items-center gap-2 text-sm text-copy-muted hover:text-primary transition-colors">
              <Mail className="h-4 w-4" /> info@lava-sa.com
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
