import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import CategoryReviewBanner from "@/components/reviews/CategoryReviewBanner";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, collectionPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vacuum Accessories — Labels, Fluid Stop, Wine Sealers & More",
  description:
    "LAVA vacuum accessories South Africa — bag labels, fluid stop, bone protection, wine sealers, roll dispenser and manual hand pump. Official June 2026 prices.",
  path: "/products/accessories",
});

export const revalidate = 3600;

export default async function AccessoriesPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("accessories");
  } catch {
    // Supabase unavailable
  }

  const bagAccessories = products.filter((p) => p.tags?.includes("bags") || p.tags?.includes("rolls") || p.tags?.includes("labels"));
  const other = products.filter((p) => !bagAccessories.includes(p));

  const collectionLd = collectionPageSchema({
    name: "Vacuum Accessories",
    description:
      "LAVA vacuum accessories South Africa — bag labels, fluid stop, bone protection, wine sealers, roll dispenser and manual hand pump.",
    url: "/products/accessories",
    items: products.map((p) => ({ name: p.name, url: `/products/${p.slug}`, image: p.primary_image_url })),
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Vacuum Accessories", url: "/products/accessories" },
  ]);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[collectionLd, crumbLd]} />

      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Labels · Fluid Stop · Wine Sealers · More</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Vacuum Accessories
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Everything beyond bags and machines — label your packs, seal moist foods safely,
            reseal wine bottles, cut rolls cleanly and pump containers by hand.
          </p>
        </div>
      </section>

      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Genuine LAVA</span>
          <span>✓ Fits All Machines</span>
          <span>✓ June 2026 Prices</span>
          <span>✓ Courier — R190 excl. VAT (Gauteng) · R250 elsewhere</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container space-y-16">
          {bagAccessories.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Bags &amp; Rolls</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bagAccessories.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {other.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Containers &amp; More</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {other.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}

          {products.length === 0 && (
            <p className="text-copy-muted py-12 text-center bg-gray-50 border border-dashed">
              Run <code className="text-xs bg-surface px-1">028_missing_price_list_products.sql</code> in Supabase, then refresh.
            </p>
          )}
        </div>
      </section>

      <CategoryReviewBanner categorySlug="accessories" />
    </main>
  );
}
