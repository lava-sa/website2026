import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Lava South Africa collects, uses and protects your personal information in accordance with POPIA (Protection of Personal Information Act).",
};

export default function PrivacyPage() {
  return (
    <main className="py-16">
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-primary">Privacy Policy</h1>
          <p className="mt-3 text-copy-muted text-sm">
            Last updated: April 2026 · Lava Vide South Africa (Pty) Ltd
          </p>
          <p className="mt-4 text-copy-muted">
            Lava South Africa is committed to protecting your personal information and
            your right to privacy. This policy explains what information we collect, why
            we collect it, and how we use it — in compliance with the{" "}
            <strong className="text-primary">Protection of Personal Information Act (POPIA)</strong>,
            Act 4 of 2013.
          </p>
        </div>

        <div className="prose-lava">

          <Section id="responsible-party" title="1. Responsible Party">
            <Table rows={[
              ["Organisation",  "Lava Vide South Africa (Pty) Ltd"],
              ["Address",       "5 Stirling Road, Bryanston, Sandton 2191"],
              ["Email",         "info@lava-sa.co.za"],
              ["Telephone",     "+27 (0)72 160 5556"],
              ["Website",       "lava-sa.co.za"],
            ]} />
          </Section>

          <Section id="what-we-collect" title="2. What Personal Information We Collect">
            <p>We collect only the information necessary to process your order and provide customer service:</p>
            <ul>
              <li><strong className="text-primary">Identity information:</strong> First name, last name</li>
              <li><strong className="text-primary">Contact information:</strong> Email address, telephone number, physical delivery address</li>
              <li><strong className="text-primary">Transaction information:</strong> Order history, products purchased, payment status (we do not store card numbers — all card processing is handled by PayFast)</li>
              <li><strong className="text-primary">Technical information:</strong> IP address, browser type, pages visited and time spent on site (collected via analytics tools — see Section 7)</li>
              <li><strong className="text-primary">Communication records:</strong> Emails, messages or enquiries sent to us</li>
            </ul>
            <p>We do <strong>not</strong> collect sensitive information such as race, religion, health data or biometric data.</p>
          </Section>

          <Section id="how-we-use" title="3. How We Use Your Information">
            <p>We use your personal information only for the following purposes:</p>
            <ul>
              <li>Processing and fulfilling your orders</li>
              <li>Communicating with you about your order, delivery or warranty claim</li>
              <li>Responding to enquiries or support requests</li>
              <li>Sending you transactional emails (order confirmation, dispatch notification)</li>
              <li>Sending occasional product updates or special offers — only if you have not opted out</li>
              <li>Improving our website and product offering through aggregated, anonymised analytics</li>
              <li>Complying with legal obligations</li>
            </ul>
            <p>We will never use your data in a way that is incompatible with the purpose for which it was collected.</p>
          </Section>

          <Section id="sharing" title="4. Who We Share Your Information With">
            <p>We do not sell, rent or trade your personal information. We share it only with trusted third parties strictly necessary to fulfil your order:</p>
            <ul>
              <li><strong className="text-primary">PayFast</strong> — payment processing (subject to PayFast&apos;s own privacy policy)</li>
              <li><strong className="text-primary">Courier partners</strong> — your name, address and phone number are shared with our courier service for delivery purposes</li>
              <li><strong className="text-primary">Email service providers</strong> — to send transactional emails</li>
            </ul>
            <p>
              All third-party service providers are required to handle your data securely
              and only for the specified purpose. We do not share your data with advertisers
              or unrelated third parties.
            </p>
          </Section>

          <Section id="security" title="5. How We Protect Your Information">
            <ul>
              <li>Our website uses <strong className="text-primary">TLS (HTTPS) encryption</strong> for all data transmitted between your browser and our servers.</li>
              <li>We do not store credit or debit card numbers on our systems. All card data is handled exclusively by PayFast, which is PCI-DSS compliant.</li>
              <li>Access to customer data is restricted to authorised personnel only.</li>
              <li>We regularly review our security practices to protect against unauthorised access, disclosure or destruction of personal information.</li>
            </ul>
          </Section>

          <Section id="retention" title="6. How Long We Keep Your Information">
            <p>
              We retain your personal information for as long as is necessary for the purpose
              for which it was collected, or as required by law. Specifically:
            </p>
            <ul>
              <li>Order and transaction records are retained for 5 years for tax and legal compliance purposes.</li>
              <li>Marketing preferences are retained until you unsubscribe or withdraw consent.</li>
              <li>Enquiry correspondence is retained for 2 years.</li>
              <li>Upon your request, we will delete personal information that we are not legally required to retain.</li>
            </ul>
          </Section>

          <Section id="analytics" title="7. Cookies and Analytics">
            <p>
              Our website uses cookies — small text files stored in your browser — to improve
              your experience. Cookies do not contain personally identifiable information.
            </p>
            <p>We may use analytics tools to understand how visitors use our site. This data is aggregated and anonymised. You can disable cookies in your browser settings, although this may affect some website functionality.</p>
          </Section>

          <Section id="your-rights" title="8. Your Rights Under POPIA">
            <p>You have the right to:</p>
            <ul>
              <li><strong className="text-primary">Access</strong> — request a copy of the personal information we hold about you</li>
              <li><strong className="text-primary">Correction</strong> — request correction of inaccurate or incomplete information</li>
              <li><strong className="text-primary">Deletion</strong> — request deletion of your personal information (subject to legal retention requirements)</li>
              <li><strong className="text-primary">Object</strong> — object to the processing of your personal information for direct marketing purposes</li>
              <li><strong className="text-primary">Withdraw consent</strong> — withdraw any consent previously given at any time</li>
              <li><strong className="text-primary">Complain</strong> — lodge a complaint with the Information Regulator of South Africa if you believe your rights have been violated</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:info@lava-sa.co.za" className="text-primary font-semibold hover:text-secondary transition-colors">
                info@lava-sa.co.za
              </a>.
              We will respond within 30 days.
            </p>
          </Section>

          <Section id="regulator" title="9. Information Regulator">
            <p>
              If you are not satisfied with our response to a privacy concern, you may contact
              the <strong className="text-primary">Information Regulator of South Africa</strong>:
            </p>
            <Table rows={[
              ["Website", "www.justice.gov.za/inforeg"],
              ["Email",   "inforeg@justice.gov.za"],
              ["Address", "JD House, 27 Stiemens Street, Braamfontein, Johannesburg 2001"],
            ]} />
          </Section>

          <Section id="updates" title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The current version will
              always be published on this page with the date of last revision. We encourage
              you to review this page periodically.
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
        Privacy questions? Contact{" "}
        <a href="mailto:info@lava-sa.co.za" className="text-primary font-semibold">info@lava-sa.co.za</a>
        {" "}or call{" "}
        <a href="tel:+27721605556" className="text-primary font-semibold">+27 72 160 5556</a>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          ["Terms & Conditions",  "/legal/terms"],
          ["Conditions of Use",   "/legal/conditions"],
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
