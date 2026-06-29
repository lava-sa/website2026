export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { generateSignature, getPayFastUrl } from "@/lib/payfast";
import { ensureCheckoutCustomerAccount, type CheckoutAccountResult } from "@/lib/checkout-customer-account";
import { sendOrderPlacedEmails } from "@/lib/order-email";
import { getPublicSiteUrl } from "@/lib/seo";
import type { CartItem } from "@/lib/cart-context";
import { getShipping } from "@/lib/shipping";

async function generateOrderNumber(supabase: ReturnType<typeof createServiceClient>): Promise<string> {
  const { data, error } = await supabase
    .from("orders")
    .select("order_number")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(`Failed to generate order number: ${error.message}`);

  let maxNumeric = 6129;
  for (const row of data ?? []) {
    const raw = String(row.order_number ?? "").trim();
    const m = raw.match(/^(?:ORD-)?(\d+)$/i);
    if (!m) continue;
    const parsed = parseInt(m[1], 10);
    if (Number.isFinite(parsed)) maxNumeric = Math.max(maxNumeric, parsed);
  }

  return `ORD-${maxNumeric + 1}`;
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

interface CheckoutBody {
  cart: CartItem[];
  payment_method?: "payfast" | "bank_transfer";
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    notes?: string;
  };
}

export async function POST(req: NextRequest) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { cart, customer, payment_method = "payfast" } = body;
  if (!cart?.length)        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  if (!customer?.first_name || !customer?.email)
    return NextResponse.json({ error: "Missing customer details" }, { status: 400 });

  // ── 2. Calculate totals ────────────────────────────────────────────────────
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = getShipping(subtotal, customer.province);
  const total    = subtotal + shipping;

  // ── 3. Save order to Supabase ──────────────────────────────────────────────
  const supabase = createServiceClient();

  let orderNumber = "";
  let order: { id: string } | null = null;
  let orderErr: { message: string; code?: string } | null = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    orderNumber = await generateOrderNumber(supabase);
    const insert = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        province: customer.province,
        postal_code: customer.postal_code,
        notes: customer.notes ?? null,
        subtotal,
        shipping,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (!insert.error) {
      order = insert.data;
      orderErr = null;
      break;
    }

    orderErr = { message: insert.error.message, code: (insert.error as { code?: string }).code };
    if (orderErr.code !== "23505") break;
  }

  if (orderErr || !order) {
    console.error("Order insert error:", orderErr?.message ?? "Unknown insert error");
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  // ── 3b. Tag payment method (requires supabase-orders-payment-method.sql migration) ──
  // Silent — if column doesn't exist yet this just logs a warning, order still succeeds.
  await supabase.from("orders").update({ payment_method }).eq("id", order.id)
    .then(({ error }) => { if (error) console.warn("payment_method column not found — run supabase-orders-payment-method.sql"); });

  // ── 4. Save order items ────────────────────────────────────────────────────
  const itemRows = cart.map((item) => ({
    order_id:     order.id,
    product_id:   item.id,
    product_name: item.name,
    product_sku:  item.sku,
    quantity:     item.quantity,
    unit_price:   item.price,
    line_total:   item.price * item.quantity,
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
  if (itemsErr) {
    console.error("Order items insert error:", itemsErr.message);
    // Non-fatal — order exists, continue to PayFast
  }

  // ── 4a. Customer account (non-fatal) — login for order tracking ───────────
  const account = await ensureCheckoutCustomerAccount({
    email: customer.email,
    firstName: customer.first_name,
    lastName: customer.last_name,
    phone: customer.phone,
    orderNumber,
  }).catch((err): CheckoutAccountResult => {
    console.error("Checkout account provisioning failed:", err);
    return { customerId: null, isNewAccount: false };
  });

  if (account.customerId) {
    await supabase
      .from("orders")
      .update({ customer_id: account.customerId })
      .eq("id", order.id)
      .then(({ error }) => {
        if (error) console.warn("orders.customer_id update failed:", error.message);
      });
  }

  // ── 4b. Send order confirmation emails (non-fatal) ─────────────────────────
  await sendOrderPlacedEmails({
    orderNumber,
    paymentMethod: payment_method,
    customer,
    cart,
    subtotal,
    shipping,
    total,
    account: {
      orderAccessUrl: account.orderAccessUrl,
    },
  });

  // ── 5. Bank transfer — return order number, no PayFast needed ────────────
  if (payment_method === "bank_transfer") {
    return NextResponse.json({ method: "bank_transfer", orderNumber });
  }

  // ── 6. Build PayFast params (ORDER MATTERS for signature) ──────────────────
  const siteUrl = getPublicSiteUrl();
  const merchantId  = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || "";
  const merchantKey = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || "";
  const passphrase  = process.env.PAYFAST_PASSPHRASE || "";

  // Cart summary for item_description (max 255 chars)
  const itemSummary = truncate(
    cart.map((i) => `${i.quantity}× ${i.name}`).join(", "),
    255
  );

  const orderedParams: [string, string][] = [
    ["merchant_id",     merchantId],
    ["merchant_key",    merchantKey],
    ["return_url",      `${siteUrl}/checkout/success?order=${orderNumber}`],
    ["cancel_url",      `${siteUrl}/checkout/cancel?order=${orderNumber}`],
    ["notify_url",      `${siteUrl}/api/payfast/itn`],
    ["name_first",      customer.first_name],
    ["name_last",       customer.last_name],
    ["email_address",   customer.email],
    ["cell_number",     customer.phone],
    ["m_payment_id",    orderNumber],
    ["amount",          total.toFixed(2)],
    ["item_name",       truncate(`Lava-SA — Order ${orderNumber}`, 100)],
    ["item_description", itemSummary],
  ];

  const signature = generateSignature(orderedParams, passphrase);

  const params: Record<string, string> = Object.fromEntries(orderedParams);
  params.signature = signature;

  return NextResponse.json({
    payfastUrl: getPayFastUrl(),
    params,
  });
}
