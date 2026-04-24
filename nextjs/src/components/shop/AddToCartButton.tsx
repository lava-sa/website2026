"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-context";

interface Props {
  product: Omit<CartItem, "quantity">;
  funnelSlug?: string; // if set, redirect to /buy/[funnelSlug] after adding
  priceDisplay?: React.ReactNode;
}

export default function AddToCartButton({ product, funnelSlug, priceDisplay }: Props) {
  const { addItem, isHydrated } = useCart();
  const router      = useRouter();
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);

  const changeQty = (delta: number) =>
    setQty((q) => Math.max(1, Math.min(10, q + delta)));

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    if (funnelSlug) {
      router.push(`/buy/${funnelSlug}`);
      return;
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      router.push("/cart");
    }, 250);
  };

  return (
    <div className="flex flex-col gap-3">

      {/* Row: Price on left, QTY on right */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 \${priceDisplay ? 'py-4 border-y border-border mb-1 mt-1' : ''}`}>
        
        {/* Render Price Block */}
        {priceDisplay && (
          <div className="flex-1">
            {priceDisplay}
          </div>
        )}

        {/* Quantity selector */}
        <div className="flex items-center gap-0 shrink-0">
          <span className="text-xs font-bold text-copy-muted uppercase tracking-wider mr-3">Qty</span>
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() => changeQty(-1)}
              disabled={qty <= 1}
              aria-label="Decrease quantity"
              className="h-10 w-10 flex items-center justify-center text-primary hover:bg-primary hover:text-white
                         transition-colors border-r border-border disabled:opacity-30"
            >
            <Minus className="h-4 w-4" />
          </button>
            <span className="h-10 w-12 flex items-center justify-center text-base font-bold text-primary select-none">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => changeQty(1)}
              disabled={qty >= 10}
              aria-label="Increase quantity"
              className="h-10 w-10 flex items-center justify-center text-primary hover:bg-primary hover:text-white
                         transition-colors border-l border-border disabled:opacity-30"
            >
            <Plus className="h-4 w-4" />
          </button>
          </div>
          {qty > 1 && (
            <span className="ml-3 text-xs text-secondary font-semibold absolute -mt-12">
              {qty} units
            </span>
          )}
        </div>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={!isHydrated}
        className={`btn-primary flex items-center justify-center gap-2 text-base py-4 transition-all duration-300 ${
          added ? "bg-emerald-600 border-emerald-600" : ""
        }`}
      >
        {!isHydrated ? (
          <>Loading…</>
        ) : added ? (
          <><Check className="h-5 w-5" /> Added to Cart!</>
        ) : (
          <><ShoppingBag className="h-5 w-5" /> Add to Cart</>
        )}
      </button>

    </div>
  );
}
