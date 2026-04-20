import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Wrench, Phone, Mail, CheckCircle, X, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "2-Year LAVA Warranty — What's Covered & How to Claim | Lava South Africa",
  description:
    "All LAVA vacuum machines carry a 2-year factory warranty. Free collection, repair and redelivery. 10+ years spare parts availability. Here's exactly what's covered.",
};

export default function WarrantyPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Shopping Help</p>
          <h1 className="text-4xl font-black text-primary">2-Year Warranty</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            Every LAVA vacuum sealing machine sold by Lava-SA carries a 2-year factory
            warranty. If your machine develops a fault, we collect it, fix it and return it —
            at no cost to you.
          </p>
        </div>

        {/* Key warranty facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: ShieldCheck, title: "2 Years", sub: "Full factory warranty on all machines" },
            { icon: Wrench, title: "Free Repair", sub: "Collection, repair & redelivery at our cost" },
            { icon: Clock, title: "10+ Years", sub: "Spare parts available after warranty expires" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="border border-border bg-surface p-4 text-center">
              <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="font-bold text-primary text-sm">{title}</p>
              <p className="text-xs text-copy-muted mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="prose-lava">

          <h2 className="text-2xl font-bold text-primary mb-4">What the Warranty Covers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="border border-green-200 bg-green-50 p-5">
              <p className="font-bold text-green-800 text-sm mb-3 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Covered Under Warranty
              </p>
              <ul className="text-xs text-green-800 space-y-2 pl-1">
                <li>• Manufacturing defects in materials and workmanship</li>
                <li>• Vacuum pump failure under normal use</li>
                <li>• Sealing strip failure (not normal wear)</li>
                <li>• Lid mechanism defects</li>
                <li>• Electrical faults not caused by incorrect voltage</li>
                <li>• Any component failure that occurs under normal household or commercial use</li>
              </ul>
            </div>
            <div className="border border-red-200 bg-red-50 p-5">
              <p className="font-bold text-red-800 text-sm mb-3 flex items-center gap-1.5">
                <X className="h-4 w-4" /> Not Covered
              </p>
              <ul className="text-xs text-red-800 space-y-2 pl-1">
                <li>• Normal wear parts (sealing strips, foam seals) — these are consumables</li>
                <li>• Damage caused by misuse or improper operation</li>
                <li>• Damage from incorrect voltage or power surges</li>
                <li>• Repairs attempted by unauthorised third parties</li>
                <li>• Cosmetic damage that doesn&apos;t affect function</li>
                <li>• Damage from liquid entering the machine (preventable with Liquid Stop)</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">How to Make a Warranty Claim</h2>
          <div className="space-y-3 mb-8">
            {[
              { step: "1", title: "Contact us", detail: "Email anneke@lava-sa.co.za or call +27 72 160 5556 with your order number and a description of the fault. Photos or a short video are extremely helpful." },
              { step: "2", title: "Troubleshoot together", detail: "Many issues can be resolved over the phone or by email without needing to return the machine. We'll walk through the problem with you first — often it's something simple." },
              { step: "3", title: "We arrange collection", detail: "If the machine needs to come in, we arrange a courier to collect it at no cost to you. We'll give you a collection date and a reference number." },
              { step: "4", title: "Repair or replacement", detail: "Most machines are repaired and returned within 5–10 business days. If a repair isn't possible, we replace with the equivalent model. We keep you updated throughout." },
              { step: "5", title: "Free return delivery", detail: "Your repaired or replacement machine is returned to you via tracked courier, also at our cost." },
            ].map(({ step, title, detail }) => (
              <div key={step} className="flex gap-4 border border-border p-5">
                <div className="h-9 w-9 bg-primary text-white font-black text-sm flex items-center justify-center shrink-0 rounded-full">{step}</div>
                <div>
                  <p className="font-bold text-primary mb-1">{title}</p>
                  <p className="text-sm text-copy leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">After Warranty: Spare Parts</h2>
          <p>
            LAVA&apos;s commitment to repairability doesn&apos;t end when the warranty does.
            <strong> Spare parts are stocked for 10+ years</strong> after a model is discontinued.
            This means a machine purchased today will still be repairable in 2036.
          </p>
          <p>
            The most commonly replaced parts are wear items — and they&apos;re all available
            from Lava-SA:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
            {[
              { part: "Sealing Strips", desc: "The element that melts the bag closed. Typically lasts 3–5 years of regular use.", href: "/products/spare-parts" },
              { part: "Liquid Trap Lids", desc: "Catches marinade and moisture before it reaches the pump. Essential maintenance item.", href: "/products/spare-parts" },
              { part: "Vacuum Seal Sets", desc: "The foam and rubber seals that maintain lid pressure. Replace if vacuum is weakening.", href: "/products/spare-parts" },
            ].map(({ part, desc, href }) => (
              <Link key={part} href={href} className="border border-border bg-surface p-4 hover:border-primary transition-colors group">
                <p className="font-bold text-primary text-sm group-hover:text-secondary transition-colors">{part}</p>
                <p className="text-xs text-copy-muted mt-1 leading-relaxed">{desc}</p>
                <p className="text-xs font-semibold text-secondary mt-2">Shop now →</p>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Why LAVA Warranty Support Is Different</h2>
          <p>
            Most appliance warranties involve sending a machine to an authorised service centre
            you&apos;ve never heard of, waiting 3–6 weeks, and receiving it back in unknown
            condition. LAVA-SA warranty claims go through Anneke and Wilco directly.
          </p>
          <ul>
            <li>You deal with <strong>the same people you bought from</strong> — not a call centre</li>
            <li>They have personal experience with every machine in the range</li>
            <li>Claims are handled within <strong>1 business day of contact</strong></li>
            <li>Most issues are resolved without the machine ever leaving your home</li>
          </ul>

          <div className="bg-primary/5 border border-primary/20 p-5 mt-8">
            <p className="font-bold text-primary mb-3">Make a Warranty Claim</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="tel:+27721605556" className="flex items-center gap-3 border border-border bg-white px-4 py-3 hover:border-primary transition-all">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-primary text-sm">+27 72 160 5556</p>
                  <p className="text-xs text-copy-muted">Mon–Fri 09:00–17:00</p>
                </div>
              </a>
              <a href="mailto:anneke@lava-sa.co.za" className="flex items-center gap-3 border border-border bg-white px-4 py-3 hover:border-primary transition-all">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="font-bold text-primary text-sm">anneke@lava-sa.co.za</p>
                  <p className="text-xs text-copy-muted">Reply within 1 business day</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
          {[
            ["Delivery & Shipping", "/help/delivery"],
            ["Returns & Exchanges", "/help/returns"],
            ["FAQ", "/help/faq"],
            ["Shop Spare Parts", "/products/spare-parts"],
            ["Full Terms & Conditions", "/legal/terms#guarantee"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="text-xs font-bold text-copy-muted hover:text-primary transition-colors underline">
              {label}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
