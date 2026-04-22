import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Vacuum Sealing Shelf Life Chart — Complete Food Storage Guide",
  description:
    "Comprehensive shelf life chart for vacuum sealed food — fridge, freezer and pantry. Includes all major food categories with and without vacuum sealing.",
};

const categories = [
  {
    name: "Red Meat & Game",
    rows: [
      ["Beef steaks / chops", "3–5 days", "10–14 days", "3–6 months", "2–3 years"],
      ["Beef mince", "1–2 days", "5–7 days", "3–4 months", "12–15 months"],
      ["Lamb / mutton", "3–5 days", "10–14 days", "3–6 months", "2–3 years"],
      ["Pork chops / sausages", "3–5 days", "10–14 days", "3–6 months", "18 months–2 years"],
      ["Venison (blesbok, kudu, impala)", "2–4 days", "8–12 days", "3–6 months", "2–3 years"],
      ["Biltong (dry)", "2–4 weeks", "4–6 months", "6 months", "2 years"],
      ["Cured / smoked meats", "1–2 weeks", "4–6 weeks", "2–3 months", "12 months"],
    ],
  },
  {
    name: "Poultry",
    rows: [
      ["Chicken (whole / pieces)", "2–3 days", "7–10 days", "6–9 months", "18 months–2 years"],
      ["Chicken mince", "1–2 days", "5–7 days", "3–4 months", "12 months"],
      ["Cooked chicken", "3–4 days", "10–14 days", "3–4 months", "12 months"],
    ],
  },
  {
    name: "Fish & Seafood",
    rows: [
      ["Snoek / yellowtail (raw)", "1–2 days", "5–7 days", "2–3 months", "12–15 months"],
      ["Smoked snoek", "5–7 days", "4–6 weeks", "3–4 months", "12 months"],
      ["Prawns / scampi", "1–2 days", "5–7 days", "3–4 months", "12–15 months"],
      ["Trout fillets", "2–3 days", "7–10 days", "3–4 months", "18 months"],
      ["Tuna (fresh)", "1 day", "3–5 days", "2–3 months", "12–15 months"],
    ],
  },
  {
    name: "Dairy & Cheese",
    rows: [
      ["Hard cheese (cheddar, gouda)", "2–4 weeks", "4–8 months", "6 months", "18 months"],
      ["Soft cheese (feta, ricotta)", "1–2 weeks", "3–4 weeks", "N/A", "6–8 months"],
      ["Cream cheese / mascarpone", "1–2 weeks", "3–4 weeks", "N/A", "N/A"],
      ["Butter", "1–2 months", "6–8 months", "6–9 months", "18 months"],
    ],
  },
  {
    name: "Vegetables & Fruit",
    rows: [
      ["Blanched vegetables", "5–7 days", "14–21 days", "8–12 months", "2–3 years"],
      ["Raw leafy greens", "2–3 days", "7–10 days", "N/A", "N/A"],
      ["Root vegetables (carrots, beetroot)", "2–3 weeks", "4–6 weeks", "8–12 months", "2–3 years"],
      ["Berries", "1–3 days", "7–10 days", "6–8 months", "2 years"],
      ["Avocado (mashed)", "1–2 days", "4–5 days", "3–4 months", "12 months"],
      ["Herbs (fresh)", "1–2 weeks", "3–4 weeks", "6 months (frozen)", "12 months"],
    ],
  },
  {
    name: "Dry Goods & Pantry",
    rows: [
      ["Coffee beans", "2–4 weeks (open)", "4–6 months", "—", "—"],
      ["Nuts (almonds, cashews, macadamia)", "1–3 months", "2–3 years", "—", "—"],
      ["Dried fruit", "3–6 months", "2–3 years", "—", "—"],
      ["Rice / grains", "6–12 months", "2–3 years", "—", "—"],
      ["Flour / meal", "3–6 months", "2–3 years", "—", "—"],
      ["Chocolate / cocoa", "6–12 months", "2–3 years", "—", "—"],
      ["Spices & herbs (dried)", "6–12 months", "2–4 years", "—", "—"],
    ],
  },
  {
    name: "Cooked & Prepared Food",
    rows: [
      ["Cooked meat / stews", "3–4 days", "10–14 days", "2–3 months", "12 months"],
      ["Soups & sauces", "3–5 days", "10–14 days", "3–4 months", "12 months"],
      ["Cooked pasta / rice", "3–5 days", "10–14 days", "2–3 months", "8 months"],
      ["Bread (fresh)", "3–5 days", "2–3 weeks", "3 months", "12 months"],
      ["Pastries / baked goods", "2–3 days", "10–14 days", "2–3 months", "12 months"],
    ],
  },
];

export default function ShelfLifeChartPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-4xl">

        <div className="mb-12">
          <p className="overline mb-3">Vacuum Packaging</p>
          <h1 className="text-4xl font-black text-primary">Vacuum Sealing Shelf Life Chart</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed max-w-2xl">
            The complete reference guide for every food category — fridge, freezer and pantry
            storage times, with and without vacuum sealing.
          </p>
          <p className="mt-3 text-sm text-copy-muted">
            All figures are conservative estimates. Actual shelf life depends on initial food quality,
            storage temperature and sealing technique. Always check food before consuming if any doubt exists.
          </p>
        </div>

        {/* Key callout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { stat: "3–5×", label: "Average shelf life extension" },
            { stat: "2–3 yrs", label: "Vacuum sealed game meat in freezer" },
            { stat: "4–8 mo", label: "Hard cheese vacuum sealed in fridge" },
            { stat: "2–3 yrs", label: "Dry goods at room temperature" },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-primary text-white p-4 text-center">
              <p className="text-2xl font-black text-secondary">{stat}</p>
              <p className="text-xs text-white/70 mt-1 leading-snug">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3 mb-10 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Food safety:</strong> Vacuum sealing slows but does not stop all bacterial growth.
            Always refrigerate or freeze raw proteins, even when vacuum sealed. Anaerobic bacteria
            (C. botulinum) can grow in sealed environments at room temperature. Never store
            raw meat, fish or poultry at room temperature, sealed or unsealed.
          </p>
        </div>

        {categories.map((cat) => (
          <section key={cat.name} className="mb-10">
            <h2 className="text-lg font-black text-primary mb-3 pb-2 border-b-2 border-primary">{cat.name}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="text-left py-2.5 px-4 font-bold text-primary">Food</th>
                    <th className="text-left py-2.5 px-4 font-bold text-copy-muted text-xs">Fridge (normal)</th>
                    <th className="text-left py-2.5 px-4 font-bold text-secondary text-xs">Fridge (vacuum)</th>
                    <th className="text-left py-2.5 px-4 font-bold text-copy-muted text-xs">Frozen (normal)</th>
                    <th className="text-left py-2.5 px-4 font-bold text-secondary text-xs">Frozen (vacuum)</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.rows.map(([food, fridgeN, fridgeV, frozenN, frozenV]) => (
                    <tr key={food} className="border-b border-border odd:bg-surface last:border-0">
                      <td className="py-2 px-4 font-semibold text-primary text-sm">{food}</td>
                      <td className="py-2 px-4 text-copy-muted text-xs">{fridgeN}</td>
                      <td className="py-2 px-4 font-semibold text-secondary text-xs">{fridgeV}</td>
                      <td className="py-2 px-4 text-copy-muted text-xs">{frozenN}</td>
                      <td className="py-2 px-4 font-semibold text-secondary text-xs">{frozenV}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/products/vacuum-machines" className="bg-primary text-white text-sm font-bold px-6 py-4 text-center hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            Shop Vacuum Machines <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products/bags-rolls" className="border border-border text-primary text-sm font-semibold px-6 py-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
            Shop Bags & Rolls
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-xs font-black uppercase tracking-widest text-copy-muted mb-4">More Guides</p>
          <div className="flex flex-wrap gap-4">
            {[
              ["Advantages of Vacuum Packaging", "/vacuum-packaging/advantages"],
              ["Expert Tips", "/vacuum-packaging/expert-tips"],
              ["Dry Aging Guide", "/vacuum-packaging/dry-aging"],
              ["Our Vacuum Bags", "/vacuum-packaging/bags-guide"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-semibold text-primary hover:text-secondary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3.5 w-3.5 text-secondary" /> {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
