import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, collectionPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vacuum Containers & Lids — Acrylic & Stainless Steel",
  description:
    "LAVA vacuum containers South Africa — acrylic & stainless steel, 650ml to 4000ml. Compatible with every LAVA sealer. Preserve, marinate and store fresh.",
  path: "/products/containers-lids",
});

export const revalidate = 3600;

export default async function ContainersLidsPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("containers-lids");
  } catch {
    // Supabase unavailable
  }

  const acrylic   = products.filter((p) => p.tags?.includes("acrylic") && !p.tags?.includes("lid") && !p.tags?.includes("set"));
  const acrylicSets = products.filter((p) => p.tags?.includes("acrylic") && p.tags?.includes("set"));
  const esLine    = products.filter((p) => p.tags?.includes("stainless-steel") && !p.tags?.includes("set"));
  const esLineSets = products.filter((p) => p.tags?.includes("stainless-steel") && p.tags?.includes("set"));
  const lids      = products.filter((p) => p.tags?.includes("lid"));

  const collectionLd = collectionPageSchema({
    name: "Vacuum Containers & Lids — Acrylic & Stainless Steel",
    description: "LAVA vacuum containers South Africa — acrylic & stainless steel, 650ml to 4000ml. Compatible with every LAVA sealer. Preserve, marinate and store fresh.",
    url: "/products/containers-lids",
    image: "/images/og-fallback/og-containers.jpg",
    items: products.map((p) => ({ name: p.name, url: `/products/${p.slug}`, image: p.primary_image_url })),
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Containers & Lids", url: "/products/containers-lids" },
  ]);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[collectionLd, crumbLd]} />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">BPA-Free · Dishwasher Safe · Lifetime Quality</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Vacuum Containers & Lids
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Preserve, marinate and store — without bags. LAVA acrylic and stainless steel
            containers connect directly to your machine&apos;s vacuum pump attachment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["Glass Containers", "/products/glass-containers"],
              ["Acrylic Containers", "#acrylic-containers"],
              ["Stainless Steel", "/products/stainless-containers"],
              ["Universal Lids", "/products/acrylic-lids"],
            ].map(([label, href]) => (
              <a key={href} href={href}
                className="text-sm font-semibold border border-white/30 text-white/80 px-4 py-2 hover:bg-white/10 hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ BPA-Free</span>
          <span>✓ Dishwasher Safe</span>
          <span>✓ Fits All LAVA Machines</span>
          <span>✓ Marinate 3× Faster</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      {/* ── How it works strip ─────────────────────────────────────────────── */}
      <div className="border-b border-border py-10 bg-surface">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-3xl mx-auto">
            {[
              { step: "1", title: "Fill the container", desc: "Add food, marinade or ingredients" },
              { step: "2", title: "Attach the pump", desc: "Connect your machine's pump adapter to the lid valve" },
              { step: "3", title: "Vacuum & store", desc: "Press the vacuum button — done in seconds" },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">{s.title}</p>
                  <p className="text-xs text-copy-muted mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ACRYLIC CONTAINERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="acrylic-containers" className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">Crystal Clear</p>
            <h2 className="text-3xl font-bold text-primary">Acrylic Vacuum Containers</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              See exactly what&apos;s inside. Lightweight, affordable and dishwasher safe.
              Available in 5 sizes from 650ml to 2000ml. These remain our most popular range.
            </p>
          </div>

          {acrylic.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {acrylic.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {acrylicSets.length > 0 && (
            <>
              <div className="mb-6 mt-4">
                <p className="overline mb-1">Best value</p>
                <h3 className="text-xl font-bold text-primary">Acrylic Container Sets</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {acrylicSets.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}

          {products.length === 0 && (
            <p className="text-copy-muted py-12 text-center">Products loading — please check back shortly.</p>
          )}
        </div>
      </section>

      {/* ── Acrylic vs Stainless comparison strip ──────────────────────────── */}
      <div className="bg-surface border-y border-border py-12">
        <div className="section-container">
          <h3 className="text-center text-lg font-bold text-primary mb-8">Acrylic vs Stainless Steel — which is right for you?</h3>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <caption className="sr-only">Feature comparison: Acrylic vs ES-Line Stainless Steel containers</caption>
              <thead>
                <tr className="bg-primary text-white">
                  <th scope="col" className="text-left py-3 px-4 font-bold w-2/5">Feature</th>
                  <th scope="col" className="text-center py-3 px-4 font-bold">Acrylic</th>
                  <th scope="col" className="text-center py-3 px-4 font-bold">
                    ES-Line Stainless
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-secondary mt-0.5">Premium Choice</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["See-through",           "✓",  "✗"],
                  ["Lightweight",           "✓",  "—"],
                  ["More affordable",       "✓",  "—"],
                  ["Great for everyday use","✓",  "✓"],
                  ["Odour & stain resistant","Partial", "✓"],
                  ["Dishwasher safe",       "—",  "✓"],
                  ["Professional durability","—", "✓"],
                  ["Best for strong-smelling foods (game, fish, garlic)", "—", "✓"],
                ].map(([feature, acrylic, steel]) => (
                  <tr key={feature} className="border-b border-border odd:bg-surface">
                    <td className="py-2.5 px-4 text-copy">{feature}</td>
                    <td className={`py-2.5 px-4 text-center font-semibold ${acrylic === "✓" ? "text-emerald-600" : acrylic === "✗" ? "text-copy-muted" : "text-copy-muted"}`}>{acrylic}</td>
                    <td className={`py-2.5 px-4 text-center font-semibold ${steel === "✓" ? "text-emerald-600" : steel === "✗" ? "text-copy-muted" : "text-copy-muted"}`}>{steel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Category Links Strip ─────────────────────────────────────────── */}
      <section className="bg-surface py-20 border-t border-border">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary">Explore More Containers</h2>
            <p className="text-copy-muted mt-2">Specialized vacuum storage solutions for every need.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Glass Containers", href: "/products/glass-containers", desc: "Sustainable & Stylish" },
              { title: "Stainless Steel", href: "/products/stainless-containers", desc: "Lifetime professional durability" },
              { title: "Universal Lids", href: "/products/acrylic-lids", desc: "Seal any bowl or container" },
            ].map((cat) => (
              <a key={cat.href} href={cat.href}
                className="group bg-white border border-border p-8 text-center hover:border-secondary transition-all">
                <h3 className="font-bold text-primary group-hover:text-secondary transition-colors">{cat.title}</h3>
                <p className="text-xs text-copy-muted mt-2">{cat.desc}</p>
                <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  View Collection →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
