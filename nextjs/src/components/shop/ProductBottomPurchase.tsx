"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Lock, ShoppingBag, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import StockBadge from "@/components/shop/StockBadge";
import { formatPrice } from "@/lib/products";
import type { StockStatus } from "@/types/product";

type ReviewsSummary = {
  average_rating: number;
  total_reviews: number;
};

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    sku: string | null;
    regular_price: number;
    sale_price: number | null;
    stock_status: StockStatus;
    stock_quantity: number | null;
    primary_image_url: string | null;
  };
  price: number;
  image: string | null;
  funnelSlug?: string;
  reviews?: ReviewsSummary | null;
  /** mid = after industries; bottom = end of page (default) */
  placement?: "mid" | "bottom";
};

export default function ProductBottomPurchase({
  product,
  price,
  image,
  funnelSlug,
  reviews,
  placement = "bottom",
}: Props) {
  const { addItem, isHydrated } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const changeQty = (delta: number) =>
    setQty((q) => Math.max(1, Math.min(10, q + delta)));

  const cartProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price,
    image: product.primary_image_url,
    sku: product.sku,
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i += 1) addItem(cartProduct);
    if (funnelSlug) {
      router.push(`/buy/${funnelSlug}`);
      return;
    }
    setAdded(true);
    setTimeout(() => router.push("/cart"), 300);
  };

  const roundedRating = reviews ? Math.round(reviews.average_rating) : 0;
  const hasSale = product.sale_price != null && product.sale_price < product.regular_price;
  const sectionId = placement === "mid" ? "buy-now-mid" : "buy-now";
  const headingId = placement === "mid" ? "mid-purchase-heading" : "bottom-purchase-heading";

  return (
    <section
      id={sectionId}
      className="relative py-12 sm:py-14 bg-gold-light/50"
      aria-labelledby={headingId}
    >
      <div className="section-container">
        <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-primary mb-5">
          Ready to order?
        </p>

        <div className="max-w-5xl mx-auto bg-white border border-secondary/30 shadow-[0_12px_48px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
              {/* Thumbnail */}
              {image && (
                <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 mx-auto lg:mx-0 border border-border bg-surface">
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    sizes="128px"
                  />
                </div>
              )}

              {/* Product info */}
              <div className="flex-1 min-w-0 text-center lg:text-left">
                {product.sku && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted mb-1">
                    SKU: {product.sku}
                  </p>
                )}
                <p
                  id={headingId}
                  className="text-xl sm:text-2xl font-black text-primary leading-tight"
                >
                  {product.name}
                </p>

                {reviews && (
                  <a
                    href="#reviews"
                    className="inline-flex items-center gap-2 mt-2 mb-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i <= roundedRating
                              ? "fill-secondary text-secondary"
                              : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {reviews.average_rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-copy-muted underline">
                      ({reviews.total_reviews} reviews)
                    </span>
                  </a>
                )}

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2">
                  <StockBadge
                    status={product.stock_status}
                    quantity={product.stock_quantity}
                  />
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-primary">
                      {formatPrice(price)}
                    </span>
                    {hasSale && (
                      <span className="text-base text-copy-muted line-through">
                        {formatPrice(product.regular_price)}
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">
                      incl. VAT
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase actions */}
              <div className="w-full lg:w-auto lg:min-w-[260px] shrink-0">
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">
                      Qty
                    </span>
                    <div className="flex items-center border border-border bg-white">
                      <button
                        type="button"
                        onClick={() => changeQty(-1)}
                        disabled={qty <= 1}
                        aria-label="Decrease quantity"
                        className="h-11 w-11 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors border-r border-border disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="h-11 w-12 flex items-center justify-center text-base font-black text-primary select-none">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeQty(1)}
                        disabled={qty >= 10}
                        aria-label="Increase quantity"
                        className="h-11 w-11 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors border-l border-border disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!isHydrated}
                    className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-6 text-base transition-all duration-300 ${
                      added
                        ? "bg-emerald-600 text-white"
                        : "bg-primary text-white hover:bg-primary-dark"
                    } disabled:opacity-60`}
                  >
                    {!isHydrated ? (
                      "Loading…"
                    ) : added ? (
                      <>
                        <Check className="h-5 w-5" />
                        Going to checkout…
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        Buy Now
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-center lg:justify-start gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                    SSL Secure Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-0.5 bg-secondary w-full" />
        </div>

        <p className="text-center mt-4 text-xs text-copy-muted">
          Questions?{" "}
          <Link href="/contact" className="font-bold text-primary hover:text-secondary transition-colors">
            Contact Anneke
          </Link>{" "}
          — we&apos;re happy to help before you buy.
        </p>
      </div>
    </section>
  );
}
