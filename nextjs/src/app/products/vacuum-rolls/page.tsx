import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";
import Link from "next/link";
import { ChevronRight } from "lucide-react";


export const metadata: Metadata = {
  title: "Embossed Vacuum Rolls — Custom Length Vacuum Packaging",
  description:
    "LAVA embossed vacuum rolls in multiple widths. Cut exactly the length you need. BPA-free, food-safe, and compatible with all LAVA machines.",
};

export const revalidate = 3600;

const ROLL_SIZES = [
  { size: "15 cm wide", use: "Sausages, asparagus, narrow cuts"  },
  { size: "20 cm wide", use: "Steaks, chops — most popular"      },
  { size: "25 cm wide", use: "Roasts, larger cuts"               },
  { size: "30 cm wide", use: "Whole chickens, large game"        },
];

export default async function VacuumRollsPage() {
  let rolls: Product[] = [];

  try {
    rolls = await getProductsByCategory("vacuum-rolls");
  } catch {
    // Supabase not available
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <nav className="bg-surface border-b border-border py-4">
        <div className="section-container flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-copy-muted">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-secondary/40" />
          <Link href="/products/bags-rolls" className="hover:text-secondary transition-colors">Vacuum Bags & Rolls</Link>
          <ChevronRight className="h-3.5 w-3.5 text-secondary/40" />
          <span className="text-primary font-black">Embossed Vacuum Rolls</span>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Custom Lengths · Versatile · BPA-Free</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Embossed Vacuum Rolls
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Exactly the length you need, every time. Perfect for large game portions,
            extra-long fish fillets, or oddly shaped items.
          </p>
        </div>
      </section>

      {/* ── Trust strip ─────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3 text-center">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ 90μ Strong Embossed Film</span>
          <span>✓ BPA-Free & Food Safe</span>
          <span>✓ Freezer & Sous-Vide Safe</span>
          <span>✓ Fits All LAVA Machines</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          Vacuum Rolls
      ══════════════════════════════════════════════════════════════ */}
      <section className="pt-16 pb-20">
        <div className="section-container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="overline mb-2">Cut to any length</p>
              <h2 className="text-2xl font-bold text-primary">Embossed Vacuum Rolls</h2>
              <p className="text-sm text-copy-muted mt-1">
                Available in 4 widths — cut exactly the length you need
              </p>
            </div>
            <Link
              href="/products/bags-rolls"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-secondary hover:underline shrink-0"
            >
              All bags & rolls <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {rolls.length === 0 ? (
            <p className="text-copy-muted py-8 text-center">Products loading — please check back shortly.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rolls.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Width Guide ─────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border py-16">
        <div className="section-container">
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <p className="overline mb-2">Maximum Flexibility</p>
            <h2 className="text-3xl font-bold text-primary">Roll Width Guide</h2>
            <p className="mt-3 text-copy-muted italic">Available in 4 widths. Cut exactly the length you need — no waste.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border overflow-hidden">
            {ROLL_SIZES.map((item) => (
              <div key={item.size} className="p-6 border-r border-border last:border-r-0 text-center">
                <p className="text-xl font-black text-secondary">{item.size}</p>
                <p className="text-sm text-copy-muted mt-2">{item.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
