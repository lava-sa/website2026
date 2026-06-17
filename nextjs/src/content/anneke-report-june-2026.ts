export const ANNEKE_REPORT_META = {
  title: "Website Launch Briefing",
  subtitle: "Anneke’s requests, meeting notes & Monday 22 June 2026 launch plan",
  meetingDate: "17 June 2026",
  meetingTime: "12:00",
  launchDate: "Monday 22 June 2026",
  version: "June 2026 (final)",
  path: "/reports/anneke-june-2026",
} as const;

export type RequestStatus = "Done" | "Partial" | "Not yet" | "Waiting on Anneke";

export interface CatalogueRequest {
  area: string;
  request: string;
  status: RequestStatus;
  notes: string;
}

/** Anneke’s email notes + Easy Pump follow-up. */
export const ANNEKE_EMAIL_REQUESTS: CatalogueRequest[] = [
  {
    area: "All categories",
    request: "Use pictures and product information from www.la-va.com where noted",
    status: "Partial",
    notes: "Many machines and new lines (G-Line glass, Easy Pump, Flex jar sealer, extra lid sizes) pulled from la-va. Ongoing per category.",
  },
  {
    area: "Lava spare parts",
    request: "Remove “Which parts fit my machine?” section",
    status: "Not yet",
    notes: "Section still on spare parts page — remove before launch if agreed.",
  },
  {
    area: "Vacuum bags",
    request: "Remove bag size guide",
    status: "Not yet",
    notes: "Transcript: Anneke may prefer a more visual guide instead of removing — confirm today.",
  },
  {
    area: "Vacuum bags",
    request: "Remove 2-year guarantee mention",
    status: "Partial",
    notes: "Guarantee applies to machines and selected scales — not bags (see warranty rule below).",
  },
  {
    area: "Vacuum bags",
    request: "Better product photos (not placeholder / third-party look)",
    status: "Waiting on Anneke",
    notes: "From first meeting — not in email. Anneke to supply photos.",
  },
  {
    area: "Vacuum rolls",
    request: "Remove 25 cm and 30 cm rolls from the shop",
    status: "Not yet",
    notes: "Unpublish after Anneke confirms.",
  },
  {
    area: "Vacuum rolls",
    request: "Remove 2-year guarantee mention",
    status: "Partial",
    notes: "Same warranty rule as bags.",
  },
  {
    area: "Glass vacuum containers",
    request: "Remove old listings; separate glass from pump",
    status: "Done",
    notes: "G-Line black/white + Easy Pump on Glass Containers. Jar sealers under Glass Jar Sealer.",
  },
  {
    area: "Glass vacuum containers",
    request: "Add new glass items Anneke will send",
    status: "Waiting on Anneke",
    notes: "Ready when photos/SKUs arrive.",
  },
  {
    area: "Glass vacuum containers",
    request: "Remove jar attachment from Glass Containers category",
    status: "Done",
    notes: "8–9 cm jar attachment lives under Jar Sealer only.",
  },
  {
    area: "Sealers for glass jars",
    request: "Remove 2-year guarantee where not applicable",
    status: "Partial",
    notes: "Check jar sealer pages.",
  },
  {
    area: "Sealers for glass jars",
    request: "Add another glass jar sealer",
    status: "Partial",
    notes: "Flex Sealer for Jars added. Second SKU when Anneke specifies.",
  },
  {
    area: "Acrylic vacuum lids",
    request: "Populate all lid sizes from the old website",
    status: "Partial",
    notes: "Five sizes live; two smaller sizes noted in meeting — Anneke to confirm sizes.",
  },
  {
    area: "Acrylic containers",
    request: "Remove acrylic container set (4-piece bundle)",
    status: "Not yet",
    notes: "Individual containers only — unpublish set.",
  },
  {
    area: "Stainless containers",
    request: "Remove stainless container sets — individuals only",
    status: "Not yet",
    notes: "From first meeting — not in email.",
  },
  {
    area: "Scales",
    request: "Remove first scale, 200 kg and 300 kg digital scales",
    status: "Not yet",
    notes: "No longer in stock per Anneke.",
  },
  {
    area: "Sous vide",
    request: "Under Sous Vide — no dropdown; show products directly",
    status: "Partial",
    notes: "Single menu link (no dropdown). Meeting: two circulator products on page; glass/pump under Glass Containers.",
  },
  {
    area: "Clearance",
    request: "Acrylic vacuum containers at 10% discount",
    status: "Not yet",
    notes: "Butchery script exists; acrylic range still to apply.",
  },
  {
    area: "Clearance",
    request: "All butchery accessories at 10% discount",
    status: "Partial",
    notes: "Clearance section built — confirm sale prices on live shop.",
  },
  {
    area: "Current promotions",
    request: "Anneke can add and remove promotions herself",
    status: "Not yet",
    notes: "Discuss self-service vs request-based for launch.",
  },
  {
    area: "Vacuum machines",
    request: "Remove V.333 from the range",
    status: "Partial",
    notes: "Off main menu; hide product page if fully discontinued.",
  },
  {
    area: "Delivery",
    request: "Within South Africa: 5–10 working days",
    status: "Partial",
    notes: "Align Help, checkout and shipping pages before launch.",
  },
];

/** First meeting — items not repeated in Anneke’s email. */
export const TRANSCRIPT_ONLY_REQUESTS: CatalogueRequest[] = [
  {
    area: "Warranty policy",
    request: "2-year guarantee on machines and applicable scales only — not bags, rolls, butchery, etc.",
    status: "Partial",
    notes: "Remove misleading guarantee copy from non-machine categories.",
  },
  {
    area: "Returns / service",
    request: "“Repair or replace” wording; clear send-in troubleshooting process",
    status: "Not yet",
    notes: "Legal/shipping pages — softer than full-refund tone.",
  },
  {
    area: "Contact",
    request: "Anneke’s cell and email on relevant pages (plus info@lava-sa.com)",
    status: "Partial",
    notes: "Contact page strong; extend to category footers if desired.",
  },
  {
    area: "Butchery strategy",
    request: "Phase out butchery focus; keep tools for now; clearance on rest",
    status: "Partial",
    notes: "Company concentrating on vacuum processing.",
  },
  {
    area: "Content / SEO",
    request: "Expand Applications; strengthen vacuum education content",
    status: "Partial",
    notes: "Ongoing — supports Google and AI visibility.",
  },
  {
    area: "Site review",
    request: "Internal site-info page for scores and keywords",
    status: "Done",
    notes: "lava-sa.com/site-info (not for public marketing).",
  },
  {
    area: "Images",
    request: "Remove duplicated images across site",
    status: "Not yet",
    notes: "Audit before launch.",
  },
  {
    area: "Navigation",
    request: "Remove unnecessary dropdowns where few products remain",
    status: "Partial",
    notes: "Sous Vide simplified; review other menus.",
  },
  {
    area: "StoreVac cross-link",
    request: "Out-of-stock bag sizes → link to StoreVac compatible bag",
    status: "Not yet",
    notes: "Compare stock levels first; storevac.co.za domain available to register.",
  },
  {
    area: "Domains",
    request: "lava-sa.cl → new site after approval",
    status: "Not yet",
    notes: "After .com launch stabilises.",
  },
  {
    area: "Video",
    request: "Reuse Anneke’s social videos on website when ready",
    status: "Waiting on Anneke",
    notes: "Anneke creating IG/FB content.",
  },
  {
    area: "About page",
    request: "Wilco & Anneke photo via admin upload",
    status: "Waiting on Anneke",
    notes: "Replace duplicate Landig image.",
  },
];

export const FIRST_MEETING_FOLLOWUPS: CatalogueRequest[] = [
  {
    area: "Shipping",
    request: "Courier pricing — Gauteng vs rest of South Africa",
    status: "Done",
    notes: "R190 excl. VAT Gauteng · R250 elsewhere.",
  },
  {
    area: "Vacuum machines",
    request: "V.100 Premium (limited stock, ~6 units) on menu",
    status: "Done",
    notes: "Listed as limited stock in machine menu.",
  },
  {
    area: "Product pages",
    request: "Real reviews only where we have them",
    status: "Done",
    notes: "Sensible highlights on other categories.",
  },
  {
    area: "Special offers",
    request: "Clearance without duplicate product pages",
    status: "Done",
    notes: "Same URL; sale price on card.",
  },
  {
    area: "Prices",
    request: "Lava-SA shop prices",
    status: "Done",
    notes: "No bulk price changes needed — earlier confusion was Star Aesthetic, not Lava-SA.",
  },
  {
    area: "Site review room",
    request: "Voice + screen-share on the website",
    status: "Done",
    notes: "Admin → Site review for walk-throughs with guest link.",
  },
];

export const WEBSITE_EXPERIENCE_DELIVERED = [
  { feature: "V.300 Series operating manual", detail: "Portrait A4 — Save as PDF. Member login required." },
  { feature: "V.100 Premium X operating manual", detail: "14 pages, same format." },
  { feature: "Videos on machine pages", detail: "YouTube embedded — public, no login." },
  { feature: "Manual + Video above Industries", detail: "Machine product page layout." },
  { feature: "Member account vs password reset", detail: "Clear paths for new visitors and existing customers." },
  { feature: "Admin → Leads", detail: "Newsletter, signups, Janet — not existing buyers." },
  { feature: "Admin → Customers", detail: "Orders and WooCommerce history." },
  { feature: "Janet enquiries", detail: "Saved in admin for Anneke to follow up." },
] as const;

export const LAUNCH_PLAN = {
  date: "Monday 22 June 2026",
  time: "Morning",
  headline: "Go live on lava-sa.com",
  steps: [
    "Remove site preview password / open site to public (if still gated).",
    "Point lava-sa.co.za and www.lava-sa.co.za to lava-sa.com (already configured in site routing).",
    "Verify all old WordPress / WooCommerce URLs redirect to matching new pages.",
    "Final pass on Anneke’s removals (bags guide, spare-parts table, rolls, scales, sets).",
    "Apply butchery + acrylic clearance pricing if agreed.",
    "Standardise delivery copy: 5–10 working days within South Africa.",
    "Add to Home Screen (website app) — ship basic install icons before or immediately after launch mail.",
    "Send customer + leads mailing: new site, add to phone, review invitation.",
    "Update Google Business Profile quietly (not mentioned in customer email).",
    "Monitor orders, contact form, and PayFast for first 48 hours.",
  ],
} as const;

export const LAUNCH_MAILING = {
  audience: "All customers (Admin → Customers) and leads (Admin → Leads / mailing list).",
  include: [
    "Welcome to the new lava-sa.com — same Lava quality, faster shop, manuals and videos on machine pages.",
    "Add Lava-SA to your phone (Add to Home Screen) — bags, rolls and spares one tap away.",
    "Existing customers: please share a review of your machine and service from Anneke and the Lava team.",
    "Link to review forms / submit-review on site.",
  ],
  exclude: [
    "Google Business Profile changes (action separately).",
    "Technical hosting details.",
  ],
} as const;

export const LAUNCH_READINESS = {
  verdict: "Reasonable if catalogue cleanup happens Thu–Fri 19–20 June",
  risks: [
    "Several Anneke removals still not live (bag guide, spare-parts table, rolls, scales, sets).",
    "PWA / Add to Home Screen not fully built yet — launch mail should say “add to home screen” only after icons/manifest ship (Fri–Mon).",
    "Old URL redirect map needs a tested checklist against top WooCommerce URLs.",
    "Butchery/acrylic clearance prices must show on live shop before clearance mail.",
    "Member activation emails — test one fresh signup before bulk mail.",
  ],
  strengths: [
    "New design approved by Anneke; core shop, checkout, and admin working.",
    "co.za → .com redirect already in site configuration.",
    "Manuals, videos, leads/customers split, site review room delivered.",
    "No Lava-SA price list rework required.",
  ],
} as const;

export const MIGHT_HAVE_MISSED = [
  "Remove site preview / staging password before Monday.",
  "PayFast live credentials and a real R1 test transaction.",
  "SSL on all domains (lava-sa.com, www, .co.za).",
  "404 page and broken-link check after redirects.",
  "sitemap.xml submitted in Google Search Console (internal — not in customer mail).",
  "Robots: production indexing enabled (preview hosts stay noindex).",
  "Cookie / POPIA consent still valid on new site.",
  "Anneke out-of-office phone coverage for launch week.",
  "Backup: old WordPress site kept read-only until redirects verified.",
  "lava-sa.cl domain timing (separate from Monday .com launch).",
  "Register storevac.co.za if bag cross-link strategy confirmed (available ~R99).",
  "Spam/test customer cleanup before mailing list send.",
  "Email send rate / Resend domain warm-up for large blast.",
] as const;

export const STOREVAC_DOMAIN = {
  domain: "storevac.co.za",
  status: "Available to register",
  note: "Confirmed on domains.co.za (~R99). Not registered yet — DNS lookup shows no active zone. Register if cross-link or sister brand needed.",
} as const;

export const SUMMARY_COUNTS = {
  done: ANNEKE_EMAIL_REQUESTS.filter((r) => r.status === "Done").length,
  partial: ANNEKE_EMAIL_REQUESTS.filter((r) => r.status === "Partial").length,
  notYet: ANNEKE_EMAIL_REQUESTS.filter((r) => r.status === "Not yet").length,
  waiting: ANNEKE_EMAIL_REQUESTS.filter((r) => r.status === "Waiting on Anneke").length,
  emailTotal: ANNEKE_EMAIL_REQUESTS.length,
} as const;
