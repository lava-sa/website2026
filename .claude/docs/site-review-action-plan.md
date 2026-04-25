# Lava-SA — Site Review: Consolidated Plan of Action
**Compiled:** 21 April 2026  
**Sources:** LM Arena (deep audit) · NotebookLM · Gemini  
**Status:** Pre-launch / Post-HuntEx preparation

---

## How to read this document
Issues are grouped by **Priority Tier** (P0 → P3) and flagged with which reviewer(s) raised them.  
Where memory/code already confirms the bug, that is noted explicitly.  
Client input items are marked 🤝.

---

## P0 — Critical: Fix Before or Immediately After HuntEx

> These are broken promises, data bugs, or trust-destroyers. Fix within 1–3 days.

---

### P0-A · Shipping threshold inconsistency
**Reviewers:** LM Arena, Gemini  
**Code confirms:** Memory records `FREE_SHIPPING_THRESHOLD = R2,000`. The homepage copy says "Free shipping over **R2,500**."  
**Fix:** Search for every hard-coded "R2,500" or "2500" shipping reference in the frontend and change to "R2,000". Also add a **sitewide header banner** ("Free shipping on orders over R2,000") as Gemini recommends — this reduces cart abandonment.  
**Files to check:** `src/app/page.tsx`, `src/components/`, any marketing copy component.

---

### P0-B · Lava Points display is wrong on homepage product cards
**Reviewers:** LM Arena, Gemini  
**Code confirms:** Rate is 1 point per R5 spent (1% cashback). A R14,500 machine earns **2,900 points**, NOT 14,500.  
The homepage currently shows points equal to the full rand price (so 14,500 pts for V.300). Product/category pages show ~20% which is also wrong (would be 1pt/R1 = too generous).  
**Fix:**  
1. Correct homepage product cards to show `Math.floor(price / 5)` points.  
2. Add a tooltip/label: "= R145 off your next order" to make it tangible (Gemini recommendation).  
3. Verify product detail page uses same formula consistently.

---

### P0-C · Review submission page shows "Loading…" instead of form
**Reviewers:** LM Arena  
**Fix:** The review page relies entirely on client-side rendering for the form. Add a server-rendered fallback or use `Suspense` with a proper skeleton so the form HTML is in the initial response. This affects SEO crawling and accessibility.  
**Files:** `src/app/reviews/` or similar.

---

### P0-D · HuntEx event block needs urgency + expiry plan
**Reviewers:** All three  
**Context:** Today is 21 April. HuntEx runs 24–27 April 2026.  
**Immediate fix (today):** Add a countdown banner: *"Only 3 days until HuntEx 2026 — Stand B-XX, Gallagher Convention Centre. Show specials available!"*  
**Post-event plan (after 27 April):** Replace section with "Thank you for visiting us at HuntEx 2026" or remove it entirely. Build a CMS toggle in the admin panel so this can be switched without a code deploy.  
**Action owner:** Developer + 🤝 Anneke (confirm stand number and any show specials)

---

### P0-E · Domain / noindex setup
**Reviewers:** LM Arena  
**Context:** Site is live on `website2026-delta.vercel.app` and `lava-sa.online`. Legal pages reference `lava-sa.co.za`. Google may index the Vercel preview URL.  
**Fix:**  
1. Add `X-Robots-Tag: noindex` to the Vercel preview domain in `vercel.json` or via Vercel project settings → "Deployment Protection" or redirect rules.  
2. DNS switch to `lava-sa.co.za` is already in the blockers list — prioritise after HuntEx.  
3. Once on production domain, submit sitemap to Google Search Console.

---

## P1 — High Priority: Trust & Consistency (Fix This Week)

---

### P1-A · Response time promise: 1 business hour vs 1 business day
**Reviewers:** LM Arena  
**Fix:** Decide the real SLA with Anneke (🤝), then update both the homepage and the contact page to the same wording. Recommended: "We reply within 1 business day" is safer and still strong.

---

### P1-B · Anneke vs Janet/James chatbot persona confusion
**Reviewers:** LM Arena  
**Context:** Memory calls the widget "James chat widget". Reviews say "Janet". Contact page says "Talk to a real person. Not a chatbot." and that Anneke answers personally — yet the product pages and footer push the chat widget.  
**Fix:**  
1. Clarify internally: is the widget AI or human-assisted? (🤝)  
2. If it's an AI assistant, do NOT use "Talk to a real person. Not a chatbot." — change that heading.  
3. Rename the widget consistently everywhere (pick one name and stick to it).  
4. The contact page can still highlight Anneke's personal involvement; the chat is just a first-response tool.

---

### P1-C · Founded year: 1982 vs 1983
**Reviewers:** LM Arena  
**Fix:** Get the verified year from Anneke (🤝). Update every occurrence to match. Do a codebase-wide search for both "1982" and "1983".

---

### P1-D · Product name inconsistency: V.333 Black vs V.333 Chrome
**Reviewers:** LM Arena  
**Fix:** Check the Supabase products table. Align the navigation label, product card, and product detail page to the single canonical name. Update the admin product record if needed.

---

### P1-E · 350,000 customers: worldwide vs SA hunters
**Reviewers:** LM Arena  
**Fix:** The correct claim (sourced from Lava Germany) is global. Change any instance that says "350,000+ SA hunters trust Lava" to "350,000+ customers worldwide trust Lava." Only make the SA-specific claim if you have the SA figure.

---

### P1-F · Limited Edition V.300® Black priced below standard V.300®
**Reviewers:** NotebookLM  
**Context:** V.300® Premium X = R14,500; V.300® Black (Limited Edition) = R14,200.  
**Fix:** 🤝 Confirm with Wilco/Anneke the intended price positioning. Either:  
- Raise Limited Edition to R14,500 or above, OR  
- Remove "Limited Edition" branding if it's just a colour variant at a lower price point.

---

### P1-G · Returns / Warranty copy alignment & CPA compliance
**Reviewers:** LM Arena  
**Context:** Product pages advertise "30-Day Returns" and "2-Year Warranty" cleanly. The Conditions of Use adds a 10% restocking fee and a 5-day defect reporting window. South Africa's Consumer Protection Act implies a 6-month warranty on defective goods.  
**Fix:**  
1. 🤝 Have Anneke/Wilco get legal counsel to review the returns and warranty terms.  
2. Ensure the marketing claim ("30-Day Returns") links directly to the policy page that explains the conditions.  
3. Add the 2-Year Warranty as a dedicated detail page (linked from footer) — Gemini flagged this.  
4. Remove or reconcile any 5-day defect reporting window that conflicts with CPA.

---

### P1-H · All featured testimonials are from Germany
**Reviewers:** All three  
**Fix:**  
1. Move German reviews to a secondary position OR add a clear label: "Translated from la-va.com — verified German customer."  
2. Prioritise getting SA testimonials from existing customers: Crown Game Breeders, Ivory Macadamias, Crous Broers, The Test Kitchen, SA Game Breeders.  
3. Add a short case study (1–2 paragraphs) for one key SA partner as Gemini recommends.  
4. Post-purchase email sequence (see P2-C) will generate organic local reviews over time.

---

### P1-I · Legal entity name inconsistency
**Reviewers:** LM Arena  
**Fix:** Standardise across all pages:  
- **Legal name:** "Lava Vide South Africa (Pty) Ltd" (or whatever the registered name is — 🤝 confirm)  
- **Trading name:** "Lava-SA" or "Lava South Africa" — pick one  
- **Contact email in legal pages:** `anneke@lava-sa.co.za` (operational) vs `info@lava-sa.co.za` (footer). Legal pages should use the official registered contact.  
- Fix the double title bug: "Lava South Africa | Lava South Africa" in page metadata.

---

### P1-J · Breadcrumb / H1 / page title mismatches
**Reviewers:** LM Arena  
**Examples:**  
- Terms page: breadcrumb = "Terms of Service", H1 = "Terms & Conditions"  
- Conditions page: breadcrumb = "Conditions of Sale", H1 = "Conditions of Use"  
**Fix:** For each legal page, pick one canonical label and use it in breadcrumb, H1, and `<title>` tag consistently.

---

## P2 — Medium Priority: UX & Conversion (Fix This Month)

---

### P2-A · Navigation mega-menu has broken/merged text strings
**Reviewers:** NotebookLM  
**Example:** "About Lava-SALava TVVacuum MachinesV.100" — text nodes concatenating without spaces/separators.  
**Fix:** Inspect the navigation component for missing whitespace, incorrect inline elements, or CSS `display` issues that collapse spacing. This is likely a quick code fix once you find the element.

---

### P2-B · Homepage is too long; too many competing CTAs
**Reviewers:** LM Arena, NotebookLM  
**Current CTA count (homepage):** Shop, Explore applications, Write a review, Record a story, Read our story, Join green mission, Browse machines, Contact Anneke, Leave a review, Shop all machines, Send a message = **11 CTAs**.  
**Fix:**  
- Define ONE primary CTA for the page: "Shop All Machines"  
- One secondary CTA per section at most  
- Remove review solicitation CTAs from the homepage entirely (move to post-purchase email — see P2-C)  
- Consider cutting or collapsing: heritage story, sustainability story, and green mission into a single "About Lava" section  
- The stray `""` visible on the homepage is a content/rendering bug — find and remove it

---

### P2-C · Review solicitation is in the wrong place
**Reviewers:** LM Arena, NotebookLM  
**Fix:** Remove "Write Your Review" and "Record Your Story" CTAs from the homepage and product pages. Instead, trigger these via an **automated post-purchase email** (Resend is already in the stack) sent 14 days after delivery. This keeps the homepage funnel clean and generates more reviews long-term.

---

### P2-D · Lava Points: no explanation of value
**Reviewers:** Gemini  
**Fix:** Wherever points are displayed, add: "100 points = R5 off your next order" (or whatever the actual rate works out to be). A tooltip component on the points chip would work well. Also ensure the `/rewards` page has a clear worked example.

---

### P2-E · Free shipping should be a persistent sitewide banner
**Reviewers:** Gemini  
**Fix:** Add a thin top banner above the header (dismissible or persistent): *"Free shipping on all orders over R2,000 — delivered to your door."* This is one of the strongest conversion drivers and is currently buried.

---

### P2-F · Cookie consent notice missing
**Reviewers:** LM Arena  
**Fix:** The Privacy Policy mentions cookies and analytics, but there is no visible cookie consent banner/notice. Add a minimal cookie consent banner (can use a lightweight library or build it with `localStorage`). Ensure it links to the Privacy Policy.

---

### P2-G · Lava TV: embed on relevant product pages
**Reviewers:** Gemini  
**Fix:** For high-ticket machines (V.300®, V.400®, V.500®), embed the relevant Lava TV video directly on the product detail page above the technical specs. Video materially improves conversion on premium items.

---

### P2-H · WhatsApp floating widget
**Reviewers:** Gemini  
**Fix:** Anneke's mobile number is already on the site. Add a floating WhatsApp button (bottom-right, above the chat widget) linking to `https://wa.me/27XXXXXXXXX?text=Hi+Anneke...`. This is the #1 preferred contact method in South Africa. Confirm number with 🤝 Anneke.

---

### P2-I · Generic link text ("View Product →", "View →")
**Reviewers:** LM Arena  
**Fix:** Replace with descriptive text: "View V.300® Premium X", "See all vacuum bags", etc. This improves both accessibility (screen readers) and SEO anchor text.

---

### P2-J · Navigation: Machine Selector Quiz
**Reviewers:** Gemini  
**Fix:** Add a short (3-question) guided tool: "Find your perfect Lava machine." Questions: What will you use it for? (Home / Biltong & Hunting / Commercial) → How often? → What's your budget? → Recommends a specific model. This is a medium development effort but very high conversion value.

---

## P3 — Lower Priority: SEO, Brand Polish & Long-Term (This Quarter)

---

### P3-A · SEO: local search term optimisation
**Reviewers:** Gemini  
**Fix:** Update page `<title>` tags, meta descriptions, and H1s to include: "vacuum sealer South Africa," "vacuum packer Johannesburg," "best vacuum sealer for biltong," "industrial vacuum packer butchery." Target the Hunting and Butchery segments specifically.

---

### P3-B · Overclaims in marketing copy
**Reviewers:** LM Arena  
**Examples:** "No oxygen. No spoilage mechanism," "100% flavour retention," "20–30 minutes vacuum marinating equals overnight."  
**Fix:** Soften absolute claims: "virtually eliminates spoilage mechanisms," "up to 3× longer shelf life (depending on food quality and storage temperature)." Have Anneke/Wilco review from a brand accuracy standpoint (🤝).

---

### P3-C · Repetitive value proposition copy
**Reviewers:** LM Arena, NotebookLM  
**Fix:** Audit the homepage sections and ensure each one adds something *new*. "German engineering," "built to last," "since 1982," and "exclusive SA distributor" should appear once each — prominently — not scattered through every section.

---

### P3-D · Data table accessibility (comparison tables, shipping tables)
**Reviewers:** LM Arena  
**Fix:** Ensure comparison and shipping tables use semantic `<table>`, `<thead>`, `<th scope="col">`, and `<td>` elements — not just divs with CSS grid. Screen readers and Google both need proper table markup.

---

### P3-E · Partner logos → case studies
**Reviewers:** Gemini  
**Fix:** Pick one high-profile SA partner (e.g., The Test Kitchen, Crown Game Breeders). Write a 200-word case study: the problem, the Lava solution, the outcome. Far more powerful than a logo row.

---

### P3-F · Sustainability: reusable bag specifics
**Reviewers:** Gemini  
**Fix:** Add a short guide or FAQ: "Are Lava bags reusable?" with specific wash/reuse instructions and a comparison vs single-use plastic bags. This turns the Green Mission section from vague to credible.

---

## Summary Table

| ID | Issue | Source | Priority | Effort | Owner |
|---|---|---|---|---|---|
| P0-A | Shipping threshold R2,500 → R2,000 | LM Arena, Gemini | 🔴 P0 | 1h | Dev |
| P0-B | Lava Points display wrong (14,500 → 2,900) | LM Arena, Gemini | 🔴 P0 | 2h | Dev |
| P0-C | Review page stuck on "Loading…" | LM Arena | 🔴 P0 | 3h | Dev |
| P0-D | HuntEx countdown banner + expiry plan | All | 🔴 P0 | 2h | Dev + 🤝 |
| P0-E | Domain / noindex on Vercel preview | LM Arena | 🔴 P0 | 1h | Dev |
| P1-A | Response time 1hr vs 1 day | LM Arena | 🟠 P1 | 30min | Dev + 🤝 |
| P1-B | Anneke vs Janet/James persona | LM Arena | 🟠 P1 | 2h | Dev + 🤝 |
| P1-C | Founded 1982 vs 1983 | LM Arena | 🟠 P1 | 30min | Dev + 🤝 |
| P1-D | V.333 Black vs Chrome naming | LM Arena | 🟠 P1 | 30min | Dev |
| P1-E | 350k worldwide vs SA customers | LM Arena | 🟠 P1 | 30min | Dev |
| P1-F | Limited Edition priced below standard | NotebookLM | 🟠 P1 | 30min | Dev + 🤝 |
| P1-G | Returns/warranty copy & CPA compliance | LM Arena | 🟠 P1 | 4h | Dev + 🤝 Legal |
| P1-H | All testimonials from Germany | All | 🟠 P1 | 4h | Dev + 🤝 |
| P1-I | Legal entity name inconsistency | LM Arena | 🟠 P1 | 1h | Dev + 🤝 |
| P1-J | Breadcrumb/H1/title mismatches | LM Arena | 🟠 P1 | 1h | Dev |
| P2-A | Nav mega-menu merged text strings | NotebookLM | 🟡 P2 | 1h | Dev |
| P2-B | Homepage too long, too many CTAs | LM Arena, NotebookLM | 🟡 P2 | 1 day | Dev + 🤝 |
| P2-C | Review CTAs → post-purchase email | LM Arena, NotebookLM | 🟡 P2 | 3h | Dev |
| P2-D | Lava Points: no value explanation | Gemini | 🟡 P2 | 1h | Dev |
| P2-E | Free shipping sitewide banner | Gemini | 🟡 P2 | 1h | Dev |
| P2-F | Cookie consent banner missing | LM Arena | 🟡 P2 | 2h | Dev |
| P2-G | Lava TV embed on product pages | Gemini | 🟡 P2 | 3h | Dev |
| P2-H | WhatsApp floating widget | Gemini | 🟡 P2 | 1h | Dev + 🤝 |
| P2-I | Generic link text | LM Arena | 🟡 P2 | 2h | Dev |
| P2-J | Machine Selector Quiz | Gemini | 🟡 P2 | 3 days | Dev |
| P3-A | SEO local search terms | Gemini | 🟢 P3 | 2h | Dev |
| P3-B | Overclaims in marketing copy | LM Arena | 🟢 P3 | 2h | Dev + 🤝 |
| P3-C | Repetitive value proposition copy | LM Arena, NotebookLM | 🟢 P3 | Half day | Dev + 🤝 |
| P3-D | Table accessibility (semantic HTML) | LM Arena | 🟢 P3 | 2h | Dev |
| P3-E | Partner logos → case studies | Gemini | 🟢 P3 | 2h | Dev + 🤝 |
| P3-F | Sustainability: reusable bag guide | Gemini | 🟢 P3 | 2h | Dev + 🤝 |

---

## Issues NOT raised that are already in the blockers list
These are in the existing `project_state.md` blockers and do not need to be re-created:
- DNS switch to lava-sa.co.za
- Run Supabase SQL migration files
- Bank details for EFT checkout
- Sous vide product images
- PayFast sandbox test before go-live
- Newsletter to 1,285 customers

---

## Recommended sprint order (post-HuntEx)

**Week 1 (22–27 Apr) — while HuntEx is live:**
1. P0-D: HuntEx countdown banner today
2. P0-A: Fix shipping threshold copy
3. P0-B: Fix Lava Points display
4. P0-E: Vercel preview noindex

**Week 2 (28 Apr – 4 May) — post-HuntEx, pre-DNS switch:**
5. P0-C: Fix review page loading bug
6. P0-D: Swap HuntEx block to "Thank you" post-event
7. P1-C, P1-D, P1-E, P1-J: Quick data/copy fixes (all under 30 min each)
8. P1-A, P1-B: Confirm with Anneke, then fix
9. P2-A: Nav merged text bug
10. P2-E: Free shipping banner
11. P1-I: Standardise legal entity name

**Week 3 (5–11 May) — trust & conversion:**
12. P1-H: Replace/label German testimonials, request SA reviews
13. P1-G: Returns/warranty alignment (needs legal input first)
14. P1-F: Limited Edition pricing decision
15. P2-B: Homepage CTA audit and simplification
16. P2-C: Post-purchase review email (Resend)
17. P2-D: Lava Points value tooltip
18. P2-F: Cookie consent banner

**Week 4+ — polish & growth:**
19. P2-G: Lava TV product page embeds
20. P2-H: WhatsApp widget
21. P2-I: Generic link text audit
22. P3-A: SEO meta optimisation
23. P3-B, P3-C: Copy refinement
24. P3-D: Table semantic HTML
25. P2-J: Machine Selector Quiz (larger project, plan separately)
