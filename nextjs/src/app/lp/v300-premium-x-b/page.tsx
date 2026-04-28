import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lava V.300 Premium X — Vacuum Like a Professional | Lava-SA",
  description:
    "The German-engineered vacuum sealer trusted by hunters, chefs and butchers across South Africa. 500W double pump. -0.94 bar. 2-year warranty. Free shipping over R3,500.",
  robots: { index: false, follow: false }, // landing page — paid traffic only
  openGraph: {
    title: "Lava V.300 Premium X — Vacuum Like a Professional",
    description:
      "44 years of German engineering. Built for hunters, chefs, butchers and serious households.",
    images: ["/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x.webp"],
  },
};

const PRODUCT_URL = "/products/v300-premium-x"; // where the buy button sends them

const SPECS = [
  { label: "Power", value: "500 W" },
  { label: "Vacuum strength", value: "-0.94 bar" },
  { label: "Voltage", value: "220–240 V / 50 Hz" },
  { label: "Sealing bar", value: "300 mm" },
  { label: "Dimensions", value: "410 × 230 × 98 mm" },
  { label: "Weight", value: "4.40 kg" },
  { label: "Article No.", value: "VL0300XP" },
  { label: "Warranty", value: "2 years" },
];

const FEATURES = [
  {
    title: "Pressure regulation L+",
    body:
      "The only home-class sealer in South Africa with adjustable vacuum pressure. From a gentle -0.2 bar for delicate berries and fillets — to a full -0.94 bar for game meat and biltong. You decide.",
  },
  {
    title: "Lava Close System (LCS)",
    body:
      "Magnetic one-finger close. No hand cramps, no levering, no broken seals. Engineered in Germany for 1,000+ cycles between maintenance.",
  },
  {
    title: "Double piston pump",
    body:
      "Twin-piston, oil-free pump rated for continuous use. Same architecture used in Lava's commercial V.500 — scaled for the home and small business.",
  },
  {
    title: "Liquid separator",
    body:
      "Built-in moisture trap protects the pump from juices, brines and marinades. Sous-vide ready out the box.",
  },
  {
    title: "Adjustable sealing time",
    body:
      "Three programmed strengths: 6 sec (90μm bags), 8 sec (160μm), 10 sec (aluminium / structured). Match the seal to the bag — no guesswork.",
  },
  {
    title: "Genuine German build",
    body:
      "Lava has built vacuum sealers in Germany since 1982. The V.300 Premium X is the machine 350,000+ households worldwide rely on.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Very well built, very powerful and very efficient. After three hunting seasons it still seals like day one.",
    name: "Ralf A.",
    role: "Hunter, Limpopo — V.300 Premium X owner since 2022",
  },
  {
    quote:
      "I run a small biltong shop. The pressure regulation is a game-changer — I can vac soft cuts without crushing them.",
    name: "Pieter v.d. Merwe",
    role: "Butchery owner, Pretoria",
  },
  {
    quote:
      "Bought it for fish after a Cape Point trip ruined my old sealer. The Lava just doesn't quit.",
    name: "James T.",
    role: "Fly-fisherman, Western Cape",
  },
];

const IN_THE_BOX = [
  "Lava V.300 Premium X vacuum sealer",
  "Starter pack of professional vacuum bags (mixed sizes)",
  "External vacuum hose for canisters & marinators",
  "Quick-start guide (English) + full German engineering manual",
  "2-year limited manufacturer warranty",
];

export default function V300PremiumXLandingPage() {
  return (
    <main className="bg-white text-copy">
      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-petrol-800 text-white">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/homepage/lava-precision-durability.webp"
            alt="Lava V.300 Premium X landing page hero background image"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-petrol-800 via-petrol-800/90 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
          {/* Copy */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-secondary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                The Most Popular Lava in South Africa
              </span>
            </div>

            <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4.2rem)] font-bold uppercase leading-[1.05] tracking-wide">
              Vacuum like a<br />
              <em className="not-italic text-secondary">professional.</em>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-dark-muted">
              The Lava V.300 Premium X is the German-engineered vacuum sealer
              trusted by hunters, chefs, butchers and serious households across
              South Africa. Built to be used. Built to last decades.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={PRODUCT_URL}
                className="btn-primary shadow-lg"
                data-cta="hero-primary"
              >
                Order Yours — R13,500
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
              <a
                href="#specs"
                className="inline-flex items-center gap-2.5 border border-primary-mid bg-on-dark-subtle px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-on-dark-hover"
              >
                See the Specs
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-3 gap-6 border-t border-primary-mid pt-6 text-sm">
              <li>
                <p className="font-heading text-2xl font-bold text-on-dark-muted">
                  500 W
                </p>
                <p className="mt-0.5 text-xs text-on-dark-faint">
                  Double piston pump
                </p>
              </li>
              <li>
                <p className="font-heading text-2xl font-bold text-on-dark-muted">
                  -0.94 bar
                </p>
                <p className="mt-0.5 text-xs text-on-dark-faint">
                  Commercial-grade vacuum
                </p>
              </li>
              <li>
                <p className="font-heading text-2xl font-bold text-on-dark-muted">
                  2-Year
                </p>
                <p className="mt-0.5 text-xs text-on-dark-faint">
                  Manufacturer warranty
                </p>
              </li>
            </ul>
          </div>

          {/* Product image */}
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x.webp"
              alt="Lava V.300 Premium X vacuum sealer"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-gray-200 bg-gray-100 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            ["44+", "Years German engineering"],
            ["350k+", "Customers worldwide"],
            ["1,000+", "Seals between service"],
            ["Since 2007", "SA distributor"],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="font-heading text-2xl font-bold text-primary">{v}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-copy-muted">
                {l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          THE WHY — emotional / aspirational
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            Why owners stop buying anything else
          </span>
          <h2 className="mt-4 font-heading text-[clamp(1.8rem,3vw,2.8rem)] font-bold uppercase leading-tight tracking-wide text-primary">
            You didn't buy that kudu, that yellowtail, that prime rib —
            <em className="not-italic text-secondary"> to throw it away.</em>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-copy-muted">
            Freezer burn ruins more South African game meat than any predator on
            the veld. Cheap sealers fail when you need them most — at 11pm after
            a long hunt, halfway through 40kg of fillet. The V.300 Premium X
            doesn't fail. It's the machine professional butchers, chefs and
            hunters install once and use for a decade. Every cut of meat,
            every fish, every batch of biltong — sealed at full commercial
            strength, with the dial turned exactly where you need it.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURE GRID
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold uppercase tracking-wide text-primary">
              Six things <em className="not-italic text-secondary">no other sealer in this class</em> does.
            </h2>
          </div>

          <div className="mt-12 grid gap-px bg-gray-300 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white p-8">
                <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-primary">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-copy-muted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PRODUCT GALLERY + IN THE BOX
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="grid grid-cols-2 gap-3">
            {[
              "lava-vacuum-sealer-v300-premium-x.webp",
              "lava-vacuum-sealer-v300-premium-x-02.webp",
              "lava-vacuum-sealer-v300-premium-x-03.webp",
              "lava-vacuum-sealer-v300-premium-x-04.webp",
            ].map((img, i) => (
              <div
                key={img}
                className={`relative aspect-square bg-gray-100 ${
                  i === 0 ? "col-span-2 aspect-[16/10]" : ""
                }`}
              >
                <Image
                  src={`/images/products/machines/v300-premium-x/${img}`}
                  alt={`Lava V.300 Premium X product image ${i + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              What you get
            </span>
            <h2 className="mt-3 font-heading text-3xl font-bold uppercase tracking-wide text-primary">
              Everything in the box.
            </h2>
            <ul className="mt-6 space-y-4">
              {IN_THE_BOX.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 inline-block h-1.5 w-4 shrink-0 bg-secondary" />
                  <span className="text-base text-copy">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href={PRODUCT_URL}
              className="btn-primary mt-8 self-start shadow-lg"
              data-cta="midpage"
            >
              Order Yours — R13,500
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-petrol-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold uppercase tracking-wide">
            What owners <em className="not-italic text-secondary">actually say.</em>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="border-l-2 border-secondary bg-on-dark-subtle p-8"
              >
                <div className="flex gap-0.5 text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.9L12 18l-6.1 3.1 1.2-6.9-5-4.9 6.9-1L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 text-base leading-relaxed text-on-dark-muted">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-primary-mid pt-4">
                  <p className="font-heading text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-on-dark-faint">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SPECS
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="specs" className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Engineered, not assembled
            </span>
            <h2 className="mt-3 font-heading text-[clamp(1.8rem,3vw,2.6rem)] font-bold uppercase tracking-wide text-primary">
              The numbers.
            </h2>
          </div>

          <dl className="mt-10 grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2">
            {SPECS.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between bg-white px-6 py-5"
              >
                <dt className="text-sm uppercase tracking-wider text-copy-muted">
                  {s.label}
                </dt>
                <dd className="font-heading text-base font-bold text-primary">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          GUARANTEE STRIP
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-gray-200 bg-gray-100 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            ["2-Year Warranty", "Direct from the SA distributor."],
            ["Free Shipping", "On orders over R3,500 nationwide."],
            ["Real Humans", "Anneke answers every product enquiry personally."],
          ].map(([t, b]) => (
            <div key={t}>
              <h3 className="font-heading text-lg font-bold uppercase tracking-wide text-primary">
                {t}
              </h3>
              <p className="mt-2 text-sm text-copy-muted">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-petrol-800 py-24 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-petrol-800 via-primary to-petrol-800" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-[clamp(2rem,3.5vw,3.2rem)] font-bold uppercase leading-tight tracking-wide">
            Stop replacing sealers.<br />
            <em className="not-italic text-secondary">Buy the last one.</em>
          </h2>
          <p className="mt-6 text-lg text-on-dark-muted">
            44 years of German engineering. Two-year warranty. Free shipping
            over R3,500. Built for the way you actually cook, hunt, fish and
            preserve.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={PRODUCT_URL}
              className="btn-primary shadow-2xl"
              data-cta="final"
            >
              Order the V.300 Premium X — R13,500
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
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 border border-primary-mid bg-on-dark-subtle px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-on-dark-hover"
            >
              Talk to Anneke first
            </Link>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-on-dark-faint">
            Lava-SA · Authorised distributor since 2007
          </p>
        </div>
      </section>
    </main>
  );
}
