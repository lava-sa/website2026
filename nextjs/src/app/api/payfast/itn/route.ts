export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { verifyITNSignature, validateITNWithPayFast } from "@/lib/payfast";
import { sendPaymentReceivedEmails } from "@/lib/order-email";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // ── 1. Parse params (preserve order for signature verification) ────────────
  const params = new URLSearchParams(rawBody);
  const entries: [string, string][] = [...params.entries()];

  const receivedSignature = params.get("signature") ?? "";
  const paymentStatus     = params.get("payment_status") ?? "";
  const orderNumber       = params.get("m_payment_id") ?? "";
  const pfPaymentId       = params.get("pf_payment_id") ?? "";
  const amount            = params.get("amount_gross") ?? "0";

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing m_payment_id" }, { status: 400 });
  }

  // ── 2. Verify signature ────────────────────────────────────────────────────
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";
  const sigValid = verifyITNSignature(entries, passphrase, receivedSignature);
  if (!sigValid) {
    console.error(`ITN signature mismatch for order ${orderNumber}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── 3. Validate with PayFast server ───────────────────────────────────────
  try {
    const pfValid = await validateITNWithPayFast(rawBody);
    if (!pfValid) {
      console.error(`PayFast validation failed for order ${orderNumber}`);
      return NextResponse.json({ error: "PayFast validation failed" }, { status: 400 });
    }
  } catch (err) {
    // If the PayFast validate call fails (network issue), log but continue
    console.warn("PayFast validate call error:", err);
  }

  // ── 4. Look up order ───────────────────────────────────────────────────────
  const supabase = createServiceClient();

  const { data: order, error: findErr } = await supabase
    .from("orders")
    .select("id, total, status, first_name, last_name, email")
    .eq("order_number", orderNumber)
    .single();

  if (findErr || !order) {
    console.error(`Order not found: ${orderNumber}`);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // ── 5. Verify amount (prevent fraud) ──────────────────────────────────────
  const receivedAmount = parseFloat(amount);
  if (Math.abs(receivedAmount - Number(order.total)) > 0.01) {
    console.error(
      `Amount mismatch for ${orderNumber}: expected ${order.total}, got ${receivedAmount}`
    );
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  // ── 6. Map PayFast status → our status ────────────────────────────────────
  const statusMap: Record<string, string> = {
    COMPLETE:  "paid",
    FAILED:    "failed",
    CANCELLED: "cancelled",
  };
  const newStatus = statusMap[paymentStatus] ?? "pending";

  // ── 7. Update order ────────────────────────────────────────────────────────
  const { error: updateErr } = await supabase
    .from("orders")
    .update({ status: newStatus, pf_payment_id: pfPaymentId })
    .eq("id", order.id);

  if (updateErr) {
    console.error(`Order update error for ${orderNumber}:`, updateErr.message);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }

  // Send payment confirmation emails only on the transition into "paid".
  if (newStatus === "paid" && order.status !== "paid" && order.email) {
    await sendPaymentReceivedEmails({
      orderNumber,
      customer: {
        first_name: order.first_name ?? "",
        last_name: order.last_name ?? "",
        email: order.email,
      },
      total: Number(order.total),
    });
  }

  console.log(`ITN processed: ${orderNumber} → ${newStatus}`);
  return NextResponse.json({ ok: true });
}
