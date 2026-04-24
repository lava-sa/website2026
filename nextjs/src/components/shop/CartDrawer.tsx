"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { getShipping, SHIPPING_FEE, useCart } from "@/lib/cart-context";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDrawer() {
  const { items, total, count, isDrawerOpen, drawerOpenReason, closeDrawer, removeItem } = useCart();
  const shipping = getShipping(total);
  const orderTotal = total + shipping;
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen || drawerOpenReason !== "add") {
      setShowToast(false);
      return;
    }

    setShowToast(true);
    const toastTimer = setTimeout(() => setShowToast(false), 2200);
    const closeTimer = setTimeout(() => closeDrawer(), 6500);
    return () => {
      clearTimeout(toastTimer);
      clearTimeout(closeTimer);
    };
  }, [closeDrawer, drawerOpenReason, isDrawerOpen]);

  return (
    <>
      <div
        className={`fixed top-24 right-6 z-[320] transition-all duration-300 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-primary text-white text-sm font-semibold px-4 py-3 shadow-xl border border-primary-dark">
          Added to cart.
        </div>
      </div>

      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-[300] bg-black/45 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[310] shadow-2xl
          transition-transform duration-300 ease-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        aria-label="Shopping cart drawer"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="font-bold text-primary flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Cart ({count})
          </p>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-copy-muted hover:text-primary transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100%-220px)] overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-copy-muted">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border border-border p-3">
                <div className="relative h-16 w-16 bg-surface shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-border" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary leading-snug line-clamp-2">{item.name}</p>
                  <p className="text-xs text-copy-muted mt-1">Qty: {item.quantity}</p>
                  <p className="text-sm font-bold text-primary mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-copy-muted hover:text-red-600 transition-colors self-start"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-white p-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-copy-muted">Subtotal</span>
            <span className="font-semibold text-primary">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-copy-muted">Delivery</span>
            <span className="font-semibold text-primary">
              {shipping === 0 ? "FREE" : formatPrice(SHIPPING_FEE)}
            </span>
          </div>
          <div className="flex justify-between text-base border-t border-border pt-2">
            <span className="font-bold text-primary">Total</span>
            <span className="font-bold text-primary">{formatPrice(orderTotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link href="/cart" onClick={closeDrawer} className="btn-ghost text-center py-3 px-4">
              View Cart
            </Link>
            <Link href="/checkout" onClick={closeDrawer} className="btn-primary text-center py-3 px-4">
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
