import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AlertTriangle } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, webPageSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vacuum Sealing Biltong & Charcuterie in South Africa",
  description:
    "Biltong, droëwors and charcuterie — vacuum sealing extends shelf life and protects your product. The correct technique for dry and wet biltong, by Lava-SA.",
  path: "/applications/biltong",
});

export default function BiltongPage() {
  const pageLd = webPageSchema({
    name: "Vacuum Sealing Biltong & Charcuterie in South Africa",
    description: "Biltong, droëwors and charcuterie — vacuum sealing extends shelf life and protects your product. The correct technique for dry and wet biltong, by Lava-SA.",
    url: "/applications/biltong",
  });
  const crumbLd = breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Applications", url: "/applications" },
    { name: "Biltong & Charcuterie", url: "/applications/biltong" },
  ]);

  return (
    <main className="py-16">
      <JsonLd data={[pageLd, crumbLd]} />
      <div className="section-container max-w-3xl">

        <div className="mb-10">
          <p className="overline mb-3">Applications</p>
          <h1 className="text-4xl font-black text-primary leading-tight mb-3">
            Biltong &amp; Charcuterie
          </h1>
          <p className="text-lg text-copy-muted leading-relaxed">
            South Africa&apos;s own preservation tradition — and vacuum sealing is its natural
            partner. Whether you&apos;re making biltong for your family or building a product
            for distribution, LAVA changes what&apos;s possible.
          </p>
        </div>

        <Image 
          src="/images/applications/app-biltong-hanging-drying.webp" 
          alt="Biltong hanging and drying for vacuum sealing" 
          width={1200} 
          height={525}
          className="w-full h-auto rounded-lg mb-8"
        />

        <div className="prose-lava mt-12">

          <h2 className="text-2xl font-bold text-primary mb-4">Biltong + Vacuum Sealing: The Rules</h2>
          <p>
            Biltong seems counterintuitive to vacuum seal — it&apos;s already a preserved product.
            But vacuum sealing dramatically extends its shelf life and enables distribution.
            The key is understanding which type of biltong handles sealing differently.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="border-2 border-secondary p-5">
              <p className="font-black text-primary mb-1">Dry Biltong</p>
              <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-3">Very dry, no moisture</p>
              <ul className="text-sm text-copy space-y-1.5 pl-3">
                <li>✅ Can be vacuum sealed at room temperature</li>
                <li>✅ Shelf life: 4–6 months at room temperature</li>
                <li>✅ Frozen: 2 years</li>
                <li>✅ Safe to post / distribute without refrigeration</li>
                <li>✅ Use standard embossed bags</li>
              </ul>
            </div>
            <div className="border border-border p-5">
              <p className="font-black text-primary mb-1">Wet / Soft Biltong</p>
              <p className="text-xs text-copy-muted font-bold uppercase tracking-wider mb-3">Moist, higher moisture content</p>
              <ul className="text-sm text-copy space-y-1.5 pl-3">
                <li>⚠️ Must be refrigerated even after vacuum sealing</li>
                <li>⚠️ Shelf life: 3–4 weeks refrigerated (vs 5–7 days loose)</li>
                <li>✅ Frozen: 12–18 months</li>
                <li>⚠️ Inspect carefully for mould before sealing</li>
                <li>✅ Use Liquid Stop function</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3 mb-8">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Never vacuum seal biltong with visible surface mould</strong>, even if you
              plan to cut it off. Mould produces toxins that penetrate the product before the
              surface growth is visible. When in doubt, discard.
            </p>
          </div>

          <Image 
            src="/images/applications/app-biltong-finished-product-varieties.webp" 
            alt="Finished biltong product varieties" 
            width={1200} 
            height={450}
            className="w-full h-auto rounded-lg mb-8"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">For Biltong Producers</h2>
          <p>
            If you&apos;re making biltong to sell — at markets, online or direct — vacuum sealing
            transforms the business model:
          </p>
          <ul>
            <li><strong>Professional presentation</strong> — vacuum sealed product looks premium, commands higher prices</li>
            <li><strong>Extended distribution window</strong> — dry biltong sealed at source can be posted nationwide without refrigeration</li>
            <li><strong>Longer display life</strong> — markets and deli counters can hold product for weeks rather than days</li>
            <li><strong>Consistent weight labelling</strong> — sealed bags don&apos;t lose moisture weight on the shelf, so the labelled weight is what the customer gets</li>
            <li><strong>Hygiene compliance</strong> — vacuum sealed product is tamper-evident and meets food safety requirements for retail</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Droëwors &amp; Charcuterie</h2>
          <p>
            Droëwors is even more suitable for vacuum sealing than biltong — it&apos;s fully
            dried with very low moisture. Sealed droëwors keeps 6–9 months at room temperature
            and 2+ years frozen, with minimal flavour loss.
          </p>
          <p>
            European-style charcuterie (coppa, bresaola, lonza) works identically — the dry
            curing process is already a preservation step. Vacuum sealing after curing locks
            in the result and extends shelf life significantly.
          </p>

          <Image 
            src="/images/applications/app-biltong-vacuum-sealed-packaged.webp" 
            alt="Vacuum sealed biltong packaging" 
            width={1200} 
            height={450}
            className="w-full h-auto rounded-lg mb-8"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Recommended Machine</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                model: "V.300® Premium X",
                tag: "Home maker / small producer",
                desc: "Perfect for sealing biltong in quantities up to a few kilograms. Handles dry and wet biltong. 42 cm sealing width handles standard biltong sticks easily.",
                href: "/products/vacuum-machines",
              },
              {
                model: "V.333® Chrome",
                tag: "Market supplier / small commercial",
                desc: "Commercial pump for continuous sealing sessions. Ideal for weekend market production runs — process 20–30+ kg per session without overheating.",
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

        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products/bags-rolls" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shop Bags & Rolls
          </Link>
        </div>

      </div>
    </main>
  );
}