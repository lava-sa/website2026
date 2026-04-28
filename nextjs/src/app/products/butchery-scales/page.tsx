import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Precision Butchery Scales — Platform & Hanging",
  description:
    "Professional digital scales for butchery and food processing. High-precision platform scales and heavy-duty hanging scales for every operation.",
};

export const revalidate = 3600;

export default async function ButcheryScalesPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("butchery-accessories");
  } catch {
    // Supabase unavailable
  }

  const scales = products.filter((p) => p.tags?.includes("scale"));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Precision · Reliable · Heavy-Duty</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Precision Butchery Scales
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            From precise recipe preparation to heavy-duty carcass weighing. 
            Accurate, reliable digital scales for every stage of your workflow.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Digital Accuracy</span>
          <span>✓ Stainless Steel Plates</span>
          <span>✓ Up to 300kg Capacity</span>
          <span>✓ Easy-to-Read Displays</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary text-balance">Platform & Hanging Scales</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
               Choose between high-precision benchtop units and heavy-duty hanging scales. 
               Essential for portion control, inventory management, and bulk weighing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {scales.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

    </main>
  );
}
