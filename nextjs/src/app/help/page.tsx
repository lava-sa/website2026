import type { Metadata } from "next";
import Link from "next/link";
import { Truck, RefreshCw, ShieldCheck, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Shopping Help",
  description:
    "Delivery information, returns policy, warranty claims, and frequently asked questions for LAVA South Africa orders.",
};

const HELP_LINKS = [
  {
    icon: Truck,
    title: "Delivery & Shipping",
    description: "Delivery times, free shipping threshold, and what to expect after you order.",
    href: "/help/delivery",
    cta: "View delivery info",
  },
  {
    icon: RefreshCw,
    title: "Returns & Exchanges",
    description: "30-day returns, CPA rights for defective products, and how to start a return.",
    href: "/help/returns",
    cta: "View returns policy",
  },
  {
    icon: ShieldCheck,
    title: "2-Year Warranty",
    description: "What's covered, how to make a claim, and our free collection and repair process.",
    href: "/help/warranty",
    cta: "View warranty details",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description: "Common questions about machines, bags, orders, and accounts — answered.",
    href: "/help/faq",
    cta: "Browse FAQs",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white">

      <section className="bg-primary py-16">
        <div className="section-container">
          <p className="overline text-secondary mb-3">We&apos;re Here to Help</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Shopping Help
          </h1>
          <p className="mt-4 text-on-dark-muted text-lg max-w-xl">
            Everything you need to know about ordering, delivery, returns, and warranty —
            or call us directly on{" "}
            <a href="tel:+27721605556" className="text-secondary font-bold hover:underline">
              +27 72 160 5556
            </a>
            .
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {HELP_LINKS.map(({ icon: Icon, title, description, href, cta }) => (
              <Link
                key={href}
                href={href}
                className="group border border-border bg-white p-8 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-bold text-primary text-lg mb-2 group-hover:text-secondary transition-colors">
                  {title}
                </h2>
                <p className="text-sm text-copy-muted leading-relaxed mb-4">{description}</p>
                <p className="text-xs font-bold text-secondary">{cta} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface border-t border-border py-12 text-center">
        <div className="section-container max-w-xl mx-auto">
          <p className="font-bold text-primary mb-2">Still need help?</p>
          <p className="text-copy-muted mb-5">
            Anneke answers personally — call, WhatsApp, or email and you&apos;ll hear back the same day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+27721605556" className="inline-block bg-primary text-white font-bold px-6 py-3 hover:bg-primary/90 transition-colors">
              Call +27 72 160 5556
            </a>
            <Link href="/contact" className="inline-block border border-border text-copy font-semibold px-6 py-3 hover:border-primary hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
