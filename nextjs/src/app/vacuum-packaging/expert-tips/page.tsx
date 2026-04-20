import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Expert Vacuum Sealing Tips — Get the Most from Your LAVA | Lava South Africa",
  description:
    "Pro-level tips for better seals, longer shelf life, vacuum marinating, sous vide, containers and troubleshooting. From people who use LAVA machines every day.",
};

const tips = [
  {
    category: "Better Seals",
    items: [
      {
        tip: "Seal 3–4 cm from the opening",
        detail: "Leave enough space to re-seal if needed, but not so much that you waste bag material. 3 cm minimum from the top of the food to the seal line."
      },
      {
        tip: "Double-seal all freezer bags",
        detail: "After the machine seals, run a second seal 1 cm below the first. This is what LAVA's double sealing strip does automatically — it's the reason LAVA seals don't fail."
      },
      {
        tip: "Pat food completely dry before sealing",
        detail: "Moisture on the surface of food creates steam in the bag and can cause seal failure. A quick pat with paper towel — especially on fish and marinated meats — makes a significant difference."
      },
      {
        tip: "Fold the bag opening over the machine lip",
        detail: "Prevents the seal area from being contaminated by juices or moisture during vacuuming. Pull the bag taut and flat against the seal strip."
      },
    ]
  },
  {
    category: "Food Preparation",
    items: [
      {
        tip: "Freeze mince and liquids flat before sealing",
        detail: "Mince, sauces and soups will spread flat if pre-frozen for 1–2 hours before vacuum sealing. The result is a neat, stackable brick that takes up minimal freezer space."
      },
      {
        tip: "Blanch vegetables before vacuum sealing",
        detail: "Raw vegetables continue enzymatic activity even in a vacuum. Blanching (brief boiling + ice bath) stops enzymes and preserves colour and texture for 2–3 years frozen."
      },
      {
        tip: "Use baking paper between stacked items",
        detail: "When sealing multiple chops or fish fillets in one bag, place a sheet of baking paper between each piece. They'll freeze without sticking together and can be separated individually."
      },
      {
        tip: "Seal garlic and onion in double bags",
        detail: "Garlic in particular permeates bag material over time and can affect flavour of adjacent bags in the freezer. A double bag (one inside another) solves this."
      },
    ]
  },
  {
    category: "Vacuum Marinating",
    items: [
      {
        tip: "20–30 minutes equals overnight",
        detail: "Vacuum pressure forces marinade into meat cells far faster than conventional soaking. Game meat, chicken and lamb benefit most. Keep the bag in the fridge during marinating."
      },
      {
        tip: "Use the lowest vacuum setting for soft foods",
        detail: "Bread, delicate fish and soft vegetables will be compressed or damaged at maximum vacuum. Reduce the vacuum level or use the pressure control dial on your LAVA machine."
      },
      {
        tip: "Marinate fish for maximum 30 minutes",
        detail: "Acidic marinades (lemon, wine, vinegar) begin to 'cook' fish under vacuum. 20–30 minutes is plenty. Any longer and the texture starts to change."
      },
    ]
  },
  {
    category: "Containers & Jars",
    items: [
      {
        tip: "Vacuum-seal coffee in the container it came in",
        detail: "If your coffee beans came in a container with a foil seal, remove the seal, fill the LAVA acrylic container, and vacuum it. No bag needed — the pump connects directly to the container lid."
      },
      {
        tip: "Reseal wine bottles after opening",
        detail: "The LAVA hose and stopper attachment vacuums standard wine bottles. An opened bottle resealed this way stays fresh 5–7 days vs 1–2 days conventionally."
      },
      {
        tip: "Use jars for non-seal foods",
        detail: "Delicate items that would be damaged in a bag (biscuits, crisps, crackers) can be vacuum sealed in LAVA acrylic containers. The vacuum preserves freshness without crushing."
      },
    ]
  },
  {
    category: "Troubleshooting",
    items: [
      {
        tip: "Bag not sealing properly? Check the seal strip",
        detail: "A worn sealing strip is the most common cause of failed seals. If you can see visible wear or if seals are inconsistent, replace the sealing strip. LAVA strips are available from Lava-SA and are easy to replace."
      },
      {
        tip: "Machine not reaching full vacuum? Check the bag",
        detail: "Ensure you're using embossed vacuum bags (the textured ones, not smooth). Smooth bags block the vacuum channels. Only embossed bags allow the pump to draw air from the entire bag."
      },
      {
        tip: "Liquid in the machine? Clean immediately",
        detail: "If marinade or blood enters the vacuum path, the machine needs to be cleaned before next use. Remove the liquid trap lid (spare parts are available), clean, and dry completely."
      },
    ]
  },
];

export default function ExpertTipsPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary">Expert Vacuum Sealing Tips</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            Pro-level techniques for better seals, longer shelf life, vacuum marinating,
            sous vide and troubleshooting — from people who use LAVA machines every day.
          </p>
        </div>

        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/blog/lava-0005.jpg" alt="LAVA V300 Premium machine with vegetables" fill className="object-cover" />
        </div>

        {/* Video */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Watch: Vacuum Marinating in Action</p>
          <div className="relative aspect-video bg-zinc-100">
            <iframe
              src="https://www.youtube-nocookie.com/embed/pUwXwXRFy8w?rel=0&modestbranding=1"
              title="Vacuum Marinating Meat with LAVA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {tips.map((section) => (
          <section key={section.category} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 bg-secondary text-white flex items-center justify-center">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-black text-primary">{section.category}</h2>
            </div>
            <div className="space-y-4">
              {section.items.map(({ tip, detail }) => (
                <div key={tip} className="border border-border bg-surface p-5">
                  <p className="font-bold text-primary mb-1.5">{tip}</p>
                  <p className="text-sm text-copy leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products/spare-parts" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shop Spare Parts
          </Link>
        </div>

      </div>
    </main>
  );
}
