import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Vacuum Bags & Rolls — German-Quality Embossed Packaging",
  description:
    "LAVA embossed vacuum bags and rolls in all sizes. BPA-free, food-safe, freezer and sous-vide compatible. Compatible with all LAVA vacuum sealing machines.",
};

export const revalidate = 3600;

/* ─── Size guide data ───────────────────────────────────────────────────────── */
const BAG_SIZES = [
  { size: "10 × 15 cm",  use: "Spices, herbs, small cuts"       },
  { size: "13 × 20 cm",  use: "Chicken fillets, fish, deli meat" },
  { size: "13 × 22.5 cm",use: "Sausages, chicken pieces"         },
  { size: "20 × 30 cm",  use: "Steaks, chops — most popular"     },
  { size: "20 × 35 cm",  use: "Whole fish, large chops, biltong" },
  { size: "20 × 40 cm",  use: "Roasts, game portions"            },
  { size: "25 × 60 cm",  use: "Legs of lamb, large game"         },
  { size: "30 × 60 cm",  use: "Whole chickens, shoulders"        },
];

const ROLL_SIZES = [
  { size: "15 cm wide", use: "Sausages, asparagus, narrow cuts"  },
  { size: "20 cm wide", use: "Steaks, chops — most popular"      },
  { size: "25 cm wide", use: "Roasts, larger cuts"               },
  { size: "30 cm wide", use: "Whole chickens, large game"        },
];

/* ─── Page ──────────────────────────────────────────────────────────────────── */
export default async function BagsRollsPage() {
  let bags: Product[] = [];
  let rolls: Product[] = [];

  try {
    bags  = await getProductsByCategory("vacuum-bags");
    rolls = await getProductsByCategory("vacuum-rolls");
  } catch {
    // Supabase not available — show empty state
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">German Quality · BPA-Free · Food Safe</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Vacuum Bags & Rolls
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Embossed multi-layer film designed for use with all LAVA vacuum sealing machines.
            Freezer safe, microwave safe, sous-vide safe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["Vacuum Bags", "/products/vacuum-bags"],
              ["Vacuum Rolls", "/products/vacuum-rolls"],
              ["Size Guide", "#size-guide"],
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
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ 90μ Embossed Film</span>
          <span>✓ BPA-Free & Food Safe</span>
          <span>✓ Freezer & Sous-Vide Safe</span>
          <span>✓ Fits All LAVA Machines</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          VACUUM BAGS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="vacuum-bags" className="py-20">
        <div className="section-container">

          <div className="mb-10">
            <p className="overline mb-2">Pre-cut & ready to use</p>
            <h2 className="text-3xl font-bold text-primary">Vacuum Bags</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Available in 8 sizes — from small herb packets to large game portions.
              All bags feature the embossed channel pattern for reliable vacuuming.
            </p>
          </div>

          {bags.length === 0 ? (
            <p className="text-copy-muted py-12 text-center">Products loading — please check back shortly.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bags.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Size Guide ─────────────────────────────────────────────────────── */}
      <section id="size-guide" className="bg-surface border-y border-border py-16">
        <div className="section-container">
          <div className="mb-8">
            <p className="overline mb-2">Find the right fit</p>
            <h2 className="text-2xl font-bold text-primary">Bag Size Guide</h2>
            <p className="mt-2 text-copy-muted">Not sure which size? Use this quick reference.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <caption className="sr-only">Bag Size Guide — recommended uses for each bag dimension</caption>
              <thead>
                <tr className="bg-primary text-white">
                  <th scope="col" className="text-left py-3 px-4 font-bold">Bag Size</th>
                  <th scope="col" className="text-left py-3 px-4 font-bold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {BAG_SIZES.map((item) => (
                  <tr key={item.size} className="border-b border-border odd:bg-surface">
                    <td className="py-2.5 px-4 font-semibold text-primary">{item.size}</td>
                    <td className="py-2.5 px-4 text-copy">{item.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          VACUUM ROLLS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="vacuum-rolls" className="py-20">
        <div className="section-container">

          <div className="mb-10">
            <p className="overline mb-2">Cut to any length</p>
            <h2 className="text-3xl font-bold text-primary">Vacuum Rolls</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Cut exactly the length you need — no waste. Available in 4 widths.
              Ideal when you pack items of varying lengths regularly.
            </p>
          </div>

          {rolls.length === 0 ? (
            <p className="text-copy-muted py-12 text-center">Products loading — please check back shortly.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rolls.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Roll size guide */}
          <div className="mt-12 overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <caption className="sr-only">Roll Width Guide — recommended uses for each roll width</caption>
              <thead>
                <tr className="bg-primary text-white">
                  <th scope="col" className="text-left py-3 px-5 font-bold text-xs uppercase tracking-widest">Roll Width</th>
                  <th scope="col" className="text-left py-3 px-5 font-bold text-xs uppercase tracking-widest">Best For</th>
                </tr>
              </thead>
              <tbody>
                {ROLL_SIZES.map((item) => (
                  <tr key={item.size} className="border-t border-border odd:bg-surface">
                    <td className="py-2.5 px-5 font-semibold text-primary">{item.size}</td>
                    <td className="py-2.5 px-5 text-copy-muted">{item.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Compatibility note ─────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border py-12">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="overline mb-3">Important</p>
            <h3 className="text-xl font-bold text-primary mb-4">Machine Compatibility</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <caption className="sr-only">Bag and roll compatibility by LAVA machine model</caption>
                <thead>
                  <tr className="bg-primary text-white">
                    <th scope="col" className="text-left py-3 px-4 font-bold">Machine</th>
                    <th scope="col" className="text-left py-3 px-4 font-bold">Seal Width</th>
                    <th scope="col" className="text-left py-3 px-4 font-bold">Max Bag Width</th>
                    <th scope="col" className="text-left py-3 px-4 font-bold">Max Roll Width</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["V.100 Premium X",        "340 mm", "30 cm", "30 cm"],
                    ["V.300 Premium X / Black", "300 mm", "25 cm", "25 cm"],
                    ["V.400 / V.500 Commercial","450–1200 mm", "All sizes", "Custom widths available"],
                  ].map(([model, seal, bags, rolls]) => (
                    <tr key={model} className="border-b border-border odd:bg-surface">
                      <td className="py-2.5 px-4 font-semibold text-primary">{model}</td>
                      <td className="py-2.5 px-4 text-copy">{seal}</td>
                      <td className="py-2.5 px-4 text-copy">{bags}</td>
                      <td className="py-2.5 px-4 text-copy">{rolls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
