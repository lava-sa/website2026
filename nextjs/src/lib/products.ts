import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/types/product";

// Server-side client (service role bypasses RLS)
function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      console.warn("⚠️ getClient: Missing Supabase URL or Service Role Key. Operations will fail.");
    }
    return createClient("https://placeholder.supabase.co", "placeholder");
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

/** All published products in a category slug, with images */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories!inner ( id, name, slug ),
      product_images ( id, url, alt, is_primary, sort_order )
    `)
    .eq("categories.slug", categorySlug)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getProductsByCategory: ${error.message}`);
  return (data ?? []) as Product[];
}

/** All featured products for homepage/marketing sections */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, sku, name, slug, short_description, description,
      regular_price, sale_price, stock_status, stock_quantity,
      weight_kg, length_cm, width_cm, height_cm, category_id,
      is_published, is_featured, sort_order, seo_title, seo_description,
      tags, specs, industries, primary_image_url, created_at, updated_at,
      categories ( id, name, slug )
    `)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`getFeaturedProducts: ${error.message}`);
  return (data ?? []) as Product[];
}

/** Single product by slug, with images */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories ( id, name, slug ),
      product_images ( id, url, alt, is_primary, sort_order )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`getProductBySlug: ${error.message}`);
  }
  return data as Product;
}

/** All product slugs for static generation */
export async function getAllProductSlugs(): Promise<string[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_published", true);

  if (error) throw new Error(`getAllProductSlugs: ${error.message}`);
  return (data ?? []).map((p) => p.slug);
}

/** Related products — same category, excluding current slug */
export async function getRelatedProducts(categorySlug: string, excludeSlug: string, limit = 3): Promise<Product[]> {
  const supabase = getClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, regular_price, sale_price,
      stock_status, primary_image_url, is_featured, sort_order,
      categories!inner ( slug )
    `)
    .eq("categories.slug", categorySlug)
    .eq("is_published", true)
    .neq("slug", excludeSlug)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`getRelatedProducts: ${error.message}`);
  return (data ?? []) as unknown as Product[];
}

/** Format price as ZAR */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Sort product images: primary first */
export function sortImages(images: Product["product_images"]) {
  if (!images?.length) return [];
  return [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });
}

/** 
 * Mapping of product tags to specialized sub-category pages 
 * for hierarchical breadcrumbs.
 */
export const SUB_CATEGORY_MAP: Record<string, { name: string; href: string }> = {
  "machinery": { name: "Butchery Machinery", href: "/products/butchery-machinery" },
  "boards": { name: "Cutting and Display Boards", href: "/products/butchery-boards" },
  "cutting-board": { name: "Cutting and Display Boards", href: "/products/butchery-boards" },
  "knife": { name: "Professional Knives", href: "/products/butchery-knives" },
  "hanging": { name: "Hanging Systems", href: "/products/butchery-hanging" },
  "protective": { name: "Protective Gear", href: "/products/butchery-protective" },
  "scale": { name: "Scales", href: "/products/butchery-scales" },
  "tools": { name: "Specialized Tools", href: "/products/butchery-tools" },
  "glass": { name: "Glass Vacuum Containers", href: "/products/glass-containers" },
  "jar-sealer": { name: "Vacuum Sealer for Glass Jar", href: "/products/glass-jar-sealer" },
  "stainless-steel": { name: "Stainless Steel Vacuum Containers", href: "/products/stainless-containers" },
  "lid": { name: "Vacuum Acrylic Lids", href: "/products/acrylic-lids" },
  "vacuum-bags": { name: "Embossed Vacuum Bags", href: "/products/vacuum-bags" },
  "vacuum-rolls": { name: "Embossed Vacuum Rolls", href: "/products/vacuum-rolls" },
};
