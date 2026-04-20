-- ═══════════════════════════════════════════════════════
-- LAVA-SA — Products Schema
-- Run once in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════

-- Categories
CREATE TABLE categories (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  parent_id   uuid REFERENCES categories(id),
  image_url   text,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- Products
CREATE TABLE products (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sku               text UNIQUE,
  name              text NOT NULL,
  slug              text UNIQUE NOT NULL,
  short_description text,
  description       text,
  regular_price     decimal(10,2) NOT NULL,
  sale_price        decimal(10,2),
  stock_status      text DEFAULT 'in_stock'
                    CHECK (stock_status IN ('in_stock','out_of_stock','on_backorder','on_order')),
  stock_quantity    int,
  weight_kg         decimal(6,3),
  length_cm         decimal(8,2),
  width_cm          decimal(8,2),
  height_cm         decimal(8,2),
  category_id       uuid REFERENCES categories(id),
  is_published      boolean DEFAULT true,
  is_featured       boolean DEFAULT false,
  sort_order        int DEFAULT 0,
  seo_title         text,
  seo_description   text,
  tags              text[]  DEFAULT '{}',
  specs             jsonb   DEFAULT '{}',
  industries        text[]  DEFAULT '{}',
  primary_image_url text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

-- Product images gallery
CREATE TABLE product_images (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url        text NOT NULL,
  alt        text,
  is_primary boolean DEFAULT false,
  sort_order int DEFAULT 0
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security — public reads, service-role writes
ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_categories"     ON categories     FOR SELECT USING (true);
CREATE POLICY "public_read_products"       ON products       FOR SELECT USING (is_published = true);
CREATE POLICY "public_read_product_images" ON product_images FOR SELECT USING (true);
