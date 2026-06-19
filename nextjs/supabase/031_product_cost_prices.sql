-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Product cost prices (NET ex-VAT, June 2026 price list)
-- cost_price = supplier NET column; regular_price = TOTAL COST incl. 15% VAT
-- Run in Supabase SQL Editor (idempotent)
-- ═══════════════════════════════════════════════════════

ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price decimal(10,2);

COMMENT ON COLUMN products.cost_price IS 'Supplier NET cost ex-VAT (ZAR). From Landig price list.';

UPDATE products SET cost_price = 3687, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'LX0020';
UPDATE products SET cost_price = 631, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0002';
UPDATE products SET cost_price = 283, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0003';
UPDATE products SET cost_price = 1065, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0007';
UPDATE products SET cost_price = 796, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0008';
UPDATE products SET cost_price = 587, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0010(4';
UPDATE products SET cost_price = 422, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0011(2';
UPDATE products SET cost_price = 539, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0012(2';
UPDATE products SET cost_price = 474, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0013(2';
UPDATE products SET cost_price = 200, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0018';
UPDATE products SET cost_price = 230, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0021';
UPDATE products SET cost_price = 365, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0022';
UPDATE products SET cost_price = 317, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0023';
UPDATE products SET cost_price = 522, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0026';
UPDATE products SET cost_price = 517, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0027';
UPDATE products SET cost_price = 865, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0028';
UPDATE products SET cost_price = 1139, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0029';
UPDATE products SET cost_price = 513, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0031';
UPDATE products SET cost_price = 452, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0032';
UPDATE products SET cost_price = 570, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0033';
UPDATE products SET cost_price = 417, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0054';
UPDATE products SET cost_price = 363, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0056';
UPDATE products SET cost_price = 452, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0057';
UPDATE products SET cost_price = 796, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0058';
UPDATE products SET cost_price = 599, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0065';
UPDATE products SET cost_price = 765, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0066';
UPDATE products SET cost_price = 852, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0075';
UPDATE products SET cost_price = 1000, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0076';
UPDATE products SET cost_price = 1222, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0077';
UPDATE products SET cost_price = 557, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0083';
UPDATE products SET cost_price = 687, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0084';
UPDATE products SET cost_price = 739, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0085';
UPDATE products SET cost_price = 226, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0090';
UPDATE products SET cost_price = 278, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0099';
UPDATE products SET cost_price = 8696, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0100P';
UPDATE products SET cost_price = 9565, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0100PX';
UPDATE products SET cost_price = 791, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0131';
UPDATE products SET cost_price = 513, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0163';
UPDATE products SET cost_price = 222, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0180';
UPDATE products SET cost_price = 300, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0181';
UPDATE products SET cost_price = 548, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0193';
UPDATE products SET cost_price = 130, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0295';
UPDATE products SET cost_price = 174, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0296';
UPDATE products SET cost_price = 200, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0297';
UPDATE products SET cost_price = 12439, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0300P';
UPDATE products SET cost_price = 11739, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0300PX';
UPDATE products SET cost_price = 25991, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0400P';
UPDATE products SET cost_price = 35835, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL0500P';
UPDATE products SET cost_price = 608, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL1193';
UPDATE products SET cost_price = 59374, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'VL1200P';
UPDATE products SET cost_price = 405, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'WK104';
UPDATE products SET cost_price = 316, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z11040';
UPDATE products SET cost_price = 1144, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z11052';
UPDATE products SET cost_price = 652, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z11060';
UPDATE products SET cost_price = 435, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z11061';
UPDATE products SET cost_price = 262, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z22009';
UPDATE products SET cost_price = 368, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z22012';
UPDATE products SET cost_price = 347, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z33010';
UPDATE products SET cost_price = 347, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z33013';
UPDATE products SET cost_price = 347, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z33014';
UPDATE products SET cost_price = 347, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z33015';
UPDATE products SET cost_price = 347, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z33020';
UPDATE products SET cost_price = 39, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44043';
UPDATE products SET cost_price = 57, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44044';
UPDATE products SET cost_price = 75, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44046';
UPDATE products SET cost_price = 178, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44051';
UPDATE products SET cost_price = 307, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44052';
UPDATE products SET cost_price = 122, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44053';
UPDATE products SET cost_price = 783, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44060';
UPDATE products SET cost_price = 1565, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z44060A';
UPDATE products SET cost_price = 696, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z55011';
UPDATE products SET cost_price = 1304, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z55012';
UPDATE products SET cost_price = 4522, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z55015';
UPDATE products SET cost_price = 4044, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z66130';
UPDATE products SET cost_price = 438, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z99051';
UPDATE products SET cost_price = 613, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z99053';
UPDATE products SET cost_price = 798, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z99055';
UPDATE products SET cost_price = 921, updated_at = NOW() WHERE UPPER(TRIM(sku)) = 'Z99057';
