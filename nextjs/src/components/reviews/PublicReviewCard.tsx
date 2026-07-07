import Link from "next/link";
import { Star } from "lucide-react";
import ReviewTestimonialCard, {
  displayReviewToTestimonial,
} from "@/components/reviews/ReviewTestimonialCard";
import type { DisplayReview } from "@/lib/reviews/types";

type Props = {
  review: DisplayReview;
  showStructured?: boolean;
  compact?: boolean;
  className?: string;
};

export default function PublicReviewCard({
  review,
  showStructured = true,
  compact = false,
  className = "",
}: Props) {
  return (
    <ReviewTestimonialCard
      {...displayReviewToTestimonial(review)}
      showStructured={showStructured}
      compact={compact}
      className={className}
    />
  );
}

type SectionProps = {
  id?: string;
  title: string;
  subtitle?: string;
  reviewBlock: { average_rating: number; total_reviews: number; reviews: DisplayReview[] };
  reviewFormHref?: string;
  maxCards?: number;
  /** IDs already shown elsewhere on the page (e.g. under gallery). */
  excludeIds?: string[];
};

export function ProductReviewsSection({
  id = "reviews",
  title,
  subtitle,
  reviewBlock,
  reviewFormHref = "/submit-review",
  maxCards = 6,
  excludeIds = [],
}: SectionProps) {
  const exclude = new Set(excludeIds);
  const cards = reviewBlock.reviews.filter((r) => !exclude.has(r.id)).slice(0, maxCards);

  return (
    <section id={id} className="py-20 bg-surface border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="overline mb-2">Verified Customers</p>
            <h2 className="text-3xl font-black text-primary">{title}</h2>
            {subtitle && <p className="text-copy-muted mt-2 max-w-2xl">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i <= Math.round(reviewBlock.average_rating) ? "fill-secondary text-secondary" : "text-border"}`}
                />
              ))}
            </div>
            <div>
              <p className="font-black text-primary text-lg leading-none">
                {reviewBlock.average_rating.toFixed(1)} / 5.0
              </p>
              <p className="text-xs text-copy-muted">{reviewBlock.total_reviews} reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8 items-stretch">
          {cards.length > 0 ? (
            cards.map((review) => (
              <PublicReviewCard key={review.id} review={review} className="h-full" />
            ))
          ) : (
            <p className="col-span-full text-center text-sm text-copy-muted py-6">
              More reviews are shown above the product gallery.{" "}
              <a href={reviewFormHref} className="font-bold text-secondary hover:text-primary">
                Leave your review →
              </a>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={reviewFormHref}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 hover:bg-primary hover:text-white transition-colors"
          >
            <Star className="h-4 w-4" /> Leave Your Review
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
          >
            View all customer reviews →
          </Link>
        </div>
      </div>
    </section>
  );
}

type EmptySectionProps = {
  id?: string;
  title: string;
  reviewFormHref?: string;
};

export function ProductReviewsEmptySection({
  id = "reviews",
  title,
  reviewFormHref = "/submit-review",
}: EmptySectionProps) {
  return (
    <section id={id} className="py-20 bg-surface border-t border-border">
      <div className="section-container text-center">
        <p className="overline mb-2">Customer Reviews</p>
        <h2 className="text-3xl font-black text-primary mb-4">{title}</h2>
        <p className="text-copy-muted max-w-xl mx-auto mb-8">
          No reviews for this product yet. Be the first to share your experience.
        </p>
        <Link
          href={reviewFormHref}
          className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 hover:bg-primary hover:text-white transition-colors"
        >
          <Star className="h-4 w-4" /> Leave the first review
        </Link>
      </div>
    </section>
  );
}
