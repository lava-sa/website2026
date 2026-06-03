import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/seo";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Home v2 — LAVA Vacuum Sealers South Africa",
  description:
    "Test homepage v2 for Lava-SA with clear category structure: vacuum machines, bags, rolls, containers, butchery accessories and sous vide.",
  alternates: { canonical: "/home2" },
  robots: { index: false, follow: false },
};

type CategoryBlock = {
  key: string;
  categorySlug: string;
  href: string;
  h2: string;
  summary: string;
  fallbackImage: string;
};

const CATEGORY_BLOCKS: CategoryBlock[] = [
  {
    key: "machines",
    categorySlug: "vacuum-machines",
    href: "/products/vacuum-machines",
    h2: "Vacuum Machines",
    summary: "German-engineered LAVA vacuum sealers for home, hunting, butchery and commercial use.",
    fallbackImage: "/images/products/descriptions/welding-at-the-touch-of-a-button.webp",
  },
  {
    key: "bags",
    categorySlug: "vacuum-bags",
    href: "/products/vacuum-bags",
    h2: "Vacuum Bags",
    summary: "Embossed vacuum bags in multiple sizes for game, fish, biltong and bulk food storage.",
    fallbackImage: "/images/products/descriptions/double-sealing-lava-vacuum-machines.webp",
  },
  {
    key: "rolls",
    categorySlug: "vacuum-rolls",
    href: "/products/vacuum-rolls",
    h2: "Vacuum Rolls",
    summary: "Cut-to-length embossed rolls for flexible packaging and less waste.",
    fallbackImage: "/images/products/descriptions/limitless-variety-lava-vacuum-sealing-machines.webp",
  },
  {
    key: "containers",
    categorySlug: "containers-lids",
    href: "/products/containers-lids",
    h2: "Containers & Lids",
    summary: "Acrylic and stainless vacuum containers plus lids for marinating, storage and prep.",
    fallbackImage: "/images/products/descriptions/for-containers-and-jars-vacuum-sealing.webp",
  },
  {
    key: "butchery",
    categorySlug: "butchery-accessories",
    href: "/products/butchery-accessories",
    h2: "Butchery Accessories",
    summary: "Professional butchery tools, boards, hanging systems, protective wear and machinery.",
    fallbackImage: "/images/products/descriptions/lava-vacuum-sealers-quality-without-compromise.webp",
  },
  {
    key: "sous-vide",
    categorySlug: "sous-vide",
    href: "/products/sous-vide",
    h2: "Sous Vide",
    summary: "Precision sous-vide circulators and accessories for controlled temperature cooking.",
    fallbackImage: "/images/products/descriptions/welding-at-the-touch-of-a-button.webp",
  },
];

export const revalidate = 3600;

export default async function Home2Page() {
  const categoryProducts = await Promise.all(
    CATEGORY_BLOCKS.map(async (block) => {
      try {
        const products = await getProductsByCategory(block.categorySlug);
        return { key: block.key, products };
      } catch {
        return { key: block.key, products: [] as Product[] };
      }
    }),
  );

  const imageByKey = new Map(
    categoryProducts.map(({ key, products }) => [key, products[0]?.primary_image_url ?? null]),
  );

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Lava-SA Homepage v2",
    url: `${SITE_URL}/home2`,
    description:
      "Homepage v2 concept with explicit category architecture for local SEO and AI search clarity.",
    isPartOf: { "@type": "WebSite", name: "Lava-SA", url: SITE_URL },
  };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={websiteSchema} />

      <section className="bg-primary py-16 sm:py-20 border-b border-on-dark-border">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Homepage v2 concept</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-4xl">
            LAVA Vacuum Sealers South Africa
            <span className="block text-secondary mt-2 text-2xl sm:text-3xl font-black">
              Vacuum Machines, Bags, Rolls, Containers, Butchery & Sous Vide
            </span>
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-3xl leading-relaxed">
            This draft homepage is structured around your primary product categories so users,
            Google, and AI systems immediately see what Lava-SA sells.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {CATEGORY_BLOCKS.map((block) => {
              const imageSrc = imageByKey.get(block.key) || block.fallbackImage;
              return (
                <article key={block.key} className="border border-border bg-white overflow-hidden group">
                  <div className="aspect-[4/3] overflow-hidden bg-surface">
                    {/* Using plain img supports both local and DB image URLs */}
                    <img
                      src={imageSrc}
                      alt={`${block.h2} category image`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-black text-primary mb-3">{block.h2}</h2>
                    <p className="text-copy-muted mb-5">{block.summary}</p>
                    <Link
                      href={block.href}
                      className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
                    >
                      Shop {block.h2}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 border-y border-border">
        <div className="section-container max-w-4xl">
          <h2 className="text-3xl font-black text-primary mb-6">Why this structure is stronger</h2>
          <div className="space-y-3">
            {[
              "The H1 tells search engines and buyers exactly what you sell in South Africa.",
              "Each core product category is promoted as a clear H2 section.",
              "Every category links directly to a focused commercial landing page.",
              "The page keeps your premium brand feel while improving topical clarity.",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2 text-copy">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <span>{item}</span>
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary px-6 py-3 text-sm font-bold">
              Back to current homepage
            </Link>
            <Link href="/products/vacuum-machines" className="px-6 py-3 text-sm font-bold border border-border hover:border-primary text-primary transition-colors">
              Go to machines
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

