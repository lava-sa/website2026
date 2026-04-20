import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Clock, TrendingDown, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Vacuum Sealing for Catering & Restaurants | Lava South Africa",
  description:
    "Professional vacuum sealing for caterers, restaurants and food service businesses. Reduce waste, extend shelf life, improve portion control and deliver better food quality every time.",
};

const benefits = [
  {
    icon: Clock,
    title: "Extend shelf life up to 5×",
    body: "Vacuum-sealed proteins, prepared sauces and prepped vegetables stay fresh 3–5× longer than conventional storage — cutting fridge turnover and waste.",
  },
  {
    icon: TrendingDown,
    title: "Cut food waste & cost",
    body: "Seal and date bulk purchases the moment they arrive. Reduce shrinkage on expensive cuts like fillet and lamb rack by sealing immediately after portioning.",
  },
  {
    icon: CheckCircle,
    title: "Consistent portion control",
    body: "Pre-portion proteins, sauces and garnishes in precise gram weights. Every plate leaves the kitchen consistent — regardless of who is on the pass.",
  },
  {
    icon: ShieldCheck,
    title: "HACCP & food-safety ready",
    body: "Vacuum-sealed packs are date-labelled and tamper-evident. Ideal for HACCP compliance, cook-chill programs and third-party food safety audits.",
  },
];

const useCases = [
  {
    title: "Sous vide production",
    body: "Seal proteins in precise portion bags for sous vide cooking. Consistent results at scale — perfect for steakhouses, hotel kitchens and event caterers.",
    img: "/images/applications/catering-sous-vide.webp",
  },
  {
    title: "Batch sauces & stocks",
    body: "Seal house-made stocks, demi-glace, and sauces in 200–500 ml packs. Thaw only what you need — no contamination, no waste.",
    img: "/images/applications/catering-sauces.webp",
  },
  {
    title: "Charcuterie & deli",
    body: "Extend display life on sliced charcuterie, smoked salmon and deli meats. Sealed portions look immaculate at the counter and stay fresh significantly longer.",
    img: "/images/applications/catering-charcuterie.webp",
  },
  {
    title: "Prep & portioning",
    body: "Seal marinated proteins days in advance. Consistent marinade penetration, longer shelf life, and service-ready packs that go straight from fridge to pan or grill.",
    img: "/images/applications/catering-prep.webp",
  },
];

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="aspect-[4/3] bg-primary/10 flex items-end relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      <div className="relative p-3 w-full bg-black/20">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Image needed</p>
        <p className="text-xs font-semibold text-white/80">{label}</p>
      </div>
    </div>
  );
}

export default function CateringPage() {
  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-primary py-20">
        <div className="section-container max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">
            Applications — Catering &amp; Restaurants
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
            Less waste.<br />Better food.<br />Faster service.
          </h1>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed mb-8">
            Professional kitchens across South Africa use LAVA vacuum sealers to reduce food costs,
            deliver consistent quality and stay HACCP compliant. German engineering built for the
            demands of commercial food service.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products/vacuum-machines" className="btn-secondary">
              View Machines <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="border border-white/30 text-white px-6 py-3 font-bold text-sm hover:bg-white/10 transition-colors">
              Talk to Anneke
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key benefits ─────────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="section-container">
          <div className="mb-12 text-center">
            <p className="overline mb-3">Why it matters</p>
            <h2 className="text-3xl font-bold text-primary">Built for professional kitchens</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white border border-border p-6 flex flex-col gap-4">
                <div className="h-10 w-10 bg-secondary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-bold text-primary leading-snug">{title}</h3>
                <p className="text-sm text-copy-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="mb-12 text-center">
            <p className="overline mb-3">How it&apos;s used</p>
            <h2 className="text-3xl font-bold text-primary">Catering applications</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {useCases.map((item) => (
              <div key={item.title} className="flex flex-col gap-4 bg-white border border-border overflow-hidden">
                <ImagePlaceholder label={item.img} />
                <div className="p-6">
                  <h3 className="font-bold text-lg text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-copy-muted leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shelf life table ─────────────────────────────────────────── */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="section-container max-w-3xl">
          <div className="mb-10 text-center">
            <p className="overline mb-3">At a glance</p>
            <h2 className="text-3xl font-bold text-primary">Shelf life comparison</h2>
            <p className="text-copy-muted mt-3 text-sm">Refrigerated storage · approximate guidelines</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-3 px-5 text-left font-bold">Product</th>
                  <th className="py-3 px-5 text-center font-bold">Standard storage</th>
                  <th className="py-3 px-5 text-center font-bold text-secondary">Vacuum sealed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Fresh beef fillet",   "2–3 days",  "10–14 days"],
                  ["Cooked chicken",      "2–3 days",  "8–10 days"],
                  ["Sliced charcuterie",  "3–5 days",  "14–21 days"],
                  ["Prepared sauce",      "3–4 days",  "10–12 days"],
                  ["Smoked salmon",       "4–5 days",  "14–18 days"],
                  ["Marinated proteins",  "2–3 days",  "7–10 days"],
                ].map(([food, standard, sealed], i) => (
                  <tr key={food} className={i % 2 === 0 ? "bg-white" : "bg-surface"}>
                    <td className="py-3 px-5 font-semibold text-primary border-b border-border">{food}</td>
                    <td className="py-3 px-5 text-center text-copy-muted border-b border-border">{standard}</td>
                    <td className="py-3 px-5 text-center font-bold text-secondary border-b border-border">{sealed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-copy-muted mt-4 text-center">
            * Shelf life depends on product type, storage temperature and hygiene conditions.
          </p>
        </div>
      </section>

      {/* ── Recommended machines ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container max-w-4xl">
          <div className="mb-10 text-center">
            <p className="overline mb-3">Recommended</p>
            <h2 className="text-3xl font-bold text-primary">Best machines for catering</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border-2 border-primary bg-primary/5 p-6 flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">High-volume kitchens</p>
              <h3 className="text-xl font-black text-primary">V.400® Premium</h3>
              <p className="text-sm text-copy-muted leading-relaxed flex-1">
                Dual-pump performance with industrial-grade sealing. Built for continuous use — the go-to choice for hotels,
                large caterers and production kitchens where the machine never stops.
              </p>
              <Link href="/products/v400-premium" className="btn-primary text-sm py-3 text-center mt-auto">
                View V.400® →
              </Link>
            </div>
            <div className="border border-border p-6 flex flex-col gap-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Restaurants & small caterers</p>
              <h3 className="text-xl font-black text-primary">V.300® Premium X</h3>
              <p className="text-sm text-copy-muted leading-relaxed flex-1">
                The world&apos;s most popular LAVA model for a reason. Powerful enough for daily commercial use,
                compact enough for even the tightest kitchen prep station.
              </p>
              <Link href="/products/v300-premium-x" className="btn-primary text-sm py-3 text-center mt-auto">
                View V.300® →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-primary">
        <div className="section-container max-w-2xl text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Not sure which machine fits your kitchen?
          </h2>
          <p className="text-white/70 mb-8">
            Anneke will help you match the right model to your volume and workflow — no pressure, just honest advice.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-secondary">
              Get a Recommendation
            </Link>
            <Link href="/products/vacuum-machines" className="border border-white/30 text-white px-6 py-3 font-bold text-sm hover:bg-white/10 transition-colors">
              Browse All Machines
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
