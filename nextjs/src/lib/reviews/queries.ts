import { createServiceClient } from "@/lib/supabase";
import reviewsData from "@/data/reviews.json";
import type { DbReview, DisplayReview, ReviewBlock, ReviewScope } from "./types";
import { formatReviewDate, getReviewAnswers, reviewExcerpt } from "./parse";

type StaticReviewEntry = {
  name: string;
  location?: string;
  date: string;
  rating: number;
  text: string;
  title?: string;
};

type StaticReviewsFile = Record<
  string,
  { average_rating: number; total_reviews: number; reviews: StaticReviewEntry[] }
>;

const staticReviews = reviewsData as StaticReviewsFile;

function dbToDisplay(review: DbReview): DisplayReview {
  const answers = getReviewAnswers(review.answers_json, review.review);
  const isVideo = review.review_type === "video";

  return {
    id: review.id,
    name: review.name,
    location: review.city || review.company || "South Africa",
    date: formatReviewDate(review.created_at),
    rating: review.rating ?? 5,
    headline: review.headline ?? undefined,
    text: isVideo ? undefined : reviewExcerpt(review.headline, answers, review.review),
    answers: isVideo ? undefined : answers,
    videoUrl: review.video_url ?? undefined,
    isVideo,
    productLabel: review.machine ?? undefined,
    source: "db",
  };
}

function staticToDisplay(review: StaticReviewEntry, slug: string, index: number): DisplayReview {
  return {
    id: `static-${slug}-${index}`,
    name: review.name,
    location: review.location || "Verified Buyer",
    date: review.date,
    rating: review.rating,
    headline: review.title,
    text: review.text,
    source: "static",
  };
}

function computeBlock(reviews: DisplayReview[]): ReviewBlock | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    average_rating: Math.round((total / reviews.length) * 10) / 10,
    total_reviews: reviews.length,
    reviews,
  };
}

export async function fetchApprovedDbReviews(): Promise<DbReview[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, created_at, name, email, company, city, machine, product_slug, review_scope, rating, headline, review, answers_json, approved, review_type, video_url, featured"
    )
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchApprovedDbReviews:", error.message);
    return [];
  }
  return (data ?? []) as DbReview[];
}

export async function fetchReviewsForProductSlug(slug: string): Promise<ReviewBlock | null> {
  const dbReviews = await fetchApprovedDbReviews();
  const dbForProduct = dbReviews
    .filter((r) => r.review_scope !== "general" && r.product_slug === slug)
    .map(dbToDisplay);

  const staticBlock = staticReviews[slug];
  const staticForProduct =
    dbForProduct.length > 0
      ? []
      : (staticBlock?.reviews ?? []).map((r, i) => staticToDisplay(r, slug, i));

  const merged = [...dbForProduct, ...staticForProduct];
  return computeBlock(merged);
}

export async function fetchGeneralReviews(limit = 12): Promise<DisplayReview[]> {
  const dbReviews = await fetchApprovedDbReviews();
  return dbReviews
    .filter((r) => r.review_scope === "general")
    .slice(0, limit)
    .map(dbToDisplay);
}

export async function fetchProductReviews(limit = 48): Promise<DisplayReview[]> {
  const dbReviews = await fetchApprovedDbReviews();
  return dbReviews
    .filter((r) => r.review_scope === "product" && !!r.product_slug)
    .slice(0, limit)
    .map(dbToDisplay);
}

export async function fetchAllApprovedForReviewsPage(): Promise<{
  general: DisplayReview[];
  byProduct: Map<string, DisplayReview[]>;
  videos: DisplayReview[];
}> {
  const dbReviews = await fetchApprovedDbReviews();
  const general: DisplayReview[] = [];
  const byProduct = new Map<string, DisplayReview[]>();
  const videos: DisplayReview[] = [];

  for (const row of dbReviews) {
    const display = dbToDisplay(row);
    if (row.review_type === "video") {
      videos.push(display);
      continue;
    }
    if (row.review_scope === "general") {
      general.push(display);
      continue;
    }
    if (row.product_slug) {
      const list = byProduct.get(row.product_slug) ?? [];
      list.push(display);
      byProduct.set(row.product_slug, list);
    }
  }

  return { general, byProduct, videos };
}

export function getStaticReviewBlock(slug: string): ReviewBlock | null {
  const block = staticReviews[slug];
  if (!block) return null;
  const reviews = block.reviews.map((r, i) => staticToDisplay(r, slug, i));
  return {
    average_rating: block.average_rating,
    total_reviews: block.total_reviews,
    reviews,
  };
}

export function scopeLabel(scope: ReviewScope | null | undefined): string {
  return scope === "general" ? "General service" : "Product review";
}
