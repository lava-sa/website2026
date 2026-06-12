import Image from "next/image";
import Link from "next/link";
import PhoneNumbers from "@/components/layout/PhoneNumbers";
import { PHONES_DISPLAY_LONG } from "@/lib/contact";
import {
  ShieldCheck,
  Leaf,
  Award,
  Wrench,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Quote,
} from "lucide-react";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { getSitePageContent } from "@/lib/queries/site-pages";
import { DEFAULT_ABOUT_PAGE } from "@/lib/content/about-page-defaults";
import AboutSplitSection from "@/components/about/AboutSplitSection";
import CmsBody from "@/components/cms/CmsBody";

const PILLAR_ICONS = {
  award: Award,
  shield: ShieldCheck,
  wrench: Wrench,
  leaf: Leaf,
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getSitePageContent("about");
  return {
    title: { absolute: cms.seo.title },
    description: cms.seo.description,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const cms = await getSitePageContent("about");
  const about = cms.aboutPage ?? DEFAULT_ABOUT_PAGE;
  const stats = cms.stats?.length ? cms.stats : [];

  const pageLd = webPageSchema({
    type: "AboutPage",
    name: cms.seo.title,
    description: cms.seo.description,
    url: "/about",
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[pageLd, crumbLd]} />

      {/* HERO */}
      <section className="relative bg-primary overflow-hidden min-h-[560px] flex items-end">
        <div className="absolute inset-0">
          {about.heroImage?.src && (
            <Image
              src={about.heroImage.src}
              alt={about.heroImage.alt}
              fill
              className="object-cover object-center opacity-25"
              priority
            />
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-white/5 [clip-path:polygon(30%_0,100%_0,100%_100%,0%_100%)]" />
        <div className="relative section-container pb-16 pt-24">
          <div className="max-w-3xl">
            {cms.hero.overline && (
              <p className="overline text-secondary mb-4">{cms.hero.overline}</p>
            )}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              {cms.hero.heading ?? "44 years of German"}
              {cms.hero.headingEmphasis && (
                <>
                  <br />
                  <span className="text-secondary">{cms.hero.headingEmphasis}</span>
                </>
              )}
            </h1>
            {cms.hero.subtitle && (
              <p className="mt-6 text-lg text-on-dark-muted max-w-xl leading-relaxed">
                {cms.hero.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      {stats.length > 0 && (
        <div className="bg-white border-y border-border">
          <div className="section-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <span className="text-4xl font-bold text-primary">{value}</span>
                  <span className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-copy-muted">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORIGIN */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <AboutSplitSection section={about.origin} accent="bottom-right">
            <blockquote className="my-8 border-l-4 border-secondary pl-6">
              <Quote className="h-5 w-5 text-secondary mb-2 opacity-50" />
              <p className="text-base italic leading-relaxed text-copy">
                &ldquo;{about.origin.quote.text}&rdquo;
              </p>
              <footer className="mt-3 text-xs font-bold uppercase tracking-widest text-copy-muted">
                {about.origin.quote.attribution}
              </footer>
            </blockquote>
            <CmsBody html={about.origin.bodyHtml} className="space-y-4 text-[15px] leading-relaxed text-copy" />
          </AboutSplitSection>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="overline mb-3">{about.timeline.overline}</p>
            <h2 className="text-4xl font-bold text-primary">{about.timeline.heading}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-[72px] top-0 bottom-0 w-px bg-border hidden sm:block" />
              <div className="space-y-0">
                {about.timeline.items.map(({ year, event, highlight, highlightLabel }, i) => (
                  <div
                    key={`${year}-${i}`}
                    className={`relative flex gap-6 sm:gap-8 ${i < about.timeline.items.length - 1 ? "pb-10" : ""}`}
                  >
                    <div className="w-[72px] shrink-0 flex flex-col items-end sm:items-center">
                      <div
                        className={`hidden sm:flex h-8 w-8 rounded-full border-2 items-center justify-center z-10 ${
                          highlight ? "bg-primary border-primary" : "bg-white border-border"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${highlight ? "bg-white" : "bg-primary"}`} />
                      </div>
                      <span className={`text-xs font-bold mt-1 ${highlight ? "text-primary" : "text-copy-muted"}`}>
                        {year}
                      </span>
                    </div>
                    <div
                      className={`flex-1 pb-2 ${
                        highlight ? "bg-primary text-white px-5 py-4 -mt-1" : "pt-1"
                      }`}
                    >
                      {highlight && highlightLabel && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
                          {highlightLabel}
                        </p>
                      )}
                      <p className={`text-sm leading-relaxed ${highlight ? "text-white/90" : "text-copy"}`}>
                        {event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SA FOUNDERS */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <AboutSplitSection section={about.saFounders} accent="top-left">
            <CmsBody html={about.saFounders.bodyHtml} className="mt-8 space-y-4 text-[15px] leading-relaxed text-copy" />
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 border border-border bg-surface px-4 py-3.5">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Call Us</p>
                  <PhoneNumbers layout="stacked" linkClassName="text-sm font-semibold text-primary hover:text-secondary" />
                </div>
              </div>
              <a
                href="mailto:info@lava-sa.com"
                className="flex items-center gap-3 border border-border bg-surface px-4 py-3.5 hover:border-primary hover:bg-white transition-all group"
              >
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Email Us</p>
                  <p className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors">
                    info@lava-sa.com
                  </p>
                </div>
              </a>
            </div>
          </AboutSplitSection>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-24 bg-primary">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="overline text-secondary mb-3">{about.pillars.overline}</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">{about.pillars.heading}</h2>
            <p className="mt-4 text-on-dark-muted max-w-xl mx-auto leading-relaxed">{about.pillars.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.pillars.items.map(({ icon, title, body }) => {
              const Icon = PILLAR_ICONS[icon] ?? Award;
              return (
                <div
                  key={title}
                  className="bg-white/5 border border-white/10 p-7 hover:bg-white/10 transition-colors group"
                >
                  <div className="h-12 w-12 bg-secondary/20 flex items-center justify-center mb-5 group-hover:bg-secondary/30 transition-colors">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{title}</h3>
                  <p className="text-sm text-on-dark-muted leading-relaxed">{body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUALITY */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <AboutSplitSection section={about.quality}>
            <CmsBody html={about.quality.bodyHtml} className="mt-8 space-y-4 text-[15px] leading-relaxed text-copy" />
            {about.quality.features.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-2.5">
                {about.quality.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 border border-border bg-surface px-3 py-2.5">
                    <span className="h-1.5 w-1.5 shrink-0 bg-secondary rounded-full" />
                    <span className="text-xs font-medium text-copy">{feat}</span>
                  </div>
                ))}
              </div>
            )}
          </AboutSplitSection>
        </div>
      </section>

      {/* SUSTAINABILITY */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="section-container">
          <AboutSplitSection section={{ ...about.sustainability, imageSide: "right" }}>
            <CmsBody
              html={about.sustainability.bodyHtml}
              className="mt-8 space-y-4 text-[15px] leading-relaxed text-copy"
            />
            {about.sustainability.impactStats.length > 0 && (
              <div className="mt-10 grid grid-cols-3 gap-4">
                {about.sustainability.impactStats.map(({ value, label }) => (
                  <div key={label} className="text-center border border-border bg-white p-4">
                    <p className="text-3xl font-bold text-primary">{value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </AboutSplitSection>
        </div>
      </section>

      {/* SERVICE */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="overline mb-3">{about.service.overline}</p>
            <h2 className="text-4xl font-bold text-primary">{about.service.heading}</h2>
            <p className="mt-4 text-copy-muted max-w-lg mx-auto">{about.service.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Phone, title: "Call Us", detail: PHONES_DISPLAY_LONG, sub: "Mon–Fri 8am–5pm", href: null },
              { icon: Mail, title: "Email Us", detail: "info@lava-sa.com", sub: "Reply within 1 business day", href: "mailto:info@lava-sa.com" },
              { icon: MapPin, title: "Based In", detail: "Bryanston, Johannesburg", sub: "Serving all of South Africa", href: null },
              { icon: Clock, title: "Order Cut-Off", detail: "3pm weekdays", sub: "For same-day dispatch", href: null },
            ].map(({ icon: Icon, title, detail, sub, href }) => {
              const inner = (
                <>
                  <div className="h-12 w-12 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted mb-2">{title}</p>
                  <p className="font-bold text-primary text-sm leading-snug">{detail}</p>
                  <p className="text-xs text-copy-muted mt-1">{sub}</p>
                </>
              );
              return href ? (
                <a
                  key={title}
                  href={href}
                  className="border border-border bg-surface p-6 text-center hover:border-primary hover:bg-white transition-all block"
                >
                  {inner}
                </a>
              ) : (
                <div key={title} className="border border-border bg-surface p-6 text-center">
                  {inner}
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2 px-10 py-4">
              Send Us a Message
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary py-20">
        <div className="section-container text-center">
          <p className="overline text-secondary mb-4">{about.finalCta.overline}</p>
          <h2
            className="text-4xl sm:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto leading-tight"
            dangerouslySetInnerHTML={{ __html: about.finalCta.headingHtml }}
          />
          <p className="text-on-dark-muted max-w-lg mx-auto mb-10 text-lg leading-relaxed">
            {about.finalCta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={about.finalCta.primaryHref}
              className="bg-white text-primary hover:bg-secondary hover:text-white transition-colors inline-flex items-center gap-2 px-10 py-4 text-base font-semibold"
            >
              {about.finalCta.primaryLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href={about.finalCta.secondaryHref}
              className="border border-white/30 text-white/80 hover:bg-white/10 hover:text-white transition-colors px-10 py-4 text-sm font-semibold inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              {about.finalCta.secondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      {cms.bodyHtml?.trim() && (
        <section className="section-container py-16 border-t border-border">
          <CmsBody html={cms.bodyHtml} />
        </section>
      )}
    </main>
  );
}
