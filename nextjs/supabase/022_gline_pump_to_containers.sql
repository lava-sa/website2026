-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Move G-Line glass + Easy Pump to Containers
-- Anneke: these belong under Glass Containers, not Sous Vide
-- Run in Supabase SQL Editor (idempotent)
-- ═══════════════════════════════════════════════════════

UPDATE products
SET
  category_id = (SELECT id FROM categories WHERE slug = 'containers-lids' LIMIT 1),
  tags = (
    SELECT COALESCE(array_agg(t), '{}')
    FROM unnest(COALESCE(tags, '{}')) AS t
    WHERE t <> 'sous-vide'
  ),
  updated_at = now()
WHERE slug IN (
  'electric-vacuum-pump',
  'g-line-glass-vacuum-container-black',
  'g-line-glass-vacuum-container-white'
);
