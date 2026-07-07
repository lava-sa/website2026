export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";


async function adjustStockForOrders(orderIds: string[], mode: "restore" | "reduce") {
  const supabase = createServiceClient();
  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select("product_id, quantity")
    .in("order_id", orderIds);

  if (itemsErr) return { error: itemsErr.message };

  const quantityByProduct = new Map<string, number>();
  for (const item of items ?? []) {
    if (!item.product_id) continue;
    const qty = Number(item.quantity ?? 0);
    if (!Number.isFinite(qty) || qty <= 0) continue;
    quantityByProduct.set(item.product_id, (quantityByProduct.get(item.product_id) ?? 0) + qty);
  }

  const productIds = [...quantityByProduct.keys()];
  if (!productIds.length) return {};

  const { data: products, error: productsErr } = await supabase
    .from("products")
    .select("id, stock_quantity")
    .in("id", productIds);
  if (productsErr) return { error: productsErr.message };

  for (const product of products ?? []) {
    const qty = quantityByProduct.get(product.id) ?? 0;
    if (qty <= 0) continue;

    const currentQty = Number(product.stock_quantity ?? 0);
    const safeCurrentQty = Number.isFinite(currentQty) ? currentQty : 0;
    const nextQty = mode === "restore" ? safeCurrentQty + qty : Math.max(0, safeCurrentQty - qty);
    const nextStatus = nextQty > 0 ? "in_stock" : "out_of_stock";

    const { error: updateErr } = await supabase
      .from("products")
      .update({
        stock_quantity: nextQty,
        stock_status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (updateErr) return { error: updateErr.message };
  }

  return {};
}

type TrashBody = {
  ids?: string[];
  action?: "trash" | "restore";
};

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: TrashBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const action = body.action ?? "trash";
  if (!["trash", "restore"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter((id) => typeof id === "string" && id.length > 0) : [];
  if (!ids.length) return NextResponse.json({ error: "No order ids provided" }, { status: 400 });

  const supabase = createServiceClient();
  const { data: orders, error: ordersErr } = await supabase
    .from("orders")
    .select("id, trashed_at")
    .in("id", ids);

  if (ordersErr) return NextResponse.json({ error: ordersErr.message }, { status: 500 });

  const targetIds = (orders ?? [])
    .filter((o) => (action === "trash" ? !o.trashed_at : !!o.trashed_at))
    .map((o) => o.id);

  if (!targetIds.length) return NextResponse.json({ ok: true, changed: 0 });

  const stock = await adjustStockForOrders(targetIds, action === "trash" ? "restore" : "reduce");
  if (stock.error) return NextResponse.json({ error: stock.error }, { status: 500 });

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ trashed_at: action === "trash" ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .in("id", targetIds);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, changed: targetIds.length, action });
}
