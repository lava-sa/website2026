import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ShoppingCart,
  UserCircle,
  Star,
  BookOpen,
  MessageCircle,
  Settings,
} from "lucide-react";

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
const QA_DATE = "30 June 2026";
const LAST_UPDATED = "7 July 2026";
const GO_LIVE_TARGET = "Pending follow-up meeting (post 7 July 2026)";

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

// ── Pre-Launch QA (stress test) ──────────────────────────────────────────────

type QaStatus = "PASS" | "FAIL" | "PENDING";

const QA_RESULTS: { status: QaStatus; label: string; detail: string }[] = [
  {
    status: "PASS",
    label: "E-commerce checkout — 8 test orders (production)",
    detail:
      "ORD-6137 → ORD-6144 placed via Direct Bank Transfer only (PENDING, no money moved). Products: Flex Sealer, containers, V.100 Premium X, V.300 Premium X, V.300 Black. Customer + business emails verified via IMAP (info@ + itools247 test inboxes).",
  },
  {
    status: "PASS",
    label: "Order confirmation emails",
    detail:
      "Resend delivers customer copy + admin copy (info@lava-sa.com) for every test order. EFT bank details and order reference included.",
  },
  {
    status: "PASS",
    label: "Checkout safety guard",
    detail:
      "Stress-test protocol enforces Direct Bank Transfer only — no PayFast/card path used during QA. PayFast remains available for real customers.",
  },
  {
    status: "PASS",
    label: "EFT success page",
    detail: "Bank details, order reference, and next-steps shown at /checkout/success?method=eft.",
  },
  {
    status: "PASS",
    label: "Customer accounts + order tracking (magic link)",
    detail:
      "Checkout auto-creates member account. Order email includes one-click magic link → /account/orders/[orderNumber]. No password in email. Deploy pending for live verification.",
  },
  {
    status: "PASS",
    label: "Cloudflare Turnstile (production)",
    detail:
      "Active on contact page, mailing list, written reviews. Keys set in Vercel only — localhost skips captcha by design when keys unset.",
  },
  {
    status: "PENDING",
    label: "Contact form — production end-to-end",
    detail:
      "Localhost API returned 500 (Resend env not configured locally). Same code path as orders (which work on Vercel). Needs one manual submit on lava-sa.com with Turnstile before go-live.",
  },
  {
    status: "PENDING",
    label: "Homepage footer contact form",
    detail:
      "Wired to /api/contact with compact Turnstile + submit (30 June fix). Deploy + one live test required.",
  },
  {
    status: "PENDING",
    label: "Mailing list signup",
    detail:
      "API validates input correctly on localhost. Confirm new subscriber appears in admin after one live signup.",
  },
  {
    status: "PENDING",
    label: "Google reviews / GBP integration",
    detail:
      "Deferred until after public launch. Post-delivery review-request emails wired but need NEXT_PUBLIC_GBP_PLACE_ID. Google Search Console + GBP promotion planned immediately after go-live.",
  },
  {
    status: "PENDING",
    label: "Courier tracking on customer order page",
    detail:
      "Order timeline shows placed → paid → preparing → shipped → delivered. Tracking number field is placeholder only — not wired to courier API yet.",
  },
];

const QA_CLEANUP = [
  "Anneke: reverse 8 test orders ORD-6137 → ORD-6144 (notes say TEST ORDER — do NOT fulfil)",
  "Run supabase/027_points_launch_july_2026.sql if not done (zero retroactive points before 1 July 2026)",
  "Deploy pending local fixes: magic-link accounts, footer form, member modal layout, PDP table widths, What's in the box, site-info update",
  "Decommission / lock down old WordPress lava-sa.co.za (still emitting bot noise)",
];

function qaStatusStyle(status: QaStatus): { border: string; bg: string; text: string; badge: string } {
  if (status === "PASS")
    return {
      border: "border-green-200",
      bg: "bg-green-50",
      text: "text-green-800",
      badge: "bg-green-600 text-white",
    };
  if (status === "FAIL")
    return {
      border: "border-red-200",
      bg: "bg-red-50",
      text: "text-red-800",
      badge: "bg-red-500 text-white",
    };
  return {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-900",
    badge: "bg-amber-600 text-white",
  };
}

function meetingStatusStyle(status: string): { border: string; bg: string; text: string; badge: string; label: string } {
  switch (status) {
    case "DONE":
      return { border: "border-green-200", bg: "bg-green-50", text: "text-green-800", badge: "bg-green-600 text-white", label: "Done" };
    case "OPEN":
      return { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-900", badge: "bg-amber-600 text-white", label: "Open" };
    case "ANNEKE":
      return { border: "border-sky-200", bg: "bg-sky-50", text: "text-sky-900", badge: "bg-sky-600 text-white", label: "Anneke" };
    default:
      return { border: "border-border", bg: "bg-white", text: "text-copy", badge: "bg-copy-muted text-white", label: "Later" };
  }
}

// ── 30 June Meeting — Action Item Status ─────────────────────────────────────
// Status reflects a 7 July 2026 code review of the current codebase.

type MeetingStatus = "DONE" | "OPEN" | "ANNEKE" | "DEFERRED";

const MEETING_GROUPS: {
  group: string;
  items: { ref: string; task: string; status: MeetingStatus; note: string }[];
}[] = [
  {
    group: "Product review system",
    items: [
      { ref: "R1", task: "Rejected reviews fully removed (not left pending/visible)", status: "DONE", note: "Admin DELETE permanently removes the review row and any attached video file from storage." },
      { ref: "R2", task: "Map each review to the specific product / machine", status: "DONE", note: "Submissions save product_slug, machine and review_scope — no longer a general-only repository." },
      { ref: "R3", task: "General review form requires selecting the machine/equipment", status: "DONE", note: "Required product selector on the review form; rating + product both validated before submit." },
      { ref: "R4", task: "Gold “Write your review” button in header after Lava TV", status: "DONE", note: "Gold outlined button sits directly after the Lava TV link in the top navigation." },
      { ref: "R5", task: "Review entry point on all relevant product pages", status: "DONE", note: "Every PDP shows a reviews section or a “Be the first to review” call-to-action linking to the correct category form." },
      { ref: "R6", task: "Email notification on new review submission", status: "DONE", note: "Notifies anneke@lava-sa.co.za + reviews@lava-sa.com (plus admin inbox) on every written and video review." },
      { ref: "R7", task: "Investigate missing George Archer review", status: "OPEN", note: "Data investigation — needs a lookup in submissions/imports; not a code fix." },
      { ref: "R8", task: "End-to-end review verification (correct product/department)", status: "OPEN", note: "Final QA pass to run on production after the next deploy." },
    ],
  },
  {
    group: "E-commerce & cart",
    items: [
      { ref: "E1", task: "Funnel 10% discount removed when qualifying machine leaves cart", status: "DONE", note: "Cart reconciles funnel discounts on every remove; discount also re-verified server-side at checkout." },
      { ref: "E2", task: "Default payment to PayFast (EFT still available)", status: "DONE", note: "Checkout defaults to PayFast; Direct Bank Transfer (EFT) remains selectable." },
    ],
  },
  {
    group: "Navigation, catalog & content",
    items: [
      { ref: "N1", task: "Remove “Bundle deals” — keep only “Special offers”", status: "DONE", note: "No Bundle deals entry remains; Special Offers is the single promo category (highlighted gold)." },
      { ref: "N2", task: "Move scale product from Hanging systems to Scales", status: "DONE", note: "Scales page lists scale-tagged products; scale no longer under hanging systems." },
      { ref: "N3", task: "Rename nav “Vacuum packaging” → “Vacuum packing”", status: "OPEN", note: "Not changed — meeting flagged “confirm if still required”. Awaiting your go-ahead; quick change if wanted." },
      { ref: "N4", task: "Remove “Price, shipping & returns” button", status: "DONE", note: "That nav button no longer exists; delivery info now surfaced via checkout “rates & times” link and Help centre." },
      { ref: "N5", task: "New professional photos for vacuum lid products", status: "ANNEKE", note: "Awaiting new photography from Anneke (4L stainless discontinued; focus on lids)." },
      { ref: "N6", task: "Identify out-of-stock container sizes + show stock status", status: "ANNEKE", note: "Needs stock list from Anneke; stock status field is ready to display / Storevac fallback." },
    ],
  },
  {
    group: "Policies, legal & security",
    items: [
      { ref: "P1", task: "Update shipping policy (times; remove farm option + R350 surcharge)", status: "DONE", note: "Conservative estimates (Gauteng 3–5, centres/secondary 5–7, outlying 7–10). Farm row removed; no surcharge existed. Synced across delivery, shipping-returns, FAQ, terms + live checkout estimate." },
      { ref: "P2", task: "Final review of legal/policy documents (warranty, cooling-off, terms)", status: "ANNEKE", note: "Anneke to print, mark up and return changes." },
      { ref: "P3", task: "Email verification on all forms (reduce spam)", status: "DONE", note: "Syntax heuristics + live MX/domain check on contact, mailing list, member signup & password reset. Reviews additionally require an existing-customer email. Turnstile still active." },
    ],
  },
  {
    group: "Parallel projects (GSI & Storevac)",
    items: [
      { ref: "F1", task: "GSI website — clean up headings and images", status: "DEFERRED", note: "Separate project — after Lava launch." },
      { ref: "F2", task: "Storevac integration + out-of-stock redirect", status: "DEFERRED", note: "Awaiting Storevac logo + product details from Anneke." },
      { ref: "F3", task: "Submit cost estimate for Lava & GSI websites", status: "DEFERRED", note: "Ignatius — after launch checklist." },
      { ref: "F4", task: "Contact Bruce re: website updates", status: "ANNEKE", note: "Anneke follow-up." },
    ],
  },
];

// ── Recent changes shipped since the meeting (July) ──────────────────────────

const JULY_CHANGES = [
  "Checkout price integrity — all cart prices & stock re-validated server-side against the database before an order is created (blocks tampered totals).",
  "Removed fabricated star ratings/testimonials from product pages without genuine reviews (Google policy + trust); real reviews or a clean “Be the first to review” state only.",
  "Admin login hardened — forgeable static cookie replaced with an HMAC-signed, expiring session token.",
  "Reviews restricted to existing customers — the submitter’s email must exist in customers/orders, else they’re guided to sign in.",
  "Stronger spam-email filtering — keyboard-mash / gibberish / provider-typo detection + live MX (mail server) check across all public forms.",
  "Delivery times updated everywhere + live province-based estimate and “rates & times” link shown on checkout.",
  "Checkout usability — order summary sticky on desktop, always-visible pay bar on mobile, clearer “Pay … with PayFast or EFT” wording.",
  "Vacuum-machine pages now repeat gallery images 01–04 through the benefit sections (no more repeated primary image).",
  "Installable app (PWA) — Chrome/Edge install banner, offline page, home-screen icon, app manifest with shortcuts.",
];

// ── What the Website Does (plain-language feature map for Anneke) ─────────────

const FEATURE_MAP: { icon: typeof ShoppingCart; title: string; items: string[] }[] = [
  {
    icon: ShoppingCart,
    title: "Shopping & Checkout",
    items: [
      "Browse the full product range with photos, specs and prices",
      "Add to cart — bundle discount added (and removed) automatically",
      "Pay securely by card (PayFast) or EFT / bank transfer",
      "Instant order confirmation email with the order number",
    ],
  },
  {
    icon: UserCircle,
    title: "Customer Accounts & Rewards",
    items: [
      "An account is created automatically when someone orders",
      "Customers track their order with a one-click link — no password",
      "Lava Points loyalty rewards on full-price purchases",
      "Order history and profile in a simple dashboard",
    ],
  },
  {
    icon: Star,
    title: "Reviews & Trust",
    items: [
      "Customers write reviews for the exact product they bought",
      "Only real customers can leave a review (cuts fake reviews)",
      "You get an email alert for every new review",
      "Approve or fully remove reviews from your admin panel",
    ],
  },
  {
    icon: BookOpen,
    title: "Content & Marketing",
    items: [
      "Blog, guides and application pages (hunting, biltong, fishing…)",
      "Lava TV video testimonials",
      "Newsletter sign-up for your mailing list",
      "Built for Google & AI search so new customers find you",
    ],
  },
  {
    icon: MessageCircle,
    title: "Help & Support",
    items: [
      "Janet — the friendly on-page assistant answers questions",
      "Contact form with spam protection",
      "FAQ, delivery, returns and warranty pages",
      "WhatsApp and phone go straight to Anneke",
    ],
  },
  {
    icon: Settings,
    title: "Your Admin Panel",
    items: [
      "Manage products, images and prices yourself",
      "See and process every order in one place",
      "Customer list with spend, points and history",
      "Secure login with spam and bot protection",
    ],
  },
];

// ── Understand Anything (codebase knowledge-graph tool) ──────────────────────

const UNDERSTAND_ANYTHING_STEPS = [
  "In Cursor / Claude Code, add the marketplace:  /plugin marketplace add Egonex-AI/Understand-Anything",
  "Install the plugin:  /plugin install understand-anything",
  "From the project root run:  /understand  — a multi-agent pipeline scans every file, function and dependency.",
  "The knowledge graph is saved to  .understand-anything/knowledge-graph.json  (commit it so the team skips re-running).",
  "Run  /understand-dashboard  to open the interactive, clickable architecture map in your browser.",
];

// ── Launch Checklist ─────────────────────────────────────────────────────────

const CRITICAL = [
  "Deploy latest build to production (account tracking, footer form, UI fixes) — target go-live 1 July 2026",
  "One manual contact form submit on lava-sa.com (pass Turnstile) — confirm email at info@lava-sa.com",
  "Reverse test orders ORD-6137 → ORD-6144 in admin before real orders mix in",
  "Submit site to Google Search Console + sitemap after DNS / go-live",
  "Google Business Profile: verify + set NEXT_PUBLIC_GBP_PLACE_ID for post-delivery review emails",
];

const TODO = [
  "Run 027_points_launch_july_2026.sql in Supabase if not already applied",
  "Confirm mailing list signup on live site → check admin subscriber list",
  "Remove fabricated AggregateRating fallback from product pages if still present (Google policy risk)",
  "Rename GBP: La.va Vacuum Packaging → Lava South Africa (Nadine to promote lavasaonline@gmail.com to Owner)",
  "Newsletter launch to migrated customers (export CSV → Brevo) — post go-live",
  "Wire courier tracking number when Anneke has carrier workflow (order page placeholder ready)",
  "Decommission old WordPress lava-sa.co.za",
];

const DONE = [
  "Full Next.js 15 / App Router website live on lava-sa.com (Vercel)",
  "robots.ts + sitemap.ts + llms.txt published",
  "PayFast live mode configured — Merchant ID 11125471",
  "Cart, checkout (PayFast + EFT), order confirmation emails (Resend)",
  "EFT / Direct Bank Transfer — Nedbank · LAVA VIDE SA (PTY) LTD · reference = order number",
  "Pre-launch stress test: 8 EFT orders on production — emails verified (30 June 2026)",
  "Magic-link customer accounts on checkout + /account/orders/[orderNumber] tracking page",
  "Cloudflare Turnstile on contact, reviews, mailing list (production)",
  "Homepage footer contact form wired with Turnstile (compact layout, 30 June 2026)",
  "Member gate modal — desktop side-by-side layout, scroll-safe (30 June 2026)",
  "PDP table widths fixed — specs + bags/rolls compatibility (global CSS + template, 30 June 2026)",
  "What's in the box — complimentary bags/rolls removed from all machines",
  "Review form OG images for WhatsApp (/submit-review, bags-rolls, containers)",
  "Lava Points: earn only from 1 July 2026 · full-price items only (no sale/clearance)",
  "Janet voice agent: PDP context, add-to-cart, admin chat logs, sales script",
  "Lava Points dashboard, admin panel, 1,285 migrated customers + order history",
  "308 redirect lava-sa.online → lava-sa.com",
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
      "Customer auto-account on order + magic-link email to track order (no password in email)",
      "Account dashboard + per-order page /account/orders/[orderNumber] with status timeline",
      "Lava Points loyalty: earn from 1 July 2026 · full-price items only · 1 pt per R5",
      "Sales funnel with 10% upsell discount (bags/rolls/accessories, no header/footer)",
      "Submit a review page + admin moderation + category-specific OG images for WhatsApp",
      "Mailing list with Turnstile + admin subscriber export",
      "Courier delivery at checkout — tracking number on order page: placeholder (post-launch)",
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
      "Review request email: triggers post-delivery (wired — needs GBP Place ID after launch)",
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
  ["Account Profile",            "/account/profile"],
  ["Site Info (this page)",    "/site-info"],
  ["Admin Panel",                "/admin"],
];

// ── Technical Details ────────────────────────────────────────────────────────

const TECH: [string, string][] = [
  ["Platform",       "Next.js 15 (App Router)"],
  ["Database",       "Supabase (PostgreSQL)"],
  ["Email",          "Resend"],
  ["Payments",       "PayFast (live mode)"],
  ["AI Assistant",   "James / Janet (Google GenAI)"],
  ["Hosting",        "Vercel (cloud, global CDN)"],
  ["Primary Domain", "lava-sa.com (lava-sa.co.za DNS when ready)"],
  ["Go-live target",  `${GO_LIVE_TARGET} (pending deploy + final checks)`],
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
            Website Information — updated {LAST_UPDATED}
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Pre-launch status for<br />
            <span className="text-secondary">Anneke &amp; Wilco Uys</span>
          </h1>
          <p className="text-white/80 text-sm max-w-2xl leading-relaxed mb-6">
            Internal summary for the go-live meeting, including the status of every 30 June action item and the
            changes shipped since. Launch: <strong className="text-white">{GO_LIVE_TARGET}</strong>.
            Google Search Console, GBP, and post-purchase Google review requests are planned immediately after launch.
          </p>
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
              <CheckCircle2 className="h-3.5 w-3.5" />
              8/8 test orders PASS (EFT)
            </span>
            <span className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-100 text-xs font-semibold px-4 py-2">
              <Clock className="h-3.5 w-3.5" />
              Contact form: verify on live site
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PRE-LAUNCH QA — STRESS TEST
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-surface border-b border-border">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            Stress Test — {QA_DATE}
          </p>
          <h2 className="text-2xl font-bold text-primary mb-3">Pre-Launch QA Results</h2>
          <p className="text-sm text-copy-muted max-w-3xl leading-relaxed mb-10">
            Full checkout run on <strong>production</strong> (Direct Bank Transfer only — no money moved).
            Forms tested on <strong>localhost</strong> where Turnstile is off by design; production forms need one manual pass each before go-live.
          </p>

          <div className="space-y-3 mb-12">
            {QA_RESULTS.map(({ status, label, detail }) => {
              const s = qaStatusStyle(status);
              return (
                <div
                  key={label}
                  className={`flex items-start gap-4 border px-5 py-4 ${s.border} ${s.bg}`}
                >
                  {status === "PASS" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  ) : status === "FAIL" ? (
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${s.text} mb-1`}>{label}</p>
                    <p className={`text-sm ${s.text} opacity-90 leading-relaxed`}>{detail}</p>
                  </div>
                  <span
                    className={`shrink-0 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 ${s.badge}`}
                  >
                    {status}
                  </span>
                </div>
              );
            })}
          </div>

          <h3 className="text-lg font-bold text-primary mb-4">Cleanup before / after go-live</h3>
          <ul className="space-y-2 max-w-3xl">
            {QA_CLEANUP.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-copy leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          30 JUNE MEETING — ACTION ITEM STATUS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-border">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            Meeting Follow-up — reviewed {LAST_UPDATED}
          </p>
          <h2 className="text-2xl font-bold text-primary mb-3">30 June Meeting — Action Item Status</h2>
          <p className="text-sm text-copy-muted max-w-3xl leading-relaxed mb-10">
            Every action item from the 30 June 2026 GSI meeting, checked against the current codebase.
            <span className="font-semibold text-green-700"> Done</span> = shipped in code (deploy to see live),
            <span className="font-semibold text-amber-700"> Open</span> = still to do,
            <span className="font-semibold text-sky-700"> Anneke</span> = waiting on content/decision from Anneke.
          </p>

          <div className="space-y-8">
            {MEETING_GROUPS.map(({ group, items }) => (
              <div key={group}>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-secondary mb-4 border-b border-border pb-2">
                  {group}
                </h3>
                <div className="space-y-2.5">
                  {items.map(({ ref, task, status, note }) => {
                    const s = meetingStatusStyle(status);
                    return (
                      <div key={ref} className={`flex items-start gap-4 border px-5 py-3.5 ${s.border} ${s.bg}`}>
                        <span className="shrink-0 text-[10px] font-black text-copy-muted w-6 pt-0.5">{ref}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${s.text} mb-0.5`}>{task}</p>
                          <p className={`text-sm ${s.text} opacity-90 leading-relaxed`}>{note}</p>
                        </div>
                        <span className={`shrink-0 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 ${s.badge}`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          RECENT CHANGES (JULY)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-surface border-b border-border">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            Changelog — since the meeting
          </p>
          <h2 className="text-2xl font-bold text-primary mb-3">Recent Changes Implemented (July)</h2>
          <p className="text-sm text-copy-muted max-w-3xl leading-relaxed mb-10">
            Improvements shipped after the 30 June meeting — security, trust, delivery clarity, checkout usability
            and a new installable app. Pending final deploy for live verification.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {JULY_CHANGES.map((item) => (
              <div key={item} className="flex items-start gap-3 border border-green-200 bg-green-50 px-5 py-4">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm text-green-800 leading-relaxed">{item}</span>
              </div>
            ))}
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
              Baseline from codebase audit {AUDIT_DATE}. Scores are directional — refresh after go-live
              once Google Search Console and live CWV data are available. Google reviews / GBP integration
              planned post-launch ({GO_LIVE_TARGET}).
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
          WHAT THE WEBSITE DOES — SIMPLE FEATURE MAP
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-surface border-b border-border">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-copy-muted mb-2">
            The website at a glance
          </p>
          <h2 className="text-2xl font-bold text-primary mb-3">What the Website Does</h2>
          <p className="text-sm text-copy-muted max-w-3xl leading-relaxed mb-10">
            A simple, plain-language overview of everything the site does — for your customers and for you.
            No technical jargon, just the features and how they help the business.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_MAP.map(({ icon: Icon, title, items }) => (
              <div key={title} className="border border-border bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center justify-center h-10 w-10 bg-primary/10 shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="text-base font-bold text-primary leading-tight">{title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-copy leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
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
          UNDERSTAND ANYTHING — CODEBASE KNOWLEDGE GRAPH
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-primary">
        <div className="section-container">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-2">
            Interactive Architecture Map
          </p>
          <h2 className="text-2xl font-bold text-white mb-3">
            &ldquo;Understand Anything&rdquo; — see the whole site as a diagram
          </h2>
          <p className="text-sm text-white/80 max-w-3xl leading-relaxed mb-4">
            An open-source (MIT) tool that scans the codebase and turns it into an interactive knowledge
            graph — every page, feature, database table and dependency becomes a clickable node with a
            plain-English explanation. It runs as a plugin inside the AI coding tools (Cursor, Claude Code, etc.).
          </p>
          <p className="text-sm text-white/80 max-w-3xl leading-relaxed mb-8">
            It offers <strong className="text-white">two views</strong>, so it&apos;s not only code-related — also
            structure-related: a <strong className="text-white">structural graph</strong> (files, functions,
            classes, dependencies, colour-coded by architectural layer) and a{" "}
            <strong className="text-white">business/domain view</strong> (real domains, flows and process steps —
            e.g. the checkout and review pipelines). The plain-language summary above is the simple version;
            this tool produces the full technical, interactive one.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* How to install */}
            <div className="bg-white/5 border border-white/15 p-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-secondary mb-4">
                How to install &amp; run
              </h3>
              <ol className="space-y-3">
                {UNDERSTAND_ANYTHING_STEPS.map((step, i) => (
                  <li key={step} className="flex items-start gap-3 text-sm text-white/90 leading-relaxed">
                    <span className="shrink-0 h-5 w-5 rounded-full bg-secondary text-primary text-[11px] font-black flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Where to find it */}
            <div className="bg-white/5 border border-white/15 p-6">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-secondary mb-4">
                Where to find it
              </h3>
              <ul className="space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <a href="https://understand-anything.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-secondary">
                    understand-anything.com
                  </a>
                  <span className="text-white/50">— official site &amp; live demo</span>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5 text-secondary shrink-0" />
                  <a href="https://github.com/Egonex-AI/Understand-Anything" target="_blank" rel="noopener noreferrer" className="underline hover:text-secondary">
                    github.com/Egonex-AI/Understand-Anything
                  </a>
                </li>
              </ul>
              <p className="text-xs text-white/60 leading-relaxed mt-5">
                Note: it needs an AI coding tool to run the analysis (it uses AI to summarise each part, so it
                consumes some AI tokens). The generated diagram can be committed to the repo so anyone on the
                team can open it without re-running. Ignatius can generate this and share a link/export.
              </p>
            </div>
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
            Last updated: {LAST_UPDATED} (stress test {QA_DATE}). &nbsp;·&nbsp; Lava-SA — Bryanston, Johannesburg &nbsp;·&nbsp; info@lava-sa.com
          </p>
        </div>
      </section>

    </main>
  );
}
