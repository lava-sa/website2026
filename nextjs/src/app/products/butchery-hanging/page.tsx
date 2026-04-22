import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "Stainless Steel Hanging Systems — S-Hooks & Gambrels",
  description:
    "Professional stainless steel hanging systems for game and livestock. Corrosion-resistant S-Hooks, Swivel Hooks, and Gambrel spreaders for precise meat processing.",
};

export const revalidate = 3600;

export default async function ButcheryHangingPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("butchery-accessories");
  } catch {
    // Supabase unavailable
  }

  const hanging = products.filter((p) => p.tags?.includes("hanging"));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Stainless Steel · Durable · Professional</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Butchery Hanging Systems
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Corrosion-resistant stainless steel solutions for secure game processing. 
            From single hooks to heavy-duty adjustable spreaders.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ 100% Stainless Steel</span>
          <span>✓ Heavy-Duty Ratings</span>
          <span>✓ Corrosion Resistant</span>
          <span>✓ Professional Standard</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary text-balance">Meat Hooks & Spreaders</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
               Everything you need to hang and process game cleanly and safely. 
               All components are built to handle professional weight capacities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hanging.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
