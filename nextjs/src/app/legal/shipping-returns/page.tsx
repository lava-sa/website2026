import type { Metadata } from "next";
import Link from "next/link";
import { Truck, RefreshCw, ShieldCheck, Clock, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping & Returns — Lava South Africa",
  description: "Delivery times, courier rates, returns policy and how to make a warranty claim with Lava South Africa.",
};

export default function ShippingReturnsPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-primary">Shipping & Returns</h1>
          <p className="mt-3 text-copy-muted text-sm">
            Last updated: April 2026 · Lava Vide South Africa (Pty) Ltd
          </p>
          <p className="mt-4 text-copy-muted">
            We want your order to arrive quickly, safely and exactly as expected.
            This page explains how we ship, what to do if something goes wrong,
            and how our returns process works.
          </p>
        </div>

        {/* Quick summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Truck,       title: "Free Delivery",   sub: "On orders over R2,000" },
            { icon: Clock,       title: "2–4 Days",        sub: "After payment clears" },
            { icon: RefreshCw,   title: "30-Day Returns",  sub: "Unused, original packaging" },
            { icon: ShieldCheck, title: "2-Year Warranty", sub: "All LAVA machines" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="border border-border bg-surface p-4 text-center">
              <div className="h-10 w-10 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="font-bold text-primary text-sm leading-snug">{title}</p>
              <p className="text-xs text-copy-muted mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="prose-lava">

          <Section id="delivery" title="1. Delivery">

            <h3 className="font-bold text-primary">Processing Time</h3>
            <ul>
              <li>Orders placed on weekdays before 15:00 are typically dispatched the same day after payment clears.</li>
              <li>Orders placed after 15:00, or on weekends and public holidays, are dispatched the next business day.</li>
              <li>All vacuum machines are individually tested before dispatch.</li>
              <li>You will receive an email with a tracking number once your order is dispatched.</li>
            </ul>

            <h3 className="font-bold text-primary mt-6">Delivery Times</h3>
            <Table rows={[
              ["Gauteng (Johannesburg, Pretoria)", "1–2 business days"],
              ["Major centres (Cape Town, Durban, PE)", "2–3 business days"],
              ["Outlying areas and small towns", "3–5 business days"],
              ["Remote areas (farm addresses, etc.)", "5–7 business days"],
            ]} />
            <p className="text-sm text-copy-muted">
              Delivery times are estimates only and may be affected by courier delays, public holidays or adverse weather.
            </p>

            <h3 className="font-bold text-primary mt-6">Delivery Rates</h3>
            <Table rows={[
              ["Orders over R2,000",    "FREE standard courier delivery"],
              ["Orders under R2,000",   "R150 flat rate (most orders)"],
              ["Outlying / remote areas", "Quoted at checkout — may differ"],
            ]} />

            <h3 className="font-bold text-primary mt-6">Delivery Requirements</h3>
            <ul>
              <li>We deliver to physical street addresses only — no PO Boxes.</li>
              <li>A contact person must be available to receive delivery between 08:00 and 17:00 on weekdays.</li>
              <li>Please provide a valid cell phone number — our courier will contact you to arrange delivery.</li>
              <li><strong className="text-primary">Vacuum machines ship via tracked courier only</strong> due to their fragility and value. Bag-only orders may be sent by registered post.</li>
            </ul>

            <h3 className="font-bold text-primary mt-6">Receiving Your Order</h3>
            <ul>
              <li>Please inspect the outer packaging in the presence of the courier driver before signing.</li>
              <li>If the packaging is visibly damaged, note this on the consignment note before signing. Take photographs if possible.</li>
              <li>Report any transit damage to us within 24 hours of delivery.</li>
            </ul>

          </Section>

          <Section id="returns" title="2. Returns Policy">

            <h3 className="font-bold text-primary">Defective or Incorrect Products</h3>
            <p>
              If you receive a product that is defective, damaged in transit, or not what
              you ordered:
            </p>
            <ul>
              <li>Notify us within <strong className="text-primary">5 business days</strong> of receiving the order.</li>
              <li>Email <a href="mailto:anneke@lava-sa.co.za" className="text-primary font-semibold">anneke@lava-sa.co.za</a> with your order number, a description of the issue and photographs where possible.</li>
              <li>Once confirmed, we arrange courier collection at <strong className="text-primary">our cost</strong>.</li>
              <li>A replacement is dispatched prepaid, or a full refund is issued — your choice.</li>
            </ul>

            <h3 className="font-bold text-primary mt-6">Change of Mind Returns</h3>
            <p>
              If you ordered without seeing the product in person and wish to return it:
            </p>
            <ul>
              <li>Notify us in writing within <strong className="text-primary">30 days</strong> of delivery.</li>
              <li>The product must be unused, in its original packaging with all accessories, manuals and tags intact.</li>
              <li>Products showing signs of use, or with missing/damaged packaging, cannot be returned.</li>
              <li>A <strong className="text-primary">10% restocking fee</strong> applies, plus the cost of return courier.</li>
              <li>Refunds are processed within <strong className="text-primary">10 business days</strong> of us receiving and inspecting the returned goods.</li>
              <li>Refunds are made via EFT to your South African bank account.</li>
            </ul>

            <h3 className="font-bold text-primary mt-6">Products That Cannot Be Returned</h3>
            <ul>
              <li>Opened vacuum bags and rolls (for hygiene reasons)</li>
              <li>Special-order commercial machines (V.400, V.500 range)</li>
              <li>Products that have been used, modified or repaired by a third party</li>
              <li>Products without original packaging or accessories</li>
            </ul>

          </Section>

          <Section id="warranty" title="3. Warranty Claims">
            <p>
              All LAVA vacuum sealing machines carry a <strong className="text-primary">2-year factory warranty</strong>.
              If your machine develops a fault within the warranty period:
            </p>
            <ul>
              <li>Contact us by email or phone with your order number and a description of the fault.</li>
              <li>We will troubleshoot with you over the phone or email — many issues can be resolved without returning the machine.</li>
              <li>If the machine needs to come in, we arrange courier collection and redelivery at <strong className="text-primary">no cost to you</strong>.</li>
              <li>Repaired or replacement machines are returned within 5–10 business days depending on the nature of the repair.</li>
            </ul>
            <p>
              See the full warranty terms in our{" "}
              <Link href="/legal/terms#guarantee" className="text-primary font-semibold hover:text-secondary transition-colors">
                Terms & Conditions
              </Link>.
            </p>
          </Section>

          <Section id="contact-us" title="4. Contact Us About a Delivery or Return">
            <p>
              The fastest way to resolve any delivery or return issue is to contact Anneke
              directly. We respond to all enquiries within 1 business day.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <a href="tel:+27721605556"
                className="flex items-center gap-3 border border-border bg-surface px-4 py-4 hover:border-primary hover:bg-white transition-all">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Call</p>
                  <p className="font-bold text-primary">+27 72 160 5556</p>
                  <p className="text-xs text-copy-muted">Mon–Fri 09:00–17:00</p>
                </div>
              </a>
              <a href="mailto:anneke@lava-sa.co.za"
                className="flex items-center gap-3 border border-border bg-surface px-4 py-4 hover:border-primary hover:bg-white transition-all">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted">Email</p>
                  <p className="font-bold text-primary">anneke@lava-sa.co.za</p>
                  <p className="text-xs text-copy-muted">Reply within 1 business day</p>
                </div>
              </a>
            </div>
          </Section>

        </div>

        <LegalFooter />
      </div>
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-32">
      <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-copy">{children}</div>
    </section>
  );
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-sm border border-border">
      <tbody>
        {rows.map(([key, val]) => (
          <tr key={key} className="border-b border-border last:border-0 odd:bg-surface even:bg-white">
            <td className="py-2.5 px-4 font-semibold text-primary w-1/2 border-r border-border">{key}</td>
            <td className="py-2.5 px-4 text-copy">{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LegalFooter() {
  return (
    <div className="mt-16 pt-8 border-t border-border">
      <p className="text-xs text-copy-muted">
        Questions? Contact{" "}
        <a href="mailto:anneke@lava-sa.co.za" className="text-primary font-semibold">anneke@lava-sa.co.za</a>
        {" "}or call{" "}
        <a href="tel:+27721605556" className="text-primary font-semibold">+27 72 160 5556</a>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          ["Terms & Conditions",  "/legal/terms"],
          ["Privacy Policy",      "/legal/privacy"],
          ["Conditions of Use",   "/legal/conditions"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="text-xs text-copy-muted hover:text-primary transition-colors underline">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
