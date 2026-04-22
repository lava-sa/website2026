import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
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
              ["Legal name",    "Lava Vide South Africa (Pty) Ltd"],
              ["Trading as",    "Lava South Africa / lava-sa.co.za"],
              ["Address",       "5 Stirling Road, Bryanston, Sandton 2191, South Africa"],
              ["Telephone",     "+27 (0)72 160 5556"],
              ["Email",         "info@lava-sa.co.za"],
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
              <li>Orders over R2,500 qualify for free standard courier delivery within South Africa.</li>
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

            <div className="bg-blue-50 border border-blue-200 p-4 mb-4 text-sm text-blue-900">
              <strong>Your rights under the Consumer Protection Act (CPA), Act 68 of 2008 — Section 56:</strong>
              {" "}In addition to our contractual warranty below, South African law provides an implied
              warranty of quality on all goods. During the first <strong>6 months from delivery</strong>,
              if a product has a defect, you may demand — at your choice — repair, replacement, or a
              full refund. These statutory rights cannot be limited by any contractual term.
            </div>

            <p className="font-semibold text-primary">Statutory implied warranty (CPA §56) — first 6 months:</p>
            <ul>
              <li>If a defect arises within 6 months of delivery, you may choose: <strong>(a) repair</strong>, <strong>(b) replacement</strong>, or <strong>(c) full refund</strong>.</li>
              <li>We will arrange courier collection and redelivery at our cost for any defect reported within this period.</li>
              <li>No restocking fee, handling fee, or deduction applies to a CPA §56 claim.</li>
            </ul>

            <p className="font-semibold text-primary mt-4">Contractual factory warranty — 2 years from delivery:</p>
            <ul>
              <li>All LAVA vacuum sealing machines carry a <strong className="text-primary">2-year factory warranty</strong> from the date of delivery, covering manufacturing defects in materials and workmanship.</li>
              <li>An optional 5-year extended warranty is available on selected machines at an additional charge.</li>
              <li>The warranty covers electrical and mechanical components: pump, motor, transformer, electronics and switches.</li>
              <li><strong>Not covered:</strong> damage from improper use, unauthorised repairs, normal wear components (sealing strips, foam seals), cosmetic damage, or failure to follow operating instructions.</li>
              <li>For defects discovered between 6 and 24 months after delivery, we will repair or replace the machine at our cost, including courier collection and redelivery. A refund is offered if a repair or equivalent replacement cannot be completed within a reasonable time.</li>
              <li>To facilitate a warranty claim, please contact us as soon as a defect becomes apparent. Prompt notification helps us resolve the issue quickly and does not affect your statutory rights.</li>
            </ul>

          </Section>

          {/* Cancellation */}
          <Section id="cancellation" title="8. Right of Cancellation">

            <p className="font-semibold text-primary">CPA cooling-off — direct marketing (Section 20):</p>
            <p>
              If you purchased as a result of direct marketing initiated by us (e.g. a promotional
              email or SMS offer), you have the right to cancel within{" "}
              <strong>5 business days of receipt</strong> of the goods. In this case, we will
              arrange collection at our cost and issue a full refund with no deductions.
            </p>

            <p className="font-semibold text-primary mt-4">Our voluntary 30-day change-of-mind policy:</p>
            <p>
              As a courtesy beyond statutory minimums, we accept change-of-mind returns within
              30 days of delivery, provided:
            </p>
            <ul>
              <li>The product is in its original, unused condition with all original packaging intact.</li>
              <li>You notify us in writing (email to info@lava-sa.co.za) within 30 days of delivery.</li>
              <li>The product is not a customised or special-order item (V.400, V.500 commercial range).</li>
            </ul>
            <p>
              Upon approved return we will arrange courier collection at our cost. Refunds are
              processed within 10 business days of receiving the goods in acceptable condition.
              A <strong>10% restocking and handling fee</strong> applies to change-of-mind returns
              on non-defective goods only. This fee does <strong>not</strong> apply to returns
              made under the CPA §56 implied warranty or the §20 direct-marketing cooling-off right.
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
        <a href="mailto:info@lava-sa.co.za" className="text-primary font-semibold">info@lava-sa.co.za</a>
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
