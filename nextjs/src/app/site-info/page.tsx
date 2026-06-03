import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Site Info — Lava-SA Website Overview",
  description:
    "Internal overview of the Lava-SA website rebuild — SEO health scores, launch checklist and technical details.",
  robots: { index: false, follow: false },
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const AUDIT_DATE = "28 May 2026";

const SEO_SCORES = [
  { label: "Overall SEO Health",         score: 69 },
  { label: "Technical SEO",              score: 70 },
  { label: "Schema / Structured Data",   score: 64 },
  { label: "Content Quality (E-E-A-T)",  score: 74 },
  { label: "On-Page SEO",                score: 61 },
  { label: "AI Search Readiness (GEO)",  score: 71 },
  { label: "Performance (CWV est.)",     score: 74 },
];

function barColor(score: number): string {
  if (score >= 70) return "bg-primary";
  if (score >= 60) return "bg-[hsl(44,37%,54%)]";
  return "bg-red-500";
}

function scoreTextColor(score: number): string {
  if (score >= 70) return "text-primary";
  if (score >= 60) return "text-[hsl(44,37%,44%)]";
  return "text-red-600";
}

// ── Launch Checklist ─────────────────────────────────────────────────────────

const CRITICAL = [
  "Submit site to Google Search Console + sitemap",
  "Rename GBP: La.va Vacuum Packaging → Lava South Africa (Nadine to promote lavasaonline@gmail.com to Owner first)",
  "DNS switch: lava-sa.co.za → Vercel (Tuesday 2 June 2026)",
];

const TODO = [
  "Run 4 Supabase SQL migrations (customers schema, order history schema, customers_import, order_history_import)",
  "Add YouTube channel URL to sameAs in layout.tsx + page.tsx (orgSchema)",
  "Remove fabricated AggregateRating fallback from product pages (policy violation risk)",
  "Set NEXT_PUBLIC_GBP_URL + NEXT_PUBLIC_GBP_PLACE_ID in Vercel env vars once GBP verified",
  "Test PayFast in sandbox mode before DNS cutover (NEXT_PUBLIC_PAYFAST_SANDBOX=true)",
  "Newsletter launch to 1,285 migrated customers (export CSV → Brevo)",
  "Fix homepage title tag (89 chars → 60 chars max)",
  'Fix blog page H1 ("Lava Blog" → keyword-containing heading)',
];

const DONE = [
  "Full Next.js 15 / App Router website built and deployed to Vercel",
  "robots.ts published with AI crawler permissions (GPTBot, ClaudeBot, PerplexityBot)",
  "sitemap.ts generating 45+ URLs dynamically (products + blog + static pages)",
  "llms.txt published for AI search crawlers with key facts and page index",
  "PayFast live mode configured — Merchant ID 11125471",
  "James AI assistant (Janet) implemented on all product pages",
  "Lava Points loyalty system: 1 pt per R5 spent · 1 pt = R0.05 cashback",
  "Sales funnel with 10% discount upsell (V.300 path, no header/footer)",
  "1,285 WordPress customers · 715 orders · R2,559,048 revenue — ready to migrate",
  "Admin panel: products, orders, customers, reviews, mailing list, Janet logs",
  "Multi-tier schema: LocalBusiness, Product, BlogPosting, FAQPage, BreadcrumbList, WebSite",
  "Cart, checkout (PayFast + EFT), order confirmation emails (Resend)",
  "EFT / Direct Bank Transfer details live at checkout + confirmation (Nedbank · LAVA VIDE SA (PTY) LTD)",
  "Sous vide product images live: LX 20 Sous Vide Stick + Sous Vide Set XXL",
  "Supabase product-images storage bucket live (thumbnails in cart + confirmation)",
  "orders.payment_method column added (tracks PayFast vs bank transfer)",
  "Account dashboard with Lava Points balance + order history",
  "308 permanent redirect from lava-sa.online → lava-sa.com (middleware)",
];

// ── What's Built ─────────────────────────────────────────────────────────────

const BUILT = [
  {
    title: "Products",
    items: [
      "Full V-series range: V.100 Premium X, V.300 Premium X, V.333 Chrome, V.400 Premium, V.500 Premium",
      "Bags & rolls (embossed + smooth), containers, glass jars, stainless, acrylic lids",
      "Sous vide: LX0020 stick (R4,240) + LX0033 set (R6,210) — images pending",
      "Butchery range: knives, boards, hanging rails, scales, machinery, protective gear",
      "Spare parts always in stock",
      "Product JSON-LD schema (ZAR price, availability, AggregateRating) on every product page",
      "Machine FAQ section on V-series pages (rich content: V.100 fully populated)",
    ],
  },
  {
    title: "Content Library",
    items: [
      "11 blog articles: game meat, biltong, fish, load shedding, buying guide 2026, family story, sustainability…",
      "6 application landing pages: hunters/game, fishing, biltong, butchery, catering, kitchen",
      "Vacuum Packaging guides: advantages, shelf life chart, dry aging, expert tips, bags guide",
      "Lava TV — video testimonials page",
      "Help centre: FAQ (20 Q&A), delivery, returns, warranty",
      "BlogPosting JSON-LD on all articles (datePublished, publisher logo, mainEntityOfPage)",
    ],
  },
  {
    title: "Shop & Customer Features",
    items: [
      "Full cart and checkout — PayFast (live) + EFT paths",
      "Lava Points loyalty: earn 1 pt per R5 · redeem at R0.05/pt (1% cashback)",
      "Sales funnel with 10% upsell discount (bags/rolls/accessories, no header/footer)",
      "Account dashboard: order history, Lava Points balance",
      "Submit a review page + admin moderation queue",
      "Mailing list with newsletter subscriber CSV export (Brevo-ready)",
      "Courier delivery: R190 excl. VAT (Gauteng) · R250 excl. VAT (other provinces) at checkout",
    ],
  },
  {
    title: "SEO & AI Search",
    items: [
      "LocalBusiness + Store schema: legal name, address, geo, phone, email, price range, parent org (la-va.com)",
      "FAQPage schema: 20 Q&A pairs on /help/faq — direct AI Overview feed",
      "llms.txt with full page index, product categories, key facts (price range, warranty, address)",
      "robots.ts: AI bots explicitly permitted by name (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)",
      "GBP pre-wired in code — NEXT_PUBLIC_GBP_URL + NEXT_PUBLIC_GBP_PLACE_ID env vars activate it",
      "Review request email: triggers 7–14 days post-delivery (wired, needs GBP Place ID)",
      "Dynamic OG images per product category (hunting, bags, containers, butchery, sous vide)",
    ],
  },
  {
    title: "Technical Platform",
    items: [
      "Next.js 15 App Router — SSR + ISR (1-hour revalidation on product pages)",
      "Vercel: automatic scaling, global edge CDN, preview deploys per branch",
      "Supabase (PostgreSQL): products, product_images, orders, order_items, reviews, customers",
      "Resend: order confirmation emails + review request emails",
      "PayFast: production mode, 308 redirect from lava-sa.online → lava-sa.com",
      "next/image AVIF + WebP auto-optimisation — zero render-blocking resources",
      "Tailwind CSS v4 — responsive, mobile-first, Kevin Geary colour engine",
    ],
  },
  {
    title: "Admin Panel",
    items: [
      "Product management: create, edit, drag-and-drop images, WebP auto-convert (Sharp), set primary",
      "Order management: status filter pills, search, sort by value/date, CSV export",
      "Customer CRM: 1,285 records, VIP / newsletter filters, spend + points + last-order sort",
      "Reviews: approve / reject / moderate, sourced from Supabase",
      "Mailing list: subscriber view, export newsletter list CSV",
      "Janet AI: chat log viewer + call log with duration and transcripts",
      "Import history: tracks every data migration run",
    ],
  },
];

// ── Key Pages ────────────────────────────────────────────────────────────────

const KEY_PAGES: [string, string][] = [
  ["Homepage",                   "/"],
  ["Vacuum Machines — Shop",     "/products/vacuum-machines"],
  ["V.300 Premium X",            "/products/v300-premium-x"],
  ["Bags & Rolls",               "/products/bags-rolls"],
  ["Sous Vide",                  "/products/sous-vide"],
  ["About Lava-SA",              "/about"],
  ["Blog",                       "/blog"],
  ["Applications — Hunter/Game", "/applications/hunter-game"],
  ["Applications — Biltong",     "/applications/biltong"],
  ["Applications — Fishing",     "/applications/angler-fishing"],
  ["Lava TV",                    "/lava-tv"],
  ["Rewards / Lava Points",      "/rewards"],
  ["Help / FAQ",                 "/help/faq"],
  ["Contact",                    "/contact"],
  ["Account Dashboard",          "/account/dashboard"],
  ["Admin Panel",                "/lava-sa/"],
];

// ── Technical Details ────────────────────────────────────────────────────────

const TECH: [string, string][] = [
  ["Platform",       "Next.js 15 (App Router)"],
  ["Database",       "Supabase (PostgreSQL)"],
  ["Email",          "Resend"],
  ["Payments",       "PayFast (live mode)"],
  ["AI Assistant",   "James / Janet (Google GenAI)"],
  ["Hosting",        "Vercel (cloud, global CDN)"],
  ["Primary Domain", "lava-sa.co.za (DNS switch 2 June 2026)"],
  ["Live on Vercel",  "lava-sa.com (DNS cutover to lava-sa.co.za on 2 June)"],
  ["Repository",     "GitHub (private)"],
  ["Design",         "Tailwind v4 · Montserrat + Outfit · Petrol #1B6B6B"],
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function SiteInfoPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-primary py-14">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-4">
            Website Information — {AUDIT_DATE}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            New website overview for<br />
            <span className="text-secondary">Anneke &amp; Wilco Uys</span>
          </h1>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://lava-sa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              lava-sa.com
            </a>
            <span className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 text-secondary text-xs font-semibold px-4 py-2">
              <Clock className="h-3.5 w-3.5" />
              DNS switch: Tuesday 2 June 2026
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SEO HEALTH SCORE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-border">
        <div className="section-container">

          <div className="mb-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
              SEO Health Score — Audit {AUDIT_DATE}
            </p>
            <h2 className="text-2xl font-bold text-primary mb-3">SEO Health Score</h2>
            <p className="text-sm text-copy-muted max-w-2xl leading-relaxed">
              Scores reflect the current build capabilities based on full codebase analysis (5 specialist
              audit agents). Full Google indexation takes 4–8 weeks after the DNS switch. The old
              lava-sa.co.za WordPress site is not yet noindexed — this switches automatically on cutover.
            </p>
          </div>

          <div className="space-y-5 max-w-2xl">
            {SEO_SCORES.map(({ label, score }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-copy">{label}</span>
                  <span className={`text-sm font-bold tabular-nums ${scoreTextColor(score)}`}>
                    {score} / 100
                  </span>
                </div>
                <div className="h-2.5 w-full bg-surface rounded-none overflow-hidden">
                  <div
                    className={`h-full ${barColor(score)} transition-all`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LAUNCH CHECKLIST
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-surface border-b border-border">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            Pre-Launch
          </p>
          <h2 className="text-2xl font-bold text-primary mb-10">Launch Checklist</h2>

          <div className="space-y-3">

            {/* CRITICAL — Do now */}
            {CRITICAL.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 border border-red-200 bg-red-50 px-5 py-4"
              >
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-sm text-red-800 flex-1 leading-relaxed">{item}</span>
                <span className="shrink-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1">
                  Do Now
                </span>
              </div>
            ))}

            {/* TO DO */}
            {TODO.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 border border-border bg-white px-5 py-4"
              >
                <Clock className="h-4 w-4 text-copy-muted shrink-0 mt-0.5" />
                <span className="text-sm text-copy leading-relaxed">{item}</span>
              </div>
            ))}

            {/* DONE */}
            {DONE.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 border border-green-200 bg-green-50 px-5 py-4"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm text-green-800 leading-relaxed">{item}</span>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHAT'S BUILT
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-border">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            Feature Inventory
          </p>
          <h2 className="text-2xl font-bold text-primary mb-10">What&apos;s Built Into the New Site</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BUILT.map(({ title, items }) => (
              <div key={title}>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-secondary mb-4 border-b border-border pb-2">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-copy leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          KEY PAGES TO REVIEW
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-surface border-b border-border">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            Testing Checklist
          </p>
          <h2 className="text-2xl font-bold text-primary mb-8">Key Pages to Review</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {KEY_PAGES.map(([label, href]) => (
              <a
                key={href}
                href={`https://lava-sa.com${href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 border border-border bg-white px-4 py-3 hover:border-primary hover:bg-white transition-all group"
              >
                <span className="text-sm text-copy group-hover:text-primary transition-colors font-medium">
                  {label}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-copy-muted shrink-0 group-hover:text-secondary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TECHNICAL DETAILS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            Stack
          </p>
          <h2 className="text-2xl font-bold text-primary mb-8">Technical Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-border bg-border max-w-3xl">
            {TECH.map(([key, val]) => (
              <div key={key} className="flex items-start gap-0 bg-white">
                <div className="w-40 shrink-0 bg-surface px-4 py-3.5 border-r border-border">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-copy-muted">
                    {key}
                  </span>
                </div>
                <div className="flex-1 px-4 py-3.5">
                  <span className="text-sm text-copy font-medium">{val}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs text-copy-muted">
            This page is not indexed by Google (robots: noindex). For internal use only.
            &nbsp;·&nbsp; Lava-SA — Bryanston, Johannesburg &nbsp;·&nbsp; info@lava-sa.com
          </p>
        </div>
      </section>

    </main>
  );
}
