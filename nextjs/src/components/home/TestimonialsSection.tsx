import Image from "next/image";

const testimonials = [
  {
    quote: "An outstanding product with excellent craftsmanship and performance. The price to performance ratio is very good. Delivery and packaging were perfect.",
    name: "Thomas S.",
    tag: "V.300 Premium · Verified Purchaser",
    country: "Germany",
    image: "/images/testimonials/thomas.jpg",
  },
  {
    quote: "I already own the previous model and am thrilled with the new design. The fact that I'm giving this as a gift says it all. I only gift products to my friends when I'm completely convinced of their quality.",
    name: "Caroline S.",
    tag: "V.100 Premium X · Verified Purchaser",
    country: "Germany",
    image: "/images/testimonials/caroline.jpg",
  },
  {
    quote: "A superb device. We treated ourselves to this machine for Christmas. I'm absolutely satisfied with its excellent quality. With minimal pressure, the device immediately begins creating the vacuum.",
    name: "Ralf A.",
    tag: "V.300® Premium X · Verified Purchaser",
    country: "Germany",
    image: "/images/testimonials/ralf.jpg",
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
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mt-5 mx-auto max-w-2xl text-base leading-relaxed text-copy">
            Discover why professionals and home users alike trust Lava vacuum sealers.
            These authentic reviews from <strong className="font-semibold text-primary">verified customers</strong> highlight the exceptional quality,
            performance, and reliability that have made our products the{" "}
            <strong className="font-semibold text-primary">preferred choice for vacuum sealing</strong>{" "}
            across South Africa and beyond.
          </p>
        </div>

        {/* ── Cards grid ─────────────────────────────────────────── */}
        <div className="testimonials__grid grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="testimonials__card uk-card uk-card-default flex flex-col justify-between"
            >
              <div className="uk-card-body">

                {/* Stars */}
                <div className="testimonials__stars mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--color-secondary)">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="testimonials__quote text-[15px] italic leading-relaxed text-copy">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="testimonials__attribution mt-8 border-t border-border pt-5 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="testimonials__avatar relative h-12 w-12 shrink-0 overflow-hidden bg-primary-wash">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-primary m-0">{t.name}</p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-copy-muted">
                      {t.country}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                      {t.tag}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
