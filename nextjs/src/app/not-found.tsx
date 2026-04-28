import Link from "next/link";
import { Home, Search, Phone, ArrowRight, Package } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-4">
        <div className="text-center max-w-xl">

          {/* 404 display */}
          <div className="relative mb-8 inline-block">
            <span className="text-[10rem] font-black text-primary/5 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Search className="h-12 w-12 text-secondary mx-auto mb-2" />
                <p className="text-sm font-bold uppercase tracking-widest text-primary">Page not found</p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-primary mb-4 leading-tight">
            Oops — this page<br />doesn&apos;t exist
          </h1>
          <p className="text-copy-muted text-base leading-relaxed mb-8 max-w-sm mx-auto">
            The page you&apos;re looking for may have moved or been removed.
            Let&apos;s get you back on track.
          </p>

          {/* Search */}
          <form
            action="/search"
            method="get"
            role="search"
            className="mb-8 flex items-center border border-border bg-white focus-within:border-primary transition-colors"
          >
            <label htmlFor="not-found-search" className="sr-only">
              Search Lava-SA
            </label>
            <Search className="h-4 w-4 text-secondary ml-4 shrink-0" aria-hidden="true" />
            <input
              id="not-found-search"
              type="search"
              name="q"
              placeholder="Search products, guides, FAQs…"
              className="flex-1 px-3 py-3 text-sm text-primary placeholder:text-copy-muted bg-transparent outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-5 py-3 hover:bg-secondary transition-colors"
            >
              Search
            </button>
          </form>

          {/* Popular products */}
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-secondary mb-3">
              Popular Products
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                ["/products/v300-premium-x", "V.300 Premium X"],
                ["/products/v100-premium-x", "V.100 Premium X"],
                ["/products/vacuum-bags", "Vacuum Bags"],
                ["/products/sous-vide", "Sous Vide"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="border border-border bg-white px-3 py-2 text-xs font-bold text-primary hover:border-primary transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>


          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <Link href="/"
              className="flex items-center justify-center gap-2 bg-white border border-border px-4 py-4 font-bold text-sm text-primary hover:border-primary hover:shadow-sm transition-all group">
              <Home className="h-4 w-4 text-secondary" />
              Home
            </Link>
            <Link href="/products/vacuum-machines"
              className="flex items-center justify-center gap-2 bg-white border border-border px-4 py-4 font-bold text-sm text-primary hover:border-primary hover:shadow-sm transition-all group">
              <Package className="h-4 w-4 text-secondary" />
              Machines
            </Link>
            <Link href="/contact"
              className="flex items-center justify-center gap-2 bg-white border border-border px-4 py-4 font-bold text-sm text-primary hover:border-primary hover:shadow-sm transition-all group">
              <Phone className="h-4 w-4 text-secondary" />
              Contact Us
            </Link>
          </div>

          {/* Primary CTA */}
          <Link href="/"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base">
            Back to Homepage <ArrowRight className="h-4 w-4" />
          </Link>

        </div>
      </div>

      {/* ── Help strip ───────────────────────────────────────────────── */}
      <div className="border-t border-border bg-white py-8">
        <div className="section-container max-w-2xl text-center">
          <p className="text-sm text-copy-muted mb-4">
            Can&apos;t find what you&apos;re looking for? Anneke and the team are happy to help.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-primary">
            <a href="tel:+27721605556" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <Phone className="h-4 w-4 text-secondary" />
              +27 72 160 5556
            </a>
            <a href="mailto:info@lava-sa.co.za" className="flex items-center gap-2 hover:text-secondary transition-colors">
              <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@lava-sa.co.za
            </a>
            <a href="https://wa.me/27721605556" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-secondary transition-colors">
              <svg className="h-4 w-4 text-[#075E54]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>

    </main>
  );
}
