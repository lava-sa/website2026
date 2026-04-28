import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Special Offers & Promotions",
  description:
    "Watch this page for the latest LAVA South Africa promotions. We regularly run special offers to coincide with trade shows, hunting season, and local events.",
};

export const revalidate = 3600;

const UPCOMING_EVENTS = [
  {
    name: "Braai Season",
    date: "August – October",
    location: "Nationwide",
    description:
      "Heritage Month and the heart of braai season — the perfect time to stock up on vacuum bags, butchery gear and sous vide accessories.",
  },
  {
    name: "Year-End Sale",
    date: "November – December",
    location: "Online",
    description:
      "Our annual end-of-year promotion with discounts across the full range. Great for gifting or stocking the kitchen before the festive season.",
  },
];

export default async function SpecialOffersPage() {
  let products: Product[] = [];
  try {
    products = await getProductsByCategory("special-offers");
  } catch {
    // Supabase unavailable — show content without products
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/headers/lava-sa-vacuum-sealers-header-pick-007.webp"
            alt="LAVA vacuum sealer in action"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative section-container py-20">
          <p className="overline text-secondary mb-3">Promotions &amp; Deals</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Special Offers
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            We regularly run promotions to coincide with trade shows, hunting
            season and key events throughout the year. Bookmark this page and
            check back often — you won&apos;t want to miss out.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#current-offers"
              className="inline-block bg-secondary text-white font-bold px-6 py-3 hover:bg-secondary/90 transition-colors"
            >
              View Current Offers
            </a>
            <a
              href="#upcoming-events"
              className="inline-block border border-white/30 text-white/80 font-semibold px-6 py-3 hover:bg-white/10 hover:text-white transition-colors"
            >
              Upcoming Events
            </a>
          </div>
        </div>
      </section>

      {/* ── Stay informed strip ───────────────────────────────────────────────── */}
      <div className="bg-secondary">
        <div className="section-container py-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-white font-semibold text-sm">
            Watch this page to stay informed of the latest LAVA South Africa promotion offers.
          </p>
          <a
            href="mailto:info@lava-sa.co.za?subject=Please notify me of special offers"
            className="text-sm font-bold text-white underline underline-offset-2 hover:no-underline whitespace-nowrap"
          >
            Email me when offers go live →
          </a>
        </div>
      </div>

      {/* ── Current offers / products ─────────────────────────────────────────── */}
      <section id="current-offers" className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">On sale now</p>
            <h2 className="text-3xl font-bold text-primary">Current Promotions</h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-none p-16 text-center bg-surface">
              <p className="text-2xl mb-3">🏷️</p>
              <p className="font-bold text-primary text-lg mb-2">No active promotions right now</p>
              <p className="text-copy-muted max-w-md mx-auto">
                Our next promotion is just around the corner. Check back soon or
                send us an email and we&apos;ll let you know the moment an offer goes live.
              </p>
              <a
                href="mailto:info@lava-sa.co.za?subject=Please notify me of special offers"
                className="inline-block mt-6 bg-primary text-white font-bold px-6 py-3 hover:bg-primary/90 transition-colors"
              >
                Notify Me
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Event image feature ───────────────────────────────────────────────── */}
      <section className="bg-surface border-y border-border py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="overline mb-3">Where you&apos;ll find us</p>
              <h2 className="text-3xl font-bold text-primary mb-5">
                We Bring Our Best Prices to Every Event
              </h2>
              <p className="text-copy-muted leading-relaxed mb-4">
                From the country&apos;s biggest hunting expos to butchery trade shows
                and outdoor festivals, LAVA South Africa attends events across the
                country — and we always bring exclusive show pricing with us.
              </p>
              <p className="text-copy-muted leading-relaxed mb-6">
                Can&apos;t make it in person? Our online promotions run alongside every
                event so you can take advantage of the same deals from anywhere
                in South Africa.
              </p>
              <Link
                href="/about"
                className="inline-block border border-primary text-primary font-semibold px-5 py-2.5 hover:bg-primary hover:text-white transition-colors"
              >
                More About Us
              </Link>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/headers/lava-sa-vacuum-sealers-header-pick-012.webp"
                alt="LAVA vacuum sealing at trade and outdoor events across South Africa"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming events ───────────────────────────────────────────────────── */}
      <section id="upcoming-events" className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">Mark your calendar</p>
            <h2 className="text-3xl font-bold text-primary">Upcoming Promotion Events</h2>
            <p className="mt-3 text-copy-muted max-w-xl">
              These are the key dates when you can expect special pricing, bundle
              deals and exclusive offers from LAVA South Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {UPCOMING_EVENTS.map((event) => (
              <div key={event.name} className="border border-border bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
                  {event.date}
                </p>
                <h3 className="text-lg font-bold text-primary mb-1">{event.name}</h3>
                <p className="text-xs text-copy-muted mb-3 font-medium">{event.location}</p>
                <p className="text-sm text-copy-muted leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Second image + CTA ────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden py-24">
        <div className="absolute inset-0">
          <Image
            src="/images/headers/lava-sa-vacuum-sealers-header-pick-012.webp"
            alt="LAVA South Africa vacuum sealing"
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative section-container text-center max-w-2xl mx-auto">
          <p className="overline text-secondary mb-4">Never miss a deal</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
            Be the First to Know
          </h2>
          <p className="text-on-dark-muted text-lg leading-relaxed mb-8">
            Drop us an email and we&apos;ll add you to our promotions list. No spam —
            just a quick heads-up when a new offer goes live.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:info@lava-sa.co.za?subject=Please notify me of special offers"
              className="inline-block bg-secondary text-white font-bold px-8 py-3 hover:bg-secondary/90 transition-colors"
            >
              Email Us to Subscribe
            </a>
            <Link
              href="/products"
              className="inline-block border border-white/30 text-white/80 font-semibold px-8 py-3 hover:bg-white/10 hover:text-white transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
