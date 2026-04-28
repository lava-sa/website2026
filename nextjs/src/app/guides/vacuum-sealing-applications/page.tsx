import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vacuum Sealing Applications Guide",
  description:
    "Application hub for hunters, chefs, butcheries, anglers, biltong makers, and sous vide users in South Africa.",
};

const APPLICATION_CLUSTERS = [
  ["/applications/hunter-game", "Hunters & Game Processing"],
  ["/applications/angler-fishing", "Anglers & Fishing"],
  ["/applications/butchery", "Butchery & Meat Processing"],
  ["/applications/catering", "Catering & Restaurants"],
  ["/applications/kitchen", "Home Kitchen & Meal Prep"],
  ["/applications/biltong", "Biltong & Charcuterie"],
  ["/products/sous-vide", "Sous Vide Products"],
] as const;

export default function VacuumSealingApplicationsGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-primary py-14">
        <div className="section-container max-w-4xl">
          <p className="overline text-secondary mb-3">Pillar Guide</p>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Applications for Hunters, Chefs, Butchery & Sous Vide
          </h1>
          <p className="mt-4 text-on-dark-muted text-lg">
            Find the right machine, bag strategy, and workflow by real-world application.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="section-container max-w-4xl space-y-5 text-copy leading-relaxed">
          <p>
            Different applications need different vacuum control and throughput. Game processing, fish handling,
            butchery prep, and sous vide all benefit from tailored settings and bag systems.
          </p>
          <p>
            This page is the central entry point to application-specific cluster content and machine recommendations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {APPLICATION_CLUSTERS.map(([href, label]) => (
              <Link key={href} href={href} className="border border-border px-4 py-3 text-sm hover:border-primary hover:text-primary transition-colors">
                {label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
