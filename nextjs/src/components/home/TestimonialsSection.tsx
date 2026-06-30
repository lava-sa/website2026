import ReviewTestimonialCard from "@/components/reviews/ReviewTestimonialCard";

const testimonials = [
  {
    quote:
      "An outstanding product with excellent craftsmanship and performance. The price to performance ratio is very good. Delivery and packaging were perfect.",
    name: "Thomas S.",
    tagLine: "V.300 Premium · Verified Purchaser",
    location: "Germany",
    avatarUrl: "/images/testimonials/thomas.jpg",
  },
  {
    quote:
      "I already own the previous model and am thrilled with the new design. The fact that I'm giving this as a gift says it all. I only gift products to my friends when I'm completely convinced of their quality.",
    name: "Caroline S.",
    tagLine: "V.100 Premium X · Verified Purchaser",
    location: "Germany",
    avatarUrl: "/images/testimonials/caroline.jpg",
  },
  {
    quote:
      "A superb device. We treated ourselves to this machine for Christmas. I'm absolutely satisfied with its excellent quality. With minimal pressure, the device immediately begins creating the vacuum.",
    name: "Ralf A.",
    tagLine: "V.300® Premium X · Verified Purchaser",
    location: "Germany",
    avatarUrl: "/images/testimonials/ralf.jpg",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials bg-surface py-24">
      <div className="section-container">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="testimonials__header mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Customer Reviews
            </span>
            <span className="h-px w-8 bg-secondary" />
          </div>
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">What Our Customers Say</h2>
          <p className="mt-5 mx-auto max-w-2xl text-base leading-relaxed text-copy">
            Discover why professionals and home users alike trust Lava vacuum sealers. These
            authentic reviews from{" "}
            <strong className="font-semibold text-primary">verified customers</strong> highlight the
            exceptional quality, performance, and reliability that have made our products the{" "}
            <strong className="font-semibold text-primary">preferred choice for vacuum sealing</strong>{" "}
            across South Africa and beyond.
          </p>
        </div>

        {/* ── Cards grid ─────────────────────────────────────────── */}
        <div className="testimonials__grid grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
          {testimonials.map((t, index) => (
            <ReviewTestimonialCard
              key={index}
              quote={t.quote}
              name={t.name}
              location={t.location}
              tagLine={t.tagLine}
              avatarUrl={t.avatarUrl}
              rating={5}
              className="testimonials__card h-full"
            />
          ))}
        </div>

        <p className="mt-10 text-center">
          <a
            href="/reviews"
            className="text-sm font-bold text-secondary hover:text-primary transition-colors"
          >
            Read all customer reviews →
          </a>
        </p>
      </div>
    </section>
  );
};

export default TestimonialsSection;
