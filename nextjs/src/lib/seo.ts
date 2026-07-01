/**
 * SEO / Schema.org JSON-LD builders.
 * All helpers return plain objects — feed them to <JsonLd data={...} />.
 */

import type { Metadata } from "next";

export const SITE_URL = "https://lava-sa.com";

/** Legacy / staging hosts — never use in customer-facing email or auth links. */
const LEGACY_PUBLIC_HOSTS = new Set([
  "lava-sa.online",
  "www.lava-sa.online",
  "lava-sa.co.za",
  "www.lava-sa.co.za",
]);

function normalizePublicSiteUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    if (LEGACY_PUBLIC_HOSTS.has(host)) return SITE_URL;
  } catch {
    /* invalid URL — fall through */
  }
  return trimmed;
}

function isLocalDevHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Canonical site URL for customer emails and magic-link redirect_to.
 * Hard-coded to the live domain — never localhost, never lava-sa.online.
 * Override only with CUSTOMER_FACING_SITE_URL (non-localhost) for staging.
 */
export function getCustomerFacingSiteUrl(): string {
  const override = process.env.CUSTOMER_FACING_SITE_URL?.trim();
  if (override) {
    try {
      const host = new URL(override).hostname.toLowerCase();
      if (!isLocalDevHost(host) && !LEGACY_PUBLIC_HOSTS.has(host)) {
        return override.replace(/\/$/, "");
      }
    } catch {
      /* ignore invalid override */
    }
  }
  return SITE_URL;
}

/**
 * Canonical base URL for PayFast return URLs, order emails, magic links, etc.
 * Production always uses lava-sa.com (never lava-sa.online / legacy staging hosts).
 */
export function getPublicSiteUrl(): string {
  if (process.env.VERCEL_ENV === "production") {
    return SITE_URL;
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return normalizePublicSiteUrl(fromEnv);

  return SITE_URL;
}

export const ORG_NAME = "Lava-SA";
export const DEFAULT_OG_IMAGE = "/images/headers/lava-sa-vacuum-sealers-V300-header-pick-1250.jpg";

/**
 * Category-aware OG fallback. Used when a product has no primary_image_url
 * so the social preview at least shows something thematically relevant
 * instead of the generic V.300 header. Maps a product's category.slug to
 * an image in /public/images/og-fallback/.
 *
 * Returns DEFAULT_OG_IMAGE for any unmapped category.
 */
export function categoryOgFallback(categorySlug: string | null | undefined): string {
  switch (categorySlug) {
    case "vacuum-machines":
      return "/images/og-fallback/og-machines.jpg";
    case "vacuum-bags":
    case "vacuum-rolls":
    case "bags-rolls":
      return "/images/og-fallback/og-bags-rolls.jpg";
    case "sous-vide":
      return "/images/og-fallback/og-sous-vide.jpg";
    case "containers-lids":
      return "/images/og-fallback/og-containers.jpg";
    case "spare-parts":
      return "/images/og-fallback/og-spare-parts.jpg";
    case "butchery-machinery":
    case "butchery-boards":
    case "butchery-knives":
    case "butchery-hanging":
    case "butchery-protective":
    case "butchery-scales":
    case "butchery-tools":
      return "/images/og-fallback/og-butchery.jpg";
    default:
      return "/images/og-fallback/og-default.jpg";
  }
}

/**
 * Build full page metadata (title, description, canonical, OpenGraph, Twitter)
 * from a single call. Pages that don't set openGraph/twitter inherit the
 * root layout's blocks, which means Facebook/WhatsApp/Twitter previews show
 * the homepage title for every page. Use this helper to give each page its
 * own social preview.
 *
 * - `titleAbsolute: true` skips the root template (use when the title already
 *   ends with " | Lava-SA" or you want to override).
 */
export function pageMetadata(args: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  titleAbsolute?: boolean;
  noIndex?: boolean;
}): Metadata {
  const image = args.image ?? DEFAULT_OG_IMAGE;
  const imageAlt = args.imageAlt ?? args.title;
  const titleField = args.titleAbsolute ? { absolute: args.title } : args.title;
  const ogTitle = args.titleAbsolute ? args.title : `${args.title} | Lava-SA`;

  return {
    title: titleField,
    description: args.description,
    alternates: { canonical: args.path },
    ...(args.noIndex && { robots: { index: false, follow: true } }),
    openGraph: {
      title: ogTitle,
      description: args.description,
      url: args.path,
      type: "website",
      siteName: "Lava-SA",
      locale: "en_ZA",
      images: [{ url: image, width: 1250, height: 830, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: args.description,
      images: [image],
    },
  };
}

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
  categories?: { slug?: string | null } | null;
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
    description: (() => {
      const fromShort = product.short_description
        ? product.short_description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
        : "";
      const fromAi = String(
        (product as { specs?: Record<string, unknown> }).specs?.ai_summary ?? ""
      ).trim();
      return fromShort || fromAi || undefined;
    })(),
    sku: product.sku ?? undefined,
    image: images.length
      ? images
      : [`${SITE_URL}${categoryOgFallback(product.categories?.slug)}`],
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

/**
 * CollectionPage schema for product category/listing pages.
 * Optionally includes an ItemList of products for richer Google results.
 */
export function collectionPageSchema(args: {
  name: string;
  description: string;
  url: string;
  image?: string;
  items?: { name: string; url: string; image?: string | null }[];
}) {
  const fullUrl = args.url.startsWith("http") ? args.url : `${SITE_URL}${args.url}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    description: args.description,
    url: fullUrl,
    image: args.image
      ? args.image.startsWith("http") ? args.image : `${SITE_URL}${args.image}`
      : undefined,
    publisher: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
  };
  if (args.items?.length) {
    schema.mainEntity = {
      "@type": "ItemList",
      itemListElement: args.items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: p.url.startsWith("http") ? p.url : `${SITE_URL}${p.url}`,
        image: p.image
          ? p.image.startsWith("http") ? p.image : `${SITE_URL}${p.image}`
          : undefined,
      })),
    };
  }
  return schema;
}

/**
 * Generic WebPage schema for informational pages (applications, about, etc).
 */
export function webPageSchema(args: {
  type?: "WebPage" | "AboutPage";
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  const fullUrl = args.url.startsWith("http") ? args.url : `${SITE_URL}${args.url}`;
  return {
    "@context": "https://schema.org",
    "@type": args.type ?? "WebPage",
    name: args.name,
    description: args.description,
    url: fullUrl,
    image: args.image
      ? args.image.startsWith("http") ? args.image : `${SITE_URL}${args.image}`
      : undefined,
    publisher: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
    inLanguage: "en-ZA",
  };
}
