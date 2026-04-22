import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions of Use",
  description: "Conditions of use for lava-sa.co.za — pricing, returns, defective products and your rights as a customer.",
};

export default function ConditionsPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-primary">Conditions of Use</h1>
          <p className="mt-3 text-copy-muted text-sm">
            Last updated: April 2026 · Lava Vide SA (Pty) Ltd
          </p>
          <p className="mt-4 text-copy-muted">
            By accessing and using <strong className="text-primary">lava-sa.co.za</strong> and
            placing an order, you agree to the following conditions of use. Please read these
            carefully before purchasing.
          </p>
        </div>

        <div className="prose-lava">

          <Section id="pricing" title="1. Pricing">
            <ul>
              <li>All prices displayed on lava-sa.co.za are in South African Rand (ZAR) and include 15% VAT.</li>
              <li>Prices are subject to change without prior notice due to currency fluctuations, manufacturer price adjustments or stock changes.</li>
              <li>If a price changes between your order and dispatch, we will notify you before processing the order.</li>
              <li>Pricing errors may occur. We reserve the right to cancel orders affected by pricing errors and will issue a full refund immediately.</li>
            </ul>
          </Section>

          <Section id="availability" title="2. Product Availability">
            <ul>
              <li>We make every effort to keep stock levels accurate on our website.</li>
              <li>If a product becomes unavailable after your order is placed, we will notify you promptly by phone or email and issue a full refund for the unavailable item.</li>
              <li>Certain commercial machines (V.400, V.500 range) are special-order items. Estimated lead times will be communicated at the time of order.</li>
            </ul>
          </Section>

          <Section id="use-of-site" title="3. Use of This Website">
            <ul>
              <li>This website and all its content are the property of Lava Vide SA (Pty) Ltd. You may not reproduce, redistribute or commercially exploit any content without prior written permission.</li>
              <li>You may use this website only for lawful purposes and in a way that does not infringe the rights of others.</li>
              <li>We reserve the right to restrict or terminate access to the website if we believe these conditions are being violated.</li>
              <li>Links to third-party websites are provided for convenience only. We are not responsible for the content or privacy practices of any third-party site.</li>
            </ul>
          </Section>

          <Section id="accuracy" title="4. Accuracy of Information">
            <p>
              We take care to ensure product descriptions, specifications and images are
              accurate. However, minor variations may exist between product images and the
              actual product (colour rendition, packaging updates). Manufacturing tolerances
              of up to 5% on dimensions and specifications are considered acceptable.
            </p>
            <p>
              If you receive a product that materially differs from its description, please
              contact us within 5 days and we will resolve the matter at no cost to you.
            </p>
          </Section>

          <Section id="reporting" title="5. Reporting a Problem">

            <div className="bg-blue-50 border border-blue-200 p-4 mb-4 text-sm text-blue-900">
              <strong>CPA §56 — Implied warranty of quality:</strong> South African law provides a
              6-month implied warranty from delivery. If a product is defective within this period,
              you may demand repair, replacement, or a full refund — your choice. This right
              cannot be limited by any contractual condition.
            </div>

            <p className="font-semibold text-primary">Transit damage or wrong item received:</p>
            <p>
              Please inspect your delivery in the presence of the courier driver. If goods arrive
              visibly damaged or are not what you ordered, notify us within{" "}
              <strong className="text-primary">5 business days</strong> of receiving your order
              so we can engage the courier and resolve the issue promptly. Contact us at:
            </p>
            <Table rows={[
              ["Email",   "info@lava-sa.co.za"],
              ["Phone",   "+27 (0)72 160 5556"],
              ["Hours",   "Monday – Friday, 09:00 – 17:00"],
            ]} />
            <p>
              Please have your order number and a description (or photograph) of the issue
              ready. We will respond within 1 business day with a resolution plan.
            </p>
            <p className="text-sm text-copy-muted">
              Note: the 5-business-day window above applies to transit damage and wrong-item
              claims. Manufacturing or quality defects are covered for 6 months under the CPA
              and 24 months under our factory warranty — see Section 6 below.
            </p>
          </Section>

          <Section id="defective" title="6. Defective Products">

            <p className="font-semibold text-primary">First 6 months — CPA §56 implied warranty:</p>
            <ul>
              <li>If a manufacturing or quality defect appears within 6 months of delivery, you may choose: repair, replacement, or full refund.</li>
              <li>Courier collection is at our cost. No restocking fee or deduction applies.</li>
            </ul>

            <p className="font-semibold text-primary mt-4">6–24 months — contractual factory warranty:</p>
            <ul>
              <li>Manufacturing defects reported between 6 and 24 months after delivery are covered by our 2-year factory warranty.</li>
              <li>We will repair or replace the machine at our cost, including courier collection and redelivery.</li>
              <li>A refund is offered if repair or equivalent replacement cannot be completed within a reasonable time.</li>
            </ul>

            <p className="font-semibold text-primary mt-4">Not covered (both periods):</p>
            <ul>
              <li>Damage caused by misuse, unauthorised modification, or failure to follow operating instructions.</li>
              <li>Normal wear components: sealing strips, foam seals (available as spare parts).</li>
              <li>Cosmetic damage that does not affect function.</li>
            </ul>

          </Section>

          <Section id="returns" title="7. Returns — Change of Mind (Non-Defective Products)">
            <p className="text-sm text-copy-muted">
              This section applies to voluntary returns of products that are not defective.
              Returns of defective products are governed by Section 6 above and the CPA —
              the restocking fee and conditions below do not apply to those.
            </p>
            <ul>
              <li>Returns require prior written authorisation from Lava South Africa.</li>
              <li>You must notify us within <strong className="text-primary">30 days</strong> of receiving the product.</li>
              <li>Returned products must be in original, unused condition with all original packaging, tags, labels and documentation intact.</li>
              <li>A <strong className="text-primary">10% handling and restocking fee</strong> applies to change-of-mind returns on non-defective goods, plus return courier costs.</li>
              <li>This fee does <strong>not</strong> apply to defective product returns, CPA §56 warranty claims, or CPA §20 direct-marketing cooling-off cancellations.</li>
              <li>Products that show signs of use, have been opened (for consumables), or are missing packaging will not be accepted for change-of-mind return.</li>
              <li>Refunds are processed within 10 business days of receiving the returned product in acceptable condition.</li>
            </ul>
            <p>
              See our full <Link href="/legal/shipping-returns" className="text-primary font-semibold hover:text-secondary transition-colors">Shipping & Returns Policy</Link> for complete details.
            </p>
          </Section>

          <Section id="warranty" title="8. Warranty Summary">
            <p>
              All LAVA vacuum sealing machines carry a 2-year factory warranty covering
              manufacturing defects in materials and workmanship. This warranty does not
              cover wear parts (sealing strips, foam seals) or damage caused by improper use.
            </p>
            <p>
              Full warranty terms are set out in our{" "}
              <Link href="/legal/terms#guarantee" className="text-primary font-semibold hover:text-secondary transition-colors">
                Terms & Conditions
              </Link>.
            </p>
          </Section>

          <Section id="limitation" title="9. Limitation of Liability">
            <p>
              Lava South Africa&apos;s liability is limited to the purchase price of the
              goods concerned. We are not liable for indirect or consequential losses arising
              from the use of our products or website. Nothing in these conditions limits
              liability for fraud or gross negligence.
            </p>
          </Section>

          <Section id="changes" title="10. Changes to These Conditions">
            <p>
              We may update these conditions at any time. The version in effect at the time
              of your purchase governs that transaction. Continued use of the website after
              an update constitutes acceptance of the revised conditions.
            </p>
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
        Questions? Contact{" "}
        <a href="mailto:info@lava-sa.co.za" className="text-primary font-semibold">info@lava-sa.co.za</a>
        {" "}or call{" "}
        <a href="tel:+27721605556" className="text-primary font-semibold">+27 72 160 5556</a>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          ["Terms & Conditions",  "/legal/terms"],
          ["Privacy Policy",      "/legal/privacy"],
          ["Shipping & Returns",  "/legal/shipping-returns"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="text-xs text-copy-muted hover:text-primary transition-colors underline">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
