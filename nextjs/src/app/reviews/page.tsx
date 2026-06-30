import type { Metadata } from "next";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import PublicReviewCard from "@/components/reviews/PublicReviewCard";
import { fetchAllApprovedForReviewsPage } from "@/lib/reviews/queries";
import { createServiceClient } from "@/lib/supabase";

export const metadata: Metadata = pageMetadata({
  title: "Customer Reviews",
  description:
    "Read verified LAVA customer reviews — general service experiences and product-specific feedback on vacuum machines, bags, containers and more.",
  path: "/reviews",
});

export const revalidate = 3600;

async function getProductNames(slugs: string[]): Promise<Map<string, string>> {
  if (slugs.length === 0) return new Map();
  const supabase = createServiceClient();
  const { data } = await supabase.from("products").select("slug, name").in("slug", slugs);
  return new Map((data ?? []).map((p) => [p.slug as string, p.name as string]));
}

export default async function ReviewsPage() {
  const { general, byProduct, videos } = await fetchAllApprovedForReviewsPage();
  const productSlugs = Array.from(byProduct.keys());
  const productNames = await getProductNames(productSlugs);

  const productSections = productSlugs
    .map((slug) => ({
      slug,
      name: productNames.get(slug) ?? slug.replace(/-/g, " "),
      reviews: byProduct.get(slug) ?? [],
    }))
    .filter((s) => s.reviews.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  const hasContent = general.length > 0 || productSections.length > 0 || videos.length > 0;

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary py-16">
        <div className="section-container max-w-3xl text-center">
          <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-6 w-6 fill-secondary text-secondary" />
            ))}
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Customer Reviews</h1>
          <p className="text-white/70 text-base leading-relaxed">
            Real experiences from LAVA customers across South Africa — service, support, and product performance in their own words.
          </p>
        </div>
      </section>

      <div className="section-container py-16 space-y-16 max-w-5xl">
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
          <>
            {general.length > 0 && (
              <section>
                <div className="mb-8">
                  <p className="overline mb-2">Service &amp; Support</p>
                  <h2 className="text-2xl font-black text-primary">General Reviews</h2>
                  <p className="text-copy-muted mt-2">
                    Customers sharing their overall experience with Anneke and the Lava-SA team.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {general.map((review) => (
                    <PublicReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            )}

            {productSections.length > 0 && (
              <section className="space-y-12">
                <div>
                  <p className="overline mb-2">Products &amp; Machines</p>
                  <h2 className="text-2xl font-black text-primary">Product Reviews</h2>
                  <p className="text-copy-muted mt-2">
                    Reviews linked to specific LAVA machines and products.
                  </p>
                </div>
                {productSections.map((section) => (
                  <div key={section.slug}>
                    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                      <h3 className="text-xl font-bold text-primary">{section.name}</h3>
                      <Link
                        href={`/products/${section.slug}`}
                        className="text-sm font-bold text-secondary hover:text-primary transition-colors"
                      >
                        View product →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.reviews.map((review) => (
                        <PublicReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {videos.length > 0 && (
              <section>
                <div className="mb-8">
                  <p className="overline mb-2">Video Stories</p>
                  <h2 className="text-2xl font-black text-primary">Video Testimonials</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((review) => (
                    <PublicReviewCard key={review.id} review={review} showStructured={false} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <div className="text-center pt-8 border-t border-border">
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
