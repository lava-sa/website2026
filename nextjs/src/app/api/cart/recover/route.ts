export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { verifyCartRecoveryToken } from "@/lib/cart-recovery-token";
import { getProductsByIds, productAllowsShipping, resolveProductUnitPrice } from "@/lib/products";

/**
 * Returns the saved basket behind a recovery link, re-priced from the live
 * catalogue. Sold-out or withdrawn lines are reported rather than silently
 * restored, so nobody is walked into a checkout that will reject their order.
 */
export async function GET(req: NextRequest) {
  const token = (req.nextUrl.searchParams.get("token") ?? "").trim();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const verified = verifyCartRecoveryToken(token);
  if (!verified) {
    return NextResponse.json({ error: "This link has expired" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { data: cart, error } = await supabase
    .from("abandoned_carts")
    .select("id, email, items")
    .eq("id", verified.cartId)
    .maybeSingle();

  if (error || !cart) return NextResponse.json({ error: "Basket not found" }, { status: 404 });
  if (String(cart.email ?? "").toLowerCase() !== verified.email) {
    return NextResponse.json({ error: "This link has expired" }, { status: 403 });
  }

  const saved = (cart.items ?? []) as { id: string; name: string; quantity: number }[];
  const ids = [...new Set(saved.map((i) => i.id).filter(Boolean))];
  if (ids.length === 0) return NextResponse.json({ items: [], unavailable: [] });

  const rows = await getProductsByIds(ids).catch(() => []);
  const byId = new Map(rows.map((r) => [r.id, r]));

  const items = [];
  const unavailable: string[] = [];

  for (const line of saved) {
    const row = byId.get(line.id);
    if (!row || row.stock_status === "out_of_stock") {
      unavailable.push(line.name);
      continue;
    }
    items.push({
      id: row.id,
      slug: "",
      name: row.name,
      price: resolveProductUnitPrice(row), // live price, not the saved one
      image: null,
      quantity: Math.min(Math.max(Number(line.quantity ?? 1) || 1, 1), 99),
      sku: row.sku,
      shippingEnabled: productAllowsShipping(row),
    });
  }

  return NextResponse.json({ items, unavailable });
}
