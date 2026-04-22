import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Clock, MapPin, Phone, Mail, AlertTriangle, CheckCircle, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery & Shipping — How We Get Your LAVA to You",
  description:
    "Free delivery on orders over R2,500. Same-day dispatch before 15:00. Tracked courier to your door anywhere in South Africa. Full delivery information and rates.",
};

export default function DeliveryPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Shopping Help</p>
          <h1 className="text-4xl font-black text-primary">Delivery &amp; Shipping</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            We want your LAVA machine to arrive quickly, safely and exactly as expected.
            Here&apos;s everything you need to know about how we ship across South Africa.
          </p>
        </div>

        {/* Quick stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Truck, title: "Free Delivery", sub: "On orders over R2,500" },
            { icon: Clock, title: "Same Day", sub: "Dispatch before 15:00 weekdays" },
            { icon: MapPin, title: "Nationwide", sub: "All 9 provinces" },
            { icon: Package, title: "Fully Tracked", sub: "Email + SMS updates" },
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

          <h2 className="text-2xl font-bold text-primary mb-4">Delivery Rates</h2>
          <table className="w-full text-sm border border-border mb-8">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Order Value</th>
                <th className="text-left py-3 px-4 font-bold">Delivery Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Orders over R2,500", "FREE standard tracked courier"],
                ["Orders under R2,500", "R150 flat rate (most destinations)"],
                ["Outlying / remote areas", "Quoted at checkout — may differ"],
              ].map(([order, cost]) => (
                <tr key={order} className="border-b border-border odd:bg-surface">
                  <td className="py-3 px-4 font-semibold text-primary">{order}</td>
                  <td className="py-3 px-4 font-semibold text-secondary">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Delivery Times by Region</h2>
          <table className="w-full text-sm border border-border mb-6">
            <thead>
              <tr className="bg-primary text-white">
                <th className="text-left py-3 px-4 font-bold">Region</th>
                <th className="text-left py-3 px-4 font-bold">Estimated Delivery</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Gauteng (Johannesburg, Pretoria, Ekurhuleni)", "1–2 business days"],
                ["Major centres (Cape Town, Durban, Port Elizabeth, Bloemfontein)", "2–3 business days"],
                ["Secondary towns (George, Nelspruit, Polokwane, Kimberley)", "2–4 business days"],
                ["Outlying areas and small towns", "3–5 business days"],
                ["Remote areas (farm addresses, game farms)", "5–7 business days"],
              ].map(([region, time]) => (
                <tr key={region} className="border-b border-border odd:bg-surface">
                  <td className="py-3 px-4 text-copy">{region}</td>
                  <td className="py-3 px-4 font-semibold text-secondary">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-copy-muted mb-8">
            Delivery times are estimates from dispatch date. They may be affected by courier
            delays, public holidays or adverse weather. We dispatch as fast as we promise —
            once the parcel is with the courier, delivery timing is in their hands.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Processing &amp; Dispatch</h2>
          <div className="space-y-3 mb-8">
            {[
              { icon: CheckCircle, text: "Orders placed on weekdays before 15:00 are dispatched the same day after payment clears." },
              { icon: CheckCircle, text: "Orders placed after 15:00, or on weekends and public holidays, are dispatched the next business day." },
              { icon: CheckCircle, text: "All vacuum machines are individually tested and inspected before dispatch." },
              { icon: CheckCircle, text: "You will receive an email with a tracking number as soon as your order is dispatched." },
              { icon: CheckCircle, text: "Our courier will contact you by SMS to arrange delivery once the parcel is in your area." },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 border border-border bg-surface p-4">
                <Icon className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <p className="text-sm text-copy leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Delivery Requirements</h2>
          <ul>
            <li>We deliver to <strong>physical street addresses only</strong> — no PO Boxes.</li>
            <li>A contact person must be available to receive delivery between <strong>08:00 and 17:00 on weekdays</strong>.</li>
            <li>Please provide a valid cellphone number — our courier will contact you before delivery.</li>
            <li><strong>Vacuum machines ship via tracked courier only</strong> due to their value and fragility. Bag-only orders may be sent by registered post.</li>
            <li>If no one is available to receive the parcel, the courier will attempt re-delivery or hold at a depot for collection.</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Receiving Your Order</h2>
          <ul>
            <li>Inspect the outer packaging <strong>in the presence of the courier driver</strong> before signing.</li>
            <li>If the packaging is visibly damaged, <strong>note this on the consignment note before signing</strong>. Photograph if possible.</li>
            <li>Report any transit damage to us within <strong>24 hours</strong> of delivery.</li>
            <li>If you sign without noting damage, freight claims become significantly more difficult.</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3 my-8">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Farm &amp; game farm addresses:</strong> Remote deliveries occasionally
              require the recipient to collect from the nearest depot. If this is a concern,
              contact us before ordering and we&apos;ll advise on the best approach for your location.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Contact Us About a Delivery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="tel:+27721605556" className="flex items-center gap-3 border border-border bg-surface px-4 py-4 hover:border-primary transition-all">
              <Phone className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Call</p>
                <p className="font-bold text-primary">+27 72 160 5556</p>
                <p className="text-xs text-copy-muted">Mon–Fri 09:00–17:00</p>
              </div>
            </a>
            <a href="mailto:info@lava-sa.co.za" className="flex items-center gap-3 border border-border bg-surface px-4 py-4 hover:border-primary transition-all">
              <Mail className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Email</p>
                <p className="font-bold text-primary">info@lava-sa.co.za</p>
                <p className="text-xs text-copy-muted">Reply within 1 business day</p>
              </div>
            </a>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
          {[
            ["Returns & Exchanges", "/help/returns"],
            ["2-Year Warranty", "/help/warranty"],
            ["FAQ", "/help/faq"],
            ["Legal: Shipping & Returns Policy", "/legal/shipping-returns"],
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
