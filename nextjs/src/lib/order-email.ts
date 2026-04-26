import type { CartItem } from "@/lib/cart-context";
import { getEftBankDetails } from "@/lib/bank-details";
import { getEmailConfig, getResendClient } from "@/lib/email-config";

type PaymentMethod = "payfast" | "bank_transfer";

interface SendOrderPlacedEmailArgs {
  orderNumber: string;
  paymentMethod: PaymentMethod;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface SendPaymentReceivedEmailArgs {
  orderNumber: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  total: number;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function esc(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildItemsHtml(cart: CartItem[]): string {
  return cart
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${esc(item.name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `
    )
    .join("");
}

export async function sendOrderPlacedEmails(args: SendOrderPlacedEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();

  const fullName = `${args.customer.first_name} ${args.customer.last_name}`.trim();
  const methodLabel = args.paymentMethod === "bank_transfer" ? "EFT / Bank Transfer" : "PayFast";
  const orderUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lava-sa.online"}/checkout/success?order=${encodeURIComponent(args.orderNumber)}${args.paymentMethod === "bank_transfer" ? "&method=eft" : ""}`;
  const rows = buildItemsHtml(args.cart);

  const customerSubject =
    args.paymentMethod === "bank_transfer"
      ? `Order reserved: ${args.orderNumber} (EFT required)`
      : `Order received: ${args.orderNumber}`;

  const bank = getEftBankDetails();
  const eftBankBlock =
    args.paymentMethod === "bank_transfer"
      ? `
      <div style="margin:20px 0;padding:16px;border:2px solid #b8973a;background:#fffef8;border-radius:4px;">
        <h3 style="margin:0 0 12px;font-size:16px;">Pay by EFT — use these details</h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:4px 8px 4px 0;color:#555;">Bank</td><td style="padding:4px 0;"><strong>${esc(bank.bank)}</strong></td></tr>
          <tr><td style="padding:4px 8px 4px 0;color:#555;">Account name</td><td style="padding:4px 0;"><strong>${esc(bank.accountName)}</strong></td></tr>
          <tr><td style="padding:4px 8px 4px 0;color:#555;">Account number</td><td style="padding:4px 0;"><strong>${esc(bank.accountNo)}</strong></td></tr>
          <tr><td style="padding:4px 8px 4px 0;color:#555;">Branch code</td><td style="padding:4px 0;"><strong>${esc(bank.branchCode)}</strong></td></tr>
          <tr><td style="padding:4px 8px 4px 0;color:#555;">Account type</td><td style="padding:4px 0;"><strong>${esc(bank.accountType)}</strong></td></tr>
          <tr><td style="padding:8px 8px 4px 0;color:#555;vertical-align:top;">Payment reference</td><td style="padding:8px 0;"><strong style="font-size:16px;color:#0d2b3e;">${esc(args.orderNumber)}</strong><br/><span style="font-size:12px;color:#666;">Use this exact reference so we can match your payment.</span></td></tr>
        </table>
        <p style="margin:12px 0 0;font-size:12px;color:#92400e;">Please email proof of payment to <a href="mailto:info@lava-sa.co.za">info@lava-sa.co.za</a> to speed up processing.</p>
      </div>`
      : "";

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0d2b3e">
      <h2 style="margin:0 0 12px;">Thank you for your order, ${esc(args.customer.first_name)}.</h2>
      <p style="margin:0 0 16px;">Order number: <strong>${esc(args.orderNumber)}</strong></p>
      <p style="margin:0 0 16px;">Payment method: <strong>${methodLabel}</strong></p>
      ${eftBankBlock}
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f7f7f7">
            <th style="padding:8px;text-align:left;">Item</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:6px 0;">Subtotal: <strong>${formatPrice(args.subtotal)}</strong></p>
      <p style="margin:6px 0;">Delivery: <strong>${args.shipping === 0 ? "FREE" : formatPrice(args.shipping)}</strong></p>
      <p style="margin:10px 0 18px;font-size:18px;">Order total: <strong>${formatPrice(args.total)}</strong></p>
      <p style="margin:0 0 10px;">
        ${args.paymentMethod === "bank_transfer"
          ? "Your order is reserved. Please complete EFT payment using your order number as reference."
          : "We are processing your order. You will receive further updates once payment is confirmed."}
      </p>
      <p style="margin:0 0 20px;"><a href="${orderUrl}">View order confirmation page</a></p>
      <p style="font-size:12px;color:#666;">Need help? Reply to this email or call +27 72 160 5556.</p>
    </div>
  `;

  const adminEftNote =
    args.paymentMethod === "bank_transfer"
      ? `<p style="margin:0 0 12px;padding:12px;background:#fffef8;border:1px solid #b8973a;"><strong>EFT:</strong> Customer needs to pay ${formatPrice(args.total)} to ${esc(bank.bank)} / ${esc(bank.accountNo)} with reference <strong>${esc(args.orderNumber)}</strong>.</p>`
      : "";

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#0d2b3e">
      <h2 style="margin:0 0 12px;">New order received: ${esc(args.orderNumber)}</h2>
      <p style="margin:0 0 6px;"><strong>Customer:</strong> ${esc(fullName)}</p>
      <p style="margin:0 0 6px;"><strong>Email:</strong> <a href="mailto:${esc(args.customer.email)}">${esc(args.customer.email)}</a></p>
      <p style="margin:0 0 6px;"><strong>Phone:</strong> ${esc(args.customer.phone || "—")}</p>
      <p style="margin:0 0 16px;"><strong>Payment method:</strong> ${methodLabel}</p>
      ${adminEftNote}
      <table style="width:100%;border-collapse:collapse;margin:12px 0;">
        <thead>
          <tr style="background:#f7f7f7">
            <th style="padding:8px;text-align:left;">Item</th>
            <th style="padding:8px;text-align:center;">Qty</th>
            <th style="padding:8px;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin:6px 0;"><strong>Subtotal:</strong> ${formatPrice(args.subtotal)}</p>
      <p style="margin:6px 0;"><strong>Delivery:</strong> ${args.shipping === 0 ? "FREE" : formatPrice(args.shipping)}</p>
      <p style="margin:10px 0;"><strong>Order total:</strong> ${formatPrice(args.total)}</p>
    </div>
  `;

  try {
    const [customerRes, adminRes] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [args.customer.email],
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: customerSubject,
        html: customerHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        replyTo: args.customer.email,
        subject: `[Order] ${args.orderNumber} — ${methodLabel}`,
        html: adminHtml,
      }),
    ]);
    if (customerRes.error) {
      console.error("Customer order email failed:", JSON.stringify(customerRes.error));
    }
    if (adminRes.error) {
      console.error("Admin order email failed:", JSON.stringify(adminRes.error));
    }
    if (!customerRes.error && !adminRes.error) {
      console.info(`Order emails queued OK for ${args.orderNumber} → customer + admin`);
    }
  } catch (err) {
    console.error("Order placed email failed:", err);
  }
}

export async function sendPaymentReceivedEmails(args: SendPaymentReceivedEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();

  const fullName = `${args.customer.first_name} ${args.customer.last_name}`.trim();

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0d2b3e">
      <h2 style="margin:0 0 12px;">Payment received for order ${esc(args.orderNumber)}</h2>
      <p style="margin:0 0 10px;">Hi ${esc(args.customer.first_name)},</p>
      <p style="margin:0 0 10px;">We have received your payment of <strong>${formatPrice(args.total)}</strong>.</p>
      <p style="margin:0 0 10px;">Your order is now being prepared for dispatch.</p>
      <p style="font-size:12px;color:#666;">Thank you for choosing Lava South Africa.</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0d2b3e">
      <h2 style="margin:0 0 12px;">Payment confirmed: ${esc(args.orderNumber)}</h2>
      <p style="margin:0 0 8px;"><strong>Customer:</strong> ${esc(fullName)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${esc(args.customer.email)}">${esc(args.customer.email)}</a></p>
      <p style="margin:0 0 8px;"><strong>Amount:</strong> ${formatPrice(args.total)}</p>
    </div>
  `;

  try {
    const [customerRes, adminRes] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [args.customer.email],
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: `Payment received: ${args.orderNumber}`,
        html: customerHtml,
      }),
      resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: `[Payment Confirmed] ${args.orderNumber}`,
        html: adminHtml,
      }),
    ]);
    if (customerRes.error) {
      console.error("Customer payment email failed:", customerRes.error);
    }
    if (adminRes.error) {
      console.error("Admin payment email failed:", adminRes.error);
    }
  } catch (err) {
    console.error("Payment confirmation email failed:", err);
  }
}
