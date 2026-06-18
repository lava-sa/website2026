-- ═══════════════════════════════════════════════════════
-- LAVA-SA — June 2026 price list sync (Anneke PDF 062026)
-- Prices are incl. 15% VAT (TOTAL COST column)
-- Run in Supabase SQL Editor (idempotent)
-- ═══════════════════════════════════════════════════════

-- ── Vacuum machines ─────────────────────────────────────────────────────────

UPDATE products SET regular_price = 10000, sku = 'VL0100P', updated_at = NOW()
  WHERE slug = 'v100-premium';

UPDATE products SET sku = 'VL0100PX', updated_at = NOW()
  WHERE slug = 'v100-premium-x';

UPDATE products SET sku = 'VL0300PX', updated_at = NOW()
  WHERE slug = 'v300-premium-x';

-- Price list uses VL0300P for both Black/White; DB sku is unique — Black keeps VL0300P
UPDATE products SET sku = 'VL0300P', regular_price = 14200, updated_at = NOW()
  WHERE slug = 'v300-black';

UPDATE products SET sku = 'VL0300PW', regular_price = 14200, updated_at = NOW()
  WHERE slug = 'v300-white';

UPDATE products SET sku = 'VL0400P', updated_at = NOW()
  WHERE slug = 'v400-premium';

-- ── Vacuum bags (VL codes + incl-VAT prices) ────────────────────────────────

-- Legacy WooCommerce slugs may duplicate the same bag — one row gets the VL code
UPDATE products SET regular_price = 230, updated_at = NOW()
  WHERE slug IN ('embossed-vacuum-bags-13x22-50', '13-x-22-5-cm-50-bags-embossed-vacuum-bags');

UPDATE products SET sku = 'VL0018', updated_at = NOW()
  WHERE slug = '13-x-22-5-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = NULL, updated_at = NOW()
  WHERE slug = 'embossed-vacuum-bags-13x22-50';

UPDATE products SET sku = 'VL0021', regular_price = 265, updated_at = NOW()
  WHERE slug = '16-x-25-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0022', regular_price = 420, updated_at = NOW()
  WHERE slug = '15-x-45-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET regular_price = 365, updated_at = NOW()
  WHERE slug IN ('embossed-vacuum-bags-20x30-50', '20-x-30-cm-50-bags-embossed-vacuum-bags');

UPDATE products SET sku = 'VL0023', updated_at = NOW()
  WHERE slug = '20-x-30-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = NULL, updated_at = NOW()
  WHERE slug = 'embossed-vacuum-bags-20x30-50';

UPDATE products SET sku = 'VL0026', regular_price = 600, updated_at = NOW()
  WHERE slug = '25-x-40-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0027', regular_price = 595, updated_at = NOW()
  WHERE slug = '30-x-50-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0028', regular_price = 995, updated_at = NOW()
  WHERE slug = '35-x-50-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0029', regular_price = 1310, updated_at = NOW()
  WHERE slug = '40-x-60-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0031', regular_price = 590, updated_at = NOW()
  WHERE slug = '60-x-80-cm-10-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0131', regular_price = 910, updated_at = NOW()
  WHERE slug = '70-x-100-cm-10-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0032', regular_price = 520, updated_at = NOW()
  WHERE slug = '25-x-35-cm-50-bags-embossed-vacuum-bags';

UPDATE products SET sku = 'VL0033', regular_price = 655, updated_at = NOW()
  WHERE slug = '30-x-40-cm-50-bags-embossed-vacuum-bags';

-- ── Vacuum rolls ────────────────────────────────────────────────────────────

UPDATE products SET sku = 'VL0010(4)', regular_price = 675, updated_at = NOW()
  WHERE slug = 'embossed-vacuum-rolls-15cm-6m-4pack';

UPDATE products SET sku = 'VL0011(2)', regular_price = 485, updated_at = NOW()
  WHERE slug = 'embossed-vacuum-rolls-20cm-6m-2pack';

UPDATE products SET sku = 'VL0013(2)', regular_price = 545, updated_at = NOW()
  WHERE slug = 'embossed-vacuum-rolls-25cm-6m-2pack';

UPDATE products SET sku = 'VL0012(2)', regular_price = 620, updated_at = NOW()
  WHERE slug = 'embossed-vacuum-rolls-30cm-6m-2pack';

-- ── Acrylic containers ──────────────────────────────────────────────────────

UPDATE products SET sku = 'VL0054', regular_price = 480, updated_at = NOW()
  WHERE slug = 'acrylic-container-650ml-square';

UPDATE products SET sku = 'VL0163', regular_price = 590, updated_at = NOW()
  WHERE slug = 'acrylic-container-1000ml-round';

UPDATE products SET sku = 'VL0065', regular_price = 665, updated_at = NOW()
  WHERE slug = 'acrylic-container-1200ml-square';

UPDATE products SET sku = 'VL0066', regular_price = 880, updated_at = NOW()
  WHERE slug = 'acrylic-container-1650ml-rectangular';

UPDATE products SET sku = 'VL0058', regular_price = 915, updated_at = NOW()
  WHERE slug = 'acrylic-container-2000ml-square';

-- ── ES-Line stainless containers ────────────────────────────────────────────

UPDATE products SET regular_price = 980, updated_at = NOW()
  WHERE slug = 'es-line-stainless-container-1300ml';

UPDATE products SET regular_price = 1130, updated_at = NOW()
  WHERE slug = 'es-line-stainless-container-2500ml';

UPDATE products SET regular_price = 1405, updated_at = NOW()
  WHERE slug = 'es-line-stainless-container-4000ml';

-- ── Universal / container lids ──────────────────────────────────────────────

UPDATE products SET regular_price = 255, updated_at = NOW()
  WHERE slug = 'acrylic-container-lid-47-112mm';

UPDATE products SET regular_price = 345, updated_at = NOW()
  WHERE slug = 'acrylic-container-lid-76-143mm';

UPDATE products SET regular_price = 640, updated_at = NOW()
  WHERE slug = 'acrylic-container-lid-160-203mm';

UPDATE products SET regular_price = 790, updated_at = NOW()
  WHERE slug = 'acrylic-container-lid-204-237mm';

UPDATE products SET regular_price = 850, updated_at = NOW()
  WHERE slug = 'acrylic-container-lid-238-280mm';

-- ── Flex jar sealer ─────────────────────────────────────────────────────────

UPDATE products SET regular_price = 699, updated_at = NOW()
  WHERE slug = 'lava-flex-sealer-for-jars';

-- ── Butchery: hooks (fix swapped SKUs — clear first to avoid unique conflicts) ─

UPDATE products SET sku = NULL, updated_at = NOW()
  WHERE slug IN ('s-hooks-300x12mm-200kg', 'swivel-hooks-300x12mm-200kg');

UPDATE products SET sku = 'Z44043', regular_price = 45, updated_at = NOW()
  WHERE slug = 's-hooks-160x6mm-60kg';

UPDATE products SET sku = 'Z44044', regular_price = 66, updated_at = NOW()
  WHERE slug = 's-hooks-160x8mm-100kg';

UPDATE products SET sku = 'Z44046', regular_price = 86, updated_at = NOW()
  WHERE slug = 's-hooks-200x9mm-125kg';

UPDATE products SET sku = 'Z44053', regular_price = 140, updated_at = NOW()
  WHERE slug = 's-hooks-300x12mm-200kg';

UPDATE products SET sku = 'Z44051', regular_price = 205, updated_at = NOW()
  WHERE slug = 'swivel-hooks-260x10mm-150kg';

UPDATE products SET sku = 'Z44052', regular_price = 353, updated_at = NOW()
  WHERE slug = 'swivel-hooks-300x12mm-200kg';

UPDATE products SET sku = 'WK104', regular_price = 466, updated_at = NOW()
  WHERE slug = 'xl-swivel-hooks-500x12mm-250kg';

UPDATE products SET sku = 'Z44060', regular_price = 900, updated_at = NOW()
  WHERE slug = 'gambrel-small-560mm';

UPDATE products SET sku = 'Z44060a', regular_price = 1800, updated_at = NOW()
  WHERE slug = 'gambrel-adjustable-810mm';

-- ── Butchery: scales (free Z55015 before reassigning to 300kg scale) ─────────

UPDATE products SET sku = NULL, updated_at = NOW()
  WHERE slug = 'platform-scale-15kg';

UPDATE products SET sku = 'Z55011', regular_price = 800, updated_at = NOW()
  WHERE slug = 'hanging-scale-100kg';

UPDATE products SET sku = 'Z55012', regular_price = 1500, updated_at = NOW()
  WHERE slug = 'hanging-scale-200kg';

UPDATE products SET sku = 'Z55015', regular_price = 5200, updated_at = NOW()
  WHERE slug = 'digital-hanging-scale-300kg';

-- ── Butchery: accessories ───────────────────────────────────────────────────

UPDATE products SET regular_price = 399, updated_at = NOW()
  WHERE slug = 'butchers-apron-pvc-120x80cm';

UPDATE products SET sku = 'Z33013', regular_price = 399, updated_at = NOW()
  WHERE slug = 'cut-resistant-gloves-small';

UPDATE products SET sku = 'Z33015', regular_price = 399, updated_at = NOW()
  WHERE slug = 'cut-resistant-gloves-medium';

UPDATE products SET sku = 'Z33020', regular_price = 399, updated_at = NOW()
  WHERE slug = 'cut-resistant-gloves-large';

UPDATE products SET sku = 'Z22009', regular_price = 302, updated_at = NOW()
  WHERE slug = 'magnetic-knife-holder-30cm';

UPDATE products SET sku = 'Z22012', regular_price = 424, updated_at = NOW()
  WHERE slug = 'magnetic-knife-board-60cm';

UPDATE products SET sku = 'Z11040', regular_price = 363, updated_at = NOW()
  WHERE slug = 'cutting-board-scraper-stainless';

-- ── Recalculate clearance sale prices (90% of updated regular_price) ────────

UPDATE products
SET sale_price = ROUND(regular_price * 0.9, 0), updated_at = NOW()
WHERE category_id = (SELECT id FROM categories WHERE slug = 'butchery-accessories' LIMIT 1)
  AND is_published = true
  AND regular_price > 0
  AND COALESCE(tags, '{}') @> ARRAY['clearance']::text[];
