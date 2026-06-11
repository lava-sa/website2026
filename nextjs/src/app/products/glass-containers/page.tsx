import Link from "next/link";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, collectionPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vacuum Glass Containers",
  description:
    "Premium heat-resistant G-Line glass vacuum containers and the LAVA Easy Pump. Vacuum-seal without a machine — oven, microwave and freezer safe.",
  path: "/products/glass-containers",
});

export const revalidate = 3600;

const GLASS_PRODUCT_SLUGS = new Set([
  "electric-vacuum-pump",
  "g-line-glass-vacuum-container-black",
  "g-line-glass-vacuum-container-white",
]);

/** G-Line glass + Easy Pump only — jar sealers live on /products/glass-jar-sealer */
function isGlassRangeProduct(p: Product) {
  return GLASS_PRODUCT_SLUGS.has(p.slug);
}

export default async function GlassContainersPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("containers-lids");
  } catch {
    // Supabase unavailable
  }

  const glassProducts = products.filter(isGlassRangeProduct);

  const jsonLd = [
    collectionPageSchema({
      name: "G-Line Glass Vacuum Containers",
      description:
        "Premium heat-resistant G-Line glass vacuum containers and the LAVA Easy Pump. Vacuum-seal without a machine.",
      url: "/products/glass-containers",
      image: "/images/og-fallback/og-containers.jpg",
    }),
    breadcrumbSchema([
      { name: "Products", url: "/products" },
      { name: "Containers & Lids", url: "/products/containers-lids" },
      { name: "Vacuum Glass Containers", url: "/products/glass-containers" },
    ]),
  ];

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Heat Resistant · Freezer Safe · Sustainable</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Glass Vacuum Containers
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            G-Line borosilicate glass containers pair with the rechargeable{" "}
            <strong className="text-white">Easy Pump</strong> — vacuum-seal portions without
            needing your sealer at the bench. Ideal for marinating, meal prep and fridge storage.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Oven & Microwave Safe</span>
          <span>✓ Borosilicate Glass</span>
          <span>✓ Easy Pump Compatible</span>
          <span>✓ 100% Odour Resistant</span>
          <span>✓ Courier — R190 excl. VAT (Gauteng) · R250 elsewhere</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">G-Line Collection</p>
            <h2 className="text-3xl font-bold text-primary text-balance">Premium Glass Range</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              The Easy Pump works hand in hand with G-Line glass — no vacuum sealer machine required.
              Choose black or white lid containers, then add the pump to seal at the push of a button.
            </p>
          </div>

          {glassProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {glassProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-20 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-xl font-bold text-primary mb-2">Products loading</h3>
              <p className="text-sm text-copy-muted max-w-md">
                Run{" "}
                <code className="text-xs bg-surface px-1">022_gline_pump_to_containers.sql</code> in
                Supabase if you have not already, then refresh this page.
              </p>
            </div>
          )}

          <p className="text-sm text-copy-muted">
            Also browse{" "}
            <Link href="/products/glass-jar-sealer" className="font-semibold text-primary hover:text-secondary">
              glass jar sealers
            </Link>
            ,{" "}
            <Link href="/products/acrylic-lids" className="font-semibold text-primary hover:text-secondary">
              acrylic lids
            </Link>
            , and{" "}
            <Link href="/products/containers-lids" className="font-semibold text-primary hover:text-secondary">
              all containers & lids
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
