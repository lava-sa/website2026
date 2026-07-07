export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";


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

export async function POST() {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, short_description, description, seo_title, seo_description");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let updated = 0;
  for (const product of data ?? []) {
    const hasTitle = typeof product.seo_title === "string" && product.seo_title.trim().length > 0;
    const hasDescription = typeof product.seo_description === "string" && product.seo_description.trim().length > 0;
    if (hasTitle && hasDescription) continue;

    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (!hasTitle) payload.seo_title = autoSeoTitle(product.name);
    if (!hasDescription) payload.seo_description = autoSeoDescription(product.name, product.short_description, product.description);

    const { error: updateErr } = await supabase.from("products").update(payload).eq("id", product.id);
    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
    updated += 1;
  }

  revalidatePath("/products", "layout");
  revalidatePath("/");

  return NextResponse.json({ ok: true, updated });
}
