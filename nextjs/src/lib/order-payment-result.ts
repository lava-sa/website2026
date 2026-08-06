import type { SupabaseClient } from "@supabase/supabase-js";
import type { CartItem } from "@/lib/cart-context";
import { sendOrderOutcomeEmails, type OrderEmailOutcome } from "@/lib/order-email";
import { isDeliveryMethod, type DeliveryMethod } from "@/lib/shipping";

/**
 * Emails that announce the RESULT of a PayFast payment (confirmed or unsuccessful).
 *
 * Two guarantees:
 *  1. Nothing is sent until PayFast has actually told us what happened.
 *  2. The result email goes out exactly once per order — the send slot is
 *     claimed atomically, so duplicate ITNs, retries, or a customer refreshing
 *     the cancel page can never produce a second email.
 */

type DispatchArgs = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>;
  orderId: string;
  outcome: Extract<OrderEmailOutcome, "paid" | "unsuccessful" | "returned_unconfirmed">;
  /** Raw PayFast payment_status, shown to admin only. */
  failureDetail?: string | null;
};

type DispatchResult = { sent: boolean; reason?: string };

const ORDER_COLUMNS =
  "id, order_number, first_name, last_name, email, phone, address, city, province, postal_code, notes, subtotal, shipping, total, payment_method, delivery_method";

/** Legacy DB (migration 033 not yet run) — column simply isn't there. */
function isMissingColumn(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === "42703" ||
    /payment_result_email_(sent_at|outcome)|delivery_method/.test(error.message ?? "")
  );
}

export async function dispatchOrderPaymentResultEmails(
  args: DispatchArgs
): Promise<DispatchResult> {
  const { supabase, orderId, outcome, failureDetail } = args;

  // ── 1. Claim the send slot atomically (no row updated = already sent) ────
  // The claim is per OUTCOME: a payment that first failed and is later completed
  // still gets its confirmation, but the same outcome never goes out twice.
  let order: Record<string, unknown> | null = null;

  const claim = await supabase
    .from("orders")
    .update({
      payment_result_email_sent_at: new Date().toISOString(),
      payment_result_email_outcome: outcome,
    })
    .eq("id", orderId)
    .or(`payment_result_email_outcome.is.null,payment_result_email_outcome.neq.${outcome}`)
    .select(ORDER_COLUMNS)
    .maybeSingle();

  if (claim.error && isMissingColumn(claim.error)) {
    console.warn(
      "orders.payment_result_email_sent_at missing — run supabase/033_shipping_toggle_and_payment_result.sql (duplicate-send guard inactive)"
    );
    const fallback = await supabase
      .from("orders")
      .select(
        "id, order_number, first_name, last_name, email, phone, address, city, province, postal_code, notes, subtotal, shipping, total, payment_method"
      )
      .eq("id", orderId)
      .maybeSingle();
    if (fallback.error || !fallback.data) {
      return { sent: false, reason: "order-not-found" };
    }
    order = fallback.data as Record<string, unknown>;
  } else if (claim.error) {
    console.error("Payment-result email claim failed:", claim.error.message);
    return { sent: false, reason: "claim-failed" };
  } else if (!claim.data) {
    // Another request already claimed it — this is the normal duplicate path.
    return { sent: false, reason: "already-sent" };
  } else {
    order = claim.data as Record<string, unknown>;
  }

  const email = String(order.email ?? "").trim();
  if (!email) return { sent: false, reason: "no-email" };

  // ── 2. Load the line items for the email body ───────────────────────────
  const { data: itemRows } = await supabase
    .from("order_items")
    .select("product_id, product_name, product_sku, quantity, unit_price")
    .eq("order_id", orderId);

  const cart: CartItem[] = (itemRows ?? []).map((row) => ({
    id: String(row.product_id ?? ""),
    slug: "",
    name: String(row.product_name ?? "Item"),
    price: Number(row.unit_price ?? 0),
    image: null,
    quantity: Number(row.quantity ?? 1),
    sku: (row.product_sku as string | null) ?? null,
  }));

  const deliveryMethod: DeliveryMethod = isDeliveryMethod(order.delivery_method)
    ? order.delivery_method
    : "delivery";

  // ── 3. Send ─────────────────────────────────────────────────────────────
  await sendOrderOutcomeEmails({
    orderNumber: String(order.order_number ?? ""),
    paymentMethod: order.payment_method === "bank_transfer" ? "bank_transfer" : "payfast",
    outcome,
    deliveryMethod,
    failureDetail: failureDetail ?? null,
    customer: {
      first_name: String(order.first_name ?? ""),
      last_name: String(order.last_name ?? ""),
      email,
      phone: String(order.phone ?? ""),
      address: (order.address as string | null) ?? undefined,
      city: (order.city as string | null) ?? undefined,
      province: (order.province as string | null) ?? undefined,
      postal_code: (order.postal_code as string | null) ?? undefined,
      notes: (order.notes as string | null) ?? undefined,
    },
    cart,
    subtotal: Number(order.subtotal ?? 0),
    shipping: Number(order.shipping ?? 0),
    total: Number(order.total ?? 0),
  });

  return { sent: true };
}
