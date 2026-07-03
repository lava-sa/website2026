"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReviewsNavDropdownItem = {
  slug: string;
  label: string;
  reviewCount: number;
};

type Props = {
  label: string;
  href: string;
  active: boolean;
  width?: string;
  items: ReviewsNavDropdownItem[];
  activeProduct?: string;
  itemHref: (slug: string) => string;
};

export default function ReviewsNavDropdown({
  label,
  href,
  active,
  width = "w-72",
  items,
  activeProduct,
  itemHref,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleOutside, true);
    document.addEventListener("touchstart", handleOutside, true);
    return () => {
      document.removeEventListener("click", handleOutside, true);
      document.removeEventListener("touchstart", handleOutside, true);
    };
  }, [open]);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && ref.current?.contains(next)) return;
        setOpen(false);
      }}
    >
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.12em] uppercase py-3 transition-colors",
          active ? "text-secondary" : "text-white hover:text-secondary"
        )}
        onClick={() => setOpen(false)}
      >
        {label}
        <ChevronDown
          className={cn("h-2.5 w-2.5 opacity-50 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </Link>
      <div
        className={cn(
          "absolute top-full left-0 bg-white shadow-2xl border border-border/80 z-[500]",
          "transition-all duration-200 ease-out max-h-80 overflow-y-auto",
          width,
          open
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "invisible opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <ul className="py-2">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={itemHref(item.slug)}
                className={cn(
                  "block px-5 py-2.5 text-[13px] font-medium transition-colors",
                  activeProduct === item.slug
                    ? "bg-secondary/10 text-secondary font-bold"
                    : "text-copy hover:text-secondary hover:bg-gray-50/80"
                )}
              >
                {item.label}
                <span className="text-copy-muted text-xs ml-2">({item.reviewCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
