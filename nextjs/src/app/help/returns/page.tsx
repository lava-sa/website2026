import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw, Phone, Mail, CheckCircle, X, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges — LAVA South Africa Returns Policy | Lava South Africa",
  description:
    "30-day returns on unused products. 5-day defective product policy. Free collection on faulty items. Full returns process explained clearly.",
};

export default function ReturnsPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Shopping Help</p>
          <h1 className="text-4xl font-black text-primary">Returns &amp; Exchanges</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            We want you to be completely happy with your LAVA purchase. If something
            isn&apos;t right, here&apos;s how we make it right — quickly and without fuss.
          </p>
        </div>

        {/* Quick summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: RefreshCw, title: "30-Day Returns", sub: "Change of mind, unused product" },
            { icon: CheckCircle, title: "5-Day Defective", sub: "Report faulty goods within 5 days" },
            { icon: Phone, title: "Free Collection", sub: "On confirmed defective items" },
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

          <h2 className="text-2xl font-bold text-primary mb-4">Defective or Incorrect Products</h2>
          <p>
            If you receive a product that is defective, damaged in transit, or not what
            you ordered — we fix it. No argument, no complicated process.
          </p>
          <div className="space-y-3 my-6">
            {[
              "Notify us within 5 business days of receiving the order.",
              "Email anneke@lava-sa.co.za with your order number, a description and photographs where possible.",
              "Once the defect is confirmed, we arrange courier collection at our cost.",
              "A replacement is dispatched prepaid, or a full refund is issued — your choice.",
              "We respond to all defective product reports within 1 business day.",
            ].map((step, i) => (
              <div key={i} className="flex gap-3 border border-border bg-surface p-4">
                <div className="h-6 w-6 bg-secondary text-white font-black text-xs flex items-center justify-center shrink-0 rounded-full mt-0.5">{i + 1}</div>
                <p className="text-sm text-copy leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Change of Mind Returns</h2>
          <p>
            If you ordered without seeing the product in person and wish to return it —
            we understand. South Africa doesn&apos;t have a LAVA showroom. Here are the conditions:
          </p>
          <ul>
            <li>Notify us in writing within <strong>30 days</strong> of delivery.</li>
            <li>The product must be <strong>unused</strong>, in its original packaging with all accessories, manuals and tags intact.</li>
            <li>A <strong>10% restocking fee</strong> applies, plus the cost of return courier.</li>
            <li>Refunds are processed within <strong>10 business days</strong> of us receiving and inspecting the returned goods.</li>
            <li>Refunds are made via EFT to your South African bank account.</li>
          </ul>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">Products That Can Be Returned</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="border border-green-200 bg-green-50 p-4">
              <p className="font-bold text-green-800 text-sm mb-2 flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" /> Eligible for Return
              </p>
              <ul className="text-xs text-green-800 space-y-1.5 pl-1">
                <li>• Vacuum machines — unused, original packaging</li>
                <li>• Unopened bags and rolls (sealed original packaging)</li>
                <li>• Containers and accessories — unused, original packaging</li>
                <li>• Wrong item received — always accepted</li>
              </ul>
            </div>
            <div className="border border-red-200 bg-red-50 p-4">
              <p className="font-bold text-red-800 text-sm mb-2 flex items-center gap-1.5">
                <X className="h-4 w-4" /> Not Eligible for Return
              </p>
              <ul className="text-xs text-red-800 space-y-1.5 pl-1">
                <li>• Opened vacuum bags and rolls (hygiene)</li>
                <li>• Special-order commercial machines (V.400, V.500)</li>
                <li>• Products showing signs of use</li>
                <li>• Products modified or repaired by a third party</li>
                <li>• Products without original packaging</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-primary mt-10 mb-4">How to Start a Return</h2>
          <div className="bg-surface border border-border p-6">
            <p className="font-bold text-primary mb-4">Contact Anneke directly — she handles all returns personally.</p>
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

          <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3 mt-8">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Important:</strong> Do not return any product without prior written
              authorisation from Lava-SA. Unauthorised returns cannot be processed and may be
              returned to sender at the customer&apos;s cost.
            </p>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
          {[
            ["Delivery & Shipping", "/help/delivery"],
            ["2-Year Warranty", "/help/warranty"],
            ["FAQ", "/help/faq"],
            ["Full Returns Policy", "/legal/shipping-returns"],
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
