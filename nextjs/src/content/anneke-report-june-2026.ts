export const ANNEKE_REPORT_META = {
  title: "Website Launch Briefing",
  subtitle: "Post-meeting notes · 17 June 2026 · target go-live end of June",
  meetingDate: "17 June 2026",
  meetingTime: "11:00",
  launchDate: "End of June 2026",
  version: "June 2026 — post-meeting",
  path: "/reports/anneke-june-2026",
} as const;

export type RequestStatus = "Done" | "Partial" | "Not yet" | "Waiting on Anneke" | "Agreed — keep";

export interface CatalogueRequest {
  area: string;
  request: string;
  status: RequestStatus;
  notes: string;
}

export const MEETING_SUMMARY = [
  "Anneke and Ignatius reviewed content, pricing, and launch planning for lava-sa.com.",
  "Not much structural change needed — Anneke is happy with the new look and overall direction.",
  "Anneke will send an updated price list and promotional details; Ignatius updates shop prices before go-live.",
  "Bag and product size tables stay on the site so customers can choose the right sizes.",
  "Target go-live: end of June 2026, once prices and final assets are confirmed.",
  "Separate quotation agreed for a small StoreVac bag site (six bag sizes) — written quote to follow.",
] as const;

export const KEY_DECISIONS = [
  {
    topic: "Pricing",
    decision:
      "Anneke sends corrected price list. One item at R 6 495 should be ~R 10 000 (Anneke to confirm). Another confirmed at R 11 000. Clearance/discounted items per Anneke’s current promotions.",
  },
  {
    topic: "Bag size tables",
    decision: "Keep size guidance tables on product pages — customers need them to pick bag sizes.",
  },
  {
    topic: "Out of stock",
    decision:
      "Clear out-of-stock labels (e.g. 20 bar 30). Link or “search more” to related products or the future StoreVac site.",
  },
  {
    topic: "Testimonials",
    decision:
      "Ignatius to send a direct mobile-friendly link for written or video reviews — shareable on WhatsApp.",
  },
  {
    topic: "Manuals",
    decision:
      "V.300 manuals and videos live; English PDFs for members only. Ignatius sends PDF copies to Anneke for review.",
  },
  {
    topic: "Business hours",
    decision: "Change to 08:00–15:00 (Mon–Fri) across contact and footer copy.",
  },
  {
    topic: "Navigation",
    decision: "Remove duplicate butchery listings; “View all” shows category list then products; clearer dropdown labels.",
  },
  {
    topic: "Images",
    decision: "Ignatius fixes image order/ratios; Anneke supplies product photos (no personal photos on site).",
  },
  {
    topic: "StoreVac site",
    decision:
      "New small site for six vacuum bag sizes. Domain storevac.co.za available (~R99). Quotation R 5 000 — written quote/invoice to Anneke (confirm currency ZAR).",
  },
] as const;

export const ACTION_IGNATIUS = [
  "Send testimonial submission link (written + video, mobile/WhatsApp friendly).",
  "Send V.100 & V.300 manual PDFs to Anneke for review.",
  "Email written quotation for StoreVac site (R 5 000 — confirm ZAR).",
  "Update site pricing when Anneke’s price list arrives.",
  "Fix product image order and aspect ratios discussed on the call.",
  "Mark out-of-stock items clearly; add link to alternatives / StoreVac when live.",
  "Remove duplicate butchery listings; tidy category navigation labels.",
  "Update business hours to 08:00–15:00 site-wide.",
  "Confirm go-live schedule (end of June) once Anneke confirms StoreVac project.",
] as const;

export const ACTION_ANNEKE = [
  "Send updated / corrected price list (machines, containers, lids, butchery/processing).",
  "Confirm exact price for item currently showing R 6 495 (~R 10 000).",
  "Send current promotions and final clearance prices.",
  "Forward product photos (no personal photos).",
  "Forward StoreVac logo, bag images, and content when ready to proceed.",
  "Confirm StoreVac project and currency for R 5 000 quotation.",
] as const;

/** Status after 17 June meeting — overrides earlier email where decided differently. */
export const POST_MEETING_STATUS: CatalogueRequest[] = [
  {
    area: "Pricing",
    request: "Update all prices from Anneke’s list before go-live",
    status: "Waiting on Anneke",
    notes: "No bulk Lava price panic — Anneke sends list. Flagged: ~R 10 000 fix; R 11 000 confirmed.",
  },
  {
    area: "Vacuum bags",
    request: "Keep bag / size tables on product pages",
    status: "Agreed — keep",
    notes: "Meeting decision — overrides earlier email to remove guide.",
  },
  {
    area: "Vacuum bags",
    request: "Better product photos",
    status: "Waiting on Anneke",
    notes: "Anneke to supply; Ignatius fixes order/ratios.",
  },
  {
    area: "Inventory",
    request: "Out-of-stock labels + link to alternatives / StoreVac",
    status: "Not yet",
    notes: "e.g. 20 bar 30 set out of stock on call.",
  },
  {
    area: "Testimonials",
    request: "WhatsApp-friendly review link (written + video)",
    status: "Not yet",
    notes: "Ignatius to create and send — /submit-review paths exist.",
  },
  {
    area: "Manuals",
    request: "Member-only download; PDFs to Anneke for review",
    status: "Done",
    notes: "V.100 + V.300 live; send PDFs to Anneke.",
  },
  {
    area: "Contact",
    request: "Business hours 08:00–15:00",
    status: "Not yet",
    notes: "Site still shows 9am–5pm in places.",
  },
  {
    area: "Navigation",
    request: "Remove duplicate butchery; fix View all and dropdown labels",
    status: "Not yet",
    notes: "Category cleanup before go-live.",
  },
  {
    area: "Spare parts",
    request: "Remove “Which parts fit my machine?” (if still agreed)",
    status: "Partial",
    notes: "Not raised on 17 June call — confirm if still wanted.",
  },
  {
    area: "Clearance",
    request: "Butchery + acrylic per Anneke’s promotion list",
    status: "Waiting on Anneke",
    notes: "Apply when final prices/promotions received.",
  },
  {
    area: "StoreVac",
    request: "New mini-site — six bag sizes",
    status: "Waiting on Anneke",
    notes: "storevac.co.za available; quote R 5 000; assets from Anneke.",
  },
  {
    area: "Go-live",
    request: "Main site live end of June 2026",
    status: "Partial",
    notes: "After price list + final content pass.",
  },
];

export const WEBSITE_EXPERIENCE_DELIVERED = [
  { feature: "V.300 Series operating manual", detail: "English, portrait A4, member login, Save as PDF." },
  { feature: "V.100 Premium X operating manual", detail: "Same format — PDF to Anneke for review." },
  { feature: "V.300 videos on product page", detail: "Embedded YouTube on machine pages." },
  { feature: "Member accounts", detail: "Free signup vs password reset for existing customers." },
  { feature: "Admin → Leads / Customers", detail: "Leads exclude buyers; customers hold order history." },
  { feature: "Janet voice assistant", detail: "Mic permission fix deployed pending — voice quality review later." },
  { feature: "Site review room", detail: "Voice + screen-share on site for walk-throughs." },
  { feature: "Site info page", detail: "lava-sa.com/site-info — internal SEO scores." },
] as const;

export const LAUNCH_PLAN = {
  date: "End of June 2026",
  headline: "Main site go-live once Anneke confirms prices and assets",
  steps: [
    "Receive and apply Anneke’s updated price list.",
    "Final image pass and out-of-stock labelling.",
    "Business hours 08:00–15:00; navigation cleanup.",
    "Send testimonial link and manual PDFs to Anneke.",
    "Redirect lava-sa.co.za → lava-sa.com; verify old WordPress URLs.",
    "Optional: customer mailing — new site, add to phone, review invitation.",
    "Update Google Business Profile quietly (not in customer email).",
    "StoreVac mini-site — separate project after Anneke confirms quote.",
  ],
} as const;

export const STOREVAC_PROJECT = {
  name: "StoreVac (working name StoreVach)",
  domain: "storevac.co.za",
  domainStatus: "Available (~R99/year)",
  scope: "Six vacuum bag sizes initially",
  quote: "R 5 000 (confirm ZAR with Anneke)",
  assetsNeeded: "Logo, bag images, content from Anneke",
} as const;

export const OUTSTANDING_QUESTIONS = [
  "Exact figure for product currently at R 6 495.",
  "Final clearance/promotion list and prices.",
  "Confirm spare-parts “which parts fit” section still to be removed.",
  "Currency confirmation on R 5 000 StoreVac quotation.",
  "Whether Monday soft launch or strictly end-of-month.",
] as const;
