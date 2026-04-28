import type { Metadata } from "next";
import Link from "next/link";
import ProductCatalogImage from "@/components/shop/ProductCatalogImage";
import { Award, CheckCircle2, Thermometer, Clock, ChefHat, Droplets } from "lucide-react";
import OpenJanetButton from "@/components/shop/OpenJanetButton";
import { calculatePointsEarned } from "@/lib/rewards-config";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "LAVA Sous Vide Machines",
  description:
    "Achieve restaurant-quality results at home with LAVA sous vide precision cookers. Perfectly cooked steak, fish, and vegetables every time — vacuum sealed and slow-cooked to perfection.",
};

export const revalidate = 3600;

// ── Static product data (move to Supabase once images are ready) ─────────────

const SOUS_VIDE_PRODUCTS = [
  {
    id: "sv-lx0020",
    sku: "LX0020",
    slug: "lx20-sous-vide-stick",
    name: "LX 20 Sous Vide Stick",
    short_description:
      "Professional precision immersion circulator. Set your temperature, seal your food, and achieve flawless restaurant-quality results every time.",
    regular_price: 4240,
    sale_price: null,
    primary_image_url:
      "/images/products/sous-vide/lava-sous-vide-stick-lx-20/lava-sous-vide-stick-lx-20.webp",
    stock_status: "in_stock" as const,
    is_featured: false,
    specs: {
      "Temperature Range": "25°C – 95°C",
      "Temperature Accuracy": "±0.1°C",
      "Flow Rate": "8 litres / min",
      "Max Container Size": "15 litres",
      "Power": "1,200 W",
      "Display": "Digital LED",
      "Timer": "Up to 99 hours",
    },
    badge: null,
  },
  {
    id: "sv-lx0033",
    sku: "LX0033",
    slug: "lx33-sous-vide-set",
    name: "Sous Vide Set XXL",
    short_description:
      "Everything you need to start cooking sous vide. Includes the LX 20 stick, 12-litre basin, rack, and insulation cover — ready to go out of the box.",
    regular_price: 6210,
    sale_price: null,
    primary_image_url:
      "/images/products/sous-vide/sous-vide-set-xxl/lava-sous-vide-set-xxl.webp",
    stock_status: "in_stock" as const,
    is_featured: true,
    specs: {
      "Includes": "LX 20 Stick + Basin + Rack + Insulation",
      "Basin Capacity": "12 litres",
      "Temperature Range": "25°C – 95°C",
      "Temperature Accuracy": "±0.1°C",
      "Power": "1,200 W",
      "Timer": "Up to 99 hours",
    },
    badge: "Best Value",
  },
];

const BENEFITS = [
  {
    icon: Thermometer,
    title: "Precision Temperature",
    body: "Cook at exactly the right temperature — to within 0.1°C. No guesswork, no overcooking.",
  },
  {
    icon: Clock,
    title: "Set & Forget",
    body: "Set the timer and walk away. Your food is ready when you are — even hours later.",
  },
  {
    icon: ChefHat,
    title: "Restaurant Results at Home",
    body: "The same technique used by top chefs worldwide. Perfect steak, fish, and vegetables every time.",
  },
  {
    icon: Droplets,
    title: "Locks in Nutrients & Flavour",
    body: "Vacuum sealed and slow-cooked — no moisture or nutrients escape. Richer taste, better nutrition.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Season & Seal", body: "Season your food, place it in a LAVA vacuum bag, and seal it with your LAVA machine." },
  { step: "2", title: "Set Temperature", body: "Clip the sous vide stick to your pot or basin. Set your target temperature and timer." },
  { step: "3", title: "Cook Slowly", body: "The circulator holds the water at the exact temperature while your food cooks gently." },
  { step: "4", title: "Finish & Serve", body: "Remove from the bag. Give it a quick sear in a hot pan for colour and crust. Serve." },
];

export default function SousVidePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Page Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Precision Cooking</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            LAVA Sous Vide Machines
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            Achieve perfect results every time — restaurant-quality steaks, fish, and
            vegetables cooked to the exact degree, sealed in flavour with LAVA vacuum bags.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["View Products", "#products"],
              ["How It Works", "#how-it-works"],
              ["What is Sous Vide?", "#what-is-sous-vide"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-semibold border border-white/30 text-white/80
                           px-4 py-2 hover:bg-white/10 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border py-3">
        <div className="section-container flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-[11px] font-bold uppercase tracking-widest text-on-dark-muted">
          <span>✓ ±0.1°C Precision</span>
          <span>✓ Works with LAVA Vacuum Bags</span>
          <span>✓ Free Delivery over R2,500</span>
          <span>✓ German Engineering</span>
        </div>
      </div>

      {/* ── Products ─────────────────────────────────────────────────── */}
      <section id="products" className="py-20">
        <div className="section-container">
          <div className="mb-10">
            <p className="overline mb-2">Sous Vide Range</p>
            <h2 className="text-3xl font-bold text-primary">Choose Your Set-Up</h2>
            <p className="mt-3 text-copy-muted max-w-lg">
              Start with the stick on its own, or get everything you need in one complete set.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {SOUS_VIDE_PRODUCTS.map((product) => {
              const points = calculatePointsEarned(product.sale_price ?? product.regular_price);
              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden"
                  style={{ backgroundColor: "#FAFAFA" }}
                >
                  {/* Full-card link */}
                  <Link
                    href={`/products/${product.slug}`}
                    aria-label={product.name}
                    className="absolute inset-0 z-10"
                  />

                  <ProductCatalogImage src={product.primary_image_url} alt={product.name} title={product.name}>
                    {product.badge && (
                      <span className="pointer-events-none absolute top-3 left-3 z-10 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                        {product.badge}
                      </span>
                    )}
                    <div className="card-hover-overlay pointer-events-none z-[5]" aria-hidden="true">
                      View {product.name} →
                    </div>
                  </ProductCatalogImage>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 gap-3">
                    <span className="self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border bg-emerald-50 text-emerald-700 border-emerald-200">
                      In Stock
                    </span>
                    <h3 className="font-bold text-lg text-primary leading-snug group-hover:text-primary-mid transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-copy-muted leading-relaxed line-clamp-2 flex-1">
                      {product.short_description}
                    </p>

                    {/* Specs */}
                    <ul className="text-xs text-copy-muted space-y-1">
                      {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                        <li key={k} className="flex gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                          <span><strong>{k}:</strong> {v}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="pt-2 mt-auto border-t border-border">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.regular_price)}
                      </span>
                      <span className="ml-2 text-xs text-copy-muted">incl. VAT</span>
                    </div>

                    {/* Lava Points */}
                    <Link
                      href="/rewards"
                      className="relative z-20 mt-1 flex items-center justify-between gap-2 border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 px-3 py-2 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-secondary shrink-0" />
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                          Earn {points.toLocaleString("en-ZA")} Lava Points
                        </span>
                      </span>
                      <span className="text-[10px] font-bold text-secondary/70 uppercase tracking-wider">
                        How it works →
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────── */}
      <section className="bg-surface py-20 border-y border-border">
        <div className="section-container">
          <div className="mb-12 text-center">
            <p className="overline mb-2">Why sous vide?</p>
            <h2 className="text-3xl font-bold text-primary">The Science of Perfect Cooking</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex flex-col items-center text-center gap-4">
                <div className="h-14 w-14 bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-primary">{title}</h3>
                <p className="text-sm text-copy-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is Sous Vide? ────────────────────────────────────────── */}
      <section id="what-is-sous-vide" className="py-20">
        <div className="section-container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="overline mb-3">The technique</p>
              <h2 className="text-3xl font-bold text-primary mb-5">What is Sous Vide?</h2>
              <div className="space-y-4 text-copy-muted leading-relaxed">
                <p>
                  Sous vide (French for &ldquo;under vacuum&rdquo;) is a method of cooking in which food is
                  vacuum sealed in a bag and then immersed in a water bath at a precise, controlled temperature.
                </p>
                <p>
                  Unlike traditional cooking where you guess doneness, sous vide lets you set the exact
                  internal temperature you want — and the food <em>cannot</em> overcook past it. A steak
                  set to 56°C will be perfectly medium-rare edge to edge, every single time.
                </p>
                <p>
                  Combined with a LAVA vacuum sealer, the method locks in all the natural juices, flavours,
                  and nutrients that are usually lost through traditional high-heat cooking.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 p-8 space-y-4">
              <h3 className="font-bold text-primary text-lg">Perfect temperatures at a glance</h3>
              <div className="space-y-3">
                {[
                  { food: "Beef steak (medium-rare)", temp: "54–57°C", time: "1–4 hours" },
                  { food: "Chicken breast",            temp: "65°C",    time: "1.5–4 hours" },
                  { food: "Salmon fillet",             temp: "52–55°C", time: "40–60 min" },
                  { food: "Pork loin",                 temp: "62°C",    time: "1–4 hours" },
                  { food: "Vegetables",                temp: "83–85°C", time: "30–45 min" },
                  { food: "Eggs (soft)",               temp: "63°C",    time: "45–60 min" },
                ].map(({ food, temp, time }) => (
                  <div key={food} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="font-medium text-primary">{food}</span>
                    <span className="text-copy-muted text-right">
                      <span className="font-bold text-secondary">{temp}</span>
                      <span className="ml-2 text-xs">/ {time}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-primary py-20">
        <div className="section-container">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-3">Step by step</p>
            <h2 className="text-3xl font-bold text-white">How to Cook Sous Vide</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-4">
                <div className="h-12 w-12 bg-secondary flex items-center justify-center">
                  <span className="text-white font-black text-xl">{step}</span>
                </div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="text-center mb-8">
            <p className="overline mb-3">Need advice?</p>
            <h2 className="text-3xl font-bold text-primary mb-4">Not sure which set-up is right for you?</h2>
            <p className="text-copy-muted max-w-lg mx-auto">
              Chat with Janet — our AI advisor will match you to the right sous vide setup based on how you cook.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <OpenJanetButton />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link
              href="/contact"
              className="text-sm font-semibold text-copy-muted hover:text-primary transition-colors"
            >
              Prefer to talk to a person? Contact Us →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
