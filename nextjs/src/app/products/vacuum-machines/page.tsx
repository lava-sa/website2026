import type { Metadata } from "next";
import { getProductsByCategory } from "@/lib/products";
import type { Product } from "@/types/product";
import ProductCard from "@/components/shop/ProductCard";
import ComparisonTable from "@/components/shop/ComparisonTable";
import HuntexBanner from "@/components/home/HuntexBanner";
import OpenJanetButton from "@/components/shop/OpenJanetButton";

export const metadata: Metadata = {
  title: "LAVA Vacuum Sealing Machines",
  description:
    "Browse the full range of LAVA vacuum sealing machines. From compact home models to commercial industrial sealers — all made in Germany with a 2-year warranty.",
};

export const revalidate = 3600;

// ── Comparison data (static — specs don't change) ────────────────────────────

const DOMESTIC_COMPARISON = {
  title: "V.100 vs V.300 — Which is right for you?",
  subtitle: "Both are German-engineered home machines. Here's how they differ.",
  models: [
    { name: "V.100 Premium X",  slug: "v100-premium-x", price: "R11,000", badge: "Entry Level" },
    { name: "V.300 Premium X",  slug: "v300-premium-x", price: "R14,500", badge: "Most Popular", badgeColor: "bg-secondary text-white" },
    { name: "V.300 Black",      slug: "v300-black",      price: "R14,200", badge: "Limited Edition" },
    { name: "V.300 White",      slug: "v300-white",      price: "R14,200", badge: "Limited Edition" },
  ],
  rows: [
    { label: "Suction Power",       values: ["35 ltr/min",  "35 ltr/min",  "35 ltr/min",  "35 ltr/min"]  },
    { label: "Max Vacuum",          values: ["-0.94 bar",   "-0.80 bar",   "-0.80 bar",   "-0.96 bar"]   },
    { label: "Sealing Width",       values: ["340 mm",      "300 mm",      "300 mm",      "340 mm"]      },
    { label: "Seal Strips",         values: ["Double",      "Double",      "Double",      "Double"]      },
    { label: "Automatic Mode",      values: [false,         true,          true,          true]          },
    { label: "Manual Mode",         values: [true,          true,          true,          true]          },
    { label: "Pressure Gauge",      values: ["LED",         "Dial",        "Dial",        "Dial"]        },
    { label: "Variable Pressure",   values: [false,         true,          true,          true]          },
    { label: "2-Step Filter",       values: [false,         false,         false,         true]          },
    { label: "Container Compatible",values: [true,          true,          true,          true]          },
    { label: "Power",               values: ["500 W",       "500 W",       "800 W",       "600 W"]       },
    { label: "Weight",              values: ["4.40 kg",     "4.40 kg",     "3.95 kg",     "—"]           },
    { label: "Best For",            values: [
      "Occasional home use",
      "Regular home / hunting",
      "Style-conscious users",
      "Maximum vacuum power",
    ]},
  ],
};

const COMMERCIAL_COMPARISON = {
  title: "V.400 vs V.500 vs V.500 XXL — Commercial range compared",
  subtitle: "All special order. Contact us to discuss the right machine for your operation.",
  models: [
    { name: "V.400 Premium",       slug: "v400-premium",      price: "R29,890", badge: "Entry Commercial" },
    { name: "V.500 Premium 72cm",  slug: "v500-premium",      price: "R41,210", badge: "Commercial" },
    { name: "V.500 Premium XXL",   slug: "v500-premium-xxl",  price: "R68,280", badge: "Industrial", badgeColor: "bg-petrol-600 text-white" },
  ],
  rows: [
    { label: "Pumps",               values: ["1",              "3",              "3"]              },
    { label: "Suction Power",       values: ["35 ltr/min",     "110 ltr/min",    "110 ltr/min"]    },
    { label: "Max Vacuum",          values: ["-0.92 bar",      "-0.92 bar",      "-0.92 bar"]      },
    { label: "Sealing Width",       values: ["450 mm",         "750 mm",         "1200 mm"]        },
    { label: "Seal Strips",         values: ["Triple",         "Triple",         "Triple"]         },
    { label: "Automatic Mode",      values: [true,             true,             true]             },
    { label: "Manual Mode",         values: [true,             true,             true]             },
    { label: "Housing",             values: ["Stainless Steel","Steel",          "Steel"]          },
    { label: "Container Compatible",values: [true,             true,             true]             },
    { label: "Best For",            values: [
      "Restaurant / butchery",
      "High-volume commercial",
      "Carcases & industrial",
    ]},
  ],
};

// ─────────────────────────────────────────────────────────────────────────────

export default async function VacuumMachinesPage() {
  let products: Product[] = [];
  try {
    products = await getProductsByCategory("vacuum-machines");
  } catch {
    // Schema not yet created — show empty state
  }

  const featured = products.filter((p) => p.is_featured);
  const standard = products.filter((p) => !p.is_featured);

  return (
    <main className="min-h-screen bg-white">

      {/* ── Page Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">Made in Germany since 1982</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            LAVA Vacuum Sealing Machines
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            From compact home models to industrial commercial sealers — every
            machine is engineered in Germany and backed by a 2-year warranty.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ["Home & Domestic", "#home-range"],
              ["Compare V100 / V300", "#compare-domestic"],
              ["Commercial & Industrial", "#commercial-range"],
              ["Compare V400 / V500", "#compare-commercial"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-semibold border border-white/30 text-white/80
                           px-4 py-2 hover:bg-white/10 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>


      {/* ── Empty state ───────────────────────────────────────────────── */}
      {products.length === 0 && (
        <section className="py-32 text-center">
          <p className="text-copy-muted text-lg">Products loading — please check back shortly.</p>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          HOME & DOMESTIC RANGE
      ══════════════════════════════════════════════════════ */}
      {featured.length > 0 && (
        <section id="home-range" className="py-20">
          <div className="section-container">
            <div className="mb-10">
              <p className="overline mb-2">Best sellers</p>
              <h2 className="text-3xl font-bold text-primary">Home & Domestic Range</h2>
              <p className="mt-3 text-copy-muted max-w-lg">
                The V.100 and V.300 series — the machines most South Africans start with.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Domestic Comparison Table ─────────────────────────────────── */}
      <section id="compare-domestic" className="bg-surface border-y border-border">
        <div className="section-container">
          <ComparisonTable {...DOMESTIC_COMPARISON} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COMMERCIAL & INDUSTRIAL RANGE
      ══════════════════════════════════════════════════════ */}
      {standard.length > 0 && (
        <section id="commercial-range" className="py-20">
          <div className="section-container">
            <div className="mb-10">
              <p className="overline mb-2">For professionals</p>
              <h2 className="text-3xl font-bold text-primary">Commercial & Industrial Range</h2>
              <p className="mt-3 text-copy-muted max-w-lg">
                For restaurants, butcheries and high-volume food operations.
                All available on special order — contact us to discuss your needs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {standard.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Commercial Comparison Table ───────────────────────────────── */}
      <section id="compare-commercial" className="bg-surface border-y border-border">
        <div className="section-container">
          <ComparisonTable {...COMMERCIAL_COMPARISON} />
        </div>
      </section>

      {/* ── Janet CTA ─────────────────────────────────────────────────── */}
      <div className="section-container pb-12">
        <OpenJanetButton />
      </div>

      {/* ── Huntex Banner ─────────────────────────────────────────────── */}
      <HuntexBanner variant="section" />

    </main>
  );
}
