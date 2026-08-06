export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds, productAllowsShipping } from "@/lib/products";
import { parseFunnelCartItemId } from "@/lib/funnel";

/**
 * Which delivery options this cart may use. The browser asks before rendering the
 * delivery/collection choice; the checkout route re-derives the same answer when
 * the order is placed, so this is a UI convenience, never the authority.
 */
export async function POST(req: NextRequest) {
  let body: { productIds?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const ids = (body.productIds ?? [])
    .filter((id): id is string => typeof id === "string" && id.length > 0)
    .map((id) => parseFunnelCartItemId(id)?.baseProductId ?? id);

  if (ids.length === 0) {
    return NextResponse.json({ deliveryAvailable: true, collectionOnlyItems: [] });
  }

  try {
    const rows = await getProductsByIds(ids);
    const collectionOnlyItems = rows.filter((row) => !productAllowsShipping(row)).map((row) => row.name);

    return NextResponse.json({
      deliveryAvailable: collectionOnlyItems.length === 0,
      collectionOnlyItems,
    });
  } catch (err) {
    console.error("Shipping options lookup failed:", err);
    // Fail open — checkout still validates properly server-side.
    return NextResponse.json({ deliveryAvailable: true, collectionOnlyItems: [] });
  }
}
