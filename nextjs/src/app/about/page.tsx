import Image from "next/image";
import Link from "next/link";
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
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Lava-SA — German Vacuum Sealers Since 2007",
  description:
    "Lava South Africa is the exclusive distributor of German-engineered LAVA vacuum sealers since 2007. Built on quality, sustainability and a passion for food preservation.",
  path: "/about",
  titleAbsolute: true,
});

// ─────────────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "1982",   label: "LAVA founded in Germany" },
  { value: "2007",   label: "SA distributor established" },
  { value: "44+",    label: "Years of German engineering" },
  { value: "350k+",  label: "Customers worldwide" },
];

const PILLARS = [
  {
    icon: Award,
    title: "German Precision",
    body: "Every machine is designed and manufactured in Bad Saulgau, Baden-Württemberg — the heartland of German precision engineering. No compromises, no shortcuts.",
  },
  {
    icon: ShieldCheck,
    title: "Built to Last",
    body: "A 2-year factory warranty on every machine. Components selected for decades of use, not years. We believe the most sustainable product is one you never have to replace.",
  },
  {
    icon: Wrench,
    title: "Spare Parts. Always.",
    body: "Unlike other brands that make machines disposable, LAVA keeps spare parts available indefinitely. Your machine can be serviced and repaired — not thrown away.",
  },
  {
    icon: Leaf,
    title: "Good for the Planet",
    body: "Vacuum sealing cuts food waste dramatically. Less spoilage means less land, water and energy wasted. Every seal is a small act of environmental responsibility.",
  },
];

const TIMELINE = [
  { year: "1982", event: "Klaus Landig founds LAVA in Bad Saulgau, Upper Swabia. The first vacuum sealer rolls off the production line." },
  { year: "1990s", event: "LAVA expands across Europe. The V.300 becomes the best-selling home vacuum sealer in Germany." },
  { year: "2000s", event: "The commercial V.400 and V.500 range launches. Restaurants, butcheries and food producers across Europe adopt LAVA." },
  { year: "2007", event: "Wilco Uys establishes Lava South Africa — the exclusive distributor for the continent. The first shipment lands in Johannesburg." },
  { year: "2010s", event: "South Africa's hunting and outdoor community discovers LAVA. Word spreads camp to camp, farm to farm." },
  { year: "2024+", event: "A new digital platform launches, bringing the full LAVA range directly to South African homes, butcheries, restaurants and hunting lodges — anywhere in the country." },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const pageLd = webPageSchema({
    type: "AboutPage",
    name: "About Lava-SA — German Vacuum Sealers Since 2007",
    description: "Lava South Africa is the exclusive distributor of German-engineered LAVA vacuum sealers since 2007. Built on quality, sustainability and a passion for food preservation.",
    url: "/about",
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={[pageLd, crumbLd]} />

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-primary overflow-hidden min-h-[560px] flex items-end">

        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/homepage/lava-sa-vacuum-sealers-header-pick-001.jpg"
            alt="LAVA South Africa — German vacuum sealers"
            fill
            className="object-cover object-center opacity-25"
            priority
          />
        </div>

        {/* Diagonal accent */}
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-white/5 [clip-path:polygon(30%_0,100%_0,100%_100%,0%_100%)]" />

        <div className="relative section-container pb-16 pt-24">
          <div className="max-w-3xl">
            <p className="overline text-secondary mb-4">Our Story</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              44 years of German<br />
              <span className="text-secondary">obsession</span>.<br />
              Now South Africa&apos;s own.
            </h1>
            <p className="mt-6 text-lg text-on-dark-muted max-w-xl leading-relaxed">
              We didn&apos;t invent vacuum sealing. We perfected it — in a family workshop
              in Baden-Württemberg, machine by machine, since 1982.
            </p>
          </div>
        </div>

      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — STATS BAND
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-y border-border">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <span className="text-4xl font-bold text-primary">{value}</span>
                <span className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-copy-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 3 — THE LANDIG FAMILY (ORIGIN STORY)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Image */}
            <div className="group relative mx-auto w-full max-w-md lg:max-w-none order-2 lg:order-1">
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/landig-family.webp"
                  alt="The Landig family — founders of LAVA vacuum sealers, Bad Saulgau Germany"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Bad Saulgau, Germany</p>
                  <p className="text-white font-bold text-lg">The Landig Family</p>
                  <p className="text-white/70 text-sm">Two generations. One relentless pursuit of quality.</p>
                </div>
              </div>
              {/* Petrol accent block */}
              <div className="absolute -bottom-4 -right-4 bg-primary w-24 h-24 -z-10 hidden lg:block" />
            </div>

            {/* Copy */}
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">The Origin</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary leading-tight">
                A family obsessed with keeping food perfect.
              </h2>
              <blockquote className="my-8 border-l-4 border-secondary pl-6">
                <Quote className="h-5 w-5 text-secondary mb-2 opacity-50" />
                <p className="text-base italic leading-relaxed text-copy">
                  &ldquo;For two generations, we, the Landig family, have been passionately
                  running our family business in Bad Saulgau, Upper Swabia. What began
                  over 44 years ago as a small specialist operation has evolved into a
                  global leader in vacuum sealing technology.&rdquo;
                </p>
                <footer className="mt-3 text-xs font-bold uppercase tracking-widest text-copy-muted">
                  — Klaus Landig, Founder
                </footer>
              </blockquote>
              <div className="space-y-4 text-[15px] leading-relaxed text-copy">
                <p>
                  In a small workshop in Baden-Württemberg, Klaus Landig had a simple
                  ambition: build a vacuum sealer that would never let a customer down.
                  Every component chosen for longevity. Every seal tested to exhaustion.
                  Every machine shipped only when it was truly ready.
                </p>
                <p>
                  That philosophy has never changed. Today, the second generation of
                  the Landig family continues the tradition — designing machines in the
                  same town, with the same obsession, for a world that finally
                  understands what great food preservation looks like.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 4 — TIMELINE
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="overline mb-3">The Journey</p>
            <h2 className="text-4xl font-bold text-primary">From Germany to your kitchen.</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[72px] top-0 bottom-0 w-px bg-border hidden sm:block" />

              <div className="space-y-0">
                {TIMELINE.map(({ year, event }, i) => (
                  <div
                    key={year}
                    className={`relative flex gap-6 sm:gap-8 ${i < TIMELINE.length - 1 ? "pb-10" : ""}`}
                  >
                    {/* Year */}
                    <div className="w-[72px] shrink-0 flex flex-col items-end sm:items-center">
                      <div className={`hidden sm:flex h-8 w-8 rounded-full border-2 items-center justify-center z-10 ${
                        year === "2007" ? "bg-primary border-primary" : "bg-white border-border"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${year === "2007" ? "bg-white" : "bg-primary"}`} />
                      </div>
                      <span className={`text-xs font-bold mt-1 ${
                        year === "2007" ? "text-primary" : "text-copy-muted"
                      }`}>
                        {year}
                      </span>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-2 ${
                      year === "2007"
                        ? "bg-primary text-white px-5 py-4 -mt-1"
                        : "pt-1"
                    }`}>
                      {year === "2007" && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
                          Lava South Africa Founded
                        </p>
                      )}
                      <p className={`text-sm leading-relaxed ${year === "2007" ? "text-white/90" : "text-copy"}`}>
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

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 5 — ANNEKE & WILCO (SA FOUNDERS)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Copy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">South Africa</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary leading-tight">
                Bringing German precision to South African homes.
              </h2>
              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-copy">
                <p>
                  In 2007, Wilco Uys recognised something the rest of the country had yet to
                  discover: South African hunters, farmers, butchers and home cooks deserved
                  access to the world&apos;s finest vacuum sealing technology — not cheap
                  imitations, but the real thing, direct from the factory in Germany.
                </p>
                <p>
                  Lava South Africa was born. Wilco leads the business with a commitment to
                  integrity and a product he believes in completely. Anneke Hofmeyr manages
                  day-to-day operations and customer service — and when you call, it&apos;s
                  Anneke who answers. Personally.
                </p>
                <p>
                  Based in Bryanston, Johannesburg, but serving every corner of South Africa
                  — from the Karoo to the Cape, from the Limpopo bush to the KZN coast.
                </p>
              </div>

              {/* Contact cards */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:+27721605556"
                  className="flex items-center gap-3 border border-border bg-surface px-4 py-3.5 hover:border-primary hover:bg-white transition-all group"
                >
                  <Phone className="h-4 w-4 text-secondary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Call Us</p>
                    <p className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors">+27 72 160 5556</p>
                  </div>
                </a>
                <a
                  href="mailto:info@lava-sa.co.za"
                  className="flex items-center gap-3 border border-border bg-surface px-4 py-3.5 hover:border-primary hover:bg-white transition-all group"
                >
                  <Mail className="h-4 w-4 text-secondary shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Email Us</p>
                    <p className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors">info@lava-sa.co.za</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="group relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/lava-directors-001.webp"
                  alt="Wilco Uys and Anneke Hofmeyr — Lava South Africa"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Bryanston, Johannesburg</p>
                  <p className="text-white font-bold text-lg">Wilco Uys &amp; Anneke Hofmeyr</p>
                  <p className="text-white/70 text-sm">Owner &amp; Manager · Lava South Africa est. 2007</p>
                </div>
              </div>
              {/* Accent */}
              <div className="absolute -top-4 -left-4 bg-secondary w-24 h-24 -z-10 hidden lg:block" />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 6 — OUR PURSUIT (THE FOUR PILLARS)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-primary">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="overline text-secondary mb-3">Our Pursuit</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              What drives every machine we sell.
            </h2>
            <p className="mt-4 text-on-dark-muted max-w-xl mx-auto leading-relaxed">
              Four principles. Decided in 1982. Never compromised since.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map(({ icon: Icon, title, body }) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 7 — QUALITY IN THE MAKING (IMAGE + COPY)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Image */}
            <div className="group relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden shadow-xl">
                <Image
                  src="/images/homepage/lava-german-quality.webp"
                  alt="LAVA vacuum sealer — German engineering at its finest"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Copy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">The Machine</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary leading-tight">
                Every component is a decision, not an afterthought.
              </h2>
              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-copy">
                <p>
                  Walk into the LAVA factory in Bad Saulgau and you&apos;ll find engineers
                  who have worked on these machines for decades. The pump housings are
                  measured in microns. The sealing strips are tested for 50,000 cycles
                  before a specification is finalised. The stainless steel surfaces are
                  chosen for their resistance to acids, fat and high-pressure cleaning.
                </p>
                <p>
                  This is why a LAVA machine feels different the moment you pick it up.
                  The weight. The precision of the lid mechanism. The silence of the pump
                  at work. These are not accidents — they are deliberate, fought-for
                  design decisions made by people who genuinely care about the outcome.
                </p>
              </div>

              {/* Feature chips */}
              <div className="mt-8 grid grid-cols-2 gap-2.5">
                {[
                  "Stainless steel sealing bars",
                  "Double & triple seal strips",
                  "2-year factory warranty",
                  "50,000+ seal cycle tested",
                  "Spare parts always available",
                  "ISO-certified production",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 border border-border bg-surface px-3 py-2.5">
                    <span className="h-1.5 w-1.5 shrink-0 bg-secondary rounded-full" />
                    <span className="text-xs font-medium text-copy">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 8 — SUSTAINABILITY
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-surface border-y border-border">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Copy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">Responsibility</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary leading-tight">
                Every seal is an act of environmental responsibility.
              </h2>
              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-copy">
                <p>
                  South Africans throw away an estimated <strong className="text-primary">10 million tonnes of food every year</strong>.
                  Most of it spoils before it&apos;s eaten. Vacuum sealing extends shelf life by
                  3–5 times — meaning the same haul from your hunting weekend, the same
                  bulk buy from the butchery, lasts dramatically longer.
                </p>
                <p>
                  At LAVA we also believe a sustainable product is one that doesn&apos;t
                  need to be replaced. Our machines are designed and warranted for
                  decades of use. Our embossed bags are washable and reusable.
                  Our spare parts programme means your machine can be repaired,
                  not replaced.
                </p>
                <p>
                  Less waste. Less replacement. Less impact. That&apos;s the LAVA
                  commitment to the planet.
                </p>
              </div>

              {/* Impact stats */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { value: "5×", label: "Longer shelf life" },
                  { value: "70%", label: "Less food waste" },
                  { value: "∞", label: "Spare parts stocked" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center border border-border bg-white p-4">
                    <p className="text-3xl font-bold text-primary">{value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="group relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden shadow-xl">
                <Image
                  src="/images/homepage/lava-reforestation.webp"
                  alt="LAVA — committed to sustainability and reducing food waste"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 9 — SERVICE & CONTACT
      ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="overline mb-3">Service & Contact</p>
            <h2 className="text-4xl font-bold text-primary">We&apos;re here. Always.</h2>
            <p className="mt-4 text-copy-muted max-w-lg mx-auto">
              When you call Lava South Africa, Anneke Hofmeyr answers — the person who
              manages every order and personally backs every machine we sell.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Call Us",
                detail: "+27 72 160 5556",
                sub: "Mon–Fri 8am–5pm",
                href: "tel:+27721605556",
              },
              {
                icon: Mail,
                title: "Email Us",
                detail: "info@lava-sa.co.za",
                sub: "Reply within 1 business day",
                href: "mailto:info@lava-sa.co.za",
              },
              {
                icon: MapPin,
                title: "Based In",
                detail: "Bryanston, Johannesburg",
                sub: "Serving all of South Africa",
                href: null,
              },
              {
                icon: Clock,
                title: "Order Cut-Off",
                detail: "3pm weekdays",
                sub: "For same-day dispatch",
                href: null,
              },
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
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 px-10 py-4"
            >
              Send Us a Message
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 10 — FINAL CTA
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary py-20">
        <div className="section-container text-center">
          <p className="overline text-secondary mb-4">Ready to experience it?</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto leading-tight">
            44 years in the making.<br />Delivered to your door.
          </h2>
          <p className="text-on-dark-muted max-w-lg mx-auto mb-10 text-lg leading-relaxed">
            Browse the full range of LAVA vacuum sealers, bags and accessories —
            with free delivery on orders over R2,500.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products/vacuum-machines"
              className="bg-white text-primary hover:bg-secondary hover:text-white transition-colors inline-flex items-center gap-2 px-10 py-4 text-base font-semibold"
            >
              Shop Vacuum Machines
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="border border-white/30 text-white/80 hover:bg-white/10 hover:text-white transition-colors px-10 py-4 text-sm font-semibold inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
