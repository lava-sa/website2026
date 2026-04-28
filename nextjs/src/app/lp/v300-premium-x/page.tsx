import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import V300InstantCheckout from "@/components/landing/V300InstantCheckout";
import V300ManualGallery from "@/components/landing/V300ManualGallery";
import V300LpReviews from "@/components/landing/V300LpReviews";
import { V300_MANUAL_DE_EXCERPT } from "@/content/v300-manual-de-excerpt";

export const metadata: Metadata = {
  title: "V.300 Premium X — Buy the Machine South Africa Trusts | Lava-SA",
  description:
    "German-engineered LAVA V.300 Premium X — direct add-to-cart, 2-year warranty, free shipping over R2,500. For hunters, anglers, and serious kitchens.",
  alternates: { canonical: "/lp/v300-premium-x" },
  robots: { index: false, follow: true },
};

const RIBBON_BENEFITS = [
  "Stop losing game, fish & bulk prep to failed seals and freezer burn",
  "Dial gauge + L+ regulation — wet, delicate, and tough jobs under control",
  "Automatic one-shot mode when you want speed; manual when you want precision",
  "Wear parts you can service — not a throwaway discount-store sealer",
  "2-year factory-backed warranty with local South African support",
];

export default function V300PremiumXLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top trust strip */}
      <div className="bg-white border-b-2 border-primary text-center py-2.5 px-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] text-primary">
        <span className="inline-block">Free shipping over R2,500</span>
        <span className="mx-2 text-copy-muted font-normal hidden sm:inline">|</span>
        <span className="inline-block">2-year warranty</span>
        <span className="mx-2 text-copy-muted font-normal hidden sm:inline">|</span>
        <span className="inline-block">German engineering · SA distributor since 2007</span>
      </div>

      {/* Red urgency hero — reference LP style */}
      <section className="bg-[#c41230] text-white">
        <div className="section-container max-w-5xl py-8 sm:py-10">
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-[0.28em] text-white/90 mb-3">
            For hunters, anglers, butchers &amp; serious home kitchens
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase leading-[1.05] max-w-4xl">
            The vacuum sealer that pays for itself in saved meat, fish &amp; sanity
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/90 max-w-3xl leading-relaxed font-medium">
            If you are done with weak vacuum, burst seams, and &ldquo;almost sealed&rdquo; bags — the{" "}
            <strong className="text-white">LAVA V.300 Premium X</strong> is the professional-grade machine you
            buy once and run for years.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#add-to-cart"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-wide text-sm px-6 py-3.5 border-2 border-white/30"
            >
              Show me the price — add to cart
            </a>
            <a
              href="#manual"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 border-2 border-white/40"
            >
              See factory manual walkthrough
            </a>
          </div>
        </div>
      </section>

      {/* Hero visual */}
      <section className="bg-[#0a1628] relative">
        <div className="relative w-full aspect-[21/9] min-h-[200px] max-h-[420px]">
          <Image
            src="/images/homepage/lava-v300-premium-x-vacuum-sealer-machine.webp"
            alt="LAVA V.300 Premium X vacuum sealer — German build quality"
            fill
            className="object-cover object-center opacity-95"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Dark benefit band */}
      <section className="bg-[#0a1628] text-white pb-10 pt-2 sm:pt-4">
        <div className="section-container max-w-5xl">
          <h2 className="sr-only">Why buy the V.300 Premium X</h2>
          <ul className="space-y-3 sm:space-y-4">
            {RIBBON_BENEFITS.map((line) => (
              <li key={line} className="flex gap-3 text-sm sm:text-base leading-snug text-white/95">
                <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <V300InstantCheckout placement="top" />

      {/* Mid-story */}
      <section className="py-14 sm:py-16 border-b border-border">
        <div className="section-container max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-black text-primary leading-tight">
            Cheap sealers cost more — in waste, rework, and stress
          </h2>
          <div className="mt-5 space-y-4 text-copy leading-relaxed text-base">
            <p>
              You already invested in the hunt, the catch, or the bulk shop. The last thing you need is a machine
              that quits when the bag is wet, the fillets are stacked, or the lid needs that extra bit of vacuum
              before weld.
            </p>
            <p>
              The V.300 Premium X is built for <strong className="text-primary">repeatable vacuum</strong>,{" "}
              <strong className="text-primary">honest gauge feedback</strong>, and{" "}
              <strong className="text-primary">adjustable seal time</strong> for real bags — 90 µm, 160 µm, and
              aluminium composites — not fantasy specs on a box.
            </p>
          </div>
        </div>
      </section>

      {/* Manual visuals */}
      <section id="manual" className="py-14 bg-surface border-y border-border scroll-mt-4">
        <div className="section-container max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-black text-primary">
            Factory manual — visual walkthrough (your reference photos)
          </h2>
          <p className="mt-2 text-sm text-copy-muted max-w-3xl">
            Place images in{" "}
            <code className="bg-white px-1 py-0.5 border border-border text-xs">public/images/manual/v300-premium-x/</code>{" "}
            as <code className="text-xs">manual-01</code> through <code className="text-xs">manual-05</code> with
            extension <code className="text-xs">.jpg</code>, <code className="text-xs">.png</code>, or{" "}
            <code className="text-xs">.webp</code>. The gallery tries each format automatically.
          </p>
          <div className="mt-8">
            <V300ManualGallery />
          </div>

          <div className="mt-10 border-2 border-primary/20 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-black text-primary">Original German manual (excerpt — text you supplied)</h3>
            <p className="mt-2 text-xs text-copy-muted">
              Full printed/PDF manual ships with the machine. Below is a searchable excerpt from the manufacturer
              documentation (German).
            </p>
            <details className="mt-4 group">
              <summary className="cursor-pointer text-sm font-black uppercase tracking-wide text-[#c41230] list-none flex items-center gap-2">
                <span className="group-open:rotate-90 transition-transform">▸</span>
                Bedienungsanleitung (Auszug) — anzeigen
              </summary>
              <pre className="mt-4 max-h-[min(70vh,480px)] overflow-y-auto whitespace-pre-wrap text-xs sm:text-sm text-copy leading-relaxed bg-surface p-4 border border-border font-sans">
                {V300_MANUAL_DE_EXCERPT}
              </pre>
            </details>
          </div>
        </div>
      </section>

      {/* Offer stack — compact */}
      <section className="py-14">
        <div className="section-container max-w-4xl">
          <h2 className="text-2xl font-black text-primary">What you are getting</h2>
          <div className="mt-6 border-2 border-primary">
            {[
              ["Machine", "V.300 Premium X — VL0300XP"],
              ["Control", "Pressure gauge + automatic/manual + L+ regulator"],
              ["Sealing", "Double strip · adjustable time for bag types"],
              ["Protection", "Liquid separator + serviceable wear parts"],
              ["Backing", "2-year warranty · Lava-SA local support"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-border last:border-b-0 px-4 py-3 bg-white"
              >
                <span className="text-xs font-black uppercase tracking-wide text-primary">{k}</span>
                <span className="text-sm text-copy">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <V300InstantCheckout placement="bottom" />

      {/* Reviews */}
      <section className="py-14 bg-[#0a1628] text-white">
        <div className="section-container max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-2">Real buyers — not marketing fluff</h2>
          <p className="text-center text-sm text-white/75 mb-8 max-w-2xl mx-auto">
            Recent verified-style reviews from customers who chose the V.300 platform.
          </p>
          <V300LpReviews />
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-primary text-on-dark-muted py-10 border-t-4 border-[#c41230]">
        <div className="section-container max-w-4xl text-center text-sm space-y-3">
          <p className="text-white font-bold">Lava South Africa — authorised distributor</p>
          <p>
            Questions?{" "}
            <a href="mailto:info@lava-sa.co.za" className="text-secondary hover:underline font-semibold">
              info@lava-sa.co.za
            </a>
          </p>
          <p>
            <Link href="/products/v300-premium-x" className="text-on-dark-muted hover:text-white underline underline-offset-2">
              Full product page with full spec sheet
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
