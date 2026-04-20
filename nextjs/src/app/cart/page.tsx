"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, getShipping, SHIPPING_FEE } from "@/lib/cart-context";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const { items, total, removeItem, updateQty, count } = useCart();
  const shipping = getShipping(total);
  const orderTotal = total + shipping;

  if (count === 0) {
    return (
      <main className="min-h-screen bg-white">
        <section className="py-32">
          <div className="section-container max-w-lg mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-border mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-primary mb-3">Your cart is empty</h1>
            <p className="text-copy-muted mb-8">
              Browse our range of German-engineered vacuum sealers and accessories.
            </p>
            <Link href="/products/vacuum-machines" className="btn-primary inline-flex items-center gap-2">
              Shop Vacuum Machines
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="section-container py-8">
          <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
          <p className="mt-1 text-copy-muted">{count} {count === 1 ? "item" : "items"}</p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Cart items ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-border p-5 flex gap-5"
              >
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 bg-surface overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-border" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-bold text-primary hover:text-secondary transition-colors line-clamp-2 leading-snug"
                  >
                    {item.name}
                  </Link>
                  {item.sku && (
                    <p className="text-xs text-copy-muted font-mono mt-1">SKU: {item.sku}</p>
                  )}
                  <p className="text-sm font-semibold text-primary mt-2">
                    {formatPrice(item.price)} each
                  </p>
                </div>

                {/* Qty + remove */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <div className="flex items-center gap-1 border border-border">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-primary hover:bg-surface disabled:opacity-30 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="p-1.5 text-primary hover:bg-surface transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-copy-muted hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <div className="pt-2">
              <Link
                href="/products/vacuum-machines"
                className="text-sm font-semibold text-primary hover:text-secondary transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order summary ────────────────────────────────────────────── */}
          <div className="bg-white border border-border p-6 sticky top-32">
            <h2 className="text-lg font-bold text-primary mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-copy-muted">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-copy-muted">Delivery</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    formatPrice(SHIPPING_FEE)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-copy-muted bg-surface p-2.5 border border-border">
                  Add {formatPrice(2000 - total)} more for free delivery
                </p>
              )}
              <div className="border-t border-border pt-3 flex justify-between text-base">
                <span className="font-bold text-primary">Total</span>
                <span className="font-bold text-primary text-xl">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-primary flex items-center justify-center gap-2 mt-6 py-4 text-base"
            >
              Proceed to Checkout
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Payment trust */}
            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted mb-3 text-center">
                Secure Payment via
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-copy-muted">
                <span className="bg-[#0A4396] text-white font-bold px-2 py-0.5 text-[10px]">PayFast</span>
                <span>·</span>
                <span>Visa · Mastercard · EFT</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
