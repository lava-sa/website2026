import Link from "next/link";
import Image from "next/image";

const HeritageSection = () => {
  return (
    <section className="heritage bg-gray-100 py-24">
      <div className="section-container">
        <div className="heritage__grid grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: image ─────────────────────────────────────── */}
          <div className="heritage__media group relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[3/2] overflow-hidden bg-surface shadow-xl">
              <Image
                src="/images/about/landig-family.webp"
                alt="The Landig family — makers of Lava vacuum sealers, Bad Saulgau Germany"
                fill
                className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
              />

              {/* Year badge */}
              <div className="absolute bottom-4 right-4 bg-white px-4 py-3 shadow-lg">
                <p className="font-heading text-2xl font-bold text-primary">1982</p>
                <p className="text-[10px] font-medium text-copy-muted">Founded in Germany</p>
              </div>
            </div>
          </div>

          {/* ── Right: copy ─────────────────────────────────────── */}
          <div className="heritage__content">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-secondary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                A Family Business from Baden-Württemberg
              </span>
            </div>

            <h2 className="heritage__heading font-heading text-4xl font-bold sm:text-5xl">
              44 years of precision.
            </h2>
            <p className="mt-1.5 text-lg font-semibold text-primary">
              Now in South Africa.
            </p>

            {/* Quote */}
            <blockquote className="heritage__quote my-8 border-l-4 border-secondary pl-6">
              <p className="text-base italic leading-relaxed text-copy">
                &ldquo;For two generations, we, the Landig family, have been passionately
                running our family business in Bad Saulgau, Upper Swabia. What began
                over 44 years ago as a small specialist operation has evolved into a
                global leader in vacuum sealing technology.&rdquo;
              </p>
            </blockquote>

            <p className="mb-8 text-sm leading-relaxed text-copy">
              Lava South Africa has been the exclusive distributor since 2007 —
              bringing German-factory quality directly to SA homes, hunting camps,
              butcheries, and cold rooms.
            </p>

            {/* Credential chips */}
            <div className="heritage__credentials mb-10 grid grid-cols-2 gap-2.5">
              {[
                "Made in Germany · Since 1982",
                "Exclusive SA Distributor · 2007",
                "2-Year Machine Warranty",
                "350,000+ Customers Worldwide",
              ].map((c) => (
                <div
                  key={c}
                  className="heritage__credential flex items-center gap-2.5 border border-border bg-surface px-4 py-3"
                >
                  <span className="h-1.5 w-1.5 shrink-0 bg-secondary" />
                  <span className="text-xs font-medium text-copy">{c}</span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 border border-primary px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary-wash hover:-translate-y-0.5"
            >
              Our Story
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
