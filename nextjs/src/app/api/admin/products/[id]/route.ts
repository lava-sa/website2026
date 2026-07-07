export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { isValidSlug } from "@/lib/slug";


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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const supabase = createServiceClient();

  // Only allow safe fields to be updated
  const allowed = [
    "name", "sku", "slug", "short_description", "description",
    "regular_price", "sale_price", "stock_status", "stock_quantity",
    "is_published", "is_featured", "category_id", "tags",
    "seo_title", "seo_description", "weight_kg", "sort_order", "specs",
  ];

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { data: current } = await supabase
    .from("products")
    .select("name, slug, short_description, description, seo_title, seo_description")
    .eq("id", id)
    .maybeSingle();

  const currentSlug = String(current?.slug ?? "");
  const nextSlug = typeof body.slug === "string" ? body.slug.trim() : currentSlug;

  if (body.slug !== undefined) {
    if (!isValidSlug(nextSlug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase letters, numbers and hyphens only." },
        { status: 400 }
      );
    }
    if (nextSlug !== currentSlug) {
      const { data: conflict } = await supabase
        .from("products")
        .select("id")
        .eq("slug", nextSlug)
        .neq("id", id)
        .maybeSingle();
      if (conflict) {
        return NextResponse.json({ error: "That slug is already used by another product." }, { status: 400 });
      }

      await supabase
        .from("product_slug_redirects")
        .update({ new_slug: nextSlug })
        .eq("new_slug", currentSlug);

      await supabase.from("product_slug_redirects").upsert(
        { old_slug: currentSlug, new_slug: nextSlug, product_id: id },
        { onConflict: "old_slug" }
      );

      update.slug = nextSlug;
      revalidatePath(`/products/${currentSlug}`);
      revalidatePath(`/products/${nextSlug}`);
    }
  }

  const effectiveName = String(update.name ?? current?.name ?? "").trim();
  const effectiveShort = String(update.short_description ?? current?.short_description ?? "");
  const effectiveDescription = String(update.description ?? current?.description ?? "");
  const requestedSeoTitle = typeof update.seo_title === "string" ? update.seo_title.trim() : undefined;
  const requestedSeoDescription = typeof update.seo_description === "string" ? update.seo_description.trim() : undefined;

  if (!requestedSeoTitle) update.seo_title = autoSeoTitle(effectiveName);
  if (!requestedSeoDescription) update.seo_description = autoSeoDescription(effectiveName, effectiveShort, effectiveDescription);

  const { error } = await supabase
    .from("products")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/products", "layout");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
