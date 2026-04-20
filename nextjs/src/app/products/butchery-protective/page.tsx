import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "Protective Clothing — Cut-Resistant Gloves & PVC Aprons | LAVA South Africa",
  description:
    "Safety first in the butchery. Level 5 cut-resistant gloves and waterproof PVC aprons. Professional protective gear for hunters, farmers, and butchers.",
};

export const revalidate = 3600;

export default async function ButcheryProtectivePage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("butchery-accessories");
  } catch {
    // Supabase unavailable
  }

  const protective = products.filter((p) => p.tags?.includes("protective"));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Safety First · Hygienic · Professional</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Protective Butchery Clothing
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Stay protected during every stage of processing. Level 5 cut-resistance 
            and waterproof barrier protection for professional safety standards.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Level 5 Cut Resistance</span>
          <span>✓ Waterproof PVC</span>
          <span>✓ Easy to Sanitize</span>
          <span>✓ Comfortable Fit</span>
          <span>✓ Free Delivery over R2,000</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary text-balance">Safety & Hygiene Gear</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
               Essential equipment for safe, hygienic meat processing. 
               Protect yourself and maintain the highest standards of food safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {protective.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          
          <div className="mt-12 bg-surface p-8 border border-primary/10 max-w-2xl mx-auto text-center">
            <p className="text-sm font-bold text-primary mb-2 uppercase tracking-wide">⚠ Safety Guideline</p>
            <p className="text-xs text-copy-muted leading-relaxed">
              Level 5 (EN388) is the highest cut-resistance rating. Our gloves are reversible to fit either hand. 
              Always ensure proper cleaning with 60°C machine wash for hygiene.
            </p>
          </div>
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
