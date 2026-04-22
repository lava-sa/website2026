import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import HuntexBanner from "@/components/home/HuntexBanner";

export const metadata: Metadata = {
  title: "Butchery Machinery — Professional Meat processing | LAVA South Africa",
  description:
    "Professional-grade meat mincers and sausage fillers. Specialized equipment for efficient butchery and food preparation. Designed for home and small commercial settings.",
};

export const revalidate = 3600;

export default async function ButcheryMachineryPage() {
  let products: Product[] = [];

  try {
    // These products are in the 'butchery-accessories' category but tagged 'machinery'
    products = await getProductsByCategory("butchery-accessories");
  } catch {
    // Supabase unavailable
  }

  const machinery = products.filter((p) => 
    p.tags?.includes("machinery") || 
    p.tags?.includes("mincer") || 
    p.tags?.includes("sausage-filler")
  );

  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Professional · Efficient · Precise</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Professional Meat Processing Machinery
          </h1>
          <h2 className="mt-4 text-xl font-medium text-white/90">
            Specialized Equipment for Efficient Butchery & Food Preparation
          </h2>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 text-on-dark-muted leading-relaxed">
            <div className="space-y-4">
              <p>
                Transform your meat processing capabilities with our professional-grade 
                machinery designed for efficiency, precision, and exceptional results in 
                home and small commercial settings.
              </p>
              <p>
                Our carefully selected range of specialized butchery equipment provides 
                the perfect balance between professional performance and practical usability, 
                allowing enthusiasts and small-scale producers to achieve commercial-quality results.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                For homemade sausage production, our premium sausage fillers feature 
                robust stainless steel construction and efficient mechanical systems that 
                make creating professional-quality sausages simple and consistent.
              </p>
              <p>
                Our powerful meat mincers combine high-performance motors with durable 
                components to handle substantial processing volumes with ease, providing 
                the foundation of efficient meat processing workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Status Strip ─────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ Commercial Construction</span>
          <span>✓ Precision Engineering</span>
          <span>✓ High-Capacity Processing</span>
          <span>✓ Easy Maintenance</span>
          <span>✓ Free Delivery over R2,500</span>
        </div>
      </div>

      <section className="py-20">
        <div className="section-container">
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">Professional Features of Our Machinery Line:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Durability", desc: "Commercial-grade construction for longevity" },
                { title: "Efficiency", desc: "High-capacity processing for batch preparation" },
                { title: "Consistency", desc: "Precision engineering for professional results" },
                { title: "Versatility", desc: "Comprehensive accessory packages included" },
                { title: "Ergonomics", desc: "Designed for comfortable extended use" },
                { title: "Maintenance", desc: "Accessible components for simple cleaning" },
              ].map((f) => (
                <div key={f.title} className="bg-surface p-6 border-b-2 border-primary/10">
                  <p className="font-bold text-primary text-sm uppercase tracking-wider mb-2">{f.title}</p>
                  <p className="text-xs text-copy-muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="my-16 flex flex-col items-center text-center max-w-3xl mx-auto">
             <p className="text-copy text-lg italic leading-relaxed">
              &quot;Whether you’re processing game after a successful hunt, preparing homemade sausages from quality ingredients, or efficiently handling meat for a small business, our machinery provides the reliable performance and professional results you need for success.&quot;
             </p>
          </div>

          {machinery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {machinery.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="py-20 bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
              <h3 className="text-xl font-bold text-primary mb-2">Inventory Loading...</h3>
              <p className="text-sm text-copy-muted max-w-xs">
                We are currently importing the latest meat processing machinery into the new system. 
                Please check back in a few moments.
              </p>
            </div>
          )}

          <div className="mt-20 pt-10 border-t border-border text-center">
            <p className="text-copy-muted text-sm max-w-2xl mx-auto">
              Complete your meat processing setup by pairing our specialized machinery with our premium knives, cutting boards, and preservation tools for a comprehensive solution from field to table.
            </p>
          </div>
        </div>
      </section>

      <HuntexBanner variant="section" />
    </main>
  );
}
