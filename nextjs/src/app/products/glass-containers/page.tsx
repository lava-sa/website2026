import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "G-Line Glass Vacuum Containers",
  description:
    "Premium heat-resistant G-Line glass vacuum containers. Perfect for the oven, microwave, and deep-freeze. 100% airtight and odour resistant.",
};

export const revalidate = 3600;

export default async function GlassContainersPage() {
  let products: Product[] = [];

  try {
    // Glass products might be in 'containers-lids' or 'accessories' or a new 'glass' category
    // For now, we search 'containers-lids' for the 'glass' tag
    products = await getProductsByCategory("containers-lids");
  } catch {
    // Supabase unavailable
  }

  const glassProducts = products.filter((p) => 
    p.tags?.includes("glass") || 
    p.name.toLowerCase().includes("glass") ||
    p.slug.includes("glass")
  );

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Heat Resistant · Freezer Safe · Sustainable</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Glass Vacuum Containers
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            The ultimate in versatile food storage. Our G-Line glass containers are 
            heat-resistant, dishwasher safe, and transition perfectly from the freezer to the oven.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Oven & Microwave Safe</span>
          <span>✓ Borosilicate Glass</span>
          <span>✓ Fits All LAVA Machines</span>
          <span>✓ 100% Odour Resistant</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">G-Line Collection</p>
            <h2 className="text-3xl font-bold text-primary text-balance">Premium Glass Range</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Experience the highest standard of vacuum storage. LAVA Glass containers are 
              ideal for long-term preservation and professional food presentation.
            </p>
          </div>

          {glassProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {glassProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="py-20 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-xl font-bold text-primary mb-2">Inventory Loading...</h3>
              <p className="text-sm text-copy-muted max-w-xs">
                We are currently importing the latest G-Line glass container stock into the new system. 
                Please check back in a few moments.
              </p>
            </div>
          )}
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
