export type StockStatus = "in_stock" | "out_of_stock" | "on_backorder" | "on_order";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  regular_price: number;
  sale_price: number | null;
  stock_status: StockStatus;
  stock_quantity: number | null;
  weight_kg: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  category_id: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  specs: Record<string, string>;
  industries: string[];
  primary_image_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  product_images?: ProductImage[];
  categories?: Category;
}
