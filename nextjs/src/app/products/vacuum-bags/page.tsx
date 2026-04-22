import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Embossed Vacuum Bags — Premium German-Quality Packaging",
  description:
    "LAVA embossed vacuum bags in all sizes. BPA-free, food-safe, freezer and sous-vide compatible. The standard for professional food preservation.",
};

export const revalidate = 3600;

const BAG_SIZES = [
  { size: "13 × 22.5 cm", use: "Sausages, chicken pieces, small cuts"  },
  { size: "15 × 45 cm",   use: "Biltong strips, sausages, whole fish"   },
  { size: "16 × 25 cm",   use: "Steaks, chicken fillets, portions"       },
  { size: "20 × 30 cm",   use: "Chops, steaks — most popular size"       },
  { size: "25 × 35 cm",   use: "Large steaks, pork portions, fish"       },
  { size: "25 × 40 cm",   use: "Roasts, game portions, whole fish"       },
  { size: "30 × 40 cm",   use: "Whole chickens, shoulders, large roasts" },
  { size: "30 × 50 cm",   use: "Large game portions, bulk packs"         },
  { size: "35 × 50 cm",   use: "Legs of lamb, whole ducks, large game"   },
  { size: "40 × 60 cm",   use: "Commercial use, large carcases"          },
  { size: "60 × 80 cm",   use: "Whole carcases, butchery production"     },
  { size: "70 × 100 cm",  use: "Industrial / large game carcases"        },
];

export default async function VacuumBagsPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("vacuum-bags");
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
          <span className="text-primary font-black">Embossed Vacuum Bags</span>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Pre-cut · Ready to Use · BPA-Free</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Embossed Vacuum Bags
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            The professional choice for vacuum sealing. Multi-layer film ensures 
            maximum shelf life and prevents freezer burn.
          </p>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3 text-center">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ 90μ Strong Embossed Film</span>
          <span>✓ BPA-Free & Food Safe</span>
          <span>✓ Freezer & Sous-Vide Safe</span>
          <span>✓ Fits All LAVA Machines</span>
        </div>
      </div>

      {/* ── Products ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          {products.length === 0 ? (
            <p className="text-copy-muted py-12 text-center">Products loading — please check back shortly.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Size Guide ─────────────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border py-16">
        <div className="section-container">
          <div className="mb-8">
            <p className="overline mb-2">Find the right fit</p>
            <h2 className="text-2xl font-bold text-primary">Bag Size Guide</h2>
            <p className="mt-2 text-copy-muted">Not sure which size? Use this quick reference.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-border overflow-hidden">
            {BAG_SIZES.map((item, i) => (
              <div
                key={item.size}
                className={`p-4 border-b border-r border-border last:border-r-0 ${
                  i % 4 === 3 ? "border-r-0" : ""
                }`}
              >
                <p className="text-sm font-bold text-primary">{item.size}</p>
                <p className="text-xs text-copy-muted mt-1">{item.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
