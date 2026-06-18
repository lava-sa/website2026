import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import CategoryReviewBanner from "@/components/reviews/CategoryReviewBanner";

export const metadata: Metadata = {
  title: "Vacuum Sealer for Glass Jars",
  description:
    "Integrated vacuum valve solutions for standard glass jars. Preserve jams, preserves, and dry goods with our specialized glass jar sealer attachments.",
};

export const revalidate = 3600;

export default async function GlassJarSealerPage() {
  let products: Product[] = [];

  try {
    // These products might be in 'containers-lids' or 'accessories'
    products = await getProductsByCategory("containers-lids");
  } catch {
    // Supabase unavailable
  }

  const JAR_SEALER_SLUGS = new Set([
    "lava-flex-sealer-for-jars",
    "glass-jar-vacuum-bell-vl0193",
    "vacuum-sealer-attachment-for-glass-jars-8-9-cm-diameter",
  ]);

  const sealerProducts = products.filter(
    (p) =>
      JAR_SEALER_SLUGS.has(p.slug) ||
      p.tags?.includes("jar-sealer") ||
      p.slug.includes("flex-sealer")
  );

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Sustainable · Zero Waste · Preserves Freshness</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Vacuum Sealer for Glass Jars
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Don&apos;t limit your vacuum sealing to bags. Use our specialized attachments to seal 
            standard commercial jars, perfect for extending the life of jams, honey, and pickles.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Fits Standard Jars</span>
          <span>✓ Airtight Seal in Seconds</span>
          <span>✓ Sustainable Packaging</span>
          <span>✓ Works with All Machines</span>
          <span>✓ Courier — R190 excl. VAT (Gauteng) · R250 elsewhere</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">Preservation Accessories</p>
            <h2 className="text-3xl font-bold text-primary text-balance">Jar Sealing Solutions</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Extend the shelf life of your bottled goods significantly by extracting the air 
              with our patented jar-sealing attachments.
            </p>
          </div>

          {sealerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {sealerProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="py-20 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-xl font-bold text-primary mb-2">Inventory Loading...</h3>
              <p className="text-sm text-copy-muted max-w-xs">
                Run{" "}
                <code className="text-xs bg-surface px-1">023_lava_flex_sealer_for_jars.sql</code>{" "}
                in Supabase if you have not already, then refresh this page.
              </p>
            </div>
          )}
        </div>
      </section>

      <CategoryReviewBanner categorySlug="containers-lids" />

    </main>
  );
}
