import Image from "next/image";
import Link from "next/link";

const StaticHero = () => {
  return (
    <section className="hero relative min-h-[93vh] overflow-hidden">

      {/* ── Background image ────────────────────────────────────────── */}
      <Image
        src="/images/homepage/lava-precision-durability.webp"
        alt="Lava vacuum sealer — German-engineered precision"
        fill
        priority
        className="object-cover object-center"
      />

      {/* ── Gradient overlay: deep petrol left → mid-petrol centre → fades right */}
      <div className="absolute inset-0 bg-gradient-to-r from-petrol-800 via-primary to-[#073E4700]" />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="hero__container relative mx-auto flex min-h-[93vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="hero__content w-full max-w-2xl pt-8 pb-6 lg:pt-12 lg:pb-8">

          {/* Overline */}
          <div className="hero__overline mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Trusted by 350,000+ Customers Worldwide
            </span>
          </div>

          {/* H1 */}
          <h1 className="hero__heading font-heading text-[clamp(2.2rem,4vw,3.8rem)] font-bold uppercase leading-[1.08] tracking-wide text-white">
            Preserve food.<br />
            <em className="not-italic text-secondary">Like a professional.</em>
          </h1>

          {/* Sub-heading */}
          <p className="hero__subheading mt-5 max-w-lg text-base leading-relaxed text-on-dark-muted">
            German-engineered vacuum sealers and accessories that chefs, hunters,
            and households rely on. For over 44 years, Lava has set the standard
            for precision food preservation.
          </p>

          {/* CTAs */}
          <div className="hero__cta-group mt-7 flex flex-wrap gap-4">
            <Link href="/products/vacuum-machines" className="btn-primary shadow-lg">
              Shop Vacuum Sealers
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/applications"
              className="inline-flex items-center gap-2.5 border border-primary-mid bg-on-dark-subtle px-8 py-4 text-sm font-semibold text-white transition-all hover:border-primary-mid hover:bg-on-dark-hover hover:-translate-y-0.5"
            >
              Explore Applications
            </Link>
          </div>

          {/* Stats row */}
          <div className="hero__stats mt-8 grid grid-cols-3 gap-6 border-t border-primary-mid pt-6">
            {[
              { value: "40+",    label: "Years German Engineering" },
              { value: "350k+",  label: "Customers Worldwide" },
              { value: "2-Year", label: "Machine Warranty" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-heading text-2xl font-bold text-on-dark-muted">{s.value}</p>
                <p className="mt-0.5 text-xs text-on-dark-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Floating trust badge ─────────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 flex items-center gap-3 bg-white px-5 py-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.9L12 18l-6.1 3.1 1.2-6.9-5-4.9 6.9-1L12 2z" fill="white" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-primary">SA Distributor Since 2007</p>
          <p className="text-[10px] text-copy-muted">Exclusively authorised for South Africa</p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-petrol-800 to-[#042C3600]" />
    </section>
  );
};

export default StaticHero;
