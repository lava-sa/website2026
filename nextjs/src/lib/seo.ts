/**
 * SEO / Schema.org JSON-LD builders.
 * All helpers return plain objects — feed them to <JsonLd data={...} />.
 */

export const SITE_URL = "https://www.lava-sa.co.za";
export const ORG_NAME = "Lava South Africa";
export const DEFAULT_OG_IMAGE = "/images/headers/lava-sa-vacuum-sealers-V300-header-pick-1250.jpg";

type ProductLike = {
  slug: string;
  name: string;
  sku?: string | null;
  short_description?: string | null;
  regular_price: number;
  sale_price?: number | null;
  stock_status: string;
  primary_image_url?: string | null;
  product_images?: { url: string }[];
};

type ReviewsBlock = {
  average_rating: number;
  total_reviews: number;
};

export function productSchema(
  product: ProductLike,
  reviews?: ReviewsBlock | null,
) {
  const price = product.sale_price ?? product.regular_price;
  const images = [
    product.primary_image_url,
    ...(product.product_images?.map((i) => i.url) ?? []),
  ]
    .filter(Boolean)
    .map((u) => (u!.startsWith("http") ? u! : `${SITE_URL}${u}`));

  const availability =
    product.stock_status === "in_stock"
      ? "https://schema.org/InStock"
      : product.stock_status === "out_of_stock"
      ? "https://schema.org/OutOfStock"
      : product.stock_status === "on_backorder"
      ? "https://schema.org/BackOrder"
      : "https://schema.org/PreOrder";

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? undefined,
    sku: product.sku ?? undefined,
    image: images.length ? images : [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
    brand: { "@type": "Brand", name: "LAVA" },
    url: `${SITE_URL}/products/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "ZAR",
      availability,
      url: `${SITE_URL}/products/${product.slug}`,
      seller: { "@type": "Organization", name: ORG_NAME },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  };

  if (reviews && reviews.total_reviews > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviews.average_rating.toFixed(1),
      reviewCount: reviews.total_reviews,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return schema;
}

export function articleSchema(args: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  const img = args.image
    ? args.image.startsWith("http")
      ? args.image
      : `${SITE_URL}${args.image}`
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    image: [img],
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: {
      "@type": "Organization",
      name: args.author ?? ORG_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo/lava-sa-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": args.url.startsWith("http") ? args.url : `${SITE_URL}${args.url}`,
    },
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
