import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "A Family Business from Baden-Württemberg — 40 Years of Precision | Lava Blog",
  description:
    "The Landig family have been building vacuum sealers in southern Germany since 1982. Here's how their obsession with quality found a home in South Africa.",
};

export default function PostFamilyBusiness() {
  const articleLd = articleSchema({
    title: "A Family Business from Baden-Württemberg — 40 Years of Precision",
    description:
      "The Landig family have been building vacuum sealers in southern Germany since 1982. Here's how their obsession with quality found a home in South Africa.",
    url: "/blog/lava-family-business-germany-south-africa",
    datePublished: "2026-01-10",
  });
  return (
    <main className="py-16">
      <JsonLd data={articleLd} />
      <div className="section-container max-w-3xl">

        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-copy-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
        </Link>

        <div className="mb-10">
          <span className="bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 inline-block mb-4">Our Story</span>
          <h1 className="text-4xl font-black text-primary leading-tight mb-4">
            A Family Business from Baden-Württemberg —<br />
            40 Years of Precision. Now in South Africa.
          </h1>
          <p className="text-copy-muted text-sm">1 April 2026 · 5 min read</p>
        </div>

        {/* Hero image */}
        <div className="relative aspect-[16/7] bg-primary/10 mb-12 overflow-hidden">
          <Image src="/images/about/landig-family.webp" alt="The Landig Family — founders of LAVA" fill className="object-cover" />
        </div>

        {/* Featured video */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Watch First</p>
          <div className="relative aspect-video bg-zinc-100">
            <iframe
              src="https://www.youtube-nocookie.com/embed/yn-qpoAtbVI?rel=0&modestbranding=1"
              title="Why Choose a Lava Vacuum Sealer?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-xs text-copy-muted mt-2">Why Choose a Lava Vacuum Sealer? — in English</p>
        </div>

        <div className="prose-lava">

          <p>
            In a small town in Baden-Württemberg, southern Germany, a family started building something
            that would outlast fashion, trends and cheap competition. In <strong>1982</strong>, the
            Landig family founded what would become LAVA — one of the world's most respected vacuum
            sealer brands. Not because they had the biggest factory or the most aggressive marketing.
            Because they had an obsession: <strong>build it right, or don't build it at all.</strong>
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Forty Years Before "Premium" Was a Buzzword</h2>
          <p>
            When LAVA started, vacuum sealing was an industrial process. Butcheries and food processors
            used large, expensive chamber machines. Home cooks had no options. The Landig family saw an
            opportunity — but they refused to race to the bottom on price.
          </p>
          <p>
            Instead, they did what German engineers do: <strong>they over-engineered everything.</strong>
            Stainless steel where others used plastic. Double sealing strips where others used one.
            A sealing bar made to last 50,000 cycles instead of 5,000. The result was a machine that
            genuinely belonged in serious kitchens — and lasted long enough to justify the investment.
          </p>

          <div className="bg-surface border border-border p-6 my-8">
            <h3 className="text-base font-bold text-primary mb-4">LAVA by the Numbers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                ["1982", "Founded in Germany"],
                ["40+", "Years of manufacturing"],
                ["350,000+", "Machines sold worldwide"],
                ["2007", "Arrived in South Africa"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="text-3xl font-black text-primary">{num}</p>
                  <p className="text-xs text-copy-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Why South Africa?</h2>
          <p>
            In <strong>2007</strong>, Anneke and Wilco Uys discovered LAVA while sourcing equipment
            for their butchery business. They had tested dozens of vacuum sealers — cheap ones that
            broke within months, mid-range ones that leaked, commercial units that were overkill for
            a family operation.
          </p>
          <p>
            Then they found LAVA. Twenty years later, Anneke still has the first machine she ever
            tested. It still works perfectly.
          </p>
          <p>
            That experience became a conviction: <strong>South Africans deserved access to the best.</strong>
            Not resold Chinese hardware in German boxes. The real thing — made in Baden-Württemberg,
            distributed with the same care the Landig family put into building it.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">What "Made in Germany" Actually Means</h2>
          <p>
            The phrase gets thrown around casually. But in LAVA&apos;s case, it means:
          </p>
          <ul>
            <li><strong>Design and engineering</strong> happens in-house in Baden-Württemberg</li>
            <li><strong>Key components</strong> — the sealing bars, vacuum pumps and lid mechanisms — are manufactured in Germany</li>
            <li><strong>Every machine is individually tested</strong> before it leaves the factory</li>
            <li><strong>Spare parts are stocked for 10+ years</strong> after a model is discontinued</li>
            <li><strong>No planned obsolescence</strong> — LAVA machines are designed to be repaired, not replaced</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">A Different Kind of Relationship With Customers</h2>
          <p>
            When you buy a LAVA machine from Lava-SA, you&apos;re not buying from a warehouse that
            ships boxes. You&apos;re buying from Anneke and Wilco — who will answer the phone if you
            have a question, who will troubleshoot a seal problem with you over WhatsApp, and who
            have personally tested every product they sell.
          </p>
          <p>
            That&apos;s not a marketing claim. It&apos;s the only way they know how to do business —
            and it&apos;s why customers who bought their first LAVA machine in 2007 are still buying
            consumables from us today.
          </p>

          <blockquote className="border-l-4 border-secondary pl-6 py-2 my-8 bg-secondary/5">
            <p className="text-lg font-semibold text-primary italic leading-relaxed">
              &ldquo;We don&apos;t sell vacuum sealers. We sell the confidence that your food is safe,
              your investment is protected, and someone is there if you need help.&rdquo;
            </p>
            <footer className="text-sm text-copy-muted mt-2 font-semibold">— Anneke Uys, Lava-SA</footer>
          </blockquote>

        </div>

        {/* Product CTA */}
        <div className="mt-16 bg-primary text-white p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-secondary text-xs font-black uppercase tracking-widest mb-2">Shop LAVA</p>
            <h3 className="text-xl font-bold mb-2">Find Your Machine</h3>
            <p className="text-white/70 text-sm">From entry-level domestic to industrial commercial — there&apos;s a LAVA for every kitchen.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/products/vacuum-machines" className="bg-secondary text-white text-sm font-bold px-6 py-3 text-center hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
              Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="border border-white/30 text-white text-sm font-semibold px-6 py-3 text-center hover:border-white transition-colors">
              Our Story
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 pt-8 border-t border-border flex justify-between items-center">
          <Link href="/blog" className="text-xs font-bold text-copy-muted hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> All Articles
          </Link>
          <Link href="/blog/you-can-rely-on-our-quality" className="text-xs font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1.5">
            Next: Our Quality Promise <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  );
}
