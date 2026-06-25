"use client";

import { useEffect } from "react";
import {
  clearJanetPageContext,
  setJanetPageContext,
  type JanetPageProduct,
} from "@/lib/janet-page-context";

/** Injects authoritative product metadata so Janet knows which page the visitor is on. */
export default function JanetPageContextBridge({ product }: { product: JanetPageProduct }) {
  useEffect(() => {
    setJanetPageContext(product);
    return () => clearJanetPageContext(product.slug);
  }, [product]);

  return (
    <span
      data-janet-product={JSON.stringify(product)}
      className="sr-only"
      aria-hidden
    />
  );
}
