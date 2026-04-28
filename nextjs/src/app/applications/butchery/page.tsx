import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Butchery & Meat Processing — Commercial Vacuum Sealing in South Africa",
  description:
    "Extend display life, reduce shrinkage, improve presentation and protect margins. LAVA commercial vacuum sealers for South African butcheries, large and small.",
  path: "/applications/butchery",
});

export default function ButcheryPage() {
  const pageLd = webPageSchema({
    name: "Butchery & Meat Processing — Commercial Vacuum Sealing in South Africa",
    description: "Extend display life, reduce shrinkage, improve presentation and protect margins. LAVA commercial vacuum sealers for South African butcheries, large and small.",
    url: "/applications/butchery",
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Applications", url: "/applications" },
    { name: "Butchery", url: "/applications/butchery" },
  ]);

  return (
    <main className="py-16">
      <JsonLd data={[pageLd, crumbLd]} />
      <div className="section-container max-w-3xl">

        <div className="mb-10">
          <p className="overline mb-3">Applications</p>
          <h1 className="text-4xl font-black text-primary leading-tight mb-3">
            Butchery &amp; Meat Processing
          </h1>
          <p className="text-lg text-copy-muted leading-relaxed">
            From the home butchery processing a farm kill to the retail counter extending
            display life — LAVA commercial machines are built for serious, continuous meat work.
          </p>
        </div>

        <Image 
          src="/images/applications/app-butchery-meat-counter.webp" 
          alt="Butchery meat counter with vacuum sealed cuts" 
          width={1200} 
          height={525}
          className="w-full h-auto rounded-lg mb-8"
        />

        <div className="prose-lava mt-12">

          <h2 className="text-2xl font-bold text-primary mb-4">What Vacuum Sealing Does for a Butchery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              ["Extends display life", "Vacuum-sealed cuts in the display cabinet last 10–14 days vs 3–5 days loose. Less daily markdown, less waste."],
              ["Reduces shrinkage", "Unsealed meat loses moisture weight continuously. A sealed cut retains every gram — which is every rand."],
              ["Professional presentation", "Vacuum-sealed cuts look premium. Tight, clear packaging on the counter positions your product above supermarket-style loose cuts."],
              ["Enables online/delivery sales", "You cannot courier loose meat. Vacuum sealed, temperature-controlled packs can be shipped safely next-day across SA."],
              ["Extends the working day", "Cut in the morning, seal, display all day, still perfect at close. Reduces the pressure to sell fast or mark down."],
              ["Wet aging for premium cuts", "Seal premium steaks and age in the cold room for 7–21 days. Sell as aged product at premium pricing — no dedicated dry-ager required."],
            ].map(([title, desc]) => (
              <div key={title} className="border border-border bg-surface p-4">
                <p className="font-bold text-primary text-sm flex items-start gap-1.5 mb-1">
                  <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" /> {title}
                </p>
                <p className="text-xs text-copy-muted leading-relaxed pl-5">{desc}</p>
              </div>
            ))}
          </div>

          <Image 
            src="/images/applications/app-butchery-sealing-primal-cuts.webp" 
            alt="Sealing primal cuts in butchery" 
            width={1200} 
            height={450}
            className="w-full h-auto rounded-lg mb-8"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Choosing the Right Commercial LAVA</h2>
          <table className="w-full text-sm border border-border mb-8">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Model</th>
                <th className="text-left py-3 px-4 font-bold">Seal Width</th>
                <th className="text-left py-3 px-4 font-bold">Best For</th>
                <th className="text-left py-3 px-4 font-bold">Daily Volume</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["V.333® Chrome", "42 cm", "Home butchery, small deli, farm stall", "Up to ~80 seals/day"],
                ["V.400® Premium", "50 cm", "Retail butchery, online meat supplier", "100–200 seals/day"],
                ["V.500® Premium 72cm", "72 cm", "Large commercial butchery", "High volume, extended sessions"],
                ["V.500® Premium XXL", "80 cm", "Industrial / abattoir level", "All-day commercial use"],
              ].map(([model, width, best, vol]) => (
                <tr key={model} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-bold text-primary">{model}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary">{width}</td>
                  <td className="py-2.5 px-4 text-copy text-xs">{best}</td>
                  <td className="py-2.5 px-4 text-copy-muted text-xs">{vol}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Image 
            src="/images/applications/app-butchery-vacuum-sealed-display.webp" 
            alt="Vacuum sealed meat display in butchery" 
            width={1200} 
            height={450}
            className="w-full h-auto rounded-lg mb-8"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Butchery Accessories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["Embossed Bags 25×40 cm", "/products/bags-rolls", "Standard retail cut size"],
              ["Embossed Bags 30×60 cm", "/products/bags-rolls", "Whole rumps, large primals"],
              ["Vacuum Rolls", "/products/bags-rolls", "Custom sizing for any cut"],
              ["Butchery Knives & Equipment", "/products/butchery-accessories", "LAVA-approved butchery tools"],
            ].map(([name, href, note]) => (
              <Link key={name} href={href} className="flex items-start gap-2 border border-border p-4 hover:border-primary transition-colors group">
                <ArrowRight className="h-4 w-4 text-secondary shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                <div>
                  <p className="font-bold text-primary text-sm">{name}</p>
                  <p className="text-xs text-copy-muted">{note}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Commercial Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/contact" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Get a Recommendation
          </Link>
        </div>

      </div>
    </main>
  );
}