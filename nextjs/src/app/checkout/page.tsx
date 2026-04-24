"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, Loader2, CreditCard, Building2, Check } from "lucide-react";
import { useCart, getShipping, SHIPPING_FEE } from "@/lib/cart-context";

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency", currency: "ZAR",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount);
}

interface FormState {
  first_name: string; last_name: string; email: string; phone: string;
  address: string; city: string; province: string; postal_code: string; notes: string;
}

const EMPTY_FORM: FormState = {
  first_name: "", last_name: "", email: "", phone: "",
  address: "", city: "", province: "Gauteng", postal_code: "", notes: "",
};

type PaymentMethod = "payfast" | "bank_transfer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, clearCart, isHydrated } = useCart();
  const shipping   = getShipping(total);
  const orderTotal = total + shipping;

  const [form,          setForm]          = useState<FormState>(EMPTY_FORM);
  const [errors,        setErrors]        = useState<Partial<FormState>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("payfast");
  const [submitting,    setSubmitting]    = useState(false);
  const [serverError,   setServerError]   = useState("");
  const [orderPlaced,   setOrderPlaced]   = useState(false);

  useEffect(() => {
    // Only bounce to cart when checkout is truly empty.
    // After placing an order, we clear cart intentionally and redirect to success.
    if (isHydrated && count === 0 && !submitting && !orderPlaced) {
      router.replace("/cart");
    }
  }, [count, isHydrated, orderPlaced, router, submitting]);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (!form.first_name.trim())  errs.first_name  = "Required";
    if (!form.last_name.trim())   errs.last_name   = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email required";
    if (!form.phone.trim())       errs.phone       = "Required";
    if (!form.address.trim())     errs.address     = "Required";
    if (!form.city.trim())        errs.city        = "Required";
    if (!form.province)           errs.province    = "Required";
    if (!form.postal_code.trim()) errs.postal_code = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: items, customer: form, payment_method: paymentMethod }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Checkout failed. Please try again.");
      }

      const data = await res.json();

      if (data.method === "bank_transfer") {
        // Bank transfer — clear cart and redirect to success with EFT flag
        setOrderPlaced(true);
        clearCart();
        router.push(`/checkout/success?order=${data.orderNumber}&method=eft`);
        return;
      }

      // PayFast — build hidden form and submit
      const pfForm = document.createElement("form");
      pfForm.method = "POST";
      pfForm.action = data.payfastUrl;
      Object.entries(data.params as Record<string, string>).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden"; input.name = key; input.value = value;
        pfForm.appendChild(input);
      });
      document.body.appendChild(pfForm);
      pfForm.submit();

    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (!isHydrated || count === 0) return null;

  return (
    <main className="min-h-screen bg-surface">

      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="section-container py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Checkout</h1>
          <div className="flex items-center gap-2 text-xs text-copy-muted font-semibold">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout
          </div>
        </div>
      </div>

      <div className="section-container py-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── Left: Delivery details ───────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white border border-border p-6">
                <h2 className="font-bold text-primary text-lg mb-5">Delivery Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <Field label="First Name" error={errors.first_name} required>
                    <input type="text" value={form.first_name} onChange={set("first_name")}
                      placeholder="Anneke" className={inputCls(errors.first_name)} />
                  </Field>

                  <Field label="Last Name" error={errors.last_name} required>
                    <input type="text" value={form.last_name} onChange={set("last_name")}
                      placeholder="Uys" className={inputCls(errors.last_name)} />
                  </Field>

                  <Field label="Email Address" error={errors.email} required>
                    <input type="email" value={form.email} onChange={set("email")}
                      placeholder="anneke@example.co.za" className={inputCls(errors.email)} />
                  </Field>

                  <Field label="Cell / Phone" error={errors.phone} required>
                    <input type="tel" value={form.phone} onChange={set("phone")}
                      placeholder="082 123 4567" className={inputCls(errors.phone)} />
                  </Field>

                  <Field label="Street Address" error={errors.address} required className="sm:col-span-2">
                    <input type="text" value={form.address} onChange={set("address")}
                      placeholder="5 Stirling Road" className={inputCls(errors.address)} />
                  </Field>

                  <Field label="City / Town" error={errors.city} required>
                    <input type="text" value={form.city} onChange={set("city")}
                      placeholder="Bryanston" className={inputCls(errors.city)} />
                  </Field>

                  <Field label="Province" error={errors.province} required>
                    <select value={form.province} onChange={set("province")} className={inputCls(errors.province)}>
                      {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>

                  <Field label="Postal Code" error={errors.postal_code} required>
                    <input type="text" value={form.postal_code} onChange={set("postal_code")}
                      placeholder="2191" className={inputCls(errors.postal_code)} />
                  </Field>

                </div>
              </div>

              {/* ── Payment Method ───────────────────────────────────────── */}
              <div className="bg-white border border-border p-6">
                <h2 className="font-bold text-primary text-lg mb-5">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* PayFast card */}
                  <button type="button" onClick={() => setPaymentMethod("payfast")}
                    className={`relative text-left border-2 p-5 transition-all ${
                      paymentMethod === "payfast"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {paymentMethod === "payfast" && (
                      <span className="absolute top-3 right-3 h-5 w-5 bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                    <CreditCard className="h-6 w-6 text-primary mb-3" />
                    <p className="font-bold text-primary text-sm mb-1">Pay with PayFast</p>
                    <p className="text-xs text-copy-muted leading-relaxed mb-3">
                      Visa · Mastercard · Instant EFT · SnapScan · Capitec Pay
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {[
                        "/images/payment/payfast.png",
                        "/images/payment/visa.png",
                        "/images/payment/mastercard.png",
                      ].map((src) => (
                        <div key={src} className="relative h-6 w-12">
                          <Image src={src} alt="" fill className="object-contain" sizes="48px" />
                        </div>
                      ))}
                    </div>
                  </button>

                  {/* Bank Transfer card */}
                  <button type="button" onClick={() => setPaymentMethod("bank_transfer")}
                    className={`relative text-left border-2 p-5 transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary/40"
                    }`}
                  >
                    {paymentMethod === "bank_transfer" && (
                      <span className="absolute top-3 right-3 h-5 w-5 bg-secondary flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                    <Building2 className="h-6 w-6 text-secondary mb-3" />
                    <p className="font-bold text-primary text-sm mb-1">Direct Bank Transfer</p>
                    <p className="text-xs text-copy-muted leading-relaxed mb-3">
                      Pay directly into our bank account. No transaction fees.
                      Your order ships once payment reflects.
                    </p>
                    <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-secondary text-white px-2 py-0.5">
                      No extra fees
                    </span>
                  </button>

                </div>

                {/* Bank transfer details preview */}
                {paymentMethod === "bank_transfer" && (
                  <div className="mt-4 bg-secondary/5 border border-secondary/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-3">
                      Bank account details — shown again on confirmation
                    </p>
                    <BankDetails orderRef="Your order number" />
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white border border-border p-6">
                <h2 className="font-bold text-primary text-lg mb-4">
                  Order Notes <span className="text-copy-muted font-normal text-sm">(optional)</span>
                </h2>
                <textarea value={form.notes} onChange={set("notes")} rows={3}
                  placeholder="Special instructions, delivery preferences..."
                  className="w-full border border-border px-4 py-2.5 text-sm text-copy focus:outline-none focus:border-primary resize-none" />
              </div>

            </div>

            {/* ── Right: Order summary + submit ───────────────────────── */}
            <div className="space-y-4">

              {/* Items */}
              <div className="bg-white border border-border p-5">
                <h2 className="font-bold text-primary mb-4">Your Order</h2>
                <ul className="space-y-3 divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 pt-3 first:pt-0">
                      <div className="relative w-12 h-12 shrink-0 bg-surface">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary leading-snug line-clamp-2">{item.name}</p>
                        <p className="text-xs text-copy-muted mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-primary shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-copy-muted">Subtotal</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-copy-muted">Delivery</span>
                    <span className="font-semibold">
                      {shipping === 0
                        ? <span className="text-emerald-600">FREE</span>
                        : formatPrice(SHIPPING_FEE)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-bold text-primary">Total</span>
                    <span className="font-bold text-primary text-lg">{formatPrice(orderTotal)}</span>
                  </div>
                </div>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4">
                  {serverError}
                </div>
              )}

              {/* Submit button */}
              <button type="submit" disabled={submitting}
                className={`w-full flex items-center justify-center gap-2 py-4 text-base font-bold text-white transition-colors disabled:opacity-60 ${
                  paymentMethod === "bank_transfer"
                    ? "bg-secondary hover:bg-secondary/90"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {submitting ? (
                  <><Loader2 className="h-5 w-5 animate-spin" />
                  {paymentMethod === "bank_transfer" ? "Placing order…" : "Redirecting to PayFast…"}</>
                ) : paymentMethod === "bank_transfer" ? (
                  <><Building2 className="h-5 w-5" />
                  Place Order — {formatPrice(orderTotal)}</>
                ) : (
                  <><ShieldCheck className="h-5 w-5" />
                  Pay {formatPrice(orderTotal)} with PayFast</>
                )}
              </button>

              <p className="text-[11px] text-copy-muted text-center leading-relaxed">
                {paymentMethod === "bank_transfer"
                  ? "Your order is reserved once placed. We ship after payment reflects in our account."
                  : "You will be redirected to PayFast to complete payment securely."}
              </p>

              <Link href="/cart" className="block text-center text-sm text-copy-muted hover:text-primary transition-colors">
                ← Back to Cart
              </Link>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}

// ── Bank details component (reused in checkout preview + success page) ────────
export function BankDetails({ orderRef }: { orderRef: string }) {
  const rows = [
    { label: "Bank",           value: "Nedbank" },
    { label: "Account Name",   value: "LAVA VIDE SA (PTY) LTD" },
    { label: "Account Number", value: "1123920508" },
    { label: "Branch Code",    value: "198765" },
    { label: "Account Type",   value: "Cheque / Current" },
    { label: "Reference",      value: orderRef, highlight: true },
  ];
  return (
    <dl className="space-y-1.5 text-sm">
      {rows.map(({ label, value, highlight }) => (
        <div key={label} className="flex gap-3">
          <dt className="w-36 shrink-0 text-copy-muted font-medium">{label}:</dt>
          <dd className={`font-bold ${highlight ? "text-secondary" : "text-primary"}`}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function inputCls(error?: string) {
  return `w-full border px-4 py-2.5 text-sm text-copy focus:outline-none focus:border-primary transition-colors ${
    error ? "border-red-400 bg-red-50" : "border-border bg-white"
  }`;
}

function Field({ label, error, required, className, children }: {
  label: string; error?: string; required?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
