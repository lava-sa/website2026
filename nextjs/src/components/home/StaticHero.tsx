import Image from "next/image";
import Link from "next/link";
import type { SitePageContent } from "@/lib/content/site-pages-types";
import { DEFAULT_HOME } from "@/lib/content/site-pages-defaults";

type Props = {
  content?: Pick<SitePageContent, "hero" | "ctas" | "stats" | "trustBadge">;
};

const StaticHero = ({ content }: Props) => {
  const hero = { ...DEFAULT_HOME.hero, ...content?.hero };
  const ctas = { ...DEFAULT_HOME.ctas, ...content?.ctas };
  const stats = content?.stats?.length ? content.stats : DEFAULT_HOME.stats;
  const badge = { ...DEFAULT_HOME.trustBadge, ...content?.trustBadge };

  const headingLine1 = hero.heading ?? "Preserve food.";
  const headingLine2 = hero.headingEmphasis ?? "Like a professional.";

  return (
    <section className="hero relative min-h-[93vh] overflow-hidden">
      <Image
        src="/images/homepage/lava-precision-durability.webp"
        alt="Lava vacuum sealer — German-engineered precision"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-petrol-800 via-primary to-[#073E4700]" />

      <div className="hero__container relative mx-auto flex min-h-[93vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="hero__content w-full max-w-2xl pt-8 pb-6 lg:pt-12 lg:pb-8">
          <div className="hero__overline mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              {hero.overline}
            </span>
          </div>

          <h1 className="hero__heading font-heading text-[clamp(2.2rem,4vw,3.8rem)] font-bold uppercase leading-[1.08] tracking-wide text-white">
            {headingLine1}
            {headingLine2 && (
              <>
                <br />
                <em className="not-italic text-secondary">{headingLine2}</em>
              </>
            )}
          </h1>

          {hero.subtitle && (
            <p className="hero__subheading mt-5 max-w-lg text-base leading-relaxed text-on-dark-muted">
              {hero.subtitle}
            </p>
          )}

          <div className="hero__cta-group mt-7 flex flex-wrap gap-4">
            {ctas.primaryLabel && ctas.primaryHref && (
              <Link href={ctas.primaryHref} className="btn-primary shadow-lg">
                {ctas.primaryLabel}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
            {ctas.secondaryLabel && ctas.secondaryHref && (
              <Link
                href={ctas.secondaryHref}
                className="inline-flex items-center gap-2.5 border border-primary-mid bg-on-dark-subtle px-8 py-4 text-sm font-semibold text-white transition-all hover:border-primary-mid hover:bg-on-dark-hover hover:-translate-y-0.5"
              >
                {ctas.secondaryLabel}
              </Link>
            )}
          </div>

          <div className="hero__stats mt-8 grid grid-cols-3 gap-6 border-t border-primary-mid pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-heading text-2xl font-bold text-on-dark-muted">{s.value}</p>
                <p className="mt-0.5 text-xs text-on-dark-faint">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 flex items-center gap-3 bg-white px-5 py-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.9L12 18l-6.1 3.1 1.2-6.9-5-4.9 6.9-1L12 2z"
              fill="white"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-primary">{badge.title}</p>
          <p className="text-[10px] text-copy-muted">{badge.subtitle}</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-petrol-800 to-[#042C3600]" />
    </section>
  );
};

export default StaticHero;
