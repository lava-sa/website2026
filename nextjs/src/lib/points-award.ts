import type { SupabaseClient } from "@supabase/supabase-js";
import {
  calculatePointsEarned,
  isLineItemChargedAtRegularPrice,
  isProductEligibleForPoints,
  orderQualifiesForPoints,
} from "@/lib/rewards-config";

type OrderRow = {
  id: string;
  order_number: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  points_awarded: number | null;
};

type OrderItemRow = {
  product_id: string | null;
  product_name: string;
  unit_price: number;
  line_total: number;
};

type ProductRow = {
  id: string;
  regular_price: number;
  sale_price: number | null;
  tags: string[] | null;
};

/**
 * Credit Lava Points when an order is marked paid.
 * Idempotent — skips if points_awarded is already set on the order.
 */
export async function awardPointsForPaidOrder(
  supabase: SupabaseClient,
  orderId: string
): Promise<{ awarded: number } | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, order_number, email, first_name, last_name, status, created_at, points_awarded")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    console.warn("points-award: order not found", orderId, error?.message);
    return null;
  }

  const row = order as OrderRow;
  if (row.status !== "paid") return null;
  if (row.points_awarded != null) return { awarded: row.points_awarded };

  if (!orderQualifiesForPoints(row.created_at)) {
    await supabase.from("orders").update({ points_awarded: 0 }).eq("id", orderId);
    return { awarded: 0 };
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("product_id, product_name, unit_price, line_total")
    .eq("order_id", orderId);

  if (!items?.length) {
    await supabase.from("orders").update({ points_awarded: 0 }).eq("id", orderId);
    return { awarded: 0 };
  }

  const productIds = (items as OrderItemRow[])
    .map((i) => i.product_id)
    .filter((id): id is string => Boolean(id));

  const productsById = new Map<string, ProductRow>();
  if (productIds.length) {
    const { data: products } = await supabase
      .from("products")
      .select("id, regular_price, sale_price, tags")
      .in("id", productIds);
    for (const p of (products ?? []) as ProductRow[]) {
      productsById.set(p.id, p);
    }
  }

  let eligibleTotal = 0;
  for (const item of items as OrderItemRow[]) {
    if (!item.product_id) continue;
    const product = productsById.get(item.product_id);
    if (!product) continue;
    if (!isProductEligibleForPoints({
      regular_price: Number(product.regular_price),
      sale_price: product.sale_price != null ? Number(product.sale_price) : null,
      tags: product.tags ?? [],
    })) {
      continue;
    }
    const unitPrice = Number(item.unit_price);
    const regularPrice = Number(product.regular_price);
    if (!isLineItemChargedAtRegularPrice(unitPrice, regularPrice)) continue;
    eligibleTotal += Number(item.line_total);
  }

  const points = calculatePointsEarned(eligibleTotal);

  if (points <= 0) {
    await supabase.from("orders").update({ points_awarded: 0 }).eq("id", orderId);
    return { awarded: 0 };
  }

  const email = row.email?.toLowerCase().trim();
  if (!email) {
    await supabase.from("orders").update({ points_awarded: points }).eq("id", orderId);
    return { awarded: points };
  }

  const { data: existing } = await supabase
    .from("customers")
    .select("id, points_balance, lifetime_points")
    .eq("email", email)
    .maybeSingle();

  let customerId: string;
  let balanceAfter: number;

  if (existing?.id) {
    customerId = existing.id as string;
    balanceAfter = (existing.points_balance ?? 0) + points;
    await supabase
      .from("customers")
      .update({
        points_balance: balanceAfter,
        lifetime_points: (existing.lifetime_points ?? 0) + points,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customerId);
  } else {
    balanceAfter = points;
    const { data: created, error: createErr } = await supabase
      .from("customers")
      .insert({
        email,
        first_name: row.first_name,
        last_name: row.last_name,
        points_balance: points,
        lifetime_points: points,
      })
      .select("id")
      .single();
    if (createErr || !created?.id) {
      console.error("points-award: could not create customer", createErr?.message);
      await supabase.from("orders").update({ points_awarded: points }).eq("id", orderId);
      return { awarded: points };
    }
    customerId = created.id as string;
  }

  await supabase.from("points_transactions").insert({
    customer_id: customerId,
    order_id: orderId,
    type: "earned",
    points,
    balance_after: balanceAfter,
    description: `Earned on order ${row.order_number}`,
  });

  await supabase.from("orders").update({ points_awarded: points }).eq("id", orderId);
  return { awarded: points };
}
