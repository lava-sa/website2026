export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, sku, category_id, regular_price, stock_status, is_published, short_description, description } = body;

  if (!name || regular_price === undefined || regular_price === null) {
    return NextResponse.json({ error: "Name and price are required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Ensure slug is unique
  const baseSlug = generateSlug(name) || "product";
  let slug = baseSlug;
  let suffix = 2;
  while (true) {
    const { data } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      sku:               sku || null,
      category_id:       category_id || null,
      regular_price:     Number(regular_price),
      sale_price:        null,
      stock_status:      stock_status ?? "in_stock",
      is_published:      is_published ?? false,
      is_featured:       false,
      short_description: short_description || null,
      description:       description || null,
      updated_at:        new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/products", "layout");
  revalidatePath("/");

  return NextResponse.json({ product }, { status: 201 });
}
