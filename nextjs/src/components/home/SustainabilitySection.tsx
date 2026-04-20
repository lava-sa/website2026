import Link from "next/link";
import Image from "next/image";

const SustainabilitySection = () => {
  return (
    <section className="sustainability bg-surface py-24">
      <div className="section-container">
        <div className="sustainability__grid grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: copy ─────────────────────────────────────── */}
          <div className="sustainability__content">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-secondary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                LAVA Vacuum Sealers
              </span>
            </div>

            <h2 className="sustainability__heading font-heading text-4xl font-bold sm:text-5xl">
              Embracing Sustainability with LAVA&apos;s Long-Lasting Quality
            </h2>
            <p className="mt-4 text-lg font-semibold text-primary">
              Beyond Disposable Culture: A Commitment to Lasting Value
            </p>

            <div className="sustainability__body mt-6 space-y-4 text-[15px] leading-relaxed text-copy">
              <p>
                While many brands chase short-term wins with throwaway products, LAVA vacuum sealers
                prioritize{" "}
                <strong className="font-semibold text-primary">long-term customer satisfaction</strong>.
                Our machines are built to serve you for decades, not years — reducing the cycle of
                replacement and the waste that comes with it.
              </p>
              <p>
                By{" "}
                <strong className="font-semibold text-primary">extending the shelf life of your food</strong>,
                LAVA helps you reduce food waste at home and in your business. Less spoilage means
                fewer trips to the store, lower grocery bills, and a{" "}
                <strong className="font-semibold text-primary">smaller environmental footprint</strong>{" "}
                — all from one smart investment.
              </p>
              <p>
                Sustainability isn&apos;t a marketing term for us. It&apos;s engineered into every machine
                we build. From our{" "}
                <strong className="font-semibold text-primary">reusable vacuum bags</strong>{" "}
                to our{" "}
                <strong className="font-semibold text-primary">energy-efficient motors</strong>,
                every design decision at LAVA is made with longevity and responsibility in mind.
              </p>
            </div>

            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2.5 border border-primary px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary-wash hover:-translate-y-0.5"
            >
              Discover Sustainable Sealing
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* ── Right: image ─────────────────────────────────────── */}
          <div className="sustainability__media group relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-primary-wash shadow-xl">
              <Image
                src="/images/homepage/lava-sustainable.webp"
                alt="LAVA vacuum sealers — sustainability and durable design for South Africa"
                fill
                className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
