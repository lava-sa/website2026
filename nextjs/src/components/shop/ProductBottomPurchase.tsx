import Image from "next/image";
import AddToCartButton from "@/components/shop/AddToCartButton";
import StockBadge from "@/components/shop/StockBadge";
import { formatPrice } from "@/lib/products";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    sku: string | null;
    regular_price: number;
    sale_price: number | null;
    stock_status: string;
    stock_quantity: number | null;
    primary_image_url: string | null;
  };
  price: number;
  image: string | null;
  waUrl: string;
  funnelSlug?: string;
};

export default function ProductBottomPurchase({
  product,
  price,
  image,
  waUrl,
  funnelSlug,
}: Props) {
  return (
    <section className="py-12 bg-surface border-t border-border">
      <div className="section-container">
        <div className="max-w-4xl mx-auto bg-white border border-border shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {image && (
              <div className="relative h-24 w-24 shrink-0 border border-border bg-white mx-auto sm:mx-0">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left min-w-0">
              {product.sku && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted mb-1">
                  SKU: {product.sku}
                </p>
              )}
              <h2 className="text-lg font-black text-primary leading-tight">{product.name}</h2>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <StockBadge status={product.stock_status} quantity={product.stock_quantity} />
                <span className="text-2xl font-black text-primary">{formatPrice(price)}</span>
                <span className="text-[10px] text-copy-muted font-bold uppercase tracking-widest">
                  incl. VAT
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[220px]">
              <AddToCartButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price,
                  image: product.primary_image_url,
                  sku: product.sku,
                }}
                funnelSlug={funnelSlug}
              />
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-[#075E54] text-[#075E54] font-bold py-3 text-sm hover:bg-[#075E54] hover:text-white transition-colors"
              >
                WhatsApp to Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
