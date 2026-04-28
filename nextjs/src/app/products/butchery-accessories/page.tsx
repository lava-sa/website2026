import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Butchery Accessories & Equipment",
  description:
    "Explore LAVA's full range of professional butchery equipment: German Giesser knives, stainless steel hanging systems, digital scales, and meat processing machinery.",
};

export default function ButcheryAccessoriesLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-24">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Professional Grade · German Quality · Durable</p>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight max-w-3xl">
            Butchery Accessories & Equipment
          </h1>
          <p className="mt-6 text-on-dark-muted text-lg max-w-2xl leading-relaxed">
            From field dressing to professional meat processing. LAVA provides the complete 
            suite of tools for hunters, farmers, and commercial butchers who demand the highest standards.
          </p>
        </div>
      </section>

      {/* ── Category Grid ─────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Butchery Machinery", 
                href: "/products/butchery-machinery", 
                desc: "Mincers, fillers and processing gear.",
                tag: "High-Capacity"
              },
              { 
                title: "Professional Knives", 
                href: "/products/butchery-knives", 
                desc: "German Giesser blades for every task.",
                tag: "Precision"
              },
              { 
                title: "Hanging Systems", 
                href: "/products/butchery-hanging", 
                desc: "Stainless S-hooks, swivels and gambrels.",
                tag: "Heavy-Duty"
              },
              { 
                title: "Scales", 
                href: "/products/butchery-scales", 
                desc: "Digital platform and hanging scales.",
                tag: "Accuracy"
              },
              { 
                title: "Cutting Boards", 
                href: "/products/butchery-boards", 
                desc: "Hygienic surfaces for heavy use.",
                tag: "Durable"
              },
              { 
                title: "Protective Gear", 
                href: "/products/butchery-protective", 
                desc: "Chainmail and cut-resistant safety.",
                tag: "Safety"
              },
              { 
                title: "Specialized Tools", 
                href: "/products/butchery-tools", 
                desc: "Bone crushers, scrapers and more.",
                tag: "Essential"
              },
            ].map((cat) => (
              <a key={cat.href} href={cat.href}
                className="group relative bg-surface p-10 border border-border hover:border-secondary transition-all flex flex-col h-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  {cat.tag}
                </p>
                <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-copy-muted leading-relaxed mb-8 flex-grow">
                  {cat.desc}
                </p>
                <div className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  View Collection <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Banner ───────────────────────────────────────────────────── */}
      <section className="bg-primary py-20 border-t border-white/5 overflow-hidden relative">
         <div className="section-container relative z-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted Across South Africa</h2>
            <p className="text-on-dark-muted max-w-xl mx-auto italic">
              &quot;LAVA Butchery equipment has been our go-to for years. The Giesser knives stay sharp longer and the stainless hanging hooks are indestructible.&quot;
            </p>
            <p className="mt-4 text-secondary text-xs font-bold uppercase tracking-widest">— Commercial Abattoir Manager, Free State</p>
         </div>
      </section>
    </main>
  );
}
