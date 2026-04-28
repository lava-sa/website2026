"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Shield } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatRands } from "@/lib/utils";

const PRODUCT = {
  id: "v300-premium-x",
  slug: "v300-premium-x",
  name: "LAVA V.300 Premium X",
  sku: "VL0300XP",
  price: 13500,
  image: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x.webp",
};

const SPEC_BULLETS = [
  "500 W · up to −0,80 bar · 35 l/min pump",
  "42 cm sealing width · double 5 mm seal strips",
  "Automatic + manual vacuum · dial pressure gauge",
  "L+ pressure regulation · liquid separator included",
  "Bags, rolls, containers & jars (with hose kit)",
];

type Placement = "top" | "bottom";

export default function V300InstantCheckout({ placement = "top" }: { placement?: Placement }) {
  const [qty, setQty] = useState(1);
  const { addItem, isHydrated } = useCart();
  const router = useRouter();

  function changeQty(delta: number) {
    setQty((q) => Math.max(1, Math.min(10, q + delta)));
  }

  function addAndGoToCart() {
    for (let i = 0; i < qty; i += 1) {
      addItem({
        id: PRODUCT.id,
        slug: PRODUCT.slug,
        name: PRODUCT.name,
        sku: PRODUCT.sku,
        price: PRODUCT.price,
        image: PRODUCT.image,
      });
    }
    router.push("/cart");
  }

  const sectionId = placement === "top" ? "add-to-cart" : "add-to-cart-bottom";

  return (
    <section
      id={sectionId}
      className="py-10 sm:py-12 bg-[#f4f6f7] border-y-4 border-primary"
      aria-labelledby={`${sectionId}-heading`}
    >
      <div className="section-container max-w-5xl">
        {placement === "bottom" ? (
          <p className="text-center text-sm font-black uppercase tracking-[0.2em] text-primary mb-4">
            Ready to order? Same deal — add to cart below
          </p>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border-2 border-primary/25 bg-white">
          <div className="relative bg-white p-6 lg:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <span className="bg-[#c41230] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1.5 shadow-md rotate-[-6deg]">
                SA stock · ships nationwide
              </span>
            </div>
            <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-1.5 rounded-full bg-secondary/25 border border-secondary px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-primary">
              <Shield className="h-3.5 w-3.5 text-secondary-dark shrink-0" />
              2-year warranty
            </div>
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src={PRODUCT.image}
                alt={PRODUCT.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-center bg-white">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#c41230] mb-2">
              {placement === "top" ? "Limited-time landing offer" : "Order again — instant checkout"}
            </p>
            <h2 id={`${sectionId}-heading`} className="text-2xl sm:text-3xl font-black text-primary leading-tight">
              {PRODUCT.name}
            </h2>
            <p className="mt-2 text-sm text-copy leading-relaxed">
              Add to cart and go straight to checkout — no extra funnel steps on this page.
            </p>

            <p className="mt-4 text-4xl sm:text-5xl font-black text-[#c41230] tabular-nums">
              {formatRands(PRODUCT.price)}
            </p>
            <p className="text-xs text-copy-muted mt-1">
              Free shipping on orders over R2,500 — this machine qualifies.
            </p>

            <ul className="mt-5 space-y-1.5">
              {SPEC_BULLETS.map((line) => (
                <li key={line} className="text-xs sm:text-sm text-copy flex gap-2">
                  <span className="text-[#c41230] font-bold shrink-0">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-copy-muted">Qty</span>
              <div className="flex items-center border-2 border-primary">
                <button
                  type="button"
                  onClick={() => changeQty(-1)}
                  className="h-11 w-11 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="h-11 w-14 flex items-center justify-center font-black text-primary text-lg">{qty}</span>
                <button
                  type="button"
                  onClick={() => changeQty(1)}
                  className="h-11 w-11 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={addAndGoToCart}
              disabled={!isHydrated}
              className="mt-5 w-full inline-flex items-center justify-center gap-2.5 bg-[#c41230] hover:bg-[#9e0e26] text-white font-black text-base sm:text-lg uppercase tracking-wide py-4 px-6 shadow-lg border-2 border-[#9e0e26] transition-colors disabled:opacity-60"
            >
              <ShoppingCart className="h-5 w-5 shrink-0" />
              {isHydrated ? "Add to cart — go to checkout now" : "Loading cart…"}
            </button>

            <p className="mt-3 text-[11px] text-center text-copy-muted">
              Visa · Mastercard · Ozow · EFT · secure checkout
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
