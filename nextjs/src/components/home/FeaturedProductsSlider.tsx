"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import type { Product } from "@/types/product";

interface Props {
  products: Product[];
}

export default function FeaturedProductsSlider({ products }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  function slide(direction: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => slide("left")}
          aria-label="Scroll featured products left"
          className="inline-flex h-10 w-10 items-center justify-center border border-border bg-white text-primary transition-colors hover:border-primary hover:bg-primary/5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => slide("right")}
          aria-label="Scroll featured products right"
          className="inline-flex h-10 w-10 items-center justify-center border border-border bg-white text-primary transition-colors hover:border-primary hover:bg-primary/5"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-0 shrink-0 basis-[85%] snap-start sm:basis-[48%] lg:basis-[31%] xl:basis-[23%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
