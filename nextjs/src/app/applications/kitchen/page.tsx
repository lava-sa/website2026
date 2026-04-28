import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vacuum Sealing for Home Kitchen & Meal Prep",
  description:
    "Meal prep, bulk buying, sous vide, load-shedding protection and zero food waste — LAVA in the South African home kitchen pays for itself within the first year.",
  path: "/applications/kitchen",
});

export default function KitchenApplicationPage() {
  const pageLd = webPageSchema({
    name: "Vacuum Sealing for Home Kitchen & Meal Prep",
    description: "Meal prep, bulk buying, sous vide, load-shedding protection and zero food waste — LAVA in the South African home kitchen pays for itself within the first year.",
    url: "/applications/kitchen",
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Applications", url: "/applications" },
    { name: "Home Kitchen", url: "/applications/kitchen" },
  ]);

  return (
    <main className="py-16">
      <JsonLd data={[pageLd, crumbLd]} />
      <div className="section-container max-w-3xl">

        <div className="mb-10">
          <p className="overline mb-3">Applications</p>
          <h1 className="text-4xl font-black text-primary leading-tight mb-3">
            Home Kitchen &amp; Meal Prep
          </h1>
          <p className="text-lg text-copy-muted leading-relaxed">
            A LAVA vacuum sealer in the kitchen does more than extend shelf life. It changes
            how you shop, cook, plan meals and think about waste — permanently.
          </p>
        </div>

        {/* REPLACED Placeholder with real Image */}
        <Image
          src="/images/applications/app-kitchen-meal-prep.webp"
          alt="Vacuum sealing for meal prep in home kitchen"
          width={1200}
          height={525}
          className="rounded-xl mb-6 border border-border"
        />

        <div className="prose-lava mt-12">

          <h2 className="text-2xl font-bold text-primary mb-4">What Changes When You Have a LAVA</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { before: "Leftovers last 3–4 days", after: "Leftovers last 10–14 days" },
              { before: "Buy fresh 3–4× per week", after: "Buy once, bulk-prep once" },
              { before: "Load shedding = food anxiety", after: "Sealed food survives outages" },
              { before: "Sous vide requires a deli bag", after: "Seal it yourself in seconds" },
              { before: "Herbs wilt in 2–3 days", after: "Fresh herbs last 3–4 weeks" },
              { before: "Coffee stale in 2 weeks", after: "Coffee fresh for 4–6 months" },
            ].map(({ before, after }) => (
              <div key={before} className="border border-border bg-surface p-4 text-sm">
                <p className="text-copy-muted line-through">{before}</p>
                <p className="font-bold text-primary mt-1 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-secondary shrink-0" /> {after}
                </p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">5 Ways a LAVA Transforms Your Kitchen</h2>

          <h3 className="text-lg font-bold text-primary mt-6 mb-2">1. Sunday Meal Prep at Scale</h3>
          <p>
            Cook a large batch of stew, curry or braised meat on Sunday. Portion into
            meal-sized bags. Vacuum seal. Refrigerate what you&apos;ll eat this week — freeze
            the rest. On a Tuesday evening, drop a bag in boiling water for 8 minutes.
            Restaurant-quality food with zero weeknight cooking stress.
          </p>
          <ul>
            <li>Sealed cooked portions last 10–14 days in the fridge vs 3–4 days loose</li>
            <li>Frozen cooked meals last 12 months vs 2–3 months standard packaging</li>
            <li>Bags can go straight from freezer to boiling water (with the seal opened 1 cm)</li>
          </ul>

          <div className="relative aspect-video bg-zinc-100 my-6">
            <iframe
              src="https://www.youtube-nocookie.com/embed/1H0qA-6pE8E?rel=0&modestbranding=1"
              title="Vacuum Sealing Vegetables and Meal Prep"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <h3 className="text-lg font-bold text-primary mt-6 mb-2">2. Bulk Buying Made Practical</h3>
          <p>
            Chicken on special at R45/kg? Buy 5 kg. Beef mince at a good price? Take 3 kg.
            Vacuum seal into meal portions the same day, freeze, and you&apos;ve locked in
            the price and the quality for up to 2 years.
          </p>

          {/* REPLACED Placeholder with real Image */}
          <Image
            src="/images/applications/app-kitchen-bulk-buying.webp"
            alt="Bulk buying with vacuum sealing for long-term storage"
            width={1200}
            height={450}
            className="rounded-xl my-6 border border-border"
          />

          <h3 className="text-lg font-bold text-primary mt-6 mb-2">3. Sous Vide — Unlocked</h3>
          <p>
            Sous vide cooking requires vacuum-sealed food. Precision low-temperature cooking
            in a water bath gives perfectly consistent results — a chicken breast at exactly
            65°C, a steak at 56°C, fish at 52°C — with zero risk of overcooking.
          </p>
          <p>
            Any LAVA machine seals food for sous vide. Seal with a knob of butter and a
            sprig of rosemary directly in the bag. The vacuum forces the aromatics into the
            food during cooking.
          </p>

          <div className="relative aspect-video bg-zinc-100 my-6">
            <iframe
              src="https://www.youtube-nocookie.com/embed/XEdT5cCNiwk?rel=0&modestbranding=1"
              title="Sous Vide Vacuum Sealing with LAVA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <h3 className="text-lg font-bold text-primary mt-6 mb-2">4. Vacuum Marinating — 20 Minutes Instead of Overnight</h3>
          <p>
            Seal your braai meat in a bag with marinade, apply vacuum, and the pressure
            forces the liquid into the meat cells. 20–30 minutes equals the result of
            8–12 hours conventional marinating. Ideal for weeknight braais.
          </p>

          <h3 className="text-lg font-bold text-primary mt-6 mb-2">5. Pantry & Fridge Organisation</h3>
          <p>
            Coffee, nuts, spices, dried fruit, cheese, leftover wine — sealed and labelled,
            your fridge and pantry become genuinely organised. Flat vacuum bags stack perfectly.
            Containers with vacuum lids keep everything airtight without a single bag.
          </p>

          {/* REPLACED Placeholder with real Image */}
          <Image
            src="/images/applications/app-kitchen-pantry-organisation.webp"
            alt="Organising pantry and fridge with vacuum sealed containers"
            width={1200}
            height={450}
            className="rounded-xl my-6 border border-border"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Recommended Machine for the Home Kitchen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              {
                model: "V.100® Premium X",
                tag: "Entry Level",
                desc: "Perfect for smaller households or first-time buyers. Full LAVA quality at the entry price point.",
                href: "/products/vacuum-machines",
              },
              {
                model: "V.300® Premium X",
                tag: "Most Popular",
                desc: "The definitive home kitchen machine. 42 cm sealing width, Liquid Stop, pressure control and jar attachment.",
                href: "/products/vacuum-machines",
              },
            ].map(({ model, tag, desc, href }) => (
              <div key={model} className="border border-border p-5">
                <p className="text-[9px] font-bold uppercase tracking-wider text-secondary mb-1">{tag}</p>
                <p className="font-bold text-primary text-base mb-2">{model}</p>
                <p className="text-xs text-copy-muted leading-relaxed mb-4">{desc}</p>
                <Link href={href} className="block text-center bg-primary text-white text-xs font-bold py-2.5 hover:bg-primary/90 transition-colors">
                  View Machine →
                </Link>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Accessories for the Home Kitchen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              ["Vacuum Bags 20×30 cm", "Standard meal portion size", "/products/bags-rolls"],
              ["Acrylic Containers", "Fridge and pantry organisation", "/products/containers-lids"],
              ["Vacuum Rolls", "Custom sizes for oddly-shaped food", "/products/bags-rolls"],
            ].map(([name, desc, href]) => (
              <Link key={href + name} href={href} className="border border-border bg-surface p-4 hover:border-primary hover:bg-primary/5 transition-colors group">
                <p className="font-bold text-primary text-sm group-hover:text-secondary transition-colors">{name}</p>
                <p className="text-xs text-copy-muted mt-1">{desc}</p>
              </Link>
            ))}
          </div>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/blog/how-long-does-vacuum-sealed-food-last" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shelf Life Guide
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-xs font-black uppercase tracking-widest text-copy-muted mb-3">Other Applications</p>
          <div className="flex flex-wrap gap-3">
            {[
              ["Hunters & Game", "/applications/hunter-game"],
              ["Anglers & Fishing", "/applications/angler-fishing"],
              ["Butchery", "/applications/butchery"],
              ["Biltong & Charcuterie", "/applications/biltong"],
              ["Food Production", "/applications/food-production"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-semibold text-primary hover:text-secondary transition-colors border border-border px-4 py-2 hover:border-primary">
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}