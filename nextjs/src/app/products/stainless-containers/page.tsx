import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "ES-Line Stainless Steel Vacuum Containers",
  description:
    "Professional-grade 18/8 stainless steel vacuum containers. Odour-resistant, dishwasher safe, and lifetime durability. Perfect for home and commercial kitchens.",
};

export const revalidate = 3600;

export default async function StainlessSteelContainersPage() {
  let products: Product[] = [];

  try {
    // These products are currently in the 'containers-lids' category but tagged 'stainless-steel'
    products = await getProductsByCategory("containers-lids");
  } catch {
    // Supabase unavailable
  }

  const esLine = products.filter((p) => p.tags?.includes("stainless-steel") && !p.tags?.includes("set"));
  const esLineSets = products.filter((p) => p.tags?.includes("stainless-steel") && p.tags?.includes("set"));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Premium · Lifetime Durability · Professional</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Stainless Steel Vacuum Containers
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Our 18/8 ES-Line containers are 100% odour and stain resistant. 
            Built for professional performance and designed to last a lifetime.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ 100% Odour Resistant</span>
          <span>✓ Dishwasher Safe</span>
          <span>✓ Fits All LAVA Machines</span>
          <span>✓ Professional Grade</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">ES-Line Collection</p>
            <h2 className="text-3xl font-bold text-primary text-balance">The Stainless Steel Range</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Odour-resistant, completely dishwasher safe and built to last a lifetime. 
              Ideal for strong-smelling foods like fish, game, and marinades.
            </p>
          </div>

          {esLineSets.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary">ES-Line Sets</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {esLineSets.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}

          {esLine.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-primary">Individual Containers</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {esLine.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}

          {esLine.length === 0 && esLineSets.length === 0 && (
            <p className="text-copy-muted py-12 text-center bg-gray-50 border border-dashed">
              Products are being imported — please check back shortly.
            </p>
          )}
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
