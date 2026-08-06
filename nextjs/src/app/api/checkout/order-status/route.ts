export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { verifyOrderAccessToken } from "@/lib/order-access-token";

/**
 * Real payment status for the post-checkout pages, so /checkout/success can
 * never claim a payment succeeded when PayFast has not confirmed it.
 * Access requires the signed token minted for this order at checkout.
 */
export async function GET(req: NextRequest) {
  const orderNumber = (req.nextUrl.searchParams.get("order") ?? "").trim();
  const token = (req.nextUrl.searchParams.get("token") ?? "").trim();

  if (!orderNumber || !token) {
    return NextResponse.json({ error: "Missing order or token" }, { status: 400 });
  }

  const verified = verifyOrderAccessToken(token);
  if (!verified || verified.orderNumber !== orderNumber) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }

  const supabase = createServiceClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("order_number, status, email, total, payment_method")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (String(order.email ?? "").trim().toLowerCase() !== verified.email) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }

  return NextResponse.json({
    orderNumber: order.order_number,
    status: order.status,
    total: Number(order.total ?? 0),
    paymentMethod: order.payment_method ?? "payfast",
  });
}
