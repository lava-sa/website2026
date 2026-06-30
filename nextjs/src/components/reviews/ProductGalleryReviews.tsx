import PublicReviewCard from "@/components/reviews/PublicReviewCard";
import type { DisplayReview } from "@/lib/reviews/types";

type Props = {
  reviews: DisplayReview[];
  totalReviewCount: number;
};

/** Two highlight reviews under the product gallery — links down to #reviews. */
export default function ProductGalleryReviews({ reviews, totalReviewCount }: Props) {
  if (reviews.length === 0) return null;

  const remaining = Math.max(0, totalReviewCount - reviews.length);

  return (
    <aside className="hidden lg:flex flex-col gap-4 pt-2 border-t border-border/60">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">
          Customer highlights
        </p>
        {remaining > 0 && (
          <a
            href="#reviews"
            className="text-[11px] font-bold text-primary hover:text-secondary transition-colors whitespace-nowrap"
          >
            {remaining} more review{remaining === 1 ? "" : "s"} ↓
          </a>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <PublicReviewCard key={review.id} review={review} compact showStructured />
        ))}
      </div>

      {totalReviewCount > reviews.length && (
        <a
          href="#reviews"
          className="text-center text-xs font-bold text-secondary hover:text-primary transition-colors py-1"
        >
          Read all {totalReviewCount} customer reviews ↓
        </a>
      )}
    </aside>
  );
}
