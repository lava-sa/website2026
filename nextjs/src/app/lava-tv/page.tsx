import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Play, Youtube } from "lucide-react";

export const metadata: Metadata = {
  title: "Lava TV — Vacuum Sealing Video Guides | Lava South Africa",
  description:
    "Watch LAVA vacuum sealing in action — game meat, fish, sous vide, dry goods, containers and more. Video guides from the LAVA Germany YouTube channel.",
  openGraph: {
    title: "Lava TV — Vacuum Sealing Video Guides",
    description:
      "See exactly how LAVA vacuum sealers handle everything from venison and smoked fish to coffee, herbs and sous vide cooking.",
  },
};

// ─── Video data ───────────────────────────────────────────────────────────────

interface Video {
  id: string;
  title: string;
  desc?: string;
  lang?: "en" | "de";
}

interface Category {
  slug: string;
  label: string;
  intro: string;
  videos: Video[];
}

// English-language videos — featured at top
const featuredVideos: Video[] = [
  {
    id: "yn-qpoAtbVI",
    title: "Why Choose a Lava Vacuum Sealer?",
    desc: "Discover the unique advantages of LAVA machines over cheaper alternatives.",
    lang: "en",
  },
  {
    id: "4Ut74sEOf1I",
    title: "Which Vacuum Sealer is Right for You?",
    desc: "The ultimate buying guide — domestic vs commercial, features explained.",
    lang: "en",
  },
  {
    id: "yaf_L7C6N6U",
    title: "Vacuum Sealer for Hunters & Fishermen",
    desc: "How LAVA outperforms the competition for game meat and fresh catch.",
    lang: "en",
  },
  {
    id: "XEdT5cCNiwk",
    title: "Vacuum-Packing Fish & Salmon",
    desc: "Sealing whole fish fillets and salmon for sous vide or freezer storage.",
    lang: "en",
  },
  {
    id: "MBJEtEesjWs",
    title: "How to Vacuum Seal in a Glass",
    desc: "Using the LAVA vacuum bell attachment to seal glass jars and containers.",
    lang: "en",
  },
  {
    id: "KfuOy68QOn0",
    title: "Vacuum-Packing Jars",
    desc: "Step-by-step guide to vacuuming standard jars with the LAVA jar sealer.",
    lang: "en",
  },
];

const categories: Category[] = [
  {
    slug: "game-hunting",
    label: "Game & Hunting",
    intro:
      "South Africa's hunting season puts serious demands on your freezer. LAVA vacuum sealers lock in venison, biltong cuts and wild game for months without freezer burn.",
    videos: [
      {
        id: "yaf_L7C6N6U",
        title: "Vacuum Sealer for Hunters & Fishermen",
        desc: "Best-in-test review for hunting and fishing applications.",
        lang: "en",
      },
      {
        id: "CgLjpQiMscw",
        title: "Smoked Fish Preservation",
        desc: "Keeping smoked fish airtight and flavour-locked with the V.200.",
      },
      {
        id: "118Dd6DhhxI",
        title: "Outdoor & Emergency Kit Sealing",
        desc: "Vacuum sealing first aid supplies and field kits for long-term protection.",
      },
    ],
  },
  {
    slug: "fish-seafood",
    label: "Fish & Seafood",
    intro:
      "From the West Coast to Mozambique, South Africans love their seafood. LAVA handles wet fish and juicy marinades cleanly every time.",
    videos: [
      {
        id: "XEdT5cCNiwk",
        title: "Vacuum-Packing Fish & Salmon",
        desc: "Sealing whole fish and salmon fillets for sous vide or freezer.",
        lang: "en",
      },
      {
        id: "0DhpPcpo4VY",
        title: "Sealing Scampi & Shellfish",
        desc: "How LAVA handles wet and juicy seafood without mess.",
      },
      {
        id: "CgLjpQiMscw",
        title: "Smoked Fish Vacuum Sealing",
        desc: "Preserving smoked fish for weeks in the fridge.",
      },
    ],
  },
  {
    slug: "cooking-kitchen",
    label: "Cooking & Kitchen",
    intro:
      "Meal prep, marinating and sous vide — LAVA cuts waste and maximises flavour at every stage of the kitchen workflow.",
    videos: [
      {
        id: "CYBrTfhGMko",
        title: "Sealing Sausages & Charcuterie",
        desc: "Vacuum sealing sausages and cured meats to extend shelf life.",
      },
      {
        id: "1H0qA-6pE8E",
        title: "Peppers & Vegetables",
        desc: "Batch-prepping fresh produce for the fridge or freezer.",
      },
      {
        id: "Wr_kY1fNfgQ",
        title: "Green Beans & Blanched Veg",
        desc: "Preserving blanched vegetables at peak colour and nutrition.",
      },
      {
        id: "rmHiCfqTSJc",
        title: "Smooth Bags for Liquids & Sauces",
        desc: "Using smooth-surface bags for chilies, sauces and purees.",
      },
      {
        id: "iQQ-HluQ0Us",
        title: "Cheese Storage",
        desc: "Keeping hard and soft cheeses without mould for weeks.",
      },
      {
        id: "A8NLL6W33l8",
        title: "Wine & Oil in Bottles",
        desc: "Re-sealing opened bottles of wine, olive oil and condiments.",
      },
    ],
  },
  {
    slug: "pantry-dry-goods",
    label: "Pantry & Dry Goods",
    intro:
      "Rice, coffee, nuts, spices and dried herbs stay fresh 3–5× longer when vacuum sealed. Ideal for bulk buying and seasonal produce.",
    videos: [
      {
        id: "OWWhKBAhbbU",
        title: "Coffee Beans in Vacuum Bags",
        desc: "Preserving roasted coffee at peak aroma.",
      },
      {
        id: "FtN-HvbLaH8",
        title: "Coffee in LAVA Containers",
        desc: "Using LAVA acrylic containers to keep coffee fresh between bags.",
      },
      {
        id: "PnvNqehQT00",
        title: "Infused Oils with Herbs & Coffee",
        desc: "Accelerating oil infusion with vacuum pressure.",
      },
      {
        id: "5p8xiB6wI2o",
        title: "Nuts & Dried Goods",
        desc: "Bulk storing nuts and dried fruit without oxidation.",
      },
      {
        id: "O4WeDy7pXfI",
        title: "Powders & Bulk Dry Goods",
        desc: "Sealing flour, spices, powders and grains in smooth bags.",
      },
    ],
  },
  {
    slug: "containers-jars",
    label: "Containers & Jars",
    intro:
      "LAVA's jar and glass attachments extend the system far beyond bags — vacuum seal any standard jar, bottle or acrylic container.",
    videos: [
      {
        id: "KfuOy68QOn0",
        title: "Vacuum-Packing Jars",
        desc: "Step-by-step: vacuuming standard mason and preserving jars.",
        lang: "en",
      },
      {
        id: "MBJEtEesjWs",
        title: "How to Vacuum Seal in a Glass",
        desc: "Using the LAVA vacuum bell to seal glass containers.",
        lang: "en",
      },
      {
        id: "uqYscXTl_xQ",
        title: "The LAVA Vacuum Bell",
        desc: "Demonstrating the vacuum bell attachment for glasses and delicate items.",
      },
    ],
  },
  {
    slug: "technical-specialist",
    label: "Technical & Specialist",
    intro:
      "LAVA machines aren't just for food — they protect valuables, components and collectibles from moisture and corrosion.",
    videos: [
      {
        id: "vouGmBy4Y0o",
        title: "Plastic & Engineering Parts",
        desc: "Vacuum packing components for corrosion-free storage and shipping.",
      },
      {
        id: "8YPw63NQ2SI",
        title: "Corrosion Protection for Metal Parts",
        desc: "Protecting small metal components and fasteners from rust.",
      },
      {
        id: "mbCb9byNq9s",
        title: "Vacuum Power Demo — Crushing Cans",
        desc: "A striking demonstration of just how powerful LAVA's vacuum is.",
      },
    ],
  },
  {
    slug: "buying-guides",
    label: "Reviews & Buying Guides",
    intro:
      "Not sure which LAVA model is right for you? These guides walk through the range so you can choose with confidence.",
    videos: [
      {
        id: "yn-qpoAtbVI",
        title: "Why Choose a Lava Vacuum Sealer?",
        desc: "The unique advantages that set LAVA apart from cheap alternatives.",
        lang: "en",
      },
      {
        id: "4Ut74sEOf1I",
        title: "Which Vacuum Sealer is Right for You?",
        desc: "Full buying guide comparing domestic and commercial models.",
        lang: "en",
      },
      {
        id: "WFt1dapyhvk",
        title: "V.300 Premium — Test Review",
        desc: "In-depth review of the V.300 Premium (rated Very Good).",
      },
      {
        id: "ji42zry4xmU",
        title: "Best Vacuum Sealers 2025",
        desc: "LAVA's guide to choosing the right machine in 2025.",
      },
      {
        id: "0uFzEZvVqGU",
        title: "Vacuum Sealer Buying Tips 2025",
        desc: "What to look for and what to avoid when buying a vacuum sealer.",
      },
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function LangBadge({ lang }: { lang?: "en" | "de" }) {
  if (!lang) return null;
  return (
    <span className={`absolute top-2 right-2 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 z-10 ${
      lang === "en"
        ? "bg-secondary text-white"
        : "bg-black/50 text-white/80"
    }`}>
      {lang === "en" ? "EN" : "DE"}
    </span>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="group bg-white border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-zinc-100">
        <LangBadge lang={video.lang} />
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-primary text-sm leading-snug">{video.title}</h3>
        {video.desc && (
          <p className="text-xs text-copy-muted mt-1 leading-relaxed">{video.desc}</p>
        )}
      </div>
    </div>
  );
}

function CategorySection({ cat }: { cat: Category }) {
  return (
    <section id={cat.slug} className="scroll-mt-28 mb-20">
      <div className="mb-6 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">{cat.label}</h2>
        <p className="mt-1.5 text-sm text-copy-muted max-w-2xl">{cat.intro}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cat.videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LavaTvPage() {
  return (
    <main className="py-16">
      <div className="section-container">

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <p className="overline mb-3">Video Library</p>
          <h1 className="text-5xl font-black text-primary leading-tight">
            Lava TV
          </h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            See exactly what a LAVA vacuum sealer can do — from venison and smoked fish
            to coffee, sous vide and specialist applications.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              EN — English audio
            </span>
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-copy-muted px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-400" />
              DE — German audio · South African English versions in production
            </span>
          </div>
        </div>

        {/* Featured English videos */}
        <section id="featured" className="scroll-mt-28 mb-20">
          <div className="mb-6 pb-4 border-b-2 border-primary">
            <div className="flex items-center gap-3">
              <span className="bg-secondary text-white text-[10px] font-black uppercase tracking-wider px-2 py-1">
                English
              </span>
              <h2 className="text-2xl font-bold text-primary">Start Here</h2>
            </div>
            <p className="mt-1.5 text-sm text-copy-muted max-w-2xl">
              These videos are in English — perfect for sharing with customers or watching before you buy.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>

        {/* Quick category nav */}
        <nav className="flex flex-wrap gap-2 mb-16">
          {categories.map((cat) => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-border text-copy-muted hover:border-primary hover:text-primary transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </nav>

        {/* Category sections */}
        {categories.map((cat) => (
          <CategorySection key={cat.slug} cat={cat} />
        ))}

        {/* YouTube channel CTA */}
        <div className="bg-primary text-white px-8 py-12 text-center mt-4">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 bg-white/10 rounded-full flex items-center justify-center">
              <Youtube className="h-7 w-7 text-secondary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">More on the LAVA YouTube Channel</h2>
          <p className="text-white/70 text-sm max-w-md mx-auto mb-6">
            Browse the full library of LAVA product and how-to videos on the
            official LAVA Germany channel.
          </p>
          <Link
            href="https://www.youtube.com/@la.va_vakuumverpackung/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-6 py-3 hover:bg-secondary/90 transition-colors text-sm"
          >
            Visit LAVA on YouTube
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Shop CTA */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { label: "Shop Vacuum Machines", href: "/products/vacuum-machines" },
            { label: "Shop Bags & Rolls", href: "/products/bags-rolls" },
            { label: "Shop Containers", href: "/products/containers-lids" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="border border-border px-6 py-4 text-sm font-bold text-primary hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
