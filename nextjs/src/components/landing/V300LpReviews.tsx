import ReviewTestimonialCard from "@/components/reviews/ReviewTestimonialCard";
import reviewsData from "@/data/reviews.json";

const SLUG = "v300-premium-x";

export default function V300LpReviews() {
  const pack = reviewsData[SLUG as keyof typeof reviewsData];
  const rows = pack?.reviews?.slice(0, 4) ?? [];

  if (!rows.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
      {rows.map((r, idx) => (
        <ReviewTestimonialCard
          key={`${r.name}-${idx}`}
          quote={r.text}
          name={r.name}
          location={r.location}
          tagLine="Verified Buyer"
          rating={r.rating}
          className="h-full"
        />
      ))}
    </div>
  );
}
