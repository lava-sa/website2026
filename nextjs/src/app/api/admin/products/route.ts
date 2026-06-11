export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/slug";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(input: string, max: number): string {
  return input.length <= max ? input : `${input.slice(0, max - 1).trim()}…`;
}

function autoSeoTitle(name: string): string {
  return truncate(`${name} | Lava-SA`, 60);
}

function autoSeoDescription(name: string, shortDescription?: string | null, description?: string | null): string {
  const base = stripHtml(shortDescription || description || "").trim();
  if (base) return truncate(base, 160);
  return truncate(
    `Buy ${name} from Lava-SA in South Africa. German quality vacuum sealing products with nationwide delivery and local support.`,
    160
  );
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, sku, category_id, regular_price, stock_status, is_published, short_description, description, seo_title, seo_description } = body;

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
      seo_title:         (seo_title?.trim?.() || autoSeoTitle(name)),
      seo_description:   (seo_description?.trim?.() || autoSeoDescription(name, short_description, description)),
      updated_at:        new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/products", "layout");
  revalidatePath("/");

  return NextResponse.json({ product }, { status: 201 });
}
