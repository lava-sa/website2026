import Link from "next/link";
import Image from "next/image";

const GreenLivingSection = () => {
  return (
    <section className="green-living bg-white py-24">
      <div className="section-container">
        <div className="green-living__grid grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: image ─────────────────────────────────────── */}
          <div className="green-living__media group relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface shadow-xl">
              <Image
                src="/images/homepage/lava-reforestation.webp"
                alt="LAVA — committed to reforestation and a sustainable tomorrow"
                fill
                className="object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* ── Right: copy ─────────────────────────────────────── */}
          <div className="green-living__content">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-secondary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Green Living
              </span>
            </div>

            <h2 className="green-living__heading font-heading text-4xl font-bold sm:text-5xl">
              Planting Roots for a Sustainable Tomorrow
            </h2>
            <p className="mt-4 text-lg font-semibold text-primary">
              A Legacy of Responsibility and Sustainability
            </p>

            <div className="green-living__body mt-6 space-y-4 text-[15px] leading-relaxed text-copy">
              <p>
                At LAVA, we&apos;re more than just a company crafting vacuum sealers —{" "}
                <strong className="font-semibold text-primary">we&apos;re stewards of our planet</strong>.
                Our green living commitment goes beyond sustainable product design. We actively
                partner with{" "}
                <strong className="font-semibold text-primary">reforestation initiatives</strong>{" "}
                and environmental programmes that help offset the carbon footprint of modern manufacturing.
              </p>
              <p>
                Every LAVA machine sold is a step toward{" "}
                <strong className="font-semibold text-primary">less food waste</strong>,{" "}
                <strong className="font-semibold text-primary">fewer plastic single-use bags</strong>,
                and a more mindful relationship with the resources our planet provides. We believe
                that premium quality and environmental responsibility are not trade-offs — they go
                hand in hand.
              </p>
              <p>
                When you choose LAVA, you&apos;re not just preserving food.{" "}
                <strong className="font-semibold text-primary">You&apos;re preserving the future</strong>{" "}
                for those who come after us. Join us in building a legacy of responsibility —
                one perfect seal at a time.
              </p>
            </div>

            <Link
              href="/about/green-mission"
              className="mt-10 inline-flex items-center gap-2.5 border border-primary px-8 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary-wash hover:-translate-y-0.5"
            >
              Join Our Green Mission
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

export default GreenLivingSection;
