export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { verifyOrderAccessToken } from "@/lib/order-access-token";
import { dispatchOrderPaymentResultEmails } from "@/lib/order-payment-result";

/**
 * Safety net for a PayFast order whose ITN never arrives.
 *
 * The customer completed the PayFast step and came back to /checkout/success,
 * but PayFast has not confirmed the payment to us. We do NOT claim the order is
 * paid — the order stays "pending" and both parties get an explicitly
 * UNCONFIRMED notice so Anneke checks the PayFast dashboard before dispatching.
 *
 * Without this, a broken/disabled ITN would mean a real paying customer hears
 * nothing at all. Sends once per order (the outcome-claim guard).
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

  // Only for a PayFast order still waiting on an outcome.
  if (order.status !== "pending" || order.payment_method === "bank_transfer") {
    return NextResponse.json({ ok: true, notified: false, status: order.status });
  }

  const result = await dispatchOrderPaymentResultEmails({
    supabase,
    orderId: order.id,
    outcome: "returned_unconfirmed",
  });

  console.info(
    `PayFast return without ITN for ${orderNumber}: notice ${result.sent ? "sent" : result.reason}`
  );

  return NextResponse.json({ ok: true, notified: result.sent, status: order.status });
}
