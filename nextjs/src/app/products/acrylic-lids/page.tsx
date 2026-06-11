import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Universal Acrylic Vacuum Lids",
  description:
    "Integrated vacuum valve lids. Transform your existing bowls, jars and containers into vacuum storage solutions. Fits all LAVA vacuum pumps.",
};

export const revalidate = 3600;

/** All five universal lid sizes — smallest to largest */
const LID_SLUG_ORDER = [
  "acrylic-container-lid-47-112mm",
  "acrylic-container-lid-76-143mm",
  "acrylic-container-lid-160-203mm",
  "acrylic-container-lid-204-237mm",
  "acrylic-container-lid-238-280mm",
] as const;

const LID_SLUGS = new Set<string>(LID_SLUG_ORDER);

export default async function AcrylicLidsPage() {
  let products: Product[] = [];

  try {
    // These products are in the 'containers-lids' category but tagged 'lid'
    products = await getProductsByCategory("containers-lids");
  } catch {
    // Supabase unavailable
  }

  const acrylicLids = products
    .filter(
      (p) =>
        LID_SLUGS.has(p.slug) ||
        (p.tags?.includes("lid") && (p.tags?.includes("acrylic") || p.name.includes("Acrylic")))
    )
    .sort((a, b) => {
      const ai = LID_SLUG_ORDER.indexOf(a.slug as (typeof LID_SLUG_ORDER)[number]);
      const bi = LID_SLUG_ORDER.indexOf(b.slug as (typeof LID_SLUG_ORDER)[number]);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

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
          <span>✓ Courier — R190 excl. VAT (Gauteng) · R250 elsewhere</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">Replacement & Universal</p>
            <h2 className="text-3xl font-bold text-primary text-balance">Acrylic Vacuum Lids</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Five sizes from small jars to large bowls — seal almost any container with a smooth,
              flat rim. Each lid includes the integrated LAVA vacuum valve.
            </p>
          </div>

          {acrylicLids.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {acrylicLids.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-copy-muted py-12 text-center bg-gray-50 border border-dashed">
              Run{" "}
              <code className="text-xs bg-surface px-1">024_universal_lids_small_sizes.sql</code>{" "}
              in Supabase if you have not already, then refresh this page.
            </p>
          )}
        </div>
      </section>

    </main>
  );
}
