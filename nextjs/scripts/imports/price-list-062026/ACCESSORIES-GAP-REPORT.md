# Lava-SA — Accessories gap report (June 2026)

Sources compared:
- **Anneke price lists** — `lava-price-list-2026.pdf` + `landig-price-list-2026.pdf` (authoritative for SA pricing)
- **LAVA Germany** — [la-va.com/zubehoer](https://la-va.com/zubehoer/) (full accessory range)
- **lava-sa.com** — Supabase catalogue (seeds + SQL migrations)

Legend: ✅ On website · ⚠️ Partial / wrong SKU · ❌ Missing · 📝 SQL ready, not run yet · 🇩🇪 On la-va only (not on SA price list)

---

## A. On Anneke price list — NOT on website (priority adds)

### Vacuum bag & film accessories (la-va “Vakuumbeutel Zubehör”)

| Code | Product | Price (incl VAT) | la-va.com match | Site status |
|------|---------|------------------|-----------------|-------------|
| **VL0099** | Lava Labels and Marker | R320 | Etiketten + Permanentmarker | ❌ Missing |
| **VL0002** | Lava Fluid Stop (30cm × 12m) | R726 | FlüssigkeitsStopp | ❌ Missing |
| **VL0003** | Lava Bone Protection (10cm × 5m) | R325 | Knochenschutzleinen | ❌ Missing |
| **VL0090** | Wine Sealers (2) | R260 | Vakuum-Flaschenverschluss | ❌ Missing |
| **VL0008** | Rolls Dispenser (15–30 cm) | R915 | Rollenschneider | ❌ Missing |

### Container accessories (la-va “Behälter Zubehör”)

| Code | Product | Price | la-va.com match | Site status |
|------|---------|-------|-----------------|-------------|
| **VL0193** | Vacuum Sealer for glass jars | R630 | Vakuumglocke für Gläser (standard) | ❌ Missing — site has **Flex** dome (VL1193) only |
| **VL0056** | Hand pump (manual) | R400 | Manuelle Vakuumpumpe | ❌ Missing — site has **electric** Easy Pump (VL2050, not on Anneke list) |
| **VL0007** | 1.52 L Glass Vacuum Container | R1,225 | Glasbehälter range | ❌ Missing — site has G-Line (VL2007/8) instead |
| **VL0057** | 640 ml round container | R520 | Behälter | ❌ Missing — site lists 650 ml square (VL0054) |

### Display boards

| Code | Product | Price | la-va.com match | Site status |
|------|---------|-------|-----------------|-------------|
| **VL0295** | Salmon board 12×26.5 (5) | R150 | Lachsbretter | 📝 `027_salmon_boards.sql` — run in Supabase |
| **VL0296** | Salmon board 18.5×53 (5) | R200 | Lachsbretter | 📝 same |
| **VL0297** | Salmon board 21×57 (5) | R230 | Lachsbretter | 📝 same |

### Landig butchery (la-va “Messer & Co.” overlap)

| Code | Product | Price | la-va.com match | Site status |
|------|---------|-------|-----------------|-------------|
| **Z11060** | 3-piece butcher knife set (yellow) | R750 | Fleischer-Messerset | ❌ Missing |
| **Z11052** | 3-piece butcher knife set (black) | R1,315 | Fleischer-Messerset | ❌ Missing |
| **Z11061** | 3-piece kitchen knife set (white) | R500 | — | ❌ Missing |
| **Z99051** | Cutting board 400×250×20 mm | R503 | Schneidbrett | ❌ Missing |
| **Z99053** | Cutting board 500×300×20 mm | R705 | Schneidbrett | ❌ Missing |
| **Z99055** | Cutting board 500×400×20 mm | R918 | Schneidbrett | ❌ Missing |
| **Z99057** | Cutting board 600×400×20 mm | R1,059 | Schneidbrett | ❌ Missing |
| **Z33014** | Cutting gloves (XS) | R399 | Schnittschutzhandschuh | ❌ Missing — S/M/L only on site |
| **Z66130** | Pro-Star Meat Mincer (90 kg) | R4,650 | Fleischwolf W 50 | ❌ Missing |

---

## B. On website — matches price list ✅

Machines (V.100–V.500), vacuum bags/rolls (VL codes), universal lids (VL0180–85), acrylic + ES-Line containers, sous vide (LX0020, LX0033), Flex jar sealer (VL1193), most hooks/scales/apron/gloves, spare parts (VE codes — on la-va, not on Anneke list).

---

## C. On la-va.com — NOT on Anneke price list (optional / confirm with Anneke)

| la-va product | Notes |
|---------------|-------|
| Druckregulierung L+ | Pressure regulator — manuals mention it; no VL code on SA list |
| Elektrische Vakuumpumpe (VL2050) | ✅ On site as Easy Pump — **new product, not on June 2026 PDF** |
| Jagdetiketten (hunting labels) | Separate from VL0099 general labels |
| Gewürzmischung „Graved Lachs“ | Spice mix — SA N/A? |
| Garantieverlängerung | Warranty extension |
| Geschenkgutschein | Gift voucher |
| Ersatzteile (filters, valves, GN labels) | Mostly covered by spare-parts range on site |
| V-Messerschärfer | Knife sharpener — not on Landig list |

---

## D. Recommended next batch (accessories page)

**Quick wins** (small items, la-va has content to scrape):

1. VL0099 — Labels + marker (R320)
2. VL0090 — Wine sealers ×2 (R260)
3. VL0003 — Bone protection (R325)
4. VL0056 — Manual hand pump (R400) — distinguish from electric VL2050
5. VL0002 — Fluid Stop (R726)
6. VL0008 — Roll dispenser (R915)
7. VL0193 — Standard glass jar vacuum bell (R630)

**Already prepared:** run `027_salmon_boards.sql` for salmon boards.

**Larger butchery add:** Z99051–57 cutting boards + Z11060/52 knife sets + Z66130 mincer.

---

## E. Suggested category on site

Create **`/products/accessories`** (or tag `accessories`) grouping VL0002, VL0003, VL0090, VL0099, VL0008, VL0056, VL0193 — mirrors [la-va.com/zubehoer](https://la-va.com/zubehoer/) and the “OTHER” section of the Lava price list.
