import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight, Phone, ShieldCheck, Truck, RefreshCw,
  Star, Lock, Award,
} from "lucide-react";

import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
  getProductsByCategory,
  formatPrice,
  sortImages,
  SUB_CATEGORY_MAP,
} from "@/lib/products";
import { calculatePointsEarned, REWARDS_CONFIG } from "@/lib/rewards-config";
import ProductImageGallery from "@/components/shop/ProductImageGallery";
import IndustriesSection from "@/components/shop/IndustriesSection";
import ProductCard from "@/components/shop/ProductCard";
import StockBadge from "@/components/shop/StockBadge";
import AddToCartButton from "@/components/shop/AddToCartButton";
import OpenJanetButton from "@/components/shop/OpenJanetButton";

// ── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return {};
    const title = product.seo_title || `${product.name} — Lava-SA`;
    const description =
      product.seo_description ||
      product.short_description ||
      `Buy ${product.name} from Lava-SA. German quality, 2-year warranty, nationwide delivery.`;
    const image = product.primary_image_url || "/images/headers/lava-sa-vacuum-sealers-V300-header-pick-1250.jpg";
    const canonical = `/products/${slug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        images: [{ url: image, alt: product.name }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {};
  }
}

import reviewsData from "@/data/reviews.json";
import JsonLd from "@/components/seo/JsonLd";
import { productSchema, breadcrumbSchema } from "@/lib/seo";

// ── Spec labels ───────────────────────────────────────────────────────────────
const SPEC_LABELS: Record<string, string> = {
  pumps:         "Number of Pumps",
  suction_power: "Suction Power",
  max_vacuum:    "Max Vacuum Pressure",
  gauge:         "Pressure Gauge",
  seal_width:    "Sealing Width",
  double_seal:   "Double Seal Strip",
  triple_seal:   "Triple Seal Strip",
  manual_seal:   "Manual Sealing",
  auto_seal:     "Automatic Sealing",
  fluid_extract: "Fluid Extraction",
  filter_system: "Filter System",
  colour:        "Colour",
  voltage:       "Voltage",
  power:         "Power",
  dimensions:    "Dimensions (L×W×H)",
  weight:        "Weight",
  warranty:      "Warranty",
  made_in:       "Made In",
};

// ── Default Fallback Reviews ──────────────────────────────────────────────────
const FALLBACK_REVIEWS = [
  { name: "Thomas S.",    location: "Gauteng",      rating: 5, date: "March 2026",    text: "Absolutely outstanding machine. I've been vacuum sealing game meat for 12 years and this is by far the best I've owned. The double seal is rock solid." },
  { name: "Caroline D.", location: "Western Cape",  rating: 5, date: "February 2026", text: "We use it every week for biltong prep and bulk cooking. The automatic mode makes it so quick. German quality is evident in every detail." },
  { name: "Riël A.",     location: "Free State",    rating: 5, date: "January 2026",  text: "Bought it for hunting season. Works perfectly — even handled wet meat with no issues. The pressure gauge gives me confidence every time." },
];

// ── Whatsapp number ───────────────────────────────────────────────────────────
const WA_NUMBER = "27721605556";

// ── Consumable compatibility helpers ─────────────────────────────────────────

/**
 * Parse a machine's max sealing width (in cm) from its spec string.
 * Handles "300 mm", "30 cm", "300mm", plain "300" (assumed mm).
 * Returns 999 (no restriction) if the spec is missing or unparseable.
 */
function getMachineMaxWidthCm(sealWidthSpec: string | undefined): number {
  if (!sealWidthSpec) return 999;
  const mmMatch = String(sealWidthSpec).match(/(\d+(?:\.\d+)?)\s*mm/i);
  if (mmMatch) return parseFloat(mmMatch[1]) / 10;
  const cmMatch = String(sealWidthSpec).match(/(\d+(?:\.\d+)?)\s*cm/i);
  if (cmMatch) return parseFloat(cmMatch[1]);
  const numOnly = String(sealWidthSpec).match(/^(\d+(?:\.\d+)?)$/);
  if (numOnly) return parseFloat(numOnly[1]) / 10; // assume mm
  return 999;
}

/**
 * Extract the width dimension (in cm) from a bag or roll product name.
 * E.g. "Embossed Vacuum Bags 20 × 30 cm" → 20
 *      "Vacuum Roll 15 cm × 6 m"          → 15
 *      "Embossed Bags 13 × 22.5 cm"       → 13
 */
function getConsumableWidthCm(name: string): number {
  // First number followed by cm then × — e.g. "15 cm × 6 m"
  const cmCross = name.match(/(\d+(?:\.\d+)?)\s*cm\s*[×xX]/i);
  if (cmCross) return parseFloat(cmCross[1]);
  // First number followed by × — e.g. "20 × 30 cm"
  const cross = name.match(/(\d+(?:\.\d+)?)\s*[×xX]/);
  if (cross) return parseFloat(cross[1]);
  // Standalone cm value — e.g. "20 cm wide"
  const cm = name.match(/\b(\d+(?:\.\d+)?)\s*cm/i);
  if (cm) return parseFloat(cm[1]);
  return 0; // unknown — include by default
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product = null;
  let related: Awaited<ReturnType<typeof getRelatedProducts>> = [];

  try {
    product = await getProductBySlug(slug);
    if (product?.categories) {
      related = await getRelatedProducts(product.categories.slug, slug, 3);
    }
  } catch { /* DB not ready */ }

  if (!product) notFound();

  const images   = sortImages(product.product_images ?? []);
  const specs    = product.specs ?? {};
  const hasSpecs = Object.keys(specs).length > 0;
  const isOnOrder = product.stock_status === "on_order";
  const price     = product.sale_price ?? product.regular_price;
  const isVacuumMachine = product.categories?.slug === "vacuum-machines";

  // ── Consumables (bags + rolls) — only loaded on machine pages ───────────────
  let compatibleBags: Awaited<ReturnType<typeof getProductsByCategory>> = [];
  let compatibleRolls: Awaited<ReturnType<typeof getProductsByCategory>> = [];

  if (isVacuumMachine) {
    try {
      const [allBags, allRolls] = await Promise.all([
        getProductsByCategory("vacuum-bags"),
        getProductsByCategory("vacuum-rolls"),
      ]);
      const maxWidth = getMachineMaxWidthCm(specs.seal_width as string | undefined);
      compatibleBags  = allBags.filter(b => getConsumableWidthCm(b.name) <= maxWidth).slice(0, 4);
      compatibleRolls = allRolls.filter(r => getConsumableWidthCm(r.name) <= maxWidth).slice(0, 4);
    } catch { /* DB not ready — section simply won't render */ }
  }

  const waMessage = encodeURIComponent(`Hi, I'm interested in the ${product.name}. Can you help me?`);
  const waUrl     = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;

  // Get specific reviews or use fallback
  const productReviews = (reviewsData as any)[product.slug] || {
    average_rating: 5.0,
    total_reviews: FALLBACK_REVIEWS.length,
    reviews: FALLBACK_REVIEWS
  };

  const prodLd = productSchema(product, productReviews);
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    ...(product.categories
      ? [{ name: product.categories.name, url: `/products/${product.categories.slug}` }]
      : []),
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[prodLd, crumbLd]} />

      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <nav className="bg-surface border-b border-border py-4">
        <div className="section-container flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-copy-muted font-bold uppercase tracking-wider">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-secondary/40 shrink-0" />
          
          {/* Level 1: Category */}
          {product.categories && (
            <>
              <Link 
                href={`/products/${product.categories.slug}`} 
                className="hover:text-secondary transition-colors"
              >
                {product.categories.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-secondary/40 shrink-0" />
            </>
          )}

          {/* Level 2: Sub-category (via tags) */}
          {(() => {
            const subCatTag = product.tags?.find(tag => SUB_CATEGORY_MAP[tag]);
            if (subCatTag) {
              const subCat = SUB_CATEGORY_MAP[subCatTag];
              return (
                <>
                  <Link 
                    href={subCat.href} 
                    className="hover:text-secondary transition-colors"
                  >
                    {subCat.name}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-secondary/40 shrink-0" />
                </>
              );
            }
            return null;
          })()}

          <span className="text-primary truncate font-black">{product.name}</span>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — Hero: Gallery + Purchase Panel
      ════════════════════════════════════════════════════════════════ */}
      <section className="py-10">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* ── Left: Gallery ─────────────────────────────────────── */}
            <ProductImageGallery images={images} productName={product.name} />

            {/* ── Right: Purchase Panel ─────────────────────────────── */}
            <div className="flex flex-col gap-5">

              {/* SKU */}
              <div className="flex items-center gap-3">
                {product.sku && (
                  <span className="text-xs text-copy-muted font-mono">SKU: {product.sku}</span>
                )}
              </div>

              {/* Product name */}
              <h1 className="text-3xl sm:text-4xl font-black text-primary leading-tight">
                {product.name}
              </h1>

              {/* Star rating row */}
              <a href="#reviews" className="flex items-center gap-2 w-fit">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= Math.round(productReviews.average_rating) ? "fill-secondary text-secondary" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-primary">{productReviews.average_rating.toFixed(1)}</span>
                <span className="text-sm text-copy-muted underline hover:text-primary transition-colors">
                  ({productReviews.total_reviews} reviews)
                </span>
              </a>

              {/* Short description — emotional, problem-solving */}
              {product.short_description && (
                <p className="text-base text-copy leading-relaxed border-l-4 border-secondary pl-4">
                  {product.short_description}
                </p>
              )}

              {/* Price is now handled dynamically within the AddToCartButton or beneath this node */}

              {/* CTA — Add to Cart + WhatsApp */}
              {isOnOrder ? (
                <>
                  <div className="flex flex-col items-start gap-1 mb-4">
                    <StockBadge status={product.stock_status} quantity={product.stock_quantity} />
                    <div className="flex items-baseline gap-3 py-4 border-y border-border w-full">
                      {product.sale_price ? (
                        <>
                          <span className="text-4xl font-black text-primary">{formatPrice(product.sale_price)}</span>
                          <span className="text-xl text-copy-muted line-through">{formatPrice(product.regular_price)}</span>
                          <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2.5 py-1">
                            Save {Math.round((1 - product.sale_price / product.regular_price) * 100)}%
                          </span>
                        </>
                      ) : (
                        <span className="text-4xl font-black text-primary">{formatPrice(product.regular_price)}</span>
                      )}
                      <span className="text-xs text-copy-muted">incl. VAT</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#075E54] text-white font-bold py-4 text-base hover:bg-[#064d45] transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp to Order
                  </a>
                  <a href="tel:+27721605556"
                    className="btn-primary flex items-center justify-center gap-2 text-base py-4">
                    <Phone className="h-5 w-5" /> Call: +27 72 160 5556
                  </a>
                </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-1">
                  <AddToCartButton
                    product={{ id: product.id, slug: product.slug, name: product.name, price, image: product.primary_image_url, sku: product.sku }}
                    funnelSlug={undefined}
                    priceDisplay={
                      <div className="flex flex-col items-start gap-1">
                        <StockBadge status={product.stock_status} quantity={product.stock_quantity} />
                        <div className="flex items-baseline gap-3">
                          {product.sale_price ? (
                            <>
                              <span className="text-4xl sm:text-[42px] font-black text-primary leading-none tracking-tight">{formatPrice(product.sale_price)}</span>
                              <span className="text-xl text-copy-muted line-through">{formatPrice(product.regular_price)}</span>
                              <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2.5 py-1 ml-1 rounded-sm shadow-sm hidden sm:inline-block">
                                Save {Math.round((1 - product.sale_price / product.regular_price) * 100)}%
                              </span>
                            </>
                          ) : (
                            <span className="text-4xl sm:text-[42px] font-black text-primary leading-none tracking-tight">{formatPrice(product.regular_price)}</span>
                          )}
                          <span className="text-[10px] text-copy-muted font-bold uppercase tracking-widest ml-1">incl. VAT</span>
                        </div>
                      </div>
                    }
                  />
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#075E54] text-white font-bold py-3.5 text-sm hover:bg-[#064d45] transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Us About This Product
                  </a>
                </div>
              )}

              {/* ── Lava Points — points earned on this purchase ─────── */}
              <Link
                href="/rewards"
                className="flex items-center justify-between gap-3 border-2 border-secondary/40 bg-secondary/5 hover:bg-secondary/10 hover:border-secondary transition-colors px-5 py-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary/15 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/80 leading-none">
                      Lava Points
                    </p>
                    <p className="text-base font-black text-primary mt-1 leading-tight">
                      Earn {calculatePointsEarned(price).toLocaleString("en-ZA")} Lava Points
                      <span className="text-sm font-semibold text-copy-muted ml-2">
                        (worth {formatPrice(calculatePointsEarned(price) * REWARDS_CONFIG.RAND_PER_POINT)} off your next order)
                      </span>
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-secondary group-hover:translate-x-0.5 transition-transform shrink-0">
                  How it works →
                </span>
              </Link>

              {/* ── Trust Stamps ─────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link href="/help/warranty"
                  className="flex items-center gap-2.5 border-2 border-primary bg-primary/5 px-3 py-3 hover:bg-primary/10 transition-colors group">
                  <Award className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-black text-primary uppercase tracking-wide leading-none">2-Year Warranty</p>
                    <p className="text-[9px] text-primary/70 font-medium mt-0.5">German factory guarantee</p>
                  </div>
                </Link>
                <Link href="/help/delivery"
                  className="flex items-center gap-2.5 border border-border bg-surface px-3 py-3 hover:border-primary transition-colors group">
                  <Truck className="h-5 w-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-primary leading-none">Free Delivery</p>
                    <p className="text-[9px] text-copy-muted mt-0.5">Orders over R2,500</p>
                  </div>
                </Link>
                <Link href="/help/returns"
                  className="flex items-center gap-2.5 border border-border bg-surface px-3 py-3 hover:border-primary transition-colors group">
                  <RefreshCw className="h-5 w-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-primary leading-none">30-Day Returns</p>
                    <p className="text-[9px] text-copy-muted mt-0.5">Hassle-free policy</p>
                  </div>
                </Link>
                <Link href="/contact"
                  className="flex items-center gap-2.5 border border-border bg-surface px-3 py-3 hover:border-primary transition-colors group">
                  <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-primary leading-none">Expert Support</p>
                    <p className="text-[9px] text-copy-muted mt-0.5">Talk to Anneke directly</p>
                  </div>
                </Link>
              </div>

              {/* ── Payment icons + SSL ───────────────────────────────── */}
              <div className="border border-border bg-surface p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <p className="text-xs font-black text-emerald-700 uppercase tracking-wide">
                    SSL Secure Checkout — Your payment is 100% protected
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2 w-full mt-3">
                  {[
                    { src: "/images/payment/payfast.png",             alt: "PayFast", className: "h-5 sm:h-5" },
                    { src: "/images/payment/visa.png",                alt: "Visa"                   },
                    { src: "/images/payment/mastercard.png",          alt: "Mastercard"             },
                    { src: "/images/payment/visa-verified.png",       alt: "Verified by Visa"       },
                    { src: "/images/payment/mastercard-securecode.png", alt: "Mastercard SecureCode" },
                  ].map(({ src, alt, className }) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img key={alt} src={src} alt={alt} className={`${className || "h-7 sm:h-8"} w-auto object-contain`} />
                  ))}
                </div>
              </div>

              {/* ── Chat with Janet card ──────────────────────────────── */}
              <OpenJanetButton />

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — Full Description
      ════════════════════════════════════════════════════════════════ */}
      {product.description && (
        <section className="py-20 bg-surface border-y border-border">
          <div className="section-container max-w-3xl mx-auto">
            <p className="overline mb-3">Everything you need to know</p>
            <h2 className="text-3xl font-bold text-primary mb-8">About This Machine</h2>
            <div
              className="prose prose-lg max-w-none text-copy"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — Specifications
      ════════════════════════════════════════════════════════════════ */}
      {hasSpecs && (
        <section className="py-20">
          <div className="section-container">
            <div className="max-w-2xl mx-auto">
              <p className="overline mb-3">Technical details</p>
              <h2 className="text-3xl font-bold text-primary mb-8">Specifications</h2>
              <table className="w-full text-sm border border-border">
                <tbody>
                  {Object.entries(specs).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-surface" : "bg-white"}>
                      <td className="py-3 px-5 font-semibold text-primary w-1/2 border-b border-border">
                        {SPEC_LABELS[key] ?? key.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-5 text-copy border-b border-border">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — Industries
      ════════════════════════════════════════════════════════════════ */}
      <IndustriesSection industryKeys={product.industries ?? []} />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5 — Compatible Bags & Rolls (machines only)
      ════════════════════════════════════════════════════════════════ */}
      {isVacuumMachine && (compatibleBags.length > 0 || compatibleRolls.length > 0) && (
        <section className="py-16 bg-surface border-y border-border">
          <div className="section-container">

            {/* Promo bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-10 p-5 bg-primary">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-1">Complete Your Setup</p>
                <p className="text-white font-black text-lg leading-tight">
                  Add R1,000+ in bags or rolls &amp; save 10% on your entire order
                </p>
              </div>
              <div className="shrink-0 bg-secondary text-white px-5 py-3 text-center">
                <p className="text-2xl font-black leading-none">10%</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5">OFF your order</p>
              </div>
            </div>

            {/* Row 1 — Bags */}
            {compatibleBags.length > 0 && (
              <div className="mb-12">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="overline mb-1">Compatible with this machine</p>
                    <h2 className="text-2xl font-bold text-primary">Vacuum Bags</h2>
                  </div>
                  <Link
                    href="/products/vacuum-bags"
                    className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-secondary hover:underline shrink-0"
                  >
                    See all bags <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {compatibleBags.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <div className="mt-4 sm:hidden">
                  <Link href="/products/vacuum-bags" className="text-sm font-bold text-secondary hover:underline">
                    See all vacuum bags →
                  </Link>
                </div>
              </div>
            )}

            {/* Row 2 — Rolls */}
            {compatibleRolls.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="overline mb-1">Compatible with this machine</p>
                    <h2 className="text-2xl font-bold text-primary">Vacuum Rolls</h2>
                    <p className="text-sm text-copy-muted mt-1">Cut to any length — no waste</p>
                  </div>
                  <Link
                    href="/products/vacuum-rolls"
                    className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-secondary hover:underline shrink-0"
                  >
                    See all rolls <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className={`grid gap-6 ${
                  compatibleRolls.length <= 2
                    ? "grid-cols-1 sm:grid-cols-2 sm:max-w-2xl sm:mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                }`}>
                  {compatibleRolls.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <div className="mt-4 sm:hidden">
                  <Link href="/products/vacuum-rolls" className="text-sm font-bold text-secondary hover:underline">
                    See all vacuum rolls →
                  </Link>
                </div>
              </div>
            )}

            <p className="text-xs text-copy-muted mt-8 text-center">
              * 10% discount applied automatically at checkout when bag/roll total reaches R1,000.
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6 — Reviews
      ════════════════════════════════════════════════════════════════ */}
      <section id="reviews" className="py-20">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="overline mb-2">Verified customers</p>
              <h2 className="text-3xl font-bold text-primary">What Customers Say</h2>
              
              {/* German Site Accreditation */}
              {(reviewsData as any)[product.slug] && (
                <p className="text-[10px] sm:text-xs text-copy-muted mt-2 font-medium">
                  Translated from <a href="https://www.la-va.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">www.la-va.com</a>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`h-5 w-5 ${i <= Math.round(productReviews.average_rating) ? "fill-secondary text-secondary" : "text-border"}`} />
                ))}
              </div>
              <div>
                <p className="font-black text-primary text-lg leading-none">{productReviews.average_rating.toFixed(1)} / 5.0</p>
                <p className="text-xs text-copy-muted">{productReviews.total_reviews} reviews</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            {productReviews.reviews.slice(0, 6).map((review: any) => (
              <div key={review.name + review.date} className="bg-white border border-border p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i <= review.rating ? "fill-secondary text-secondary" : "text-border"}`} />
                  ))}
                </div>
                {review.title && <p className="text-sm font-black text-primary">{review.title}</p>}
                <p className="text-sm text-copy leading-relaxed flex-1 italic">&ldquo;{review.text}&rdquo;</p>
                <div className="border-t border-border pt-4 flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">{review.name}</span>
                  <span className="text-copy-muted">{review.location || "Verified Buyer"} · {review.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/submit-review"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 hover:bg-primary hover:text-white transition-colors">
              <Star className="h-4 w-4" /> Leave Your Review
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7 — Related Machines
      ════════════════════════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="py-20 bg-surface border-t border-border">
          <div className="section-container">
            <div className="mb-8">
              <p className="overline mb-2">Also consider</p>
              <h2 className="text-3xl font-bold text-primary">Related Machines</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
