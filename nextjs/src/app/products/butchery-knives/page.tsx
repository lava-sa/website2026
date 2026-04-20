import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "Butchery Knives — German Giesser Quality | LAVA South Africa",
  description:
    "Professional-grade German butchery knives. From gutting and boning to skinning and portioning. High-carbon stainless steel with ergonomic wet-grip handles.",
};

export const revalidate = 3600;

export default async function ButcheryKnivesPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("butchery-accessories");
  } catch {
    // Supabase unavailable
  }

  const knives = products.filter((p) => p.tags?.includes("knife") && !p.tags?.includes("magnetic-holder") && !p.tags?.includes("magnetic-board") && !p.tags?.includes("sharpener"));
  const knifeStorage = products.filter((p) => p.tags?.includes("knife") && (p.tags?.includes("magnetic-holder") || p.tags?.includes("magnetic-board") || p.tags?.includes("sharpener")));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">German Engineered · Giesser · Professional</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Professional Butchery Knives
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Experience the precision of German Giesser blades. 
            High-carbon stainless steel designed specifically for the rigorous demands of professional butchery.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Giesser Germany</span>
          <span>✓ Ergonomic Wet-Grip</span>
          <span>✓ High-Carbon Stainless Steel</span>
          <span>✓ Easy to Sharpen</span>
          <span>✓ Free Delivery over R2,000</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">Giesser Collection</p>
            <h2 className="text-3xl font-bold text-primary text-balance">The Knife Range</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              From field dressing and skinning to precise portioning. 
              Built for hunters, farmers, and professional butchers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {knives.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {knifeStorage.length > 0 && (
            <>
              <div className="mb-8 pt-10 border-t border-border">
                <p className="overline mb-2">Edge Maintenance</p>
                <h3 className="text-2xl font-bold text-primary">Sharpeners & Storage</h3>
                <p className="mt-3 text-copy-muted max-w-lg">
                   Keep your blades in peak condition with professional steels and safe magnetic storage options.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {knifeStorage.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
