import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf, TreePine, Globe, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Join Our Green Mission",
  description:
    "LAVA's commitment to a sustainable future — reforestation, responsible manufacturing, and how every machine sold contributes to a greener South Africa and world.",
};

const COMMITMENTS = [
  {
    icon: TreePine,
    title: "Reforestation Partnership",
    body: "For every LAVA machine sold, a contribution is made to certified reforestation projects. The trees planted on our behalf offset the carbon footprint of manufacturing and international shipping — and continue sequestering carbon for decades.",
  },
  {
    icon: Globe,
    title: "Energy-Efficient Design",
    body: "LAVA's motors are engineered for efficiency. The vacuum cycle that takes 30 seconds on a LAVA machine may take 90 seconds on a budget alternative — drawing the same current for three times as long. Less energy per seal, thousands of seals per year.",
  },
  {
    icon: Leaf,
    title: "Less Packaging Waste",
    body: "By extending the shelf life of food by 3–5×, every LAVA household generates meaningfully less food packaging waste over a year. Less spoilage means less food bought, less transported, less packaged, and less thrown away.",
  },
  {
    icon: Users,
    title: "Supporting Local Communities",
    body: "Lava-SA is proud to operate as a South African business, supporting local families and communities. We work directly with SA game farms, butcheries, and households — keeping value in South Africa.",
  },
];

export default function GreenMissionPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/homepage/lava-reforestation.webp"
            alt="LAVA reforestation and green mission"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative section-container py-24 max-w-3xl">
          <p className="overline text-secondary mb-3">Green Living</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Join Our Green Mission
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg leading-relaxed max-w-xl">
            When you choose LAVA, you&apos;re not just preserving food. You&apos;re preserving the future
            for those who come after us. Join us in building a legacy of responsibility — one
            perfect seal at a time.
          </p>
        </div>
      </section>

      {/* ── Opening statement ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container max-w-3xl">
          <p className="overline mb-3">Our philosophy</p>
          <h2 className="text-3xl font-bold text-primary mb-6">More Than a Vacuum Sealer Company</h2>
          <div className="space-y-5 text-[15px] leading-relaxed text-copy">
            <p>
              At LAVA, we&apos;re stewards of our planet — and we take that seriously. Our green
              commitment isn&apos;t a marketing layer applied to a product that doesn&apos;t warrant it.
              It runs through every decision we make: how we build our machines, how long we
              support them, what we ask our suppliers to commit to, and what we do with every sale.
            </p>
            <p>
              We believe that <strong className="text-primary">premium quality and environmental responsibility
              are not trade-offs</strong>. A machine that lasts 20 years and can be repaired rather
              than replaced is, by definition, a more sustainable product — regardless of what it
              costs upfront.
            </p>
            <p>
              And we acknowledge the honest tension: vacuum sealing uses bags. Some of those bags
              are plastic. We&apos;d rather address that directly than pretend it away. That&apos;s why we
              invest in reusable containers, encourage bag reuse, and pair every machine with
              education about how to get the most from both.
            </p>
            <Link href="/about/sustainable-sealing" className="inline-flex items-center gap-2 font-semibold text-secondary hover:text-primary transition-colors text-sm mt-2">
              Read our full sustainability position →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Four commitments ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="section-container">
          <div className="text-center mb-12 max-w-xl mx-auto">
            <p className="overline mb-2">Our commitments</p>
            <h2 className="text-2xl font-bold text-primary">How We Live Our Green Mission</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {COMMITMENTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white border border-border p-8">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-3">{title}</h3>
                <p className="text-copy-muted text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reforestation image feature ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden shadow-xl">
              <Image
                src="/images/blog/header-007.webp"
                alt="Planting roots for a sustainable tomorrow"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="overline mb-3">Planting roots</p>
              <h2 className="text-3xl font-bold text-primary mb-5">
                A Tree for Every Machine
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed text-copy-muted">
                <p>
                  Manufacturing anything has a carbon cost. Shipping from Germany to South Africa adds
                  to it. We don&apos;t pretend otherwise.
                </p>
                <p>
                  What we do is offset it. LAVA&apos;s reforestation contribution means that for every
                  machine we sell, trees are planted through certified programmes. Those trees don&apos;t
                  just sequester carbon — they restore habitat, protect watersheds, and provide
                  livelihoods for the communities involved.
                </p>
                <p>
                  When your LAVA machine is still running in 15 years, the trees planted when you
                  bought it will be well-established — continuing to work long after the machine
                  has more than paid for its environmental cost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you can do ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="section-container max-w-3xl mx-auto">
          <p className="overline mb-3 text-center">Your part in it</p>
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">What You Can Do as a LAVA Owner</h2>
          <div className="space-y-4">
            {[
              {
                num: "01",
                heading: "Reuse your bags",
                detail: "For dry goods (nuts, spices, coffee, biltong), wash your LAVA bags and reuse them. Each reuse is one less bag produced.",
              },
              {
                num: "02",
                heading: "Use containers where you can",
                detail: "LAVA vacuum containers and glass jars work without bags at all. Use them for sauces, dips, ferments, and dry pantry staples.",
              },
              {
                num: "03",
                heading: "Buy in bulk and seal at home",
                detail: "Buying a whole lamb or a side of beef, processing and vacuum sealing it at home, dramatically reduces packaging, transport, and spoilage waste compared to buying weekly in retail packaging.",
              },
              {
                num: "04",
                heading: "Keep your machine running",
                detail: "Replace a worn sealing strip before it causes seal failures. A R200 part that prevents a ruined bag of game meat — and extends your machine's life — is better for everyone.",
              },
            ].map(({ num, heading, detail }) => (
              <div key={num} className="flex gap-5 bg-white border border-border p-6">
                <span className="text-3xl font-black text-primary/20 leading-none shrink-0 w-10">{num}</span>
                <div>
                  <h3 className="font-bold text-primary mb-1">{heading}</h3>
                  <p className="text-sm text-copy-muted leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative bg-primary overflow-hidden py-24 text-center">
        <div className="absolute inset-0">
          <Image
            src="/images/homepage/lava-reforestation.webp"
            alt=""
            fill
            className="object-cover opacity-15"
          />
        </div>
        <div className="relative section-container max-w-xl mx-auto">
          <p className="overline text-secondary mb-3">Start here</p>
          <h2 className="text-3xl font-bold text-white mb-5">
            Join Over 350,000 Customers Worldwide
          </h2>
          <p className="text-on-dark-muted mb-8 text-lg">
            Every LAVA machine is a vote for quality over quantity, repair over replace, and
            less waste over convenience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/products/vacuum-machines" className="inline-block bg-secondary text-white font-bold px-8 py-3 hover:bg-secondary/90 transition-colors">
              Shop Vacuum Machines
            </Link>
            <Link href="/about/sustainable-sealing" className="inline-block border border-white/30 text-white/80 font-semibold px-8 py-3 hover:bg-white/10 hover:text-white transition-colors">
              Discover Sustainable Sealing
            </Link>
          </div>
        </div>
      </section>


    </main>
  );
}
