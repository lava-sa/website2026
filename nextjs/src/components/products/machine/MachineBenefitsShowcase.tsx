import Image from "next/image";
import Link from "next/link";
import { Zap, Layers, Package, Sparkles, Award, ArrowRight } from "lucide-react";

const DESC_IMG = "/images/products/descriptions";

const BENEFIT_IMAGES = {
  welding: `${DESC_IMG}/welding-at-the-touch-of-a-button.webp`,
  doubleSealing: `${DESC_IMG}/double-sealing-lava-vacuum-machines.webp`,
  containers: `${DESC_IMG}/for-containers-and-jars-vacuum-sealing.webp`,
  variety: `${DESC_IMG}/limitless-variety-lava-vacuum-sealing-machines.webp`,
  quality: `${DESC_IMG}/lava-vacuum-sealers-quality-without-compromise.webp`,
} as const;

function BenefitImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden bg-primary-wash ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}

/**
 * Reusable benefit callouts shown on every vacuum-machine product page.
 * Mirrors the la-va.com pattern of 5 alternating blocks.
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
            <BenefitImage
              src={BENEFIT_IMAGES.welding}
              alt="Welding at the touch of a button on a LAVA vacuum sealer"
            />
          </div>
        </div>
      </div>

      {/* ── 2 — Double Sealing ─────────────────────────────────────────── */}
      <div className="bg-surface border-b border-border">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <BenefitImage
              src={BENEFIT_IMAGES.doubleSealing}
              alt="Double sealing with LAVA vacuum machines"
              className="order-2 lg:order-1"
            />
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
                <Layers className="h-7 w-7 text-primary" />
              </div>
              <p className="overline mb-3">Twice the seal, twice the security</p>
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-5 leading-tight">
                Double Sealing with LAVA Vacuum Machines
              </h2>
              <p className="text-copy leading-relaxed mb-4">
                Two parallel weld lines instead of one. If the first seal ever
                fails — under freezer pressure, sous-vide heat, or transport —
                the second seal holds.
              </p>
              <p className="text-copy leading-relaxed">
                This is the difference between a bag that holds for years and one
                that vents after a month. It&apos;s why professional butcheries and
                hunters trust Lava with their entire season&apos;s harvest.
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
                For Containers and Jars Vacuum Sealing
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
            <BenefitImage
              src={BENEFIT_IMAGES.containers}
              alt="Vacuum sealing containers and jars with a LAVA machine"
            />
          </div>
        </div>
      </div>

      {/* ── 4 — Limitless Variety ──────────────────────────────────────── */}
      <div className="bg-surface border-b border-border">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <BenefitImage
              src={BENEFIT_IMAGES.variety}
              alt="Limitless variety with LAVA vacuum sealing machines"
              className="order-2 lg:order-1"
            />
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <p className="overline mb-3">From kitchen to camp</p>
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-5 leading-tight">
                Limitless Variety with LAVA Vacuum Sealing Machines
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
      <div className="bg-primary text-white border-b border-border">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center h-14 w-14 bg-white/10 mb-6">
                <Award className="h-7 w-7 text-white" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-secondary mb-3">
                Made in Germany since 1982
              </p>
              <h2 className="text-3xl sm:text-4xl font-black mb-5 leading-tight">
                LAVA Vacuum Sealers: Quality without Compromise
              </h2>
              <p className="text-white/80 leading-relaxed mb-8">
                Every Lava is engineered, machined and assembled in Bad Saulgau,
                Baden-Württemberg by the Landig family. The same factory, the same
                tolerances, the same obsession with build quality for over four decades.
              </p>
              <blockquote className="border-l-2 border-secondary pl-6">
                <p className="text-white/90 italic leading-relaxed mb-3">
                  &ldquo;I&apos;ve used my Lava daily in the butchery for nine years.
                  Not one repair, not one missed seal. It just works.&rdquo;
                </p>
                <footer className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Pieter K. — Butcher, Bloemfontein
                </footer>
              </blockquote>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden ring-1 ring-white/20">
              <Image
                src={BENEFIT_IMAGES.quality}
                alt="LAVA vacuum sealers — quality without compromise"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
