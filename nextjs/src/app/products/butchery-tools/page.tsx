import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Specialized Butchery Tools — Bone Crushers & Scrapers",
  description:
    "Essential specialized tools for professional meat processing. High-quality bone crushers, rib cutters, and stainless steel board scrapers.",
};

export const revalidate = 3600;

export default async function ButcheryToolsPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("butchery-accessories");
  } catch {
    // Supabase unavailable
  }

  const tools = products.filter((p) => p.tags?.includes("tools"));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Specialized · Heavy-Duty · Professional</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Specialized Butchery Tools
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            The right tool for every specialized task. Professional bone processing, 
            rib cutting, and workstation maintenance essentials.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Stainless Steel</span>
          <span>✓ Precision Impact</span>
          <span>✓ Durable Construction</span>
          <span>✓ Professional Standard</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary text-balance">Workstation Essentials</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
               Increase efficiency and safety with tools designed for specific processing hurdles. 
               Built to last under continuous heavy use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

    </main>
  );
}
