import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "Universal Acrylic Vacuum Lids — LAVA South Africa",
  description:
    "Integrated vacuum valve lids. Transform your existing bowls, jars and containers into vacuum storage solutions. Fits all LAVA vacuum pumps.",
};

export const revalidate = 3600;

export default async function AcrylicLidsPage() {
  let products: Product[] = [];

  try {
    // These products are in the 'containers-lids' category but tagged 'lid'
    products = await getProductsByCategory("containers-lids");
  } catch {
    // Supabase unavailable
  }

  const acrylicLids = products.filter((p) => p.tags?.includes("lid") && (p.tags?.includes("acrylic") || p.name.includes("Acrylic")));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Versatile · BPA-Free · Fits any bowl</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Universal Acrylic Vacuum Lids
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Transform any container into a vacuum storage solution in seconds. 
            Integrated valve system works with all LAVA vacuum machines and pumps.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Integrated Valve</span>
          <span>✓ Dishwasher Safe</span>
          <span>✓ Fits All LAVA Machines</span>
          <span>✓ Universal Fitment</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">Replacement & Universal</p>
            <h2 className="text-3xl font-bold text-primary text-balance">Acrylic Vacuum Lids</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Lost or damaged a lid? Or simply want to vacuum-seal your favorite kitchenware. 
              These premium lids include the integrated LAVA vacuum valve.
            </p>
          </div>

          {acrylicLids.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {acrylicLids.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-copy-muted py-12 text-center bg-gray-50 border border-dashed">
              Universal lids are being updated — please check back shortly.
            </p>
          )}
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
