import { getFeaturedProducts } from "@/lib/products";
import FeaturedProductsSlider from "@/components/home/FeaturedProductsSlider";
import type { Product } from "@/types/product";

const ProductGallery = async () => {
  let products: Product[] = [];
  try {
    products = await getFeaturedProducts();
  } catch {
    products = [];
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="product-gallery bg-surface py-24">
      <div className="section-container">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="product-gallery__header mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-secondary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                LAVA German Precision · Built for a Lifetime
              </span>
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Discover LAVA<br />Vacuum Sealers
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-copy-muted sm:text-right">
            Engineered in Germany for unmatched durability and sustainability.
            A machine for every demand.
          </p>
        </div>

        <FeaturedProductsSlider products={products} />

      </div>
    </section>
  );
};

export default ProductGallery;
