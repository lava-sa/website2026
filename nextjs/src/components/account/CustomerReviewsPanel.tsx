import Link from "next/link";
import { MessageSquare, Star, Video } from "lucide-react";
import { formatDate } from "@/lib/format";

export type CustomerReview = {
  id: string;
  headline: string | null;
  rating: number | null;
  review_type: string | null;
  approved: boolean;
  created_at: string;
  product_slug: string | null;
  machine: string | null;
  review_scope: string | null;
};

type Props = {
  reviews: CustomerReview[];
};

function reviewLabel(review: CustomerReview): string {
  if (review.review_scope === "general") return "General review";
  if (review.product_slug) return review.product_slug.replace(/-/g, " ");
  if (review.machine) return review.machine.replace(/^\[/, "").replace(/\]$/, "");
  return "Product review";
}

export default function CustomerReviewsPanel({ reviews }: Props) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="font-heading text-2xl font-bold text-primary">My Reviews</h2>
        <Link
          href="/submit-review"
          className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold px-5 py-2.5 text-sm hover:bg-secondary/90 transition-colors shrink-0"
        >
          <MessageSquare className="h-4 w-4" />
          Submit a Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-border p-8 text-center">
          <MessageSquare className="h-8 w-8 text-copy-muted mx-auto mb-3" />
          <p className="text-copy-muted mb-4">
            You haven&apos;t submitted any reviews yet. Share your LAVA experience with other customers.
          </p>
          <Link
            href="/submit-review"
            className="text-sm font-bold text-primary hover:text-secondary transition-colors"
          >
            Write your first review →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const isVideo = review.review_type === "video";
            return (
              <div key={review.id} className="bg-white border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isVideo ? (
                      <Video className="h-4 w-4 text-secondary shrink-0" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-secondary shrink-0" />
                    )}
                    <p className="font-bold text-primary">
                      {review.headline ?? (isVideo ? "Video testimonial" : "Written review")}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 border ${
                      review.approved
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {review.approved ? "Published" : "Pending approval"}
                  </span>
                </div>
                <p className="text-xs text-copy-muted mb-2 capitalize">{reviewLabel(review)}</p>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1 text-secondary">
                    {review.rating != null ? (
                      <>
                        <Star className="h-3.5 w-3.5 fill-secondary" />
                        <span className="font-bold">{review.rating}/5</span>
                      </>
                    ) : (
                      <span className="text-copy-muted">No rating</span>
                    )}
                  </div>
                  <span className="text-copy-muted">{formatDate(review.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
