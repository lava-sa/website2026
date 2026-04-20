import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Lava South Africa",
  description: "Full terms and conditions for purchasing from Lava South Africa — delivery, payment, warranty, liability and your legal rights.",
};

export default function TermsPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        {/* Header */}
        <div className="mb-12">
          <p className="overline mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-primary">Terms & Conditions</h1>
          <p className="mt-3 text-copy-muted text-sm">
            Last updated: April 2026 · Lava Vide South Africa (Pty) Ltd
          </p>
          <p className="mt-4 text-copy-muted">
            These Terms and Conditions govern all orders placed through{" "}
            <strong className="text-primary">lava-sa.co.za</strong> and apply to
            the purchase of products from Lava Vide South Africa. By placing an
            order you confirm that you have read, understood and agreed to these terms.
          </p>
        </div>

        <div className="prose-lava">

          {/* Company */}
          <Section id="company" title="1. Company Information">
            <Table rows={[
              ["Legal name",    "Lava Vide South Africa"],
              ["Trading as",    "Lava South Africa / lava-sa.co.za"],
              ["Address",       "5 Stirling Road, Bryanston, Sandton 2191, South Africa"],
              ["Telephone",     "+27 (0)72 160 5556"],
              ["Email",         "anneke@lava-sa.co.za"],
              ["Business hours","Monday – Friday, 09:00 – 17:00 SAST"],
            ]} />
          </Section>

          {/* Scope */}
          <Section id="scope" title="2. Scope">
            <p>
              These terms apply to all purchases made through our online store. We reserve
              the right to amend these terms at any time. The version published at the time
              of your order is the version that applies to that order. Purchaser&apos;s own
              standard terms will not be recognised unless expressly confirmed by us in writing.
            </p>
          </Section>

          {/* Orders */}
          <Section id="orders" title="3. Orders and Contract Formation">
            <ul>
              <li>All product listings are an invitation to treat, not a binding offer.</li>
              <li>Your order constitutes an offer to purchase. A contract is only formed when we send you an explicit order confirmation email.</li>
              <li>An automated acknowledgement email is a receipt summary only — it is not acceptance of your order.</li>
              <li>We reserve the right to decline or cancel any order (e.g. due to stock error or pricing error) and will provide a full refund immediately if payment has already been taken.</li>
              <li>Specifications and prices may change due to currency fluctuations or manufacturer changes without prior notice. We will notify you of any such change before dispatching your order.</li>
            </ul>
          </Section>

          {/* Pricing */}
          <Section id="pricing" title="4. Pricing and VAT">
            <ul>
              <li>All prices displayed are in South African Rand (ZAR) and include 15% VAT.</li>
              <li>Delivery fees are calculated at checkout based on order weight and destination.</li>
              <li>Orders over R2,000 qualify for free standard courier delivery within South Africa.</li>
              <li>We reserve the right to correct any pricing errors prior to dispatch.</li>
            </ul>
          </Section>

          {/* Payment */}
          <Section id="payment" title="5. Payment">
            <p>
              All transactions are processed securely through{" "}
              <strong className="text-primary">PayFast</strong>, a leading South African
              payment gateway. We accept Visa, Mastercard and Instant EFT via PayFast.
              Payment is required in full before any order is processed or dispatched.
            </p>
            <ul>
              <li>Credit card details are never stored on our servers — all card processing is handled exclusively by PayFast using industry-standard TLS encryption.</li>
              <li>In the event of a failed or declined payment, your order will not be processed. Please contact us if you experience payment difficulties.</li>
            </ul>
          </Section>

          {/* Delivery */}
          <Section id="delivery" title="6. Delivery">
            <ul>
              <li>All orders are dispatched via tracked courier within 1–2 business days of payment confirmation.</li>
              <li>Estimated delivery time within South Africa is 2–4 business days after dispatch.</li>
              <li>You must provide a physical street address and contact phone number — we cannot deliver to PO Boxes.</li>
              <li>Someone must be available to receive delivery between 08:00 and 17:00 on weekdays.</li>
              <li>All vacuum machines are individually tested before dispatch.</li>
              <li>Delivery delays caused by circumstances beyond our control (weather events, courier disruptions, public holidays) do not constitute breach of contract.</li>
              <li>Risk of loss passes to the customer upon handover to the courier. Please inspect all packaging in the presence of the courier driver and note any damage on the consignment note.</li>
            </ul>
          </Section>

          {/* Warranty */}
          <Section id="guarantee" title="7. Warranty">
            <ul>
              <li>All LAVA vacuum sealing machines carry a <strong className="text-primary">2-year factory warranty</strong> from the date of delivery.</li>
              <li>An optional 5-year extended warranty is available on selected machines at an additional charge.</li>
              <li>The warranty covers electrical and mechanical components: pump, motor, transformer, electronics and switches.</li>
              <li><strong>Not covered by warranty:</strong> damage caused by improper use, unauthorized repairs, normal wear components (sealing strips, foam seals), cosmetic damage, or damage caused by failure to follow operating instructions.</li>
              <li>To make a warranty claim, contact us within 14 days of discovering the defect. After 14 days without notification, the product is deemed to have been received in acceptable condition.</li>
              <li>Approved warranty repairs or replacements are handled at our cost, including courier collection and redelivery.</li>
            </ul>
          </Section>

          {/* Cancellation */}
          <Section id="cancellation" title="8. Right of Cancellation">
            <p>
              If you purchased a product without having seen it in person, you have the right
              to cancel your order within <strong>30 days of receipt</strong> of the goods
              (cooling-off period), provided:
            </p>
            <ul>
              <li>The product is in its original, unused condition with all original packaging intact.</li>
              <li>You notify us in writing (email to anneke@lava-sa.co.za) within 30 days of delivery.</li>
              <li>The product is not a customised or special-order item.</li>
            </ul>
            <p>
              Upon approved cancellation we will arrange courier collection at our cost.
              Refunds are processed within 10 business days of receiving the returned goods
              in acceptable condition. A 10% restocking fee may apply to non-defect returns.
            </p>
          </Section>

          {/* Liability */}
          <Section id="liability" title="9. Limitation of Liability">
            <p>
              Our liability to you is limited to the purchase price of the goods in question.
              We are not liable for any indirect, consequential or economic loss arising from
              the use of (or inability to use) any product. Nothing in these terms limits
              our liability for gross negligence or wilful misconduct.
            </p>
          </Section>

          {/* Jurisdiction */}
          <Section id="jurisdiction" title="10. Governing Law">
            <p>
              These terms are governed by the laws of the Republic of South Africa. Any
              disputes shall be subject to the jurisdiction of the South African courts.
              The United Nations Convention on the International Sale of Goods does not apply.
            </p>
          </Section>

          {/* Data */}
          <Section id="data" title="11. Data Protection">
            <p>
              We collect and process personal data in accordance with South Africa&apos;s
              Protection of Personal Information Act (POPIA). Please refer to our{" "}
              <Link href="/legal/privacy" className="text-primary font-semibold hover:text-secondary transition-colors">
                Privacy Policy
              </Link>{" "}
              for full details.
            </p>
          </Section>

        </div>

        <LegalFooter />
      </div>
    </main>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

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
            <td className="py-2.5 px-4 font-semibold text-primary w-1/3">{key}</td>
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
        Questions about these terms? Contact us at{" "}
        <a href="mailto:anneke@lava-sa.co.za" className="text-primary font-semibold">anneke@lava-sa.co.za</a>
        {" "}or call{" "}
        <a href="tel:+27721605556" className="text-primary font-semibold">+27 72 160 5556</a>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          ["Privacy Policy", "/legal/privacy"],
          ["Conditions of Use", "/legal/conditions"],
          ["Shipping & Returns", "/legal/shipping-returns"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="text-xs text-copy-muted hover:text-primary transition-colors underline">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
