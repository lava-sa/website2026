"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Calendar, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface HuntexBannerProps {
  /** Show as a full homepage section (default) or a slim dismissible top bar */
  variant?: "section" | "bar";
  className?: string;
}

/**
 * Huntex 2026 — Hall 4, Stand 465 — 24–27 April 2026
 * Gallagher Convention Centre, Midrand
 *
 * Design reference: Nadine's A4 ad (lava-sa-huntex-expo-2026-english-02.png)
 * Two variants:
 *   - "section"  → full homepage section (used between hero and products)
 *   - "bar"      → slim dismissible announcement bar at top of page
 */
// HuntEx runs 24–27 April 2026 at Gallagher Convention Centre
const HUNTEX_START = new Date("2026-04-24T00:00:00+02:00");
const HUNTEX_END   = new Date("2026-04-27T23:59:59+02:00");

function useDaysUntilHuntex() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const now = new Date();
    if (now > HUNTEX_END) { setDays(-1); return; }
    const ms = HUNTEX_START.getTime() - now.getTime();
    setDays(ms <= 0 ? 0 : Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, []);
  return days;
}

export default function HuntexBanner({
  variant = "section",
  className,
}: HuntexBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const daysUntil = useDaysUntilHuntex();

  // Hide banner after the event has ended
  if (dismissed || daysUntil === -1) return null;

  /* ── Slim top bar ─────────────────────────────────────────────────── */
  if (variant === "bar") {
    return (
      <div
        className={cn(
          "relative z-50 w-full bg-secondary py-2.5 px-4",
          className
        )}
      >
        <div className="section-container flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap text-sm font-semibold text-primary">
            {/* HuntEx springbok icon (inline SVG — matches Nadine's logo style) */}
            <HuntexIcon className="h-5 w-5 shrink-0" />
            <span>
              Visit us at{" "}
              <span className="font-black">HuntEx 2026</span>
              {" — "}
              <span className="font-black">Hall 4, Stand 465</span>
              {"  ·  "}
              24–27 April 2026
              {"  ·  "}
              Gallagher Convention Centre, Midrand
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="shrink-0 rounded p-1 text-primary/70 hover:text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ── Full homepage section ────────────────────────────────────────── */
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        className
      )}
      aria-label="Visit Lava at HuntEx 2026"
    >
      {/* ── Dark teal top band ──────────────────────────────────────── */}
      <div className="bg-primary px-4 py-10 sm:py-12">
        <div className="section-container">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">

            {/* Left — messaging */}
            <div className="flex-1">
              {/* Overline */}
              <p className="overline mb-3 text-secondary">
                Live event · April 2026
              </p>

              <h2 className="font-[family-name:var(--font-montserrat)] text-3xl font-black text-white sm:text-4xl leading-tight mb-4">
                Meet Us at{" "}
                <span className="text-secondary">HuntEx 2026</span>
              </h2>

              <p className="text-white/80 text-base leading-relaxed mb-6 max-w-lg">
                South Africa&apos;s premier hunting and outdoor show — and we&apos;ll be
                there in full force. Come handle the machines, see live demos,
                and take advantage of <strong className="text-white">show-only specials</strong> you
                won&apos;t find online.
              </p>

              {/* Detail pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  <Ticket className="h-4 w-4 text-secondary" />
                  Hall 4, Stand 465
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  <Calendar className="h-4 w-4 text-secondary" />
                  24–27 April 2026
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                  <MapPin className="h-4 w-4 text-secondary" />
                  Gallagher Convention Centre, Midrand
                </div>
              </div>
            </div>

            {/* Right — warranty badge + HuntEx logo block */}
            <div className="flex shrink-0 flex-col items-center gap-6 sm:flex-row lg:flex-col lg:items-end">
              {/* 2-year warranty badge */}
              <WarrantyBadge />

              {/* HuntEx branding */}
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Official exhibitor at
                </p>
                <div className="flex items-center gap-2">
                  <HuntexIcon className="h-8 w-8 text-secondary" />
                  <span className="font-[family-name:var(--font-montserrat)] text-3xl font-black italic text-white">
                    Hunt<span className="text-secondary">Ex</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Gold bottom band — product strip ────────────────────────── */}
      <div className="bg-secondary px-4 py-5">
        <div className="section-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-[family-name:var(--font-montserrat)] text-lg font-black text-primary">
              Top quality vacuum packaging machines
            </p>
            <p className="text-sm font-semibold text-primary/80">
              and meat processing equipment — made in Germany
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/products/vacuum-machines/"
              className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
            >
              Browse Machines
            </a>
            <a
              href="/contact/"
              className="inline-flex items-center justify-center rounded-[var(--radius)] border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
            >
              Contact Anneke
            </a>
          </div>
        </div>
      </div>

      {/* Dismiss button (top right corner) */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss Huntex banner"
        className="absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </section>
  );
}

/* ─── Warranty Badge ──────────────────────────────────────────────────── */
function WarrantyBadge() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      {/* Outer ring */}
      <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full">
        <circle
          cx="48" cy="48" r="44"
          fill="none"
          stroke="#b39e65"
          strokeWidth="3"
          strokeDasharray="6 3"
        />
      </svg>
      {/* Inner circle */}
      <div className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border-2 border-secondary bg-secondary">
        <span className="font-[family-name:var(--font-montserrat)] text-xl font-black leading-none text-primary">
          2
        </span>
        <span className="font-[family-name:var(--font-montserrat)] text-[9px] font-black uppercase tracking-wider text-primary">
          YEARS
        </span>
        <span className="font-[family-name:var(--font-montserrat)] text-[7px] font-bold uppercase tracking-wider text-primary">
          WARRANTY
        </span>
      </div>
      {/* Top arc label */}
      <svg viewBox="0 0 96 96" className="absolute inset-0 h-full w-full">
        <path
          id="top-arc"
          d="M 12,48 A 36,36 0 0,1 84,48"
          fill="none"
        />
        <text fontSize="8" fontWeight="bold" fill="#b39e65" letterSpacing="2">
          <textPath href="#top-arc" startOffset="10%">
            WARRANTY
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/* ─── HuntEx Springbok Icon (simplified SVG) ──────────────────────────── */
function HuntexIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Simplified springbok/deer silhouette */}
      <path d="M12 2c-.5 0-.9.2-1.2.5L9.5 4H8c-.6 0-1 .4-1 1v.5L5.5 7C5.2 7.3 5 7.7 5 8c0 .4.2.8.5 1L7 10.5V13l-2 4h2l1.5-3h7l1.5 3h2l-2-4v-2.5l1.5-1.5c.3-.2.5-.6.5-1 0-.3-.2-.7-.5-1L17 5.5V5c0-.6-.4-1-1-1h-1.5l-1.3-1.5C12.9 2.2 12.5 2 12 2zm0 2 .8 1H11.2L12 4zm-2 3h4v1.5L12 10 10 8.5V7z" />
    </svg>
  );
}
