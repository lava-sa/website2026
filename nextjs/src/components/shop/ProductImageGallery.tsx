"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/types/product";

interface Props {
  images: ProductImage[];
  productName: string;
}

const THUMB_VISIBLE = 4;

export default function ProductImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  if (!images.length) return null;

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  const canScrollLeft  = thumbOffset > 0;
  const canScrollRight = thumbOffset + THUMB_VISIBLE < images.length;

  const scrollThumbs = (dir: "left" | "right") => {
    setThumbOffset((o) =>
      dir === "right"
        ? Math.min(o + 1, images.length - THUMB_VISIBLE)
        : Math.max(o - 1, 0)
    );
  };

  const visibleThumbs = images.slice(thumbOffset, thumbOffset + THUMB_VISIBLE);

  return (
    <div className="flex flex-col gap-3">

      {/* ── Main image ─────────────────────────────────────────────── */}
      <div className="relative aspect-square bg-white border border-border overflow-hidden group">
        <Image
          src={images[active].url}
          alt={images[active].alt || productName}
          fill
          className="object-contain transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white border border-border
                         flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100
                         transition-opacity hover:bg-primary hover:text-white hover:border-primary">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={next} aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-white border border-border
                         flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100
                         transition-opacity hover:bg-primary hover:text-white hover:border-primary">
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* ── Thumbnails (max 4 visible + scroll) ────────────────────── */}
      {images.length > 1 && (
        <div className="flex items-stretch gap-2" ref={thumbRef}>

          {/* Scroll left */}
          <button
            onClick={() => scrollThumbs("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll thumbnails left"
            className="w-8 flex items-center justify-center border border-border bg-white
                       shrink-0 disabled:opacity-20 hover:bg-primary hover:text-white hover:border-primary
                       transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Visible thumbnails */}
          <div className="flex gap-2 flex-1">
            {visibleThumbs.map((img, i) => {
              const realIdx = thumbOffset + i;
              return (
                <button
                  key={img.id}
                  onClick={() => setActive(realIdx)}
                  aria-label={`View image ${realIdx + 1}`}
                  className={`relative aspect-square flex-1 border-2 overflow-hidden bg-white transition-all
                    \${realIdx === active
                      ? "border-primary"
                      : "border-border hover:border-primary/60"
                    }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${productName} ${realIdx + 1}`}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </button>
              );
            })}
            {/* Pad to 4 slots if fewer images visible */}
            {visibleThumbs.length < THUMB_VISIBLE &&
              Array.from({ length: THUMB_VISIBLE - visibleThumbs.length }).map((_, i) => (
                <div key={`pad-\${i}`} className="flex-1 aspect-square border border-dashed border-border/30" />
              ))
            }
          </div>

          {/* Scroll right */}
          <button
            onClick={() => scrollThumbs("right")}
            disabled={!canScrollRight}
            aria-label="Scroll thumbnails right"
            className="w-8 flex items-center justify-center border border-border bg-white
                       shrink-0 disabled:opacity-20 hover:bg-primary hover:text-white hover:border-primary
                       transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

        </div>
      )}

    </div>
  );
}
