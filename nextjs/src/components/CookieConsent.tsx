"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { X, Cookie, ChevronDown, ChevronUp, ShieldCheck, BarChart2 } from "lucide-react";
import { getConsent, saveConsent, type ConsentChoice } from "@/lib/cookie-consent";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type View = "banner" | "settings";

// ─────────────────────────────────────────────────────────────────────────────
// Category toggle row
// ─────────────────────────────────────────────────────────────────────────────
function CategoryRow({
  icon: Icon,
  title,
  description,
  always,
  value,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  always?: boolean;
  value?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary leading-none">{title}</p>
        </div>

        {/* Expand description */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? `Collapse ${title} details` : `Expand ${title} details`}
          className="p-1 text-copy-muted hover:text-primary transition-colors"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {/* Toggle or "Always On" badge */}
        {always ? (
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 shrink-0">
            Always on
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange?.(!value)}
            className={`relative shrink-0 h-6 w-11 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              value ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${
                value ? "translate-x-5" : "translate-x-0"
              }`}
            />
            <span className="sr-only">{value ? "Enabled" : "Disabled"}</span>
          </button>
        )}
      </div>

      {open && (
        <div className="px-4 pb-4 pt-0 bg-surface">
          <p className="text-xs text-copy-muted leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("banner");
  const [analytics, setAnalytics] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Show only when no stored consent exists
  useEffect(() => {
    if (!getConsent()) {
      // Small delay so the page renders first — feels less aggressive
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Trap focus inside the settings dialog when open
  useEffect(() => {
    if (view !== "settings" || !visible) return;
    const el = dialogRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setView("banner"); };
    document.addEventListener("keydown", trap);
    document.addEventListener("keydown", esc);
    first?.focus();
    return () => {
      document.removeEventListener("keydown", trap);
      document.removeEventListener("keydown", esc);
    };
  }, [view, visible]);

  const acceptAll = useCallback(() => {
    saveConsent("granted");
    setVisible(false);
  }, []);

  const essentialOnly = useCallback(() => {
    saveConsent("denied");
    setVisible(false);
  }, []);

  const savePreferences = useCallback(() => {
    saveConsent(analytics ? "granted" : "denied");
    setVisible(false);
  }, [analytics]);

  if (!visible) return null;

  // ── Settings panel ──────────────────────────────────────────────────────────
  if (view === "settings") {
    return (
      <div
        className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
      >
        <div
          ref={dialogRef}
          className="bg-white w-full max-w-lg shadow-2xl border border-border mx-4 mb-4 sm:mb-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <Cookie className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <h2 id="cookie-settings-title" className="text-base font-bold text-primary">
                Cookie Preferences
              </h2>
            </div>
            <button
              onClick={() => setView("banner")}
              aria-label="Close cookie settings"
              className="p-1.5 text-copy-muted hover:text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-copy-muted leading-relaxed">
              We use cookies to keep your session active and, with your permission, to understand
              how visitors use our site. See our{" "}
              <Link
                href="/legal/privacy"
                className="text-primary font-semibold underline hover:text-secondary transition-colors"
                onClick={() => setVisible(false)}
              >
                Privacy Policy
              </Link>{" "}
              for full details (Section 7).
            </p>

            <CategoryRow
              icon={ShieldCheck}
              title="Essential cookies"
              always
              description="Required for the website to function. Includes your shopping cart, secure checkout session, and login state. These cannot be disabled."
            />
            <CategoryRow
              icon={BarChart2}
              title="Analytics cookies"
              value={analytics}
              onChange={setAnalytics}
              description="Helps us understand which pages are visited and how customers navigate the site. Data is aggregated and anonymised — no personal information is stored. We use this to improve your experience."
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-t border-border bg-surface">
            <button
              onClick={savePreferences}
              className="flex-1 bg-primary text-white text-sm font-semibold py-3 px-5 hover:bg-primary-dark transition-colors"
            >
              Save my preferences
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 border border-primary text-primary text-sm font-semibold py-3 px-5 hover:bg-primary/5 transition-colors"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Banner ──────────────────────────────────────────────────────────────────
  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 z-[400] w-[calc(100vw-2rem)] max-w-sm bg-white border border-border shadow-2xl"
    >
      {/* Top accent */}
      <div className="h-0.5 bg-primary" />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Cookie className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-bold text-primary leading-none mb-1">
              We use cookies
            </p>
            <p className="text-xs text-copy-muted leading-relaxed">
              Essential cookies keep your cart and session active. We&apos;d also like to use
              anonymised analytics to improve the site.{" "}
              <Link
                href="/legal/privacy#analytics"
                className="text-primary underline hover:text-secondary transition-colors"
                onClick={() => setVisible(false)}
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={acceptAll}
            className="w-full bg-primary text-white text-sm font-semibold py-2.5 px-4 hover:bg-primary-dark transition-colors"
          >
            Accept all cookies
          </button>
          <div className="flex gap-2">
            <button
              onClick={essentialOnly}
              className="flex-1 border border-border text-copy text-xs font-semibold py-2 px-3 hover:border-primary hover:text-primary transition-colors"
            >
              Essential only
            </button>
            <button
              onClick={() => setView("settings")}
              className="flex-1 border border-border text-copy text-xs font-semibold py-2 px-3 hover:border-primary hover:text-primary transition-colors"
            >
              Manage preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
