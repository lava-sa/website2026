import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "LAVA for Food Production & Small Business",
  description:
    "Farmers market suppliers, deli owners, caterers and small food producers — LAVA commercial machines produce consistent, presentation-quality vacuum seals for all-day use.",
};

export default function FoodProductionPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-10">
          <p className="overline mb-3">Applications</p>
          <h1 className="text-4xl font-black text-primary leading-tight mb-3">
            Food Production &amp; Small Business
          </h1>
          <p className="text-lg text-copy-muted leading-relaxed">
            South Africa&apos;s food entrepreneurs — from farmers market producers to deli
            owners and restaurant suppliers — rely on LAVA for consistent, professional
            vacuum sealing that keeps pace with their operation.
          </p>
        </div>

        <Image 
          src="/images/applications/app-food-production-farmers-market.webp" 
          alt="Farmers market food production with LAVA vacuum sealer" 
          width={1200} 
          height={525}
          className="w-full h-auto rounded-lg mb-8"
        />

        <div className="prose-lava mt-12">

          <h2 className="text-2xl font-bold text-primary mb-4">Who Uses LAVA Commercially in South Africa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {[
              "Farmers market meat suppliers",
              "Artisan biltong producers",
              "Deli counters",
              "Restaurant mise en place",
              "Catering operations",
              "Game farm processors",
              "Cheese producers & mongers",
              "Sous vide meal kit companies",
              "Online butcheries",
            ].map((type) => (
              <div key={type} className="flex items-center gap-2 text-sm text-copy">
                <CheckCircle className="h-3.5 w-3.5 text-secondary shrink-0" />
                {type}
              </div>
            ))}
          </div>

          <Image 
            src="/images/applications/app-food-production-restaurant-kitchen.webp" 
            alt="Restaurant kitchen vacuum sealing with LAVA" 
            width={1200} 
            height={450}
            className="w-full h-auto rounded-lg mb-8"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">What Continuous Commercial Use Requires</h2>
          <p>
            A domestic vacuum sealer — even a good one — will overheat during commercial
            production runs. The pump needs rest cycles. The sealing strip degrades faster.
            The lid mechanism isn&apos;t rated for hundreds of cycles per day.
          </p>
          <p>
            LAVA commercial machines are built differently:
          </p>
          <ul>
            <li><strong>Commercial-grade vacuum pump</strong> — rated for extended continuous use, not batch intervals</li>
            <li><strong>Stainless steel construction throughout</strong> — food-safe, easy to clean, durable under daily production demands</li>
            <li><strong>Wider sealing bars</strong> — 50–80 cm for large primals, whole chickens, full pork bellies</li>
            <li><strong>Faster cycle time</strong> — higher pump throughput means more seals per hour</li>
            <li><strong>10+ year spare parts availability</strong> — a commercial machine that can&apos;t be repaired is a liability, not an asset</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Restaurant &amp; Catering Applications</h2>
          <p>
            Vacuum sealing in the professional kitchen changes the economics of prep work:
          </p>
          <ul>
            <li><strong>Mise en place sealed in portions</strong> — prepped Tuesday, still perfect on Sunday</li>
            <li><strong>Sous vide production</strong> — batch-cook proteins to consistent doneness, finish to order</li>
            <li><strong>Marinade acceleration</strong> — vacuum marinating reduces 12-hour marinating to 20 minutes</li>
            <li><strong>Reduced yield loss</strong> — sealed cuts don&apos;t oxidise or lose moisture weight sitting in the cold room</li>
            <li><strong>Sauce and stock portioning</strong> — large batch production sealed in single-service portions</li>
          </ul>

          <Image 
            src="/images/applications/app-food-production-commercial-sealing-session.webp" 
            alt="Commercial vacuum sealing session for food production" 
            width={1200} 
            height={450}
            className="w-full h-auto rounded-lg mb-8"
          />

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Commercial Machine Selector</h2>
          <table className="w-full text-sm border border-border mb-6">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Model</th>
                <th className="text-left py-3 px-4 font-bold">Seal Width</th>
                <th className="text-left py-3 px-4 font-bold">Ideal For</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["V.333® Chrome", "42 cm", "Entry commercial, small deli, restaurant side use"],
                ["V.400® Premium", "50 cm", "Retail butchery, market supplier, catering"],
                ["V.500® Premium 72cm", "72 cm", "High-volume processing, farm to retail"],
                ["V.500® Premium XXL", "80 cm", "Industrial production, abattoir supply chain"],
              ].map(([model, width, best]) => (
                <tr key={model} className="border-b border-border odd:bg-surface">
                  <td className="py-2.5 px-4 font-bold text-primary">{model}</td>
                  <td className="py-2.5 px-4 font-semibold text-secondary">{width}</td>
                  <td className="py-2.5 px-4 text-copy text-xs leading-relaxed">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-primary/5 border border-primary/20 p-5">
            <p className="font-bold text-primary mb-2">Not sure which commercial machine fits your operation?</p>
            <p className="text-sm text-copy leading-relaxed mb-3">
              Anneke and Wilco have supplied commercial machines to butcheries, restaurants,
              game farms and food producers across South Africa. Tell them what you need and
              they&apos;ll give you an honest recommendation — not the most expensive option.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors">
              Contact Anneke <ArrowRight className="h-4 w-4" />
            </Link>
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