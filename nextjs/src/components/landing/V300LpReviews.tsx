import { Star } from "lucide-react";
import reviewsData from "@/data/reviews.json";

const SLUG = "v300-premium-x";

export default function V300LpReviews() {
  const pack = reviewsData[SLUG as keyof typeof reviewsData];
  const rows = pack?.reviews?.slice(0, 4) ?? [];

  if (!rows.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {rows.map((r, idx) => (
        <blockquote
          key={`${r.name}-${idx}`}
          className="border-2 border-border bg-white p-5 shadow-sm"
        >
          <div className="flex gap-0.5 text-secondary mb-2">
            {Array.from({ length: r.rating }, (_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
            ))}
          </div>
          <p className="text-sm text-copy leading-relaxed">&ldquo;{r.text}&rdquo;</p>
          <footer className="mt-3 text-xs font-bold text-primary uppercase tracking-wide">
            {r.name}
            {r.location ? <span className="font-normal text-copy-muted normal-case"> · {r.location}</span> : null}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
