import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Applications — LAVA for Every Use",
  description:
    "Whether you hunt, fish, braai, make biltong, run a butchery or cook sous vide — there's a LAVA vacuum sealer built for how you work.",
  path: "/applications",
});

const applications = [
  {
    slug: "kitchen",
    title: "Home Kitchen & Meal Prep",
    subtitle: "For the household that wastes nothing",
    desc: "Meal prep, bulk buying, extending fridge life and sous vide cooking — LAVA in the kitchen pays for itself in under a year through food waste savings alone.",
    image: "app-kitchen-meal-prep",
    tags: ["Meal Prep", "Sous Vide", "Bulk Buying", "Load Shedding"],
    cta: "Kitchen Guide",
    machines: ["V.100® Premium X", "V.300® Premium X"],
  },
  {
    slug: "hunter-game",
    title: "Hunters & Game Processing",
    subtitle: "From the bush to the freezer",
    desc: "South Africa's hunting culture deserves equipment that matches the commitment. Process a full animal — blesbok, kudu, impala, warthog — and store it for 2–3 years without a gram of waste.",
    image: "app-hunter-game-field",
    tags: ["Game Meat", "Venison", "Blesbok", "Kudu", "Processing"],
    cta: "Hunting Guide",
    machines: ["V.300® Premium X", "V.400® Premium"],
  },
  {
    slug: "angler-fishing",
    title: "Anglers & Fishing",
    subtitle: "Still excellent 12 months later",
    desc: "Snoek, yellowtail, cob, kingklip — vacuum sealed the same day you catch it, your fish is still excellent 12–15 months later. No freezer burn. No off-flavours. Real catch quality preserved.",
    image: "app-fishing-snoek-west-coast",
    tags: ["Snoek", "Yellowtail", "Fishing", "West Coast", "KZN"],
    cta: "Fishing Guide",
    machines: ["V.300® Premium X"],
  },
  {
    slug: "butchery",
    title: "Butchery & Meat Processing",
    subtitle: "For serious meat work",
    desc: "Extend display life, reduce shrinkage, improve presentation and protect margins. Whether you're running a small retail butchery or processing a whole carcass at home, LAVA has the machine for the job.",
    image: "app-butchery-meat-counter",
    tags: ["Butchery", "Retail", "Commercial", "Meat Processing"],
    cta: "Butchery Guide",
    machines: ["V.333® Chrome", "V.400® Premium", "V.500® Premium"],
  },
  {
    slug: "biltong",
    title: "Biltong & Charcuterie",
    subtitle: "South Africa's own preservation art",
    desc: "Biltong makers, droëwors producers and charcuterie enthusiasts — vacuum sealing extends your product's shelf life dramatically and opens up distribution possibilities that loose packaging never could.",
    image: "app-biltong-hanging-drying",
    tags: ["Biltong", "Droëwors", "Charcuterie", "Preservation"],
    cta: "Biltong Guide",
    machines: ["V.300® Premium X", "V.333® Chrome"],
  },
  {
    slug: "catering",
    title: "Catering & Restaurants",
    subtitle: "Less waste, better food, faster service",
    desc: "Professional kitchens use LAVA to reduce food costs, deliver consistent quality and stay HACCP compliant. Vacuum-sealed portions, sous vide production and batch sauces — all from one reliable machine.",
    image: "app-catering-restaurant-kitchen",
    tags: ["Catering", "Restaurant", "Sous Vide", "HACCP", "Portion Control"],
    cta: "Catering Guide",
    machines: ["V.300® Premium X", "V.400® Premium"],
  },
  {
    slug: "food-production",
    title: "Food Production & Small Business",
    subtitle: "For producers who need reliability",
    desc: "Farmers market suppliers, deli owners, caterers and small food producers — LAVA commercial machines are built for continuous use and produce presentation-quality vacuum seals every time.",
    image: "app-food-production-farmers-market",
    tags: ["Restaurant", "Deli", "Catering", "Farmers Market", "Commercial"],
    cta: "Production Guide",
    machines: ["V.400® Premium", "V.500® Premium", "V.500® Premium XXL"],
  },
];

function PlaceholderImage({ name, aspect = "aspect-[16/9]" }: { name: string; aspect?: string }) {
  return (
    <div className={`${aspect} bg-primary/10 relative overflow-hidden flex items-end`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
      <div className="relative p-3 w-full bg-black/20 backdrop-blur-sm">
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Image needed</p>
        <p className="text-xs font-semibold text-white/80">{name}.jpg</p>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const pageLd = webPageSchema({
    name: "Applications — LAVA for Every Use",
    description: "Whether you hunt, fish, braai, make biltong, run a butchery or cook sous vide — there's a LAVA vacuum sealer built for how you work.",
    url: "/applications",
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Applications", url: "/applications" },
  ]);

  return (
    <main className="py-16">
      <JsonLd data={[pageLd, crumbLd]} />
      <div className="section-container">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <p className="overline mb-3">Applications</p>
          <h1 className="text-5xl font-black text-primary">LAVA for Every Use</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            From the kitchen counter to the hunting camp, the fishing boat to the butchery
            floor — LAVA vacuum sealers are built for the way South Africans actually work
            with food.
          </p>
        </div>

        {/* Application cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {applications.map((app) => (
            <Link
              key={app.slug}
              href={`/applications/${app.slug}`}
              className="group border border-border bg-white hover:shadow-lg transition-all duration-200 flex flex-col"
            >
              <PlaceholderImage name={app.image} />

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-black text-primary group-hover:text-secondary transition-colors leading-snug mb-1">
                  {app.title}
                </h2>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                  {app.subtitle}
                </p>
                <p className="text-sm text-copy-muted leading-relaxed flex-1 mb-4">
                  {app.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {app.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-primary/8 text-primary px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                  {app.cta} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* "Not sure which machine?" CTA */}
        <div className="bg-primary text-white p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-secondary text-xs font-black uppercase tracking-widest mb-2">Not Sure?</p>
            <h2 className="text-2xl font-bold mb-3">Let Us Help You Choose</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Tell Anneke what you use it for and she&apos;ll point you to the right machine.
              No sales pressure — just honest advice from someone who has used every LAVA
              model personally.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/contact" className="bg-secondary text-white text-sm font-bold px-6 py-3 text-center hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
              Ask Anneke <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products/vacuum-machines" className="border border-white/30 text-white text-sm font-semibold px-6 py-3 text-center hover:border-white transition-colors">
              View All Machines
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
