"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Check, ShoppingBag, ChevronRight, Tag, Shield, Truck, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-context";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — change this one number and all funnel discounts update automatically
// ⚠️  Anneke & Wilco to confirm the 20% figure before go-live
// ─────────────────────────────────────────────────────────────────────────────
const FUNNEL_DISCOUNT = 0.20;
const disc = (price: number) => Math.round(price * (1 - FUNNEL_DISCOUNT));
const fmt  = (n: number)     => `R ${n.toLocaleString("en-ZA")}`;

// ─────────────────────────────────────────────────────────────────────────────
// FUNNEL PRODUCT DATA
// Images: bags/rolls = placeholder until Anneke supplies no-bg images
// Prices: ⚠️  Anneke to confirm all accessory pricing
// ─────────────────────────────────────────────────────────────────────────────
interface FunnelProduct {
  id: string;
  name: string;
  tagline: string;
  regularPrice: number;
  image: string | null;
  sku: string;
  badge?: string;
  recommended?: boolean;
  sizes?: string[];
}

interface FunnelStep {
  stepNumber: number;
  theme: string;
  eyebrow: string;
  headline: string;
  body: string;
  type: "multi" | "single" | "sized";
  products: FunnelProduct[];
  orderBump?: FunnelProduct;
}

const STEPS: FunnelStep[] = [
  {
    stepNumber: 1,
    theme: "bags",
    eyebrow: "Step 1 of 3 — Bags & Rolls",
    headline: "Your machine needs quality bags.",
    body: "LAVA embossed bags and rolls are engineered specifically for your machine — the right seal width, the right thickness, the right texture. Pick any combination below at 20% off.",
    type: "multi",
    products: [
      {
        id: "funnel-bags-medium",
        name: "Embossed Bags — Medium (20×30cm)",
        tagline: "Perfect for steaks, game meat & biltong. 50 bags per box.",
        regularPrice: 349,
        image: null, // ← replace with /images/products/... when Anneke provides no-bg image
        sku: "BAGS-MED",
        recommended: true,
        badge: "Most Popular",
      },
      {
        id: "funnel-rolls-20",
        name: "Vacuum Rolls — 20cm × 6m",
        tagline: "Cut to any size or shape. Ideal for irregular portions.",
        regularPrice: 299,
        image: null,
        sku: "ROLLS-20",
      },
      {
        id: "funnel-rolls-30",
        name: "Vacuum Rolls — 30cm × 6m",
        tagline: "Larger cuts, whole fish & roasts. Maximum flexibility.",
        regularPrice: 399,
        image: null,
        sku: "ROLLS-30",
        badge: "Best Value",
      },
    ],
  },
  {
    stepNumber: 2,
    theme: "apron",
    eyebrow: "Step 2 of 3 — Protection",
    headline: "Protect yourself while you work.",
    body: "A quality machine deserves a quality workspace. Our professional apron is waterproof, bloodproof and machine-washable — built for butchery, biltong prep and processing.",
    type: "sized",
    products: [
      {
        id: "funnel-apron",
        name: "Professional Butcher Apron",
        tagline: "Heavy-duty PVC + cotton. Waterproof, machine washable. Adjustable straps.",
        regularPrice: 549,  // ⚠️  Anneke to confirm
        image: null,        // ← replace when apron image available
        sku: "APRON",
        sizes: ["S", "M", "L", "XL"],
      },
    ],
    orderBump: {
      id: "funnel-gloves-set",
      name: "Cut-Resistant Gloves — Level 5",
      tagline: "Includes S, M & L. Slash-resistant protection for processing.",
      regularPrice: 850,  // ⚠️  Anneke to confirm (set of 3)
      image: "/images/products/butchery/professional-cut-resistant-gloves-medium-level-5-protection.webp",
      sku: "GLOVES-SET",
    },
  },
  {
    stepNumber: 3,
    theme: "knives",
    eyebrow: "Step 3 of 3 — Complete Your Kit",
    headline: "Professional knives. One decision.",
    body: "The most-requested add-on with every machine order. German-quality blades that stay sharp, cut clean and make the whole process faster.",
    type: "single",
    products: [
      {
        id: "funnel-knife-boning",
        name: "Boning Knife — 13cm",
        tagline: "Premium chrome-molybdenum. The one knife every meat processor needs.",
        regularPrice: 380,  // ⚠️  Anneke to confirm
        image: "/images/products/butchery/professional-boning-knife-premium-13cm-blade-butcher-quality.webp",
        sku: "KNIFE-BONE-13",
      },
      {
        id: "funnel-knife-butcher",
        name: "Butcher Knife — 21cm",
        tagline: "Heavy-duty blade for large cuts, portioning and trimming.",
        regularPrice: 480,  // ⚠️  Anneke to confirm
        image: "/images/products/butchery/professional-butcher-cutting-knife-premium-21cm-blade-heavy-duty.webp",
        sku: "KNIFE-BUTCH-21",
        recommended: true,
      },
      {
        id: "funnel-knife-bundle",
        name: "Knife Bundle — Boning + Butcher",
        tagline: "Both knives. One price. The complete professional cutting solution.",
        regularPrice: 760,  // ⚠️  Anneke to confirm (should be < sum of both)
        image: "/images/products/butchery/professional-butcher-cutting-knife-premium-21cm-blade-heavy-duty.webp",
        sku: "KNIFE-BUNDLE",
        badge: "Best Value",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT IMAGE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-primary/5">
        <Tag className="h-10 w-10 text-primary/20" />
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} fill className="object-contain p-2" sizes="180px" />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — MULTI-SELECT BAGS
// ─────────────────────────────────────────────────────────────────────────────
function BagsStep({
  step, selected, toggle, onContinue, onSkip, cartTotal,
}: {
  step: FunnelStep;
  selected: Set<string>;
  toggle: (id: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  cartTotal: number;
}) {
  const selectedTotal = step.products
    .filter((p) => selected.has(p.id))
    .reduce((sum, p) => sum + disc(p.regularPrice), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {step.products.map((product) => {
          const isSelected = selected.has(product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => toggle(product.id)}
              className={`relative text-left border-2 p-4 transition-all duration-200 ${
                isSelected
                  ? "border-secondary bg-secondary/5 shadow-md"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              {/* Selected tick */}
              <div className={`absolute top-3 right-3 h-5 w-5 flex items-center justify-center transition-all ${
                isSelected ? "bg-secondary" : "bg-gray-100 border border-gray-300"
              }`}>
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>

              {product.badge && (
                <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
                  {product.badge}
                </span>
              )}

              <div className="relative h-28 mb-3 mt-1">
                <ProductImage src={product.image} alt={product.name} />
              </div>

              <p className="text-sm font-bold text-primary leading-snug mb-1">{product.name}</p>
              <p className="text-xs text-copy-muted leading-relaxed mb-3">{product.tagline}</p>

              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-secondary">{fmt(disc(product.regularPrice))}</span>
                <span className="text-xs text-copy-muted line-through">{fmt(product.regularPrice)}</span>
                <span className="text-[9px] font-black text-secondary bg-secondary/10 px-1.5 py-0.5 ml-auto">
                  SAVE {fmt(product.regularPrice - disc(product.regularPrice))}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={onContinue}
          disabled={selected.size === 0}
          className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-black py-4 text-base hover:bg-secondary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-5 w-5" />
          {selected.size > 0
            ? `Yes! Add ${selected.size} item${selected.size > 1 ? "s" : ""} — ${fmt(selectedTotal)} (20% off)`
            : "Select items above to add them"}
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={onSkip}
          className="text-sm text-copy-muted hover:text-primary transition-colors text-center py-1"
        >
          No thanks, I already have bags — skip this step →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — SIZED PRODUCT + ORDER BUMP
// ─────────────────────────────────────────────────────────────────────────────
function SizedStep({
  step, onContinue, onSkip,
}: {
  step: FunnelStep;
  onContinue: (product: FunnelProduct, size: string | null, bump: boolean) => void;
  onSkip: () => void;
}) {
  const product = step.products[0];
  const [size, setSize] = useState<string | null>(product.sizes?.[1] ?? null);
  const [addBump, setAddBump] = useState(false);

  const total = disc(product.regularPrice) + (addBump && step.orderBump ? disc(step.orderBump.regularPrice) : 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Product card */}
        <div className="border border-border bg-white p-5">
          <div className="relative h-48 mb-4">
            <ProductImage src={product.image} alt={product.name} />
          </div>
          <h3 className="font-bold text-primary text-lg leading-snug mb-1">{product.name}</h3>
          <p className="text-sm text-copy-muted leading-relaxed mb-4">{product.tagline}</p>

          {/* Size picker */}
          {product.sizes && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-copy mb-2">Select your size:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`h-10 w-14 text-sm font-bold border-2 transition-all ${
                      size === s
                        ? "border-secondary bg-secondary text-white"
                        : "border-border text-primary hover:border-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-baseline gap-3 pt-3 border-t border-border">
            <span className="text-2xl font-black text-secondary">{fmt(disc(product.regularPrice))}</span>
            <span className="text-sm text-copy-muted line-through">{fmt(product.regularPrice)}</span>
            <span className="text-xs font-black text-white bg-secondary px-2 py-0.5">20% OFF</span>
          </div>
        </div>

        {/* Why you want it */}
        <div className="flex flex-col gap-4 justify-center">
          {[
            "Waterproof & bloodproof — keeps your workspace clean",
            "Machine washable — stays fresh after heavy use",
            "Adjustable neck & waist straps — one size fits well",
            "Comes with apron pocket for small tools",
          ].map((point) => (
            <div key={point} className="flex items-start gap-3">
              <div className="h-5 w-5 bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-secondary" />
              </div>
              <p className="text-sm text-copy leading-snug">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order bump — gloves */}
      {step.orderBump && (
        <button
          type="button"
          onClick={() => setAddBump((b) => !b)}
          className={`w-full flex items-start gap-4 p-4 border-2 border-dashed transition-all text-left ${
            addBump ? "border-secondary bg-secondary/5" : "border-border hover:border-primary/40 bg-white"
          }`}
        >
          <div className={`h-5 w-5 border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
            addBump ? "border-secondary bg-secondary" : "border-gray-300"
          }`}>
            {addBump && <Check className="h-3 w-3 text-white" />}
          </div>
          <div className="relative h-14 w-14 shrink-0">
            <Image
              src={step.orderBump.image!}
              alt={step.orderBump.name}
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-wider text-secondary mb-0.5">
              Add-on — tick to include
            </p>
            <p className="font-bold text-primary text-sm leading-snug">{step.orderBump.name}</p>
            <p className="text-xs text-copy-muted mt-0.5">{step.orderBump.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-black text-secondary">{fmt(disc(step.orderBump.regularPrice))}</p>
            <p className="text-xs text-copy-muted line-through">{fmt(step.orderBump.regularPrice)}</p>
          </div>
        </button>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => onContinue(product, size, addBump)}
          disabled={!size}
          className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-black py-4 text-base hover:bg-secondary/90 transition-colors disabled:opacity-40"
        >
          <ShoppingBag className="h-5 w-5" />
          Yes! Add {addBump ? "apron + gloves" : "apron"} — {fmt(total)} (20% off)
          <ChevronRight className="h-4 w-4" />
        </button>
        <button onClick={onSkip} className="text-sm text-copy-muted hover:text-primary transition-colors text-center py-1">
          No thanks, skip this step →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — SINGLE-SELECT KNIVES
// ─────────────────────────────────────────────────────────────────────────────
function KnivesStep({
  step, onContinue, onSkip,
}: {
  step: FunnelStep;
  onContinue: (product: FunnelProduct) => void;
  onSkip: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(
    step.products.find((p) => p.recommended)?.id ?? null
  );

  const selectedProduct = step.products.find((p) => p.id === selected);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {step.products.map((product) => {
          const isSelected = selected === product.id;
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => setSelected(product.id)}
              className={`relative text-left border-2 p-4 transition-all duration-200 ${
                isSelected
                  ? "border-secondary bg-secondary/5 shadow-md"
                  : "border-border bg-white hover:border-primary/40"
              }`}
            >
              {product.badge && (
                <span className="absolute top-3 left-3 bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
                  {product.badge}
                </span>
              )}
              {product.recommended && (
                <span className="absolute top-3 right-3 bg-primary text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5">
                  Popular
                </span>
              )}

              <div className="relative h-36 mb-3">
                <ProductImage src={product.image} alt={product.name} />
              </div>

              <p className="text-sm font-bold text-primary leading-snug mb-1">{product.name}</p>
              <p className="text-xs text-copy-muted leading-relaxed mb-3">{product.tagline}</p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-black text-secondary">{fmt(disc(product.regularPrice))}</span>
                <span className="text-xs text-copy-muted line-through">{fmt(product.regularPrice)}</span>
              </div>

              {/* Selection indicator */}
              <div className={`absolute bottom-3 right-3 h-5 w-5 flex items-center justify-center border-2 transition-all ${
                isSelected ? "bg-secondary border-secondary" : "border-gray-300"
              }`}>
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => selectedProduct && onContinue(selectedProduct)}
          disabled={!selected}
          className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-black py-4 text-base hover:bg-secondary/90 transition-colors disabled:opacity-40"
        >
          <ShoppingBag className="h-5 w-5" />
          {selectedProduct
            ? `Yes! Add ${selectedProduct.name} — ${fmt(disc(selectedProduct.regularPrice))}`
            : "Select a knife above"}
          <ChevronRight className="h-4 w-4" />
        </button>
        <button onClick={onSkip} className="text-sm text-copy-muted hover:text-primary transition-colors text-center py-1">
          No thanks, go straight to checkout →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CART SUMMARY SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNNEL PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function FunnelPage() {
  const params        = useParams();
  const router        = useRouter();
  const { addItem, items, total } = useCart();
  const slug          = params.slug as string;

  const [currentStep, setCurrentStep] = useState(0); // 0-based index into STEPS
  const [addedItems,  setAddedItems]  = useState<string[]>([]);

  // State for step 1 multi-select
  const [bagsSelected, setBagsSelected] = useState<Set<string>>(new Set());

  const step = STEPS[currentStep];

  const advance = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/cart");
    }
  };

  const addToCart = (product: FunnelProduct, size?: string | null) => {
    const name = size ? `${product.name} — Size ${size}` : product.name;
    addItem({
      id:    product.id,
      slug:  product.sku,
      name:  `${name} ★ Funnel Price`,
      price: disc(product.regularPrice),
      image: product.image,
      sku:   product.sku,
    });
    setAddedItems((prev) => [...prev, product.id]);
  };

  // ── Step handlers ──────────────────────────────────────────
  const handleBagsContinue = () => {
    STEPS[0].products
      .filter((p) => bagsSelected.has(p.id))
      .forEach((p) => addToCart(p));
    advance();
  };

  const handleApronContinue = (product: FunnelProduct, size: string | null, withBump: boolean) => {
    addToCart(product, size);
    if (withBump && STEPS[1].orderBump) addToCart(STEPS[1].orderBump);
    advance();
  };

  const handleKnifeContinue = (product: FunnelProduct) => {
    addToCart(product);
    advance();
  };

  const progress = Math.round(((currentStep) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Funnel header — no nav links (distraction-free) ──── */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="font-heading text-xl font-black text-primary shrink-0">
            la.va
          </Link>

          {/* Step pills */}
          <div className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            {["Machine", "Bags & Rolls", "Protection", "Knives"].map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                <div className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold transition-all ${
                  i === 0
                    ? "bg-emerald-100 text-emerald-700"
                    : i === currentStep + 1
                    ? "bg-secondary text-white"
                    : i < currentStep + 1
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {(i === 0 || i <= currentStep) && <Check className="h-3 w-3" />}
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Cart total */}
          <div className="text-right shrink-0">
            <p className="text-[10px] text-copy-muted font-medium uppercase tracking-wide">Cart total</p>
            <p className="font-black text-primary text-lg leading-none">{fmt(total)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-secondary transition-all duration-500"
            style={{ width: `${Math.max(10, ((currentStep + 1) / (STEPS.length + 1)) * 100)}%` }}
          />
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: funnel step */}
          <div className="lg:col-span-2">

            {/* Step header */}
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-2">
                {step.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-primary leading-tight mb-3">
                {step.headline}
              </h1>
              <p className="text-base text-copy-muted leading-relaxed max-w-xl">
                {step.body}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-4 py-2">
                <Tag className="h-4 w-4 text-secondary" />
                <span className="text-sm font-bold text-secondary">
                  Exclusive 20% off — machine buyers only
                </span>
              </div>
            </div>

            {/* Step content */}
            {currentStep === 0 && (
              <BagsStep
                step={step}
                selected={bagsSelected}
                toggle={(id) => setBagsSelected((prev) => {
                  const next = new Set(prev);
                  next.has(id) ? next.delete(id) : next.add(id);
                  return next;
                })}
                onContinue={handleBagsContinue}
                onSkip={advance}
                cartTotal={total}
              />
            )}

            {currentStep === 1 && (
              <SizedStep
                step={step}
                onContinue={handleApronContinue}
                onSkip={advance}
              />
            )}

            {currentStep === 2 && (
              <KnivesStep
                step={step}
                onContinue={handleKnifeContinue}
                onSkip={advance}
              />
            )}
          </div>

          {/* Right: cart summary */}
          <div className="hidden lg:block">
            <CartSummary items={items} total={total} />
          </div>

        </div>
      </div>

      {/* ── Mobile cart bar ───────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-secondary" />
          <span className="text-sm font-bold text-primary">{fmt(total)}</span>
          <span className="text-xs text-copy-muted">in cart</span>
        </div>
        <Link href="/cart" className="text-xs font-bold text-secondary underline">
          View cart
        </Link>
      </div>

      {/* ── Footer note ───────────────────────────────────────── */}
      <div className="text-center py-8 pb-20 lg:pb-8">
        <p className="text-xs text-copy-muted">
          ⚠️ Funnel prices are 20% off regular pricing — applied to these items only.
          Machine price is unaffected. Prices to be confirmed by Lava South Africa.
        </p>
        <Link href="/cart" className="text-xs text-secondary font-bold mt-2 inline-block hover:underline">
          Skip all steps and go to cart →
        </Link>
      </div>

    </div>
  );
}
