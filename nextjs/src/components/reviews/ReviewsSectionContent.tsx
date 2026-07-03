import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, Package } from "lucide-react";
import PublicReviewCard from "@/components/reviews/PublicReviewCard";
import type { DisplayReview } from "@/lib/reviews/types";
import {
  REVIEW_SECTIONS,
  type ReviewCatalog,
  type ReviewProductEntry,
  type ReviewSectionId,
  reviewsHref,
} from "@/lib/reviews/navigation";

export type ProductSpotlight = {
  slug: string;
  name: string;
  primary_image_url: string | null;
  short_description: string | null;
};

type Props = {
  catalog: ReviewCatalog;
  section: ReviewSectionId;
  productSlug?: string;
  spotlight?: ProductSpotlight | null;
  productMeta?: Map<string, ProductSpotlight>;
};

function AverageStars({ reviews }: { reviews: DisplayReview[] }) {
  if (reviews.length === 0) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i <= Math.round(avg) ? "fill-secondary text-secondary" : "text-border"}`}
          />
        ))}
      </div>
      <span className="font-bold text-primary">{avg.toFixed(1)}</span>
      <span className="text-copy-muted">({reviews.length} reviews)</span>
    </div>
  );
}

function ProductPicker({
  sectionId,
  products,
  sectionLabel,
  productMeta,
}: {
  sectionId: ReviewSectionId;
  products: ReviewProductEntry[];
  sectionLabel: string;
  productMeta?: Map<string, ProductSpotlight>;
}) {
  return (
    <div>
      <p className="text-copy-muted mb-6 max-w-2xl">
        Choose a product to read customer reviews for {sectionLabel.toLowerCase()}.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const meta = productMeta?.get(product.slug);
          return (
            <Link
              key={product.slug}
              href={reviewsHref(sectionId, product.slug)}
              className="group border border-border bg-white overflow-hidden hover:border-primary transition-colors"
            >
              <div className="relative h-36 bg-surface border-b border-border">
                {meta?.primary_image_url ? (
                  <Image
                    src={meta.primary_image_url}
                    alt={meta.name}
                    fill
                    className="object-contain p-4"
                    sizes="240px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-border" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase text-copy-muted">
                    {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="font-bold text-primary group-hover:text-secondary transition-colors leading-snug">
                  {meta?.name ?? product.label}
                </p>
                <p className="text-xs font-bold text-secondary mt-3 inline-flex items-center gap-1">
                  Read reviews <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ProductSpotlightHeader({
  spotlight,
  reviews,
}: {
  spotlight: ProductSpotlight;
  reviews: DisplayReview[];
}) {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-10 pb-8 border-b border-border">
      <div className="relative w-full md:w-48 h-48 shrink-0 bg-surface border border-border">
        {spotlight.primary_image_url ? (
          <Image
            src={spotlight.primary_image_url}
            alt={spotlight.name}
            fill
            className="object-contain p-4"
            sizes="192px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-border" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="overline mb-2">Product reviews</p>
        <h2 className="text-2xl font-black text-primary mb-2">{spotlight.name}</h2>
        {spotlight.short_description && (
          <p className="text-sm text-copy-muted leading-relaxed mb-4 max-w-2xl">
            {spotlight.short_description}
          </p>
        )}
        <AverageStars reviews={reviews} />
      </div>
    </div>
  );
}

export default function ReviewsSectionContent({
  catalog,
  section,
  productSlug,
  spotlight,
  productMeta,
}: Props) {
  const sectionConfig = REVIEW_SECTIONS.find((s) => s.id === section)!;

  if (section === "general") {
    return (
      <div>
        <div className="mb-8">
          <p className="overline mb-2">Service &amp; Support</p>
          <h2 className="text-2xl font-black text-primary">{sectionConfig.label}</h2>
          <p className="text-copy-muted mt-2 max-w-2xl">{sectionConfig.description}</p>
        </div>
        {catalog.general.length === 0 ? (
          <p className="text-copy-muted py-8 text-center border border-dashed border-border">
            No general service reviews yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {catalog.general.map((review) => (
              <PublicReviewCard key={review.id} review={review} className="h-full" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (section === "videos") {
    return (
      <div>
        <div className="mb-8">
          <p className="overline mb-2">Video Stories</p>
          <h2 className="text-2xl font-black text-primary">{sectionConfig.label}</h2>
          <p className="text-copy-muted mt-2 max-w-2xl">{sectionConfig.description}</p>
        </div>
        {catalog.videos.length === 0 ? (
          <p className="text-copy-muted py-8 text-center border border-dashed border-border">
            No video testimonials yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {catalog.videos.map((review) => (
              <PublicReviewCard key={review.id} review={review} showStructured={false} className="h-full" />
            ))}
          </div>
        )}
      </div>
    );
  }

  const products = catalog.bySection.get(section) ?? [];

  if (!productSlug) {
    if (products.length > 0) {
      return (
        <ProductPicker
          sectionId={section}
          products={products}
          sectionLabel={sectionConfig.label}
          productMeta={productMeta}
        />
      );
    }
    return (
      <p className="text-copy-muted py-8 text-center border border-dashed border-border">
        No reviews in this category yet.
      </p>
    );
  }

  const entry = products.find((p) => p.slug === productSlug);
  if (!entry) {
    return (
      <ProductPicker
        sectionId={section}
        products={products}
        sectionLabel={sectionConfig.label}
        productMeta={productMeta}
      />
    );
  }

  return (
    <div>
      {spotlight ? (
        <ProductSpotlightHeader spotlight={spotlight} reviews={entry.reviews} />
      ) : (
        <div className="mb-8 pb-6 border-b border-border">
          <p className="overline mb-2">{sectionConfig.label}</p>
          <h2 className="text-2xl font-black text-primary">{entry.label}</h2>
          <div className="mt-3">
            <AverageStars reviews={entry.reviews} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch mb-10">
        {entry.reviews.map((review) => (
          <PublicReviewCard key={review.id} review={review} className="h-full" />
        ))}
      </div>

      <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href={`/products/${entry.slug}`}
          className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 hover:bg-primary/90 transition-colors"
        >
          View {entry.label} product page
          <ArrowRight className="h-4 w-4" />
        </Link>
        {products.length > 1 && (
          <Link
            href={reviewsHref(section)}
            className="text-sm font-bold text-secondary hover:text-primary transition-colors"
          >
            ← All {sectionConfig.label.toLowerCase()}
          </Link>
        )}
      </div>
    </div>
  );
}
