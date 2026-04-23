import Link from "next/link";
import Image from "next/image";

const QualitySection = () => {
  return (
    <section className="quality bg-white py-24">
      <div className="section-container">
        <div className="quality__grid grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: image ─────────────────────────────────────── */}
          <div className="quality__media group relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface shadow-xl">
              <Image
                src="/images/homepage/lava-v300-premium-x-vacuum-sealer-machine.webp"
                alt="LAVA V.300 Premium X vacuum sealer — German quality, engineered to perform for decades"
                fill
                className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* ── Right: copy ─────────────────────────────────────── */}
          <div className="quality__content">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-secondary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                LAVA Vacuum Sealers
              </span>
            </div>

            <h2 className="quality__heading font-heading text-4xl font-bold sm:text-5xl">
              You Can Rely on Our Quality
            </h2>
            <p className="mt-4 text-lg font-semibold text-primary">
              Unmatched Quality You Can Trust.
            </p>

            <div className="quality__body mt-6 space-y-4 text-[15px] leading-relaxed text-copy">
              <p>
                When you invest in LAVA vacuum sealers, you&apos;re choosing{" "}
                <strong className="font-semibold text-primary">high-performance vacuum sealing machines engineered to deliver decades of reliable service</strong>.
                Crafted with precision engineering and premium materials, our machines are designed
                to meet the demands of both professional and home use.
              </p>
              <p>
                Every LAVA machine undergoes{" "}
                <strong className="font-semibold text-primary">rigorous quality control</strong>,
                ensuring consistent sealing performance from the very first use to thousands of
                cycles later. Our commitment to quality means fewer replacements, less waste,
                and greater value for your investment.
              </p>
              <p>
                From our{" "}
                <strong className="font-semibold text-primary">stainless steel sealing bars</strong>{" "}
                to our{" "}
                <strong className="font-semibold text-primary">high-powered vacuum pumps</strong>,
                each component is selected to deliver the reliability that LAVA has been known for
                since 1982. When quality matters, professionals and home users alike choose LAVA.
              </p>
            </div>

            <Link
              href="/about/lasting-quality"
              className="mt-10 inline-flex items-center gap-2.5 border border-primary px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary-wash hover:-translate-y-0.5"
            >
              Explore LAVA&apos;s Lasting Quality
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

export default QualitySection;
