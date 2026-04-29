"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag, ChevronRight, Tag, Shield, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { applyFunnelDiscount } from "@/lib/funnel";
import type { CartItem } from "@/lib/cart-context";

type FunnelApiProduct = {
  id: string;
  name: string;
  slug: string;
  regular_price: number;
  sale_price: number | null;
  primary_image_url: string | null;
  sku: string | null;
};

type FunnelApiStep = {
  index: number;
  title: string;
  description: string;
  discountPercent: 10 | 15 | 20 | 25;
  products: FunnelApiProduct[];
};

type FunnelResponse = {
  enabled: boolean;
  sourceProduct?: { id: string; slug: string; name: string };
  steps: FunnelApiStep[];
};

const fmt = (n: number) => `R ${n.toLocaleString("en-ZA")}`;

function CartSummary({ items, total }: { items: CartItem[]; total: number }) {
  return (
    <div className="bg-white border border-border p-5 sticky top-6">
      <p className="text-xs font-bold uppercase tracking-wider text-copy-muted mb-4 flex items-center gap-2">
        <ShoppingBag className="h-3.5 w-3.5" /> Your order so far
      </p>
      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-primary font-medium truncate flex-1">{item.name}</span>
            <span className="text-copy-muted shrink-0 text-xs">×{item.quantity}</span>
            <span className="font-bold text-primary shrink-0">{fmt(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-copy-muted">Total</span>
          <span className="text-xl font-black text-primary">{fmt(total)}</span>
        </div>
      </div>
      <div className="mt-4 space-y-1.5 text-xs text-copy-muted">
        <div className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-secondary" /> Free delivery over R2,500</div>
        <div className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-secondary" /> SSL secure checkout</div>
      </div>
    </div>
  );
}

export default function FunnelPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { addItem, items, total } = useCart();

  const [loading, setLoading] = useState(true);
  const [funnel, setFunnel] = useState<FunnelResponse | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedByStep, setSelectedByStep] = useState<Record<number, string[]>>({});
  const [quantityByStep, setQuantityByStep] = useState<Record<number, 1 | 2 | 3>>({});

  const hasPrimaryInCart = useMemo(
    () => items.some((item) => item.slug === slug && !item.name.includes("Funnel Offer")),
    [items, slug]
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/funnel/${slug}`, { cache: "no-store" });
      if (!res.ok) {
        router.replace(`/products/${slug}`);
        return;
      }
      const data = (await res.json()) as FunnelResponse;
      if (!data.enabled || data.steps.length === 0) {
        router.replace("/cart");
        return;
      }
      setFunnel(data);
      setLoading(false);
    }
    void load();
  }, [router, slug]);

  useEffect(() => {
    if (!hasPrimaryInCart && !loading) {
      router.replace(`/products/${slug}`);
    }
  }, [hasPrimaryInCart, loading, router, slug]);

  if (loading || !funnel) return null;

  const step = funnel.steps[currentStep];
  if (!step) return null;

  const selectedProductIds = selectedByStep[currentStep] ?? [];
  const selectedProducts = step.products.filter((p) => selectedProductIds.includes(p.id));
  const finalPrice = selectedProducts.reduce(
    (sum, product) => sum + applyFunnelDiscount(product.regular_price, step.discountPercent),
    0
  );

  function goNext() {
    const stepCount = funnel?.steps.length ?? 0;
    if (currentStep < stepCount - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/cart");
  }

  function addSelectedAndContinue() {
    if (selectedProducts.length === 0) return;
    const qty = quantityByStep[currentStep] ?? 1;
    for (const selectedProduct of selectedProducts) {
      for (let i = 0; i < qty; i += 1) {
        addItem({
          id: `${selectedProduct.id}__funnel_${slug}_step${currentStep + 1}`,
          slug: selectedProduct.slug,
          name: `${selectedProduct.name} (Funnel Offer -${step.discountPercent}%)`,
          price: applyFunnelDiscount(selectedProduct.regular_price, step.discountPercent),
          image: selectedProduct.primary_image_url,
          sku: selectedProduct.sku,
        });
      }
    }
    goNext();
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="font-heading text-xl font-black text-primary shrink-0">la.va</Link>
          <div className="hidden sm:flex items-center gap-2 flex-1 justify-center">
            {funnel.steps.map((_, i) => (
              <div
                key={i}
                className={`px-3 py-1 text-xs font-bold ${
                  i === currentStep ? "bg-secondary text-white" : i < currentStep ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"
                }`}
              >
                Step {i + 1}
              </div>
            ))}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-copy-muted font-medium uppercase tracking-wide">Cart total</p>
            <p className="font-black text-primary text-lg leading-none">{fmt(total)}</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">
                Step {currentStep + 1} of {funnel.steps.length}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-primary leading-tight mb-3">
                {step.title || "Complete your setup"}
              </h1>
              {step.description && (
                <p className="text-base text-copy-muted leading-relaxed max-w-xl mb-2">
                  {step.description}
                </p>
              )}
              <div className="mt-4 inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-4 py-2">
                <Tag className="h-4 w-4 text-secondary" />
                <span className="text-sm font-bold text-secondary">
                  Exclusive {step.discountPercent}% off — bundle with your main product
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wide text-copy-muted mb-2">
                Quantity per selected item
              </label>
              <div className="inline-flex items-center gap-2 bg-white border border-border p-2">
                {[1, 2, 3].map((qty) => {
                  const selectedQty = quantityByStep[currentStep] ?? 1;
                  const isActive = selectedQty === qty;
                  return (
                    <button
                      key={qty}
                      type="button"
                      onClick={() =>
                        setQuantityByStep((prev) => ({ ...prev, [currentStep]: qty as 1 | 2 | 3 }))
                      }
                      className={`h-9 min-w-9 px-3 text-sm font-bold border transition-colors ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-primary border-border hover:border-primary"
                      }`}
                    >
                      {qty}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {step.products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                const discounted = applyFunnelDiscount(product.regular_price, step.discountPercent);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      setSelectedByStep((prev) => {
                        const existing = prev[currentStep] ?? [];
                        const next = existing.includes(product.id)
                          ? existing.filter((id) => id !== product.id)
                          : [...existing, product.id];
                        return { ...prev, [currentStep]: next };
                      })
                    }
                    className={`relative text-left border-2 p-4 transition-all duration-200 ${isSelected ? "border-secondary bg-secondary/5 shadow-md" : "border-border bg-white hover:border-primary/40"}`}
                  >
                    <div className={`absolute top-3 right-3 h-5 w-5 flex items-center justify-center ${isSelected ? "bg-secondary" : "bg-gray-100 border border-gray-300"}`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="relative h-28 mb-3 mt-1">
                      {product.primary_image_url ? (
                        <Image src={product.primary_image_url} alt={product.name} fill className="object-contain p-2" sizes="180px" />
                      ) : (
                        <div className="w-full h-full bg-primary/5" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-primary leading-snug mb-2">{product.name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black text-secondary">{fmt(discounted)}</span>
                      <span className="text-xs text-copy-muted line-through">{fmt(product.regular_price)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 pt-6">
              <button
                onClick={addSelectedAndContinue}
                disabled={selectedProducts.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-black py-4 text-base hover:bg-secondary/90 transition-colors disabled:opacity-40"
              >
                <ShoppingBag className="h-5 w-5" />
                {selectedProducts.length > 0
                  ? `Add ${selectedProducts.length * (quantityByStep[currentStep] ?? 1)} item${selectedProducts.length * (quantityByStep[currentStep] ?? 1) > 1 ? "s" : ""} for ${fmt(finalPrice * (quantityByStep[currentStep] ?? 1))}`
                  : "Select one or more products"}
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={goNext}
                className="w-full text-sm font-bold text-copy hover:text-primary transition-colors text-center py-2 border border-border hover:border-primary bg-white"
              >
                No thanks — skip this step
              </button>
            </div>
            <CartSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
}
