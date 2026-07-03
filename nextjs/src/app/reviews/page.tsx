import type { Metadata } from "next";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import ReviewsCategoryNav from "@/components/reviews/ReviewsCategoryNav";
import ReviewsSectionContent from "@/components/reviews/ReviewsSectionContent";
import { fetchAllApprovedForReviewsPage } from "@/lib/reviews/queries";
import {
  REVIEW_SECTIONS,
  buildReviewCatalog,
  resolveDefaultSection,
  reviewsHref,
  type ReviewSectionId,
} from "@/lib/reviews/navigation";
import { createServiceClient } from "@/lib/supabase";

export const metadata: Metadata = pageMetadata({
  title: "Customer Reviews",
  description:
    "Read verified LAVA customer reviews — general service experiences and product-specific feedback on vacuum machines, bags, containers and more.",
  path: "/reviews",
});

export const revalidate = 3600;

type Props = {
  searchParams: Promise<{ section?: string; product?: string }>;
};

function parseSection(value: string | undefined): ReviewSectionId | null {
  if (!value) return null;
  return REVIEW_SECTIONS.some((s) => s.id === value) ? (value as ReviewSectionId) : null;
}

async function getProductNames(slugs: string[]): Promise<Map<string, string>> {
  if (slugs.length === 0) return new Map();
  const supabase = createServiceClient();
  const { data } = await supabase.from("products").select("slug, name").in("slug", slugs);
  return new Map((data ?? []).map((p) => [p.slug as string, p.name as string]));
}

async function getProductMeta(slugs: string[]): Promise<Map<string, import("@/components/reviews/ReviewsSectionContent").ProductSpotlight>> {
  if (slugs.length === 0) return new Map();
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select("slug, name, primary_image_url, short_description")
    .in("slug", slugs)
    .eq("is_published", true);
  return new Map(
    (data ?? []).map((p) => [
      p.slug as string,
      {
        slug: p.slug as string,
        name: p.name as string,
        primary_image_url: (p.primary_image_url as string | null) ?? null,
        short_description: (p.short_description as string | null) ?? null,
      },
    ])
  );
}

export default async function ReviewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const rawData = await fetchAllApprovedForReviewsPage();
  const productSlugs = Array.from(rawData.byProduct.keys());
  const productNames = await getProductNames(productSlugs);
  const catalog = buildReviewCatalog(rawData, productNames);

  const hasContent = catalog.totalReviewCount > 0;

  let section = parseSection(params.section?.trim());
  const productSlug = params.product?.trim();

  if (!section && hasContent) {
    const defaultSection = resolveDefaultSection(catalog);
    const firstProduct =
      defaultSection === "vacuum-machines" ||
      defaultSection === "bags-rolls" ||
      defaultSection === "containers-lids"
        ? catalog.bySection.get(defaultSection)?.[0]?.slug
        : undefined;
    redirect(reviewsHref(defaultSection, firstProduct));
  }

  section = section ?? "general";

  const sectionProducts =
    section !== "general" && section !== "videos"
      ? catalog.bySection.get(section) ?? []
      : [];
  const metaSlugs = sectionProducts.map((p) => p.slug);
  const productMeta = await getProductMeta(metaSlugs);

  const spotlight = productSlug ? productMeta.get(productSlug) ?? null : null;

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary py-14">
        <div className="section-container max-w-3xl text-center">
          <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-6 w-6 fill-secondary text-secondary" />
            ))}
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Customer Reviews</h1>
          <p className="text-white/70 text-base leading-relaxed">
            Real experiences from LAVA customers across South Africa — browse by category or machine model.
          </p>
        </div>
      </section>

      {hasContent && (
        <ReviewsCategoryNav
          catalog={catalog}
          activeSection={section}
          activeProduct={productSlug}
        />
      )}

      <div className="section-container py-12 max-w-6xl">
        {!hasContent ? (
          <div className="text-center py-16 border border-border bg-surface">
            <MessageSquare className="h-12 w-12 text-copy-muted mx-auto mb-4" />
            <p className="font-bold text-primary text-lg mb-2">Reviews coming soon</p>
            <p className="text-copy-muted mb-6">Approved customer reviews will appear here.</p>
            <Link
              href="/submit-review"
              className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-8 py-3 hover:bg-secondary/90 transition-colors"
            >
              Write Your Review
            </Link>
          </div>
        ) : (
          <ReviewsSectionContent
            catalog={catalog}
            section={section}
            productSlug={productSlug}
            spotlight={spotlight}
            productMeta={productMeta}
          />
        )}

        <div className="text-center pt-12 mt-12 border-t border-border">
          <p className="text-copy-muted mb-4">Own a LAVA product? We&apos;d love to hear from you.</p>
          <Link
            href="/submit-review"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 hover:bg-primary hover:text-white transition-colors"
          >
            <Star className="h-4 w-4" /> Write Your Review
          </Link>
        </div>
      </div>
    </main>
  );
}
