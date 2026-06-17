export const ANNEKE_REPORT_META = {
  title: "Website Update Briefing",
  subtitle: "Lava-SA.com — changes, fixes & demo guide",
  meetingDate: "17 June 2026",
  meetingTime: "12:00",
  version: "June 2026",
  path: "/reports/anneke-june-2026",
} as const;

export const EXECUTIVE_SUMMARY = [
  "Member-gated web operating manuals for V.100 Premium X and V.300 Series (portrait A4, Save as PDF).",
  "Product pages show embedded YouTube videos and manuals above Industries; videos are public, manuals require login.",
  "Member signup is split from password reset so new visitors and past customers follow the right path.",
  "Admin → Leads lists newsletter, member signups, and Janet enquiries — customers with orders stay under Customers only.",
  "Production fixes: empty product-page files, invite emails pointing to localhost, password reset via Resend.",
] as const;

export const COMPLETED_ITEMS = [
  {
    feature: "V.300 Series manual",
    where: "/manuals/v300-series or V.300 product page → Manual",
    notes: "Portrait A4, ~18 pages, member login required, Save as PDF",
  },
  {
    feature: "V.100 Premium X manual",
    where: "/manuals/v100-premium-x or V.100 product page → Manual",
    notes: "Same format, 14 pages",
  },
  {
    feature: "Manuals on product pages",
    where: "Vacuum machine PDPs",
    notes: "Video then Manual above Industries section",
  },
  {
    feature: "Member-only manuals",
    where: "Open manual without logging in",
    notes: "Sign-in gate; free member account for new visitors",
  },
  {
    feature: "Signup vs reset",
    where: "/account/login",
    notes: "Create free member account (new) vs Reset password (existing customers)",
  },
  {
    feature: "Admin → Leads",
    where: "/admin/leads",
    notes: "Non-purchasers only after latest fix — not WooCommerce buyers",
  },
  {
    feature: "Admin → Customers",
    where: "/admin/customers",
    notes: "~1,000 WooCommerce / order history — separate from Leads",
  },
  {
    feature: "YouTube videos on PDP",
    where: "e.g. /products/v300-premium-x",
    notes: "Embedded player instead of blank external link cards",
  },
] as const;

export const MEMBER_FLOWS = [
  {
    audience: "New visitor (manuals, no purchase)",
    action: "Create free member account",
    data: "Supabase Authentication + Leads (if applicable)",
  },
  {
    audience: "Past customer (ordered before)",
    action: "Reset password",
    data: "Must exist in auth from invite or prior signup",
  },
  {
    audience: "Buyer / CRM",
    action: "Orders, points, history",
    data: "Customers in admin (WooCommerce import)",
  },
] as const;

export const BUGS_FIXED = [
  { issue: "Product pages white screen", cause: "Empty source files (AVG antivirus?)", fix: "Restored components from git" },
  { issue: "getMachineMedia is not a function", cause: "Empty get-machine-media.ts", fix: "Reimplemented module" },
  { issue: "Manual images missing", cause: "Wrong file extensions (.jpg vs .webp)", fix: "Corrected image paths" },
  { issue: "Setup email → localhost", cause: "Dev URL in invite redirect", fix: "Production uses NEXT_PUBLIC_SITE_URL" },
  { issue: "Password reset failed on live", cause: "Service-role client does not send mail", fix: "Resend + anon fallback" },
  { issue: "User in Auth but not Customers", cause: "Auth user ≠ customer row", fix: "Use Reset password or remove test user in Supabase" },
  { issue: "Leads showed all customers", cause: "Woo CSV merged into Leads list", fix: "Customers excluded from Leads" },
] as const;

export const REQUESTED_VS_DELIVERED = [
  { request: "V.300 manual — English, portrait, 2026 look", status: "Done" },
  { request: "V.100 manual", status: "Done" },
  { request: "One manual per series (V.300 Premium X / White / Black)", status: "Done" },
  { request: "Member-gated manual; videos public", status: "Done" },
  { request: "Video + Manual above Industries on PDP", status: "Done" },
  { request: "New visitor signup (no purchase for manuals)", status: "Done" },
  { request: "Existing customer password reset (separate flow)", status: "Done" },
  { request: "Admin view for non-customer contacts", status: "Done (Leads)" },
  { request: "Clean YouTube embeds on product pages", status: "Done" },
  { request: "Manuals for V.333, V.400, V.500, etc.", status: "Not yet — la-va.com PDFs still" },
  { request: "Contact form stored in admin", status: "Not yet — email only" },
  { request: "Pre-built PDF in /downloads/", status: "Not yet" },
] as const;

export const DEFERRED_ITEMS = [
  "Leads vs newsletter overlap for imported customers who also opted into mailing list (stats only; list now excludes customers).",
  "Contact form → save to database and show on Leads.",
  "Remaining machine manuals (factory PDFs → Lava-SA web manuals).",
  "V.100 PDP copy still mentions automatic mode in places — machine is fully manual (content tidy-up).",
  "Optional: Cloudflare Turnstile on login (currently contact / reviews / mailing list only).",
  "Clean up localhost test users in Supabase Auth before wider testing.",
] as const;

export const DEMO_STEPS = [
  "Homepage — confirm site loads (hard refresh if needed).",
  "V.300 product page — Video (play thumbnail) then Manual (member gate).",
  "Create free member account with a new test email — check inbox and spam.",
  "Open manual when logged in — Save as PDF (A4 portrait, background graphics on).",
  "Admin → Leads — should show real leads only, not ~1,000 customers.",
  "Admin → Customers — WooCommerce buyers (e.g. Janus) appear here only.",
  "Admin → Janet support chats — voice enquiry detail.",
] as const;

export const SUPABASE_CHECKLIST = [
  "Site URL = https://www.lava-sa.com",
  "Redirect URLs include /auth/callback",
  "Vercel env: SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL, RESEND_API_KEY",
  "Auth → Users for test members; delete stale localhost invites if needed",
] as const;
