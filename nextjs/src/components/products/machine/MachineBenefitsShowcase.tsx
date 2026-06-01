import Link from "next/link";
import { Zap, Layers, Package, Sparkles, Award, ArrowRight } from "lucide-react";

/**
 * Reusable benefit callouts shown on every vacuum-machine product page.
 * Mirrors the la-va.com pattern of 5 alternating blocks.
 *
 * Content is brand-level and does not vary per machine — build once, render
 * on every machine page.
 */
export default function MachineBenefitsShowcase() {
  return (
    <section className="bg-white">
      {/* ── 1 — Welding at the Touch of a Button ───────────────────────── */}
      <div className="border-y border-border">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <p className="overline mb-3">One-button simplicity</p>
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-5 leading-tight">
                Welding at the Touch of a Button
              </h2>
              <p className="text-copy leading-relaxed mb-4">
                Drop the bag in. Push down. Walk away. The Lava handles vacuum,
                seal, and release as one fluid motion — no menus, no settings, no fuss.
              </p>
              <p className="text-copy leading-relaxed">
                For everything else — delicate foods, marinades, partial vacuums — the
                manual mode gives you complete control over the suction level.
                Both worlds, one machine.
              </p>
            </div>
            <div className="relative aspect-[4/3] bg-primary-wash overflow-hidden flex items-center justify-center">
              <Zap className="h-32 w-32 text-primary/30" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2 — Double Sealing ─────────────────────────────────────────── */}
      <div className="bg-surface border-b border-border">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] bg-primary/5 overflow-hidden flex items-center justify-center order-2 lg:order-1">
              <Layers className="h-32 w-32 text-primary/30" strokeWidth={1} />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
                <Layers className="h-7 w-7 text-primary" />
              </div>
              <p className="overline mb-3">Twice the seal, twice the security</p>
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-5 leading-tight">
                Double Sealing
              </h2>
              <p className="text-copy leading-relaxed mb-4">
                Two parallel weld lines instead of one. If the first seal ever
                fails — under freezer pressure, sous-vide heat, or transport —
                the second seal holds.
              </p>
              <p className="text-copy leading-relaxed">
                This is the difference between a bag that holds for years and one
                that vents after a month. It's why professional butcheries and
                hunters trust Lava with their entire season's harvest.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 — For Containers, Jars and Pots ──────────────────────────── */}
      <div className="border-b border-border">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <p className="overline mb-3">Beyond bags</p>
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-5 leading-tight">
                For Containers, Jars and Pots
              </h2>
              <p className="text-copy leading-relaxed mb-6">
                Every Lava vacuum sealer ships with a hose attachment — extend
                the same machine to vacuum-seal Lava containers, glass jars,
                wine bottles and even pots. One device, dozens of use cases.
              </p>
              <Link
                href="/products/containers-lids"
                className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
              >
                Browse the containers & jars range
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative aspect-[4/3] bg-primary-wash overflow-hidden flex items-center justify-center">
              <Package className="h-32 w-32 text-primary/30" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 — Limitless Variety ──────────────────────────────────────── */}
      <div className="bg-surface border-b border-border">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] bg-primary/5 overflow-hidden flex items-center justify-center order-2 lg:order-1">
              <Sparkles className="h-32 w-32 text-primary/30" strokeWidth={1} />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <p className="overline mb-3">From kitchen to camp</p>
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-5 leading-tight">
                Limitless Variety
              </h2>
              <p className="text-copy leading-relaxed mb-4">
                Game meat. Biltong. Fish. Sous-vide cuts. Marinades. Cheese.
                Coffee beans. Dry goods. Documents. Camera lenses. Ammunition.
                Anything that benefits from being air-free and moisture-free.
              </p>
              <p className="text-copy leading-relaxed">
                South African home cooks, hunters, anglers, butchers, and food
                producers have used Lava machines daily since 2007 across every
                imaginable application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5 — Quality without Compromise ─────────────────────────────── */}
      <div className="bg-primary text-white">
        <div className="section-container py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 bg-white/10 mb-6">
              <Award className="h-7 w-7 text-white" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">
              Made in Germany since 1982
            </p>
            <h2 className="text-3xl sm:text-4xl font-black mb-6 leading-tight">
              Quality without Compromise
            </h2>
            <p className="text-white/80 leading-relaxed text-lg mb-8">
              Every Lava is engineered, machined and assembled in Bad Saulgau,
              Baden-Württemberg by the Landig family. The same factory, the same
              tolerances, the same obsession with build quality for over four decades.
            </p>
            <blockquote className="border-l-2 border-secondary pl-6 text-left max-w-xl mx-auto">
              <p className="text-white/90 italic leading-relaxed mb-3">
                &ldquo;I've used my Lava daily in the butchery for nine years.
                Not one repair, not one missed seal. It just works.&rdquo;
              </p>
              <footer className="text-xs font-bold uppercase tracking-wider text-secondary">
                Pieter K. — Butcher, Bloemfontein
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
