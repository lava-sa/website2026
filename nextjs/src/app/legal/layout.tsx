import type { ReactNode } from "react";
import Link from "next/link";

const LEGAL_LINKS = [
  { label: "Terms & Conditions",  href: "/legal/terms" },
  { label: "Privacy Policy",      href: "/legal/privacy" },
  { label: "Conditions of Use",   href: "/legal/conditions" },
  { label: "Shipping & Returns",  href: "/legal/shipping-returns" },
];

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">

      {/* ── Sub-nav ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-border sticky top-[var(--header-h,112px)] z-10">
        <div className="section-container">
          <nav className="flex items-center gap-1 overflow-x-auto py-3">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 text-xs font-semibold px-3 py-1.5 border border-border text-copy-muted
                           hover:border-primary hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {children}
    </div>
  );
}
