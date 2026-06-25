export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getProductBySlug } from "@/lib/products";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function toJanetProduct(p: {
  id: string;
  slug: string;
  name: string;
  sale_price: number | null;
  regular_price: number;
  sku: string | null;
  primary_image_url: string | null;
  stock_status: string;
}) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.sale_price ?? p.regular_price,
    sku: p.sku,
    image: p.primary_image_url,
    canAddToCart: p.stock_status !== "on_order",
  };
}

/** Resolve a product for Janet add_to_cart — by slug or fuzzy name search. */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")?.trim();
  const q = searchParams.get("q")?.trim();

  if (slug) {
    try {
      const product = await getProductBySlug(slug);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product: toJanetProduct(product) });
    } catch (err) {
      console.error("janet-product slug lookup:", err);
      return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
    }
  }

  if (q) {
    const supabase = getClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const needle = q.replace(/[%_]/g, "");
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, sale_price, regular_price, sku, primary_image_url, stock_status")
      .eq("is_published", true)
      .or(`name.ilike.%${needle}%,slug.ilike.%${needle}%,sku.ilike.%${needle}%`)
      .order("sort_order", { ascending: true })
      .limit(5);

    if (error) {
      console.error("janet-product search:", error.message);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    const products = (data ?? []).map(toJanetProduct);
    if (products.length === 0) {
      return NextResponse.json({ error: "No matching products" }, { status: 404 });
    }

    return NextResponse.json({
      product: products[0],
      alternatives: products.slice(1),
    });
  }

  return NextResponse.json({ error: "Provide slug or q parameter" }, { status: 400 });
}
