import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { calculatePointsEarned } from "@/lib/rewards-config";

const products = [
  {
    id: "v100",
    name: "V.100® Premium X",
    sub: "The Ideal Entry Point",
    image: "/images/products/lava-v100-premium-x-compact-vacuum-sealing-machine.webp",
    badge: "Bestseller",
    tier: "Entry Level",
    tierColor: "bg-petrol-100 text-primary",
    price: "R 11,000",
    priceValue: 11000,
    href: "/products/v100-premium-x",
  },
  {
    id: "v300",
    name: "V.300® Premium X",
    sub: "Most Popular Worldwide",
    image: "/images/products/lava-v300-premium-white-aesthetic-vacuum-sealer-angle.webp",
    badge: "Most Popular",
    tier: "Home & Domestic",
    tierColor: "bg-secondary/10 text-secondary",
    price: "R 14,500",
    priceValue: 14500,
    href: "/products/v300-premium-x",
  },
  {
    id: "v300b",
    name: "V.300® Black",
    sub: "Limited Edition Black",
    image: "/images/products/machines/v300-black/lava-vacuum-sealer-v300-black.webp",
    badge: "Limited Edition",
    tier: "Home & Domestic",
    tierColor: "bg-secondary/10 text-secondary",
    price: "R 14,200",
    priceValue: 14200,
    href: "/products/v300-black",
  },
  {
    id: "v400",
    name: "V.400® Premium",
    sub: "Built for Heavy Demands",
    image: "/images/products/lava-v400-premium-high-performance-vacuum-sealer-angle.webp",
    badge: "Commercial",
    tier: "Commercial",
    tierColor: "bg-petrol-600/10 text-petrol-600",
    price: "R 29,890",
    priceValue: 29890,
    href: "/products/v400-premium",
  },
];

const ProductGallery = () => {
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

        {/* ── Product grid ───────────────────────────────────────── */}
        <div className="product-gallery__grid grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="product-gallery__card card-hover-group group relative flex flex-col overflow-hidden border border-border bg-white transition-all hover:-translate-y-1 hover:border-primary-mid hover:shadow-lg"
            >
              {/* Image */}
              <div className="product-gallery__image relative aspect-[4/3] w-full overflow-hidden bg-white">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                />

                {/* Hover overlay — slides up */}
                <div className="card-hover-overlay gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  View Machine
                </div>

                {/* Badge */}
                <span className="product-gallery__badge absolute top-3 left-3 z-10 bg-primary px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white">
                  {product.badge}
                </span>
              </div>

              {/* Card body */}
              <div className="product-gallery__body flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">LAVA</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${product.tierColor}`}>
                    {product.tier}
                  </span>
                </div>
                <h3 className="product-gallery__name text-sm font-semibold leading-snug text-primary">
                  {product.name}
                </h3>
                <p className="mt-1 text-xs text-copy-muted">{product.sub}</p>
                <p className="mt-3 font-heading text-lg font-bold text-primary">
                  {product.price}
                </p>
              </div>

              {/* Rewards strip */}
              <div className="product-gallery__rewards flex items-center gap-2 border-t border-border px-4 py-2.5">
                <Star className="h-3 w-3 fill-secondary text-secondary shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-copy-muted">
                  Earn {calculatePointsEarned(product.priceValue).toLocaleString("en-ZA")} Lava Points
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductGallery;
