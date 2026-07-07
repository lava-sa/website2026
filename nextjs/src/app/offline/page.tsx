import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff, RefreshCw, Phone } from "lucide-react";
import { ANNEKE_PHONE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

/**
 * Offline fallback — shown by the service worker when a navigation fails with
 * no network. Kept intentionally light so it precaches cleanly.
 */
export default function OfflinePage() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center bg-surface">
      <div className="section-container text-center max-w-lg py-20">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 mb-6">
          <WifiOff className="h-8 w-8 text-primary" />
        </div>
        <p className="overline mb-2">No connection</p>
        <h1 className="text-3xl font-black text-primary mb-4">You&apos;re offline</h1>
        <p className="text-copy-muted leading-relaxed mb-8">
          We can&apos;t reach lava-sa.com right now. Check your connection and try
          again — pages you&apos;ve already visited may still open.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-3 hover:bg-primary-dark transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Try the homepage
          </Link>
          <a
            href={`tel:${ANNEKE_PHONE.tel}`}
            className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold px-8 py-3 hover:bg-primary hover:text-white transition-colors"
          >
            <Phone className="h-4 w-4" /> Call {ANNEKE_PHONE.label}
          </a>
        </div>
      </div>
    </section>
  );
}
