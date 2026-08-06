export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { verifyITNSignature, validateITNWithPayFast } from "@/lib/payfast";
import { dispatchOrderPaymentResultEmails } from "@/lib/order-payment-result";
import { awardPointsForPaidOrder } from "@/lib/points-award";

/**
 * PayFast Instant Transaction Notification — the ONLY source of truth for
 * whether a card payment succeeded. Order confirmation emails are sent from
 * here (and nowhere else for PayFast orders), so a declined card can never be
 * announced as a completed sale.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // ── 1. Parse params (preserve order for signature verification) ────────────
  const params = new URLSearchParams(rawBody);
  const entries: [string, string][] = [...params.entries()];

  const receivedSignature = params.get("signature") ?? "";
  const paymentStatus     = (params.get("payment_status") ?? "").toUpperCase();
  const orderNumber       = params.get("m_payment_id") ?? "";
  const pfPaymentId       = params.get("pf_payment_id") ?? "";
  const amount            = params.get("amount_gross") ?? "0";

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing m_payment_id" }, { status: 400 });
  }

  // ── 2. Authenticate the notification ──────────────────────────────────────
  //
  // Two independent proofs are available: our own MD5 over the payload, and
  // PayFast echoing the exact payload back as VALID. Either is sufficient.
  // Requiring the signature alone meant one encoding mistake silently threw
  // away every real payment — genuine ITNs 400'd and PayFast gave up retrying.
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";
  const sig = verifyITNSignature(entries, passphrase, receivedSignature);
  const fieldNames = entries.map(([k]) => k).join(",");

  if (sig.valid) {
    console.info(`ITN signature OK for ${orderNumber} (variant: ${sig.variant})`);
    try {
      const pfValid = await validateITNWithPayFast(rawBody);
      if (!pfValid) {
        console.error(`PayFast validation failed for order ${orderNumber}`);
        return NextResponse.json({ error: "PayFast validation failed" }, { status: 400 });
      }
    } catch (err) {
      // Network blip talking to PayFast — the signature already proved authenticity.
      console.warn("PayFast validate call error:", err);
    }
  } else {
    let serverValidated: boolean | null = null;
    try {
      serverValidated = await validateITNWithPayFast(rawBody);
    } catch (err) {
      console.warn("PayFast validate call error:", err);
    }

    if (serverValidated !== true) {
      console.error(
        `ITN REJECTED for ${orderNumber}: signature mismatch (tried ${sig.attempted.join(", ")}) ` +
          `and PayFast validate returned ${serverValidated}. Fields: ${fieldNames}`
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Authentic per PayFast itself — accept, but make the mismatch loud so the
    // encoding can be pinned down instead of silently relying on this path.
    console.warn(
      `ITN signature mismatch for ${orderNumber} BUT PayFast server confirmed the payload — accepting. Fields: ${fieldNames}`
    );
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

  // ── 5. Map PayFast status → our status ────────────────────────────────────
  // Anything that is not an explicit COMPLETE is treated as "not paid".
  const statusMap: Record<string, string> = {
    COMPLETE:  "paid",
    FAILED:    "failed",
    CANCELLED: "cancelled",
  };
  const newStatus = statusMap[paymentStatus] ?? "pending";
  const isPaid = newStatus === "paid";
  const isUnsuccessful = newStatus === "failed" || newStatus === "cancelled";

  // ── 6. Verify amount — only meaningful when money actually moved ──────────
  if (isPaid) {
    const receivedAmount = parseFloat(amount);
    if (Math.abs(receivedAmount - Number(order.total)) > 0.01) {
      console.error(
        `Amount mismatch for ${orderNumber}: expected ${order.total}, got ${receivedAmount}`
      );
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }
  }

  // ── 7. Update order ────────────────────────────────────────────────────────
  const update: Record<string, unknown> = { status: newStatus, pf_payment_id: pfPaymentId };

  const { error: updateErr } = await supabase
    .from("orders")
    .update({ ...update, payment_status_detail: paymentStatus })
    .eq("id", order.id);

  if (updateErr) {
    // payment_status_detail arrives with migration 033 — retry without it.
    const retry = await supabase.from("orders").update(update).eq("id", order.id);
    if (retry.error) {
      console.error(`Order update error for ${orderNumber}:`, retry.error.message);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
  }

  // ── 8. Announce the outcome — once, and only now that PayFast has spoken ──
  if (isPaid && order.status !== "paid") {
    const result = await dispatchOrderPaymentResultEmails({
      supabase,
      orderId: order.id,
      outcome: "paid",
    });
    console.info(`ITN paid emails for ${orderNumber}: ${result.sent ? "sent" : result.reason}`);
    await awardPointsForPaidOrder(supabase, order.id);
  } else if (isUnsuccessful && order.status !== "paid") {
    const result = await dispatchOrderPaymentResultEmails({
      supabase,
      orderId: order.id,
      outcome: "unsuccessful",
      failureDetail: paymentStatus,
    });
    console.info(
      `ITN unsuccessful emails for ${orderNumber}: ${result.sent ? "sent" : result.reason}`
    );
  }

  console.log(`ITN processed: ${orderNumber} → ${newStatus} (PayFast: ${paymentStatus || "n/a"})`);
  return NextResponse.json({ ok: true });
}
