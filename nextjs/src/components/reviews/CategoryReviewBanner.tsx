import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { reviewFormHrefForCategory } from "@/lib/review-forms";

export default function CategoryReviewBanner({
  categorySlug,
  title = "Used this product? Share your experience",
  description = "A detailed review helps other South Africans choose with confidence — and helps us keep improving.",
}: {
  categorySlug: string;
  title?: string;
  description?: string;
}) {
  const href = reviewFormHrefForCategory(categorySlug);

  return (
    <section className="py-14 bg-surface border-t border-border">
      <div className="section-container max-w-2xl text-center">
        <div className="flex justify-center gap-1 mb-3" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
          ))}
        </div>
        <h2 className="text-2xl font-black text-primary mb-2">{title}</h2>
        <p className="text-copy-muted text-sm leading-relaxed mb-6">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 hover:bg-primary hover:text-white transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          Leave a Detailed Review
        </Link>
      </div>
    </section>
  );
}
