export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { verifyOrderAccessToken } from "@/lib/order-access-token";
import { dispatchOrderPaymentResultEmails } from "@/lib/order-payment-result";

/**
 * Called by /checkout/cancel when PayFast returns the customer to us without a
 * completed payment (declined card, or they backed out).
 *
 * PayFast does not always send an ITN for an abandoned/declined attempt, so this
 * is the second net: it marks the order cancelled and sends the "payment
 * unsuccessful" emails so Anneke has the order in front of her to follow up.
 *
 * Requires the signed token minted for this order at checkout — nobody can
 * cancel someone else's order by guessing an order number.
 */
export async function POST(req: NextRequest) {
  let body: { order?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const orderNumber = String(body.order ?? "").trim();
  const token = String(body.token ?? "").trim();
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
    .select("id, status, email, payment_method")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (String(order.email ?? "").trim().toLowerCase() !== verified.email) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  }

  // Never touch an order that already has a resolved payment outcome.
  if (order.status !== "pending") {
    return NextResponse.json({ ok: true, status: order.status, changed: false });
  }

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status: "cancelled", payment_status_detail: "CANCELLED_AT_PAYFAST" })
    .eq("id", order.id)
    .eq("status", "pending");

  if (updateErr) {
    // payment_status_detail arrives with migration 033 — retry without it.
    const retry = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id)
      .eq("status", "pending");
    if (retry.error) {
      console.error(`Cancel update failed for ${orderNumber}:`, retry.error.message);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
  }

  const result = await dispatchOrderPaymentResultEmails({
    supabase,
    orderId: order.id,
    outcome: "unsuccessful",
    failureDetail: "Customer returned from PayFast without a completed payment",
  });

  console.info(
    `PayFast cancel handled for ${orderNumber}: emails ${result.sent ? "sent" : result.reason}`
  );

  return NextResponse.json({ ok: true, status: "cancelled", changed: true });
}
