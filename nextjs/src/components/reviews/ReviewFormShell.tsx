import { Star } from "lucide-react";
import ReviewFormClient from "@/components/reviews/ReviewFormClient";
import type { ReviewFormVariant } from "@/lib/review-forms";
import { getReviewFormConfig } from "@/lib/review-forms";

export default function ReviewFormShell({
  variant,
  initialTab,
}: {
  variant: ReviewFormVariant;
  initialTab: "write" | "video";
}) {
  const config = getReviewFormConfig(variant);

  return (
    <main className="min-h-screen bg-surface">
      <section className="bg-primary py-16">
        <div className="section-container max-w-2xl text-center">
          <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-6 w-6 fill-secondary text-secondary" />
            ))}
          </div>
          <h1 className="text-4xl font-black text-white mb-3">{config.pageTitle}</h1>
          <p className="text-white/70 text-base leading-relaxed">{config.heroSubtitle}</p>
        </div>
      </section>

      <div className="section-container max-w-2xl py-12">
        <div className="bg-white shadow-sm border border-border px-8 py-10 sm:px-10">
          <ReviewFormClient variant={variant} initialTab={initialTab} />
        </div>
        <p className="text-center text-xs text-copy-muted mt-6">
          All submissions are moderated by Anneke before going live · Your email is never published
        </p>
      </div>
    </main>
  );
}
