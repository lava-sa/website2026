import { Star } from "lucide-react";
import StructuredReviewBody from "@/components/reviews/StructuredReviewBody";
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
        {reviews.map((review) => {
          const hasStructured = review.answers && review.answers.length > 0;
          return (
            <blockquote
              key={review.id}
              className="bg-surface border border-border/80 p-4 flex flex-col gap-2.5"
            >
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i <= review.rating ? "fill-secondary text-secondary" : "text-border"}`}
                  />
                ))}
              </div>
              {review.headline && (
                <p className="text-xs font-black text-primary leading-snug">{review.headline}</p>
              )}
              {hasStructured ? (
                <StructuredReviewBody answers={review.answers!} compact className="text-[13px]" />
              ) : review.text ? (
                <p className="text-[13px] text-copy leading-relaxed italic line-clamp-6">
                  &ldquo;{review.text}&rdquo;
                </p>
              ) : null}
              <footer className="text-[10px] text-copy-muted pt-1 border-t border-border/60">
                <span className="font-bold text-primary">{review.name}</span>
                {" · "}
                {review.location} · {review.date}
              </footer>
            </blockquote>
          );
        })}
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
