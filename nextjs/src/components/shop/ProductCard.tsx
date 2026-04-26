import Link from "next/link";
import { Award } from "lucide-react";
import { formatPrice } from "@/lib/products";
import ProductCatalogImage from "@/components/shop/ProductCatalogImage";
import { calculatePointsEarned, calculatePointValue } from "@/lib/rewards-config";
import type { Product, StockStatus } from "@/types/product";

const STOCK_LABELS: Record<StockStatus, { label: string; className: string }> = {
  in_stock:     { label: "In Stock",         className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  out_of_stock: { label: "Out of Stock",      className: "bg-red-50 text-red-700 border-red-200" },
  on_backorder: { label: "On Backorder",      className: "bg-amber-50 text-amber-700 border-amber-200" },
  on_order:     { label: "Special Order",     className: "bg-petrol-50 text-primary border-petrol-100" },
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const stock = STOCK_LABELS[product.stock_status] ?? STOCK_LABELS.on_order;
  const href = `/products/${product.slug}`;
  const points = calculatePointsEarned(product.sale_price || product.regular_price);
  const pointsRandValue = calculatePointValue(points);

  return (
    <div
      className="card-hover-group group relative flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      {/* Full-card click target — sits above image & content, below interactive chips */}
      <Link
        href={href}
        aria-label={product.name}
        className="absolute inset-0 z-10"
      />

      {/* Image — fixed 870:670 frame; mixed square/rect sources align via object-cover */}
      {product.primary_image_url ? (
        <ProductCatalogImage src={product.primary_image_url} alt={product.name} title={product.name}>
          {product.is_featured && (
            <span className="pointer-events-none absolute top-3 left-3 z-10 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
              Most Popular
            </span>
          )}
          <div className="card-hover-overlay pointer-events-none z-[5]" aria-hidden="true">
            View {product.name} →
          </div>
        </ProductCatalogImage>
      ) : (
        <div className="relative flex aspect-[870/670] w-full items-center justify-center bg-[#F2F2F2] text-copy-muted text-sm">
          No image
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Stock badge */}
        <span className={`self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border ${stock.className}`}>
          {stock.label}
        </span>

        {/* Name */}
        <h3 className="font-bold text-lg text-primary leading-snug group-hover:text-primary-mid transition-colors">
          {product.name}
        </h3>

        {/* Short description */}
        {product.short_description && (
          <p className="text-sm text-copy-muted leading-relaxed line-clamp-2 flex-1">
            {product.short_description}
          </p>
        )}

        {/* Price */}
        <div className="pt-2 mt-auto border-t border-border">
          {product.sale_price ? (
            <>
              <span className="text-xl font-bold text-primary">{formatPrice(product.sale_price)}</span>
              <span className="ml-2 text-sm text-copy-muted line-through">{formatPrice(product.regular_price)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-primary">{formatPrice(product.regular_price)}</span>
          )}
        </div>

        {/* Lava Points — clickable, links to rewards page */}
        <Link
          href="/rewards"
          className="relative z-20 mt-1 flex items-center justify-between gap-1.5 border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 px-3 py-2 transition-colors"
        >
          <span className="flex items-center gap-1.5 min-w-0">
            <Award className="h-3.5 w-3.5 text-secondary shrink-0" />
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wide truncate">
              Earn {points.toLocaleString("en-ZA")} Lava Points
            </span>
          </span>
          <span className="text-[10px] font-bold text-secondary/70 uppercase tracking-wide shrink-0 ml-1">
            →
          </span>
        </Link>

      </div>
    </div>
  );
}
