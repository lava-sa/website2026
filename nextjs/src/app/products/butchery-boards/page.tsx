import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "Cutting and Display Boards — Butchery Essentials | LAVA South Africa",
  description:
    "Professional-grade cutting and display boards. Durable surfaces designed for heavy-duty butchery, food preparation, and elegant presentation.",
};

export const revalidate = 3600;

export default async function ButcheryBoardsPage() {
  let products: Product[] = [];

  try {
    products = await getProductsByCategory("butchery-accessories");
  } catch {
    // Supabase unavailable
  }

  const boards = products.filter((p) => p.tags?.includes("cutting-board"));

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Durable · Hygienic · Professional</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Cutting and Display Boards
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Essential workstation surfaces built for daily butchery use. 
            From high-density polyethylene to elegant magnetic display options.
          </p>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Knife Friendly</span>
          <span>✓ Easy to Clean</span>
          <span>✓ Professional Standard</span>
          <span>✓ Durable Surface</span>
          <span>✓ Free Delivery over R2,000</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-primary text-balance">Professional Boards</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
               Choose the right surface for your butchery workflow. 
               Safe, sanitary, and designed to protect your Giesser knife edges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boards.length > 0 ? (
               boards.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
               <p className="text-copy-muted py-12 text-center bg-gray-50 border border-dashed col-span-full">
                 Products are currently being migrated — check back shortly.
               </p>
            )}
          </div>
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
