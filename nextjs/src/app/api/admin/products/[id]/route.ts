export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/lib/supabase";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get("admin_session")?.value === "authenticated";
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Only allow safe fields to be updated
  const allowed = [
    "name", "sku", "short_description", "description",
    "regular_price", "sale_price", "stock_status", "stock_quantity",
    "is_published", "is_featured", "category_id",
    "seo_title", "seo_description", "weight_kg", "sort_order",
  ];

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  const { error } = await createServiceClient()
    .from("products")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
