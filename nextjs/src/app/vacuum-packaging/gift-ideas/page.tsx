import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

export const metadata: Metadata = {
  title: "LAVA Gift Ideas — The Gift That Keeps Saving",
  description:
    "A LAVA vacuum sealer is one of the few gifts that pays for itself. Ideas for hunters, fishermen, home cooks, biltong makers and foodies.",
};

const giftIdeas = [
  {
    recipient: "The Hunter",
    headline: "For the hunter who wastes nothing",
    desc: "After every hunt, hundreds of rands of venison goes to waste through freezer burn and poor storage. A LAVA machine fixes this permanently — and every hunting season for the next 20 years.",
    suggestions: [
      { name: "LAVA V.300® Premium X", href: "/products/vacuum-machines", note: "Handles a full animal's worth of processing" },
      { name: "Embossed Vacuum Bags 25×40 cm", href: "/products/bags-rolls", note: "For large game cuts and whole joints" },
      { name: "Vacuum Rolls (custom sizing)", href: "/products/bags-rolls", note: "Perfect for awkward-shaped cuts" },
    ],
    image: "/images/blog/header-001.jpg",
    imageAlt: "Game meat vacuum sealed",
    videoId: "yaf_L7C6N6U",
  },
  {
    recipient: "The Home Chef",
    headline: "For the cook who takes it seriously",
    desc: "Sous vide cooking, vacuum marinating, extending the life of premium ingredients — a LAVA machine opens up techniques that genuinely transform how food is prepared.",
    suggestions: [
      { name: "LAVA V.300® Premium X", href: "/products/vacuum-machines", note: "The definitive home chef machine" },
      { name: "LAVA Acrylic Containers Set", href: "/products/containers-lids", note: "For coffee, spices and pantry items" },
      { name: "Smooth Vacuum Bags 20×30 cm", href: "/products/bags-rolls", note: "For sauces, marinades and sous vide" },
    ],
    image: "/images/blog/lava-0005.jpg",
    imageAlt: "LAVA V300 with fresh vegetables",
    videoId: "pUwXwXRFy8w",
  },
  {
    recipient: "The Fisherman",
    headline: "For the angler who respects the catch",
    desc: "A day's fishing is only as good as the fish you're still eating six months later. LAVA turns a great day on the water into 12 months of excellent meals.",
    suggestions: [
      { name: "LAVA V.300® Premium X", href: "/products/vacuum-machines", note: "Liquid Stop essential for fish" },
      { name: "Embossed Vacuum Bags 20×30 cm", href: "/products/bags-rolls", note: "Standard fillet size" },
      { name: "Vacuum Rolls (custom cut)", href: "/products/bags-rolls", note: "For whole fish and large cuts" },
    ],
    image: "/images/blog/lava-0004.jpg",
    imageAlt: "LAVA vacuum sealer with fish",
    videoId: "XEdT5cCNiwk",
  },
  {
    recipient: "The Family Cook",
    headline: "For the household that wants to stop wasting food",
    desc: "Bulk buying, load-shedding protection, meal prep — a LAVA machine pays for itself in reduced food waste within the first year.",
    suggestions: [
      { name: "LAVA V.100® Premium X", href: "/products/vacuum-machines", note: "Entry-level — full LAVA quality" },
      { name: "Mixed Bag Starter Pack", href: "/products/bags-rolls", note: "Multiple sizes to get started" },
      { name: "LAVA Containers (small set)", href: "/products/containers-lids", note: "For fridge and pantry storage" },
    ],
    image: "/images/blog/header-006.jpg",
    imageAlt: "Vacuum sealed meal prep portions",
    videoId: "4Ut74sEOf1I",
  },
];

export default function GiftIdeasPage() {
  return (
    <main className="py-16">
      <div className="section-container">

        <div className="max-w-2xl mb-14">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary">LAVA Gift Ideas</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            A LAVA vacuum sealer is one of the few gifts that genuinely pays for itself —
            and keeps delivering for 20+ years. Find the perfect combination for every person
            on your list.
          </p>
        </div>

        {/* Hero callout */}
        <div className="bg-primary text-white p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="h-6 w-6 text-secondary" />
              <p className="text-secondary text-xs font-black uppercase tracking-widest">The Gift That Pays for Itself</p>
            </div>
            <h2 className="text-2xl font-bold mb-3">Why a LAVA is the Perfect Gift</h2>
            <ul className="text-white/80 text-sm space-y-1.5">
              <li>• Saves the average household R2,400 in food waste per year</li>
              <li>• Lasts 15–20+ years — still giving value long after the occasion is forgotten</li>
              <li>• Used daily — not a once-a-year gadget</li>
              <li>• Backed by Anneke and Wilco — real people, real support</li>
              <li>• Ships within 1–2 business days across South Africa</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/products/vacuum-machines" className="bg-secondary text-white text-sm font-bold px-6 py-3 text-center hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
              Shop All Machines <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="border border-white/30 text-white text-sm font-semibold px-6 py-3 text-center hover:border-white transition-colors">
              Ask Anneke for Advice
            </Link>
          </div>
        </div>

        {/* Gift recipient sections */}
        <div className="space-y-20">
          {giftIdeas.map((idea) => (
            <section key={idea.recipient}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-secondary text-xs font-black uppercase tracking-widest mb-2">Gift For</p>
                  <h2 className="text-3xl font-black text-primary mb-3">{idea.recipient}</h2>
                  <p className="text-xl font-semibold text-primary/70 mb-4 italic">&ldquo;{idea.headline}&rdquo;</p>
                  <p className="text-copy leading-relaxed mb-6">{idea.desc}</p>

                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-wider text-secondary">Recommended Combination</p>
                    {idea.suggestions.map(({ name, href, note }) => (
                      <Link key={href + name} href={href} className="flex items-start gap-3 border border-border bg-surface p-3.5 hover:border-primary transition-colors group">
                        <ArrowRight className="h-4 w-4 text-secondary shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                        <div>
                          <p className="font-bold text-primary text-sm">{name}</p>
                          <p className="text-xs text-copy-muted">{note}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative aspect-video bg-primary/10 overflow-hidden">
                    <Image src={idea.image} alt={idea.imageAlt} fill className="object-cover" />
                  </div>
                  <div className="relative aspect-video bg-zinc-100">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${idea.videoId}?rel=0&modestbranding=1`}
                      title={`LAVA for ${idea.recipient}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Consumables section */}
        <div className="mt-20 border border-border p-8">
          <h2 className="text-2xl font-bold text-primary mb-2">Already Have a Machine? Give Consumables.</h2>
          <p className="text-copy-muted text-sm mb-6">Bags, rolls, spare parts and containers are practical gifts that LAVA owners use every week.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/products/bags-rolls" className="border border-border p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
              <p className="font-bold text-primary">Vacuum Bags & Rolls</p>
              <p className="text-xs text-copy-muted mt-1">The consumable every LAVA owner uses weekly</p>
            </Link>
            <Link href="/products/containers-lids" className="border border-border p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
              <p className="font-bold text-primary">Containers & Lids</p>
              <p className="text-xs text-copy-muted mt-1">Extend the system beyond bags</p>
            </Link>
            <Link href="/products/spare-parts" className="border border-border p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
              <p className="font-bold text-primary">Spare Parts</p>
              <p className="text-xs text-copy-muted mt-1">Sealing strips, liquid trap lids — the maintenance gift</p>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
