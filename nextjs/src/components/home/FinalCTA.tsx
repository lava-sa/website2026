import Link from "next/link";
import { Phone } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="final-cta relative overflow-hidden bg-secondary py-24">

      {/* ── Decorative rings ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 border border-gold-light" />
      <div className="pointer-events-none absolute -left-12 -top-12 h-72 w-72 border border-gold-light" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 border border-gold-light" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 border border-gold-light" />

      <div className="final-cta__container relative section-container">
        <div className="final-cta__grid grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* ── Left: copy ─────────────────────────────────────────── */}
          <div className="final-cta__content">

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Ready to Preserve Like a Professional?
              </span>
            </div>

            <h2 className="final-cta__heading font-heading text-4xl font-bold leading-tight text-primary sm:text-5xl">
              Choose your machine.<br />
              <em className="not-italic text-white">Seal once.</em>
            </h2>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-petrol-800">
              Stop throwing food away.{" "}
              <strong className="font-semibold text-primary">Expert local support from Anneke</strong>{" "}
              — always on call. German quality, South African service.
            </p>

            {/* Action buttons */}
            <div className="final-cta__actions mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products/vacuum-machines"
                className="inline-flex items-center justify-center gap-2.5 bg-primary px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary-dark hover:-translate-y-0.5"
              >
                Shop All Machines
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="tel:+27721605556"
                className="inline-flex items-center justify-center gap-2.5 border border-primary px-8 py-4 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:-translate-y-0.5"
              >
                <Phone size={16} />
                Call Anneke
              </Link>
            </div>

            <p className="mt-6 text-xs text-petrol-800">
              ✓ Free shipping over R2,500 · 2-year machine warranty · Johannesburg-based
            </p>
          </div>

          {/* ── Right: contact card ────────────────────────────────── */}
          <div className="final-cta__card bg-white shadow-2xl">
            <div className="uk-card-body">
              <h3 className="final-cta__card-heading font-heading text-2xl font-bold text-primary m-0">
                Send us a message
              </h3>
              <p className="mt-1 text-sm text-copy-muted">
                We&apos;ll reply within 1 business day.
              </p>

              <form className="mt-7 space-y-4">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-copy">
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jan van der Berg"
                    className="w-full border border-border px-4 py-3 text-sm text-primary placeholder-on-dark-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-on-dark-muted"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-copy">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    className="w-full border border-border px-4 py-3 text-sm text-primary placeholder-on-dark-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-on-dark-muted"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-copy">
                    What can we help with?
                  </label>
                  <select className="w-full border border-border bg-white px-4 py-3 text-sm text-copy outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-on-dark-muted">
                    <option value="">Select a machine…</option>
                    <option>V.100 Premium X</option>
                    <option>V.300 Premium X</option>
                    <option>V.500</option>
                    <option>V.400 Premium</option>
                    <option>Vacuum Bags &amp; Accessories</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-copy">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you need and we'll get back to you..."
                    className="w-full border border-border px-4 py-3 text-sm text-primary placeholder-on-dark-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-on-dark-muted resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary py-4 text-[15px] font-semibold text-white transition-all hover:bg-primary-dark hover:-translate-y-0.5"
                >
                  Send Message →
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
