import type { CartItem } from "@/lib/cart-context";
import { getEftBankDetails } from "@/lib/bank-details";
import { getEmailConfig, getResendClient } from "@/lib/email-config";
import {
  EMAIL_BRAND,
  emailAlertBox,
  emailButton,
  emailDetailGrid,
  emailHighlightTotal,
  emailOrderItemsTable,
  emailSectionTitle,
  emailTwoColumns,
  escEmail,
  formatEmailPrice,
  wrapEmailLayout,
} from "@/lib/email-template";
import { getPublicSiteUrl } from "@/lib/seo";
import { generateOrderAccessMagicLink } from "@/lib/checkout-customer-account";

type PaymentMethod = "payfast" | "bank_transfer";

interface SendOrderPlacedEmailArgs {
  orderNumber: string;
  paymentMethod: PaymentMethod;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    notes?: string;
  };
  cart: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  account?: {
    orderAccessUrl?: string;
  };
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

interface SendReviewRequestEmailArgs {
  orderNumber: string;
  customer: {
    first_name: string;
    email: string;
  };
  itemName?: string;
}

function formatShippingLines(customer: SendOrderPlacedEmailArgs["customer"]): string {
  const lines = [
    customer.address?.trim(),
    [customer.city?.trim(), customer.province?.trim()].filter(Boolean).join(", "),
    customer.postal_code?.trim(),
  ].filter((line) => line && line.length > 0);
  return lines.length > 0 ? lines.map(escEmail).join("<br/>") : "—";
}

function buildShippingBlockHtml(customer: SendOrderPlacedEmailArgs["customer"]): string {
  const address = formatShippingLines(customer);
  const notes = customer.notes?.trim();
  const notesPart = notes
    ? `<p style="margin:12px 0 0;padding-top:12px;border-top:1px solid ${EMAIL_BRAND.border};font-size:13px;"><strong style="color:${EMAIL_BRAND.primary};">Delivery notes</strong><br/>${escEmail(notes)}</p>`
    : "";
  return `${address}${notesPart}`;
}

function buildOrderItemRows(cart: CartItem[]): string {
  return cart
    .map(
      (item, i) => `
        <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"};">
          <td style="padding:12px 14px;border-bottom:1px solid ${EMAIL_BRAND.border};font-size:14px;color:${EMAIL_BRAND.text};">${escEmail(item.name)}</td>
          <td style="padding:12px 10px;border-bottom:1px solid ${EMAIL_BRAND.border};text-align:center;font-size:14px;">${item.quantity}</td>
          <td style="padding:12px 14px;border-bottom:1px solid ${EMAIL_BRAND.border};text-align:right;font-size:14px;font-weight:600;">${formatEmailPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");
}

export async function sendOrderPlacedEmails(args: SendOrderPlacedEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();

  const fullName = `${args.customer.first_name} ${args.customer.last_name}`.trim();
  const siteUrl = getPublicSiteUrl();
  const orderTrackPath = `/account/orders/${encodeURIComponent(args.orderNumber)}`;
  const loginUrl = `${siteUrl}/account/login?email=${encodeURIComponent(args.customer.email)}&from=${encodeURIComponent(orderTrackPath)}`;
  const successUrl = `${siteUrl}/checkout/success?order=${encodeURIComponent(args.orderNumber)}${args.paymentMethod === "bank_transfer" ? "&method=eft" : ""}`;
  const adminOrdersUrl = `${siteUrl}/admin/orders`;
  const itemRows = buildOrderItemRows(args.cart);
  const shippingLabel = formatEmailPrice(args.shipping);
  const itemsTable = emailOrderItemsTable(
    itemRows,
    formatEmailPrice(args.subtotal),
    shippingLabel,
    formatEmailPrice(args.total)
  );

  const customerSubject =
    args.paymentMethod === "bank_transfer"
      ? `Order reserved: ${args.orderNumber} (EFT required)`
      : `Order received: ${args.orderNumber}`;

  const bank = getEftBankDetails();
  const eftBankBlock =
    args.paymentMethod === "bank_transfer"
      ? emailAlertBox(
          `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:${EMAIL_BRAND.primary};">Pay by EFT</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Bank</td><td><strong>${escEmail(bank.bank)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Account name</td><td><strong>${escEmail(bank.accountName)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Account number</td><td><strong>${escEmail(bank.accountNo)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Branch code</td><td><strong>${escEmail(bank.branchCode)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Account type</td><td><strong>${escEmail(bank.accountType)}</strong></td></tr>
            <tr><td style="padding:10px 8px 4px 0;color:${EMAIL_BRAND.muted};vertical-align:top;">Reference</td><td><strong style="font-size:17px;color:${EMAIL_BRAND.primary};">${escEmail(args.orderNumber)}</strong><br/><span style="font-size:12px;color:${EMAIL_BRAND.muted};">Use this exact reference.</span></td></tr>
          </table>
          <p style="margin:14px 0 0;font-size:13px;">Email proof of payment to <a href="mailto:info@lava-sa.com" style="color:${EMAIL_BRAND.teal};">info@lava-sa.com</a>.</p>`
        )
      : "";

  const methodLabel = args.paymentMethod === "bank_transfer" ? "EFT / Bank Transfer" : "PayFast";

  const trackOrderUrl = args.account?.orderAccessUrl ?? loginUrl;

  const accountBlock = args.account?.orderAccessUrl
    ? emailAlertBox(
        `<p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${EMAIL_BRAND.primary};">Track your order online</p>
        <p style="margin:0;font-size:14px;line-height:1.5;">Use the button below to open your order and follow shipping updates. <strong>No password needed</strong> — you are signed in automatically from this email.</p>
        <p style="margin:12px 0 0;font-size:13px;color:${EMAIL_BRAND.muted};">Want a password for next time? Set one anytime under Account after you sign in.</p>`,
        "gold"
      )
    : emailAlertBox(
        `<p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${EMAIL_BRAND.primary};">Track your order</p>
        <p style="margin:0;font-size:14px;">Sign in with your email (<strong>${escEmail(args.customer.email)}</strong>) to follow shipping updates.</p>`
      );

  const customerBody = `
    <p style="margin:0 0 16px;font-size:16px;">Hi <strong>${escEmail(args.customer.first_name)}</strong>, thank you for choosing LAVA. We have received your order and will keep you updated.</p>
    ${emailDetailGrid([
      { label: "Order number", value: `<strong>${escEmail(args.orderNumber)}</strong>` },
      { label: "Payment", value: escEmail(methodLabel) },
    ])}
    ${eftBankBlock}
    ${itemsTable}
    ${emailSectionTitle("Delivery address")}
    <div style="margin:0 0 20px;padding:14px;background:#f9fafb;border:1px solid ${EMAIL_BRAND.border};border-radius:6px;line-height:1.5;">
      ${buildShippingBlockHtml(args.customer)}
    </div>
    ${emailSectionTitle("Your account")}
    <div style="margin:0 0 20px;">${accountBlock}</div>
    <p style="margin:0 0 8px;font-size:14px;color:${EMAIL_BRAND.muted};">
      ${
        args.paymentMethod === "bank_transfer"
          ? "Your order is reserved. Please complete EFT payment using your order number as reference."
          : "We are processing your order. You will receive a confirmation once payment is verified."
      }
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${EMAIL_BRAND.muted};">
      Payment details and bank reference are also on your
      <a href="${successUrl}" style="color:${EMAIL_BRAND.teal};font-weight:600;">order confirmation page</a>.
    </p>
    ${emailButton(trackOrderUrl, "Track your order")}`;

  const customerHtml = wrapEmailLayout({
    headline: "Thank you for your order",
    subheadline: `Order ${escEmail(args.orderNumber)}`,
    badge: methodLabel,
    bodyHtml: customerBody,
  });

  const adminEftNote =
    args.paymentMethod === "bank_transfer"
      ? emailAlertBox(
          `<strong>EFT pending:</strong> Customer must pay <strong>${formatEmailPrice(args.total)}</strong> to ${escEmail(bank.bank)} / ${escEmail(bank.accountNo)} with reference <strong>${escEmail(args.orderNumber)}</strong>.`,
          "gold"
        )
      : "";

  const customerCol = `
    <p style="margin:0 0 8px;font-weight:700;font-size:15px;color:${EMAIL_BRAND.primary};">${escEmail(fullName)}</p>
    <p style="margin:0 0 4px;"><a href="mailto:${escEmail(args.customer.email)}" style="color:${EMAIL_BRAND.teal};text-decoration:none;">${escEmail(args.customer.email)}</a></p>
    <p style="margin:0;">${escEmail(args.customer.phone || "—")}</p>`;

  const adminBody = `
    <p style="margin:0 0 20px;font-size:15px;color:${EMAIL_BRAND.muted};">A new order was placed on the website. Process dispatch when payment is confirmed.</p>
    ${emailHighlightTotal("Order total", formatEmailPrice(args.total))}
    ${emailTwoColumns("Customer", customerCol, "Shipping address", buildShippingBlockHtml(args.customer))}
    ${adminEftNote}
    ${itemsTable}`;

  const adminHtml = wrapEmailLayout({
    headline: "New order received",
    subheadline: `<strong>${escEmail(args.orderNumber)}</strong>`,
    badge: methodLabel,
    bodyHtml: adminBody,
    prefooterHtml: emailButton(adminOrdersUrl, "Open in admin"),
  });

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

export async function sendReviewRequestEmail(args: SendReviewRequestEmailArgs): Promise<void> {
  const placeId = process.env.NEXT_PUBLIC_GBP_PLACE_ID?.trim();
  if (!placeId) {
    console.info("Review-request email skipped: NEXT_PUBLIC_GBP_PLACE_ID not set");
    return;
  }

  const resend = getResendClient();
  if (!resend) return;
  const { fromEmail, replyToEmail } = getEmailConfig();

  const reviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
  const subject = args.itemName
    ? `How is your ${args.itemName} treating you?`
    : `A quick favour, ${args.customer.first_name}?`;

  const itemLine = args.itemName
    ? `<p style="margin:0 0 14px;">We hope your <strong>${escEmail(args.itemName)}</strong> is working well and earning its place in your kitchen.</p>`
    : `<p style="margin:0 0 14px;">We hope your recent order is working out well for you.</p>`;

  const customerHtml = wrapEmailLayout({
    headline: `Hi ${escEmail(args.customer.first_name)}`,
    subheadline: "We would love your feedback",
    bodyHtml: `
      ${itemLine}
      <p style="margin:0 0 14px;">We are a small family-run team and Google reviews genuinely help us reach more South Africans who would benefit from proper German vacuum sealing.</p>
      ${emailButton(reviewUrl, "Leave a Google review")}
      <p style="margin:16px 0 0;font-size:14px;color:${EMAIL_BRAND.muted};">If something is not right with order <strong>${escEmail(args.orderNumber)}</strong>, please reply to this email first — we would much rather fix it for you.</p>
      <p style="margin:20px 0 0;">Thank you,<br/><strong>Anneke &amp; Wilco Uys</strong></p>`,
  });

  try {
    const res = await resend.emails.send({
      from: fromEmail,
      to: [args.customer.email],
      ...(replyToEmail ? { replyTo: replyToEmail } : {}),
      subject,
      html: customerHtml,
    });
    if (res.error) {
      console.error("Review-request email failed:", JSON.stringify(res.error));
    } else {
      console.info(`Review-request email queued OK for ${args.orderNumber} → ${args.customer.email}`);
    }
  } catch (err) {
    console.error("Review-request email failed:", err);
  }
}

export async function sendPaymentReceivedEmails(args: SendPaymentReceivedEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();

  const fullName = `${args.customer.first_name} ${args.customer.last_name}`.trim();
  const siteUrl = getPublicSiteUrl();
  const orderTrackPath = `/account/orders/${encodeURIComponent(args.orderNumber)}`;
  const loginUrl = `${siteUrl}/account/login?email=${encodeURIComponent(args.customer.email)}&from=${encodeURIComponent(orderTrackPath)}`;
  const orderAccessUrl =
    (await generateOrderAccessMagicLink(args.customer.email, args.orderNumber)) ?? loginUrl;

  const customerHtml = wrapEmailLayout({
    headline: "Payment received",
    subheadline: `Order ${escEmail(args.orderNumber)}`,
    badge: "Confirmed",
    bodyHtml: `
      <p style="margin:0 0 16px;">Hi <strong>${escEmail(args.customer.first_name)}</strong>,</p>
      <p style="margin:0 0 16px;">We have received your payment of <strong>${formatEmailPrice(args.total)}</strong>. Your order is now being prepared for dispatch.</p>
      ${emailButton(orderAccessUrl, "Track your order")}
      <p style="margin:16px 0 0;font-size:14px;color:${EMAIL_BRAND.muted};">Thank you for choosing LAVA-SA.</p>`,
  });

  const adminHtml = wrapEmailLayout({
    headline: "Payment confirmed",
    subheadline: `<strong>${escEmail(args.orderNumber)}</strong>`,
    badge: "PayFast",
    bodyHtml: `
      ${emailHighlightTotal("Amount received", formatEmailPrice(args.total))}
      ${emailDetailGrid([
        { label: "Customer", value: escEmail(fullName) },
        {
          label: "Email",
          value: `<a href="mailto:${escEmail(args.customer.email)}" style="color:${EMAIL_BRAND.teal};">${escEmail(args.customer.email)}</a>`,
        },
      ])}
      <p style="margin:16px 0 0;font-size:14px;color:${EMAIL_BRAND.muted};">You can mark the order as processing in admin and arrange dispatch.</p>`,
    prefooterHtml: emailButton(`${getPublicSiteUrl()}/admin/orders`, "Open in admin"),
  });

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
