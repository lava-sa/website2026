import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Replacement Spare Parts",
  description:
    "Genuine LAVA replacement parts for all machines. Sealing strips, liquid trap lids and vacuum seal sets — keep your vacuum sealer performing like new.",
};

export const revalidate = 3600;

// ── Compatibility reference data ─────────────────────────────────────────────

const COMPAT = [
  {
    machine: "V.100 / V.200 / V.300 Premium",
    parts: ["Sealing Strip (VE0201)", "Liquid Trap Lid (VE0601)", "Vacuum Seals (VE0701)"],
  },
  {
    machine: "V.333 Chrome",
    parts: ["Liquid Trap Lid (VE0601)", "Vacuum Seals (VE0703)"],
  },
  {
    machine: "V.400 Classic",
    parts: ["Sealing Strip (VE0204)", "Liquid Trap Lid (VE0602)", "Vacuum Seals (VE0704)"],
  },
  {
    machine: "V.400 Premium",
    parts: ["Sealing Strip (VE0209)", "Liquid Trap Lid (VE0602-1)", "Vacuum Seals (VE0708)"],
  },
  {
    machine: "V.500 Classic",
    parts: ["Sealing Strip (VE0206)", "Liquid Trap Lid (VE0602)"],
  },
  {
    machine: "V.500 Premium",
    parts: ["Sealing Strip (VE0207)", "Liquid Trap Lid (VE0602-1)", "Vacuum Seals (VE0706)"],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SparePartsPage() {
  let products: Product[] = [];
  try {
    products = await getProductsByCategory("spare-parts");
  } catch {
    // Supabase not available — show empty state
  }

  const sealingStrips     = products.filter((p) => p.tags?.includes("sealing-strip"));
  const liquidTrapLids    = products.filter((p) => p.tags?.includes("liquid-trap"));
  const vacuumSeals       = products.filter((p) => p.tags?.includes("vacuum-seals"));

  return (
    <main className="min-h-screen bg-white">

      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Genuine LAVA Parts</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Replacement Spare Parts
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Keep your LAVA machine running at peak performance with genuine
            replacement sealing strips, liquid trap lids and vacuum seal sets.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["Sealing Strips",   "#sealing-strips"],
              ["Liquid Trap Lids", "#liquid-trap-lids"],
              ["Vacuum Seals",     "#vacuum-seals"],
              ["Compatibility",    "#compatibility"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-semibold border border-white/30 text-white/80
                           px-4 py-2 hover:bg-white/10 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Genuine LAVA Parts</span>
          <span>✓ Made in Germany</span>
          <span>✓ In Stock — Ships Fast</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {products.length === 0 && (
        <section className="py-32 text-center">
          <p className="text-copy-muted text-lg">Products loading — please check back shortly.</p>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SEALING STRIPS
      ══════════════════════════════════════════════════════════════════════ */}
      {sealingStrips.length > 0 && (
        <section id="sealing-strips" className="py-20">
          <div className="section-container">
            <div className="mb-10">
              <p className="overline mb-2">Most replaced part</p>
              <h2 className="text-3xl font-bold text-primary">Sealing Strips</h2>
              <p className="mt-3 text-copy-muted max-w-lg">
                A worn sealing strip is the most common cause of failed vacuum seals.
                Replace when you notice weak or inconsistent seals.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sealingStrips.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          LIQUID TRAP LIDS
      ══════════════════════════════════════════════════════════════════════ */}
      {liquidTrapLids.length > 0 && (
        <section id="liquid-trap-lids" className="py-20 bg-surface">
          <div className="section-container">
            <div className="mb-10">
              <p className="overline mb-2">Protect your pump</p>
              <h2 className="text-3xl font-bold text-primary">Liquid Trap Lids</h2>
              <p className="mt-3 text-copy-muted max-w-lg">
                The liquid trap prevents fluids from reaching the pump. Replace a
                cracked or damaged lid immediately to avoid costly pump repairs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liquidTrapLids.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VACUUM SEALS
      ══════════════════════════════════════════════════════════════════════ */}
      {vacuumSeals.length > 0 && (
        <section id="vacuum-seals" className="py-20">
          <div className="section-container">
            <div className="mb-10">
              <p className="overline mb-2">Restore airtight performance</p>
              <h2 className="text-3xl font-bold text-primary">Vacuum Seal Sets</h2>
              <p className="mt-3 text-copy-muted max-w-lg">
                Each set contains both the top and bottom foam seals. Replace when
                the machine struggles to reach full vacuum pressure.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacuumSeals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Compatibility Table ─────────────────────────────────────────────── */}
      <section id="compatibility" className="bg-surface border-y border-border py-16">
        <div className="section-container">
          <div className="mb-8">
            <p className="overline mb-2">Quick reference</p>
            <h2 className="text-2xl font-bold text-primary">Which Parts Fit My Machine?</h2>
            <p className="mt-2 text-copy-muted">
              Not sure which part you need? Use this compatibility guide.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-5 font-bold">Machine</th>
                  <th className="text-left py-3 px-5 font-bold">Compatible Parts (SKU)</th>
                </tr>
              </thead>
              <tbody>
                {COMPAT.map((row, i) => (
                  <tr key={row.machine} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
                    <td className="py-3 px-5 font-semibold text-primary border-b border-border align-top">
                      {row.machine}
                    </td>
                    <td className="py-3 px-5 text-copy border-b border-border">
                      <ul className="space-y-1">
                        {row.parts.map((part) => (
                          <li key={part} className="text-xs">• {part}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-sm text-copy-muted">
            Not sure? Call us on{" "}
            <a href="tel:+27721605556" className="font-semibold text-primary hover:text-secondary transition-colors">
              +27 72 160 5556
            </a>{" "}
            or email{" "}
            <a href="mailto:info@lava-sa.co.za" className="font-semibold text-primary hover:text-secondary transition-colors">
              info@lava-sa.co.za
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── When to replace ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <p className="overline mb-3 text-center">Maintenance tips</p>
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">When Should I Replace These Parts?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Sealing Strip",
                  signs: [
                    "Bags don't seal properly",
                    "Visible burn marks or gaps",
                    "Seals are weak or uneven",
                    "Machine shows a sealing error",
                  ],
                },
                {
                  title: "Liquid Trap Lid",
                  signs: [
                    "Lid is cracked or broken",
                    "Vacuum pressure drops suddenly",
                    "Visible liquid in the trap",
                    "Unusual sounds during vacuuming",
                  ],
                },
                {
                  title: "Vacuum Seals",
                  signs: [
                    "Machine can't reach full vacuum",
                    "Air leaks during operation",
                    "Foam seals look compressed or flat",
                    "Performance has decreased over time",
                  ],
                },
              ].map(({ title, signs }) => (
                <div key={title} className="bg-surface border border-border p-6">
                  <h3 className="font-bold text-primary mb-4">{title}</h3>
                  <ul className="space-y-2">
                    {signs.map((sign) => (
                      <li key={sign} className="text-sm text-copy-muted flex gap-2">
                        <span className="text-secondary shrink-0 mt-0.5">→</span>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
