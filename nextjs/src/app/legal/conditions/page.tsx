import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions of Use — Lava South Africa",
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
            Last updated: April 2026 · Lava Vide South Africa (Pty) Ltd
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
              <li>This website and all its content are the property of Lava Vide South Africa. You may not reproduce, redistribute or commercially exploit any content without prior written permission.</li>
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
            <p>
              If you receive a damaged, defective or incorrect product, you must notify us
              within <strong className="text-primary">5 business days</strong> of receiving
              your order. Contact us at:
            </p>
            <Table rows={[
              ["Email",   "anneke@lava-sa.co.za"],
              ["Phone",   "+27 (0)72 160 5556"],
              ["Hours",   "Monday – Friday, 09:00 – 17:00"],
            ]} />
            <p>
              Please have your order number and a description (or photograph) of the issue
              ready. We will respond within 1 business day with a resolution plan.
            </p>
          </Section>

          <Section id="defective" title="6. Defective Products">
            <ul>
              <li>Defective machines must be reported within 5 business days of receipt.</li>
              <li>Once a defect is confirmed, we will arrange courier collection at our cost.</li>
              <li>Replacement machines are dispatched prepaid once the returned unit has been assessed.</li>
              <li>Defects caused by misuse, unauthorised modification, or failure to follow operating instructions are not covered.</li>
            </ul>
          </Section>

          <Section id="returns" title="7. Returns — Non-Defective Products">
            <ul>
              <li>Returns of non-defective products require prior written authorisation from Lava South Africa.</li>
              <li>You must notify us within <strong className="text-primary">30 days</strong> of receiving the product.</li>
              <li>Returned products must be in original, unused condition with all original packaging, tags, labels and documentation intact.</li>
              <li>A <strong className="text-primary">10% handling and restocking fee</strong> applies, plus return courier costs.</li>
              <li>Products that show signs of use, have been opened (for consumables), or are missing packaging will not be accepted for return.</li>
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
        <a href="mailto:anneke@lava-sa.co.za" className="text-primary font-semibold">anneke@lava-sa.co.za</a>
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
