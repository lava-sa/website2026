import type { CartItem } from "@/lib/cart-context";
import { getEftBankDetails } from "@/lib/bank-details";
import { getEmailConfig, getResendClient } from "@/lib/email-config";
import {
  EMAIL_BRAND,
  emailAlertBox,
  emailButton,
  emailDetailGrid,
  emailFailureBanner,
  emailHighlightTotal,
  emailOrderItemsTable,
  emailSectionTitle,
  emailTwoColumns,
  escEmail,
  formatEmailPrice,
  wrapEmailLayout,
} from "@/lib/email-template";
import { getCustomerFacingSiteUrl, getPublicSiteUrl } from "@/lib/seo";
import { createOrderAccessToken } from "@/lib/order-access-token";
import { COLLECTION_POINT, type DeliveryMethod } from "@/lib/shipping";
import { ANNEKE_PHONE, MAIN_PHONE } from "@/lib/contact";

type PaymentMethod = "payfast" | "bank_transfer";

/**
 * What actually happened to the money. Drives every visual cue in the email —
 * nothing may look like a confirmed order unless the outcome is "paid".
 */
export type OrderEmailOutcome =
  | "awaiting_eft" // EFT order placed, customer still has to pay
  | "paid" // PayFast confirmed COMPLETE via ITN
  | "unsuccessful" // PayFast declined / failed / cancelled — NO money received
  | "returned_unconfirmed"; // Customer came back from PayFast, no confirmation yet

interface SendOrderPlacedEmailArgs {
  orderNumber: string;
  paymentMethod: PaymentMethod;
  /** Defaults to "awaiting_eft" (the only outcome that may email before payment). */
  outcome?: OrderEmailOutcome;
  deliveryMethod?: DeliveryMethod;
  /** Raw PayFast payment_status (FAILED / CANCELLED / …) for the admin copy. */
  failureDetail?: string | null;
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

function buildShippingBlockHtml(
  customer: SendOrderPlacedEmailArgs["customer"],
  deliveryMethod: DeliveryMethod = "delivery"
): string {
  const address =
    deliveryMethod === "collection"
      ? `<strong style="color:${EMAIL_BRAND.primary};">Collection from our premises</strong><br/>${COLLECTION_POINT.lines
          .map(escEmail)
          .join("<br/>")}<br/><span style="color:${EMAIL_BRAND.muted};font-size:13px;">${escEmail(COLLECTION_POINT.hours)}</span>`
      : formatShippingLines(customer);
  const notes = customer.notes?.trim();
  const notesPart = notes
    ? `<p style="margin:12px 0 0;padding-top:12px;border-top:1px solid ${EMAIL_BRAND.border};font-size:13px;"><strong style="color:${EMAIL_BRAND.primary};">Order notes</strong><br/>${escEmail(notes)}</p>`
    : "";
  return `${address}${notesPart}`;
}

/** Bank block used for EFT orders and as the fallback when a card payment fails. */
function buildEftBankBlock(orderNumber: string, intro: string): string {
  const bank = getEftBankDetails();
  return emailAlertBox(
    `<p style="margin:0 0 12px;font-size:16px;font-weight:700;color:${EMAIL_BRAND.primary};">${escEmail(intro)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Bank</td><td><strong>${escEmail(bank.bank)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Account name</td><td><strong>${escEmail(bank.accountName)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Account number</td><td><strong>${escEmail(bank.accountNo)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Branch code</td><td><strong>${escEmail(bank.branchCode)}</strong></td></tr>
            <tr><td style="padding:4px 8px 4px 0;color:${EMAIL_BRAND.muted};">Account type</td><td><strong>${escEmail(bank.accountType)}</strong></td></tr>
            <tr><td style="padding:10px 8px 4px 0;color:${EMAIL_BRAND.muted};vertical-align:top;">Reference</td><td><strong style="font-size:17px;color:${EMAIL_BRAND.primary};">${escEmail(orderNumber)}</strong><br/><span style="font-size:12px;color:${EMAIL_BRAND.muted};">Use this exact reference.</span></td></tr>
          </table>
          <p style="margin:14px 0 0;font-size:13px;">Email proof of payment to <a href="mailto:info@lava-sa.com" style="color:${EMAIL_BRAND.teal};">info@lava-sa.com</a>.</p>`
  );
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

/**
 * The single order email for both customer and admin, rendered for a specific
 * payment OUTCOME.
 *
 * Hard rule: only outcome "paid" (PayFast ITN COMPLETE) or "awaiting_eft"
 * (manual EFT, money not yet expected) may look like a live order.
 * A declined card must render the red "payment unsuccessful" treatment so
 * neither the customer nor Anneke can mistake it for a paid order.
 */
export async function sendOrderOutcomeEmails(args: SendOrderPlacedEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();

  const outcome: OrderEmailOutcome = args.outcome ?? "awaiting_eft";
  const deliveryMethod: DeliveryMethod = args.deliveryMethod ?? "delivery";
  const isCollection = deliveryMethod === "collection";
  const isEft = args.paymentMethod === "bank_transfer";
  const isPaid = outcome === "paid";
  const isFailed = outcome === "unsuccessful";
  const isUnconfirmed = outcome === "returned_unconfirmed";

  const fullName = `${args.customer.first_name} ${args.customer.last_name}`.trim();
  const siteUrl = getCustomerFacingSiteUrl();
  const successUrl = `${siteUrl}/checkout/success?order=${encodeURIComponent(args.orderNumber)}&email=${encodeURIComponent(args.customer.email)}${isEft ? "&method=eft" : ""}`;
  const adminOrdersUrl = `${siteUrl}/admin/orders`;
  const itemRows = buildOrderItemRows(args.cart);
  const itemsTable = emailOrderItemsTable(
    itemRows,
    formatEmailPrice(args.subtotal),
    isCollection ? "Collection — free" : formatEmailPrice(args.shipping),
    formatEmailPrice(args.total)
  );

  const methodLabel = isEft ? "EFT / Bank Transfer" : "PayFast";
  const badgeLabel = isPaid
    ? "Payment confirmed"
    : isFailed
      ? "Payment unsuccessful"
      : isUnconfirmed
        ? "Payment not yet confirmed"
        : methodLabel;

  const customerSubject = isPaid
    ? `Payment confirmed — order ${args.orderNumber}`
    : isFailed
      ? `Payment UNSUCCESSFUL — order ${args.orderNumber} is not paid`
      : isUnconfirmed
        ? `Order received: ${args.orderNumber} — confirming your payment`
        : isEft
          ? `Order reserved: ${args.orderNumber} (EFT required)`
          : `Order received: ${args.orderNumber}`;

  const adminSubject = isPaid
    ? `[PAID] ${args.orderNumber} — PayFast payment confirmed`
    : isFailed
      ? `[PAYMENT FAILED] ${args.orderNumber} — no funds received, do not dispatch`
      : isUnconfirmed
        ? `[UNCONFIRMED] ${args.orderNumber} — verify in PayFast before dispatching`
        : `[Order] ${args.orderNumber} — ${methodLabel}`;

  const bank = getEftBankDetails();
  const eftBankBlock = isEft ? buildEftBankBlock(args.orderNumber, "Pay by EFT") : "";

  const accessToken = createOrderAccessToken(args.orderNumber, args.customer.email);
  const trackOrderUrl = `${siteUrl}/account/order-access?order=${encodeURIComponent(args.orderNumber)}&token=${encodeURIComponent(accessToken)}`;

  const accountBlock = emailAlertBox(
    `<p style="margin:0 0 8px;font-size:15px;font-weight:700;color:${EMAIL_BRAND.primary};">Track your order online</p>
        <p style="margin:0;font-size:14px;line-height:1.5;">Tap the button below to open your secure order page. <strong>No password needed</strong> — then click once more to view ${escEmail(args.orderNumber)}.</p>
        <p style="margin:12px 0 0;font-size:13px;color:${EMAIL_BRAND.muted};">Link valid 24 hours · Set a password anytime for future visits.</p>`,
    "gold"
  );

  // ── Outcome-specific customer content ────────────────────────────────────
  const customerOpening = isPaid
    ? `<p style="margin:0 0 16px;font-size:16px;">Hi <strong>${escEmail(args.customer.first_name)}</strong>, your payment of <strong>${formatEmailPrice(args.total)}</strong> was received and your order is confirmed. We are preparing it now.</p>`
    : isFailed
      ? `<p style="margin:0 0 16px;font-size:16px;">Hi <strong>${escEmail(args.customer.first_name)}</strong>, unfortunately your card payment for order ${escEmail(args.orderNumber)} did <strong>not</strong> go through at PayFast.</p>`
      : isUnconfirmed
        ? `<p style="margin:0 0 16px;font-size:16px;">Hi <strong>${escEmail(args.customer.first_name)}</strong>, thank you for your order. We have it safely on our system and are confirming your payment with PayFast.</p>`
        : `<p style="margin:0 0 16px;font-size:16px;">Hi <strong>${escEmail(args.customer.first_name)}</strong>, thank you for choosing LAVA. We have received your order and will keep you updated.</p>`;

  const customerBanner = isPaid
    ? emailAlertBox(
        `<p style="margin:0;font-size:15px;font-weight:700;color:${EMAIL_BRAND.success};">Payment confirmed by PayFast — ${formatEmailPrice(args.total)} received.</p>`,
        "green"
      )
    : isFailed
      ? emailFailureBanner(
          "PayFast payment unsuccessful",
          "Your payment was declined and <u>no money was taken</u>. This order is <u>not</u> paid and will not be dispatched until payment is completed."
        )
      : isUnconfirmed
        ? emailAlertBox(
            `<p style="margin:0 0 6px;font-size:15px;font-weight:700;color:${EMAIL_BRAND.primary};">Payment not confirmed yet</p>
             <p style="margin:0;font-size:14px;">PayFast has not yet told us the result of this payment. <strong>Please do not pay twice.</strong> We will email you as soon as it is confirmed — or if it did not go through.</p>`,
            "gold"
          )
        : "";

  const failedNextSteps = isFailed
    ? `
    ${emailSectionTitle("How to complete your order")}
    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;">Your order is being held for you. You can complete payment in any of these ways:</p>
    <ol style="margin:0 0 18px;padding-left:20px;font-size:14px;line-height:1.7;">
      <li><strong>Try again</strong> with the same or another card — <a href="${siteUrl}/cart" style="color:${EMAIL_BRAND.teal};font-weight:600;">return to your cart</a>.</li>
      <li><strong>Pay by EFT / bank transfer</strong> using the details below, with <strong>${escEmail(args.orderNumber)}</strong> as your reference.</li>
      <li><strong>Talk to Anneke</strong> on <a href="tel:${ANNEKE_PHONE.tel}" style="color:${EMAIL_BRAND.teal};font-weight:600;">${escEmail(ANNEKE_PHONE.displayLocal)}</a> to arrange another payment method.</li>
    </ol>
    ${buildEftBankBlock(args.orderNumber, "Pay by EFT instead")}`
    : "";

  const addressTitle = isCollection ? "Collection" : "Delivery address";

  /**
   * Collection orders must not simply be turned up for — Anneke needs a time
   * agreed first (client request, 6 Aug 2026). Left off a failed payment,
   * where there is nothing to collect yet.
   */
  const collectionCallToAction =
    isCollection && !isFailed
      ? emailAlertBox(
          `<p style="margin:0;font-size:15px;font-weight:700;color:${EMAIL_BRAND.primary};">
             Please arrange collection time with Anneke —
             <a href="tel:${ANNEKE_PHONE.tel}" style="color:${EMAIL_BRAND.teal};text-decoration:none;">${escEmail(ANNEKE_PHONE.displayLocal)}</a>
           </p>`,
          "gold"
        )
      : "";

  const customerClosing = isPaid
    ? `<p style="margin:0 0 16px;font-size:14px;color:${EMAIL_BRAND.muted};">${
        isCollection
          ? `We will let you know as soon as your order is packed and ready to collect from ${escEmail(COLLECTION_POINT.oneLine)}.`
          : "We will send you a dispatch notification as soon as your parcel leaves our warehouse."
      }</p>`
    : isFailed
      ? `<p style="margin:0 0 16px;font-size:14px;color:${EMAIL_BRAND.muted};">If you believe this is a mistake, or your bank shows a payment on your side, please contact us on ${escEmail(MAIN_PHONE.displayLocal)} or reply to this email before paying again.</p>`
      : isUnconfirmed
        ? `<p style="margin:0 0 16px;font-size:14px;color:${EMAIL_BRAND.muted};">If your bank shows the payment went through, reply to this email or call ${escEmail(MAIN_PHONE.displayLocal)} and we will confirm it manually on our side.</p>`
        : `<p style="margin:0 0 16px;font-size:14px;color:${EMAIL_BRAND.muted};">Your order is reserved. Please complete EFT payment using your order number as reference. Details are also on your <a href="${successUrl}" style="color:${EMAIL_BRAND.teal};font-weight:600;">order page</a>.</p>`;

  const customerBody = `
    ${customerBanner}
    ${customerOpening}
    ${emailDetailGrid([
      { label: "Order number", value: `<strong>${escEmail(args.orderNumber)}</strong>` },
      { label: "Payment", value: escEmail(methodLabel) },
      {
        label: "Payment status",
        value: isPaid
          ? `<strong style="color:${EMAIL_BRAND.success};">PAID</strong>`
          : isFailed
            ? `<strong style="color:${EMAIL_BRAND.danger};">NOT PAID — PAYMENT UNSUCCESSFUL</strong>`
            : isUnconfirmed
              ? `<strong style="color:${EMAIL_BRAND.gold};">Awaiting confirmation from PayFast</strong>`
              : `<strong style="color:${EMAIL_BRAND.gold};">Awaiting EFT payment</strong>`,
      },
      {
        label: isCollection ? "Collection" : "Delivery",
        value: isCollection
          ? `Collect from ${escEmail(COLLECTION_POINT.oneLine)}`
          : "Courier to your address",
      },
    ])}
    ${eftBankBlock}
    ${failedNextSteps}
    ${itemsTable}
    ${emailSectionTitle(addressTitle)}
    <div style="margin:0 0 20px;padding:14px;background:#f9fafb;border:1px solid ${EMAIL_BRAND.border};border-radius:6px;line-height:1.5;">
      ${buildShippingBlockHtml(args.customer, deliveryMethod)}
    </div>
    ${collectionCallToAction}
    ${emailSectionTitle("Your account")}
    <div style="margin:0 0 20px;">${accountBlock}</div>
    ${customerClosing}
    ${emailButton(trackOrderUrl, "View my order")}
  `;

  const customerHtml = wrapEmailLayout({
    headline: isPaid
      ? "Payment received — order confirmed"
      : isFailed
        ? "Payment unsuccessful"
        : isUnconfirmed
          ? "Order received — confirming payment"
          : "Thank you for your order",
    subheadline: `Order ${escEmail(args.orderNumber)}`,
    badge: badgeLabel,
    bodyHtml: customerBody,
  });

  // ── Outcome-specific admin content ───────────────────────────────────────
  const adminBanner = isPaid
    ? emailAlertBox(
        `<strong style="color:${EMAIL_BRAND.success};">PayFast payment CONFIRMED</strong> — ${formatEmailPrice(args.total)} received. Safe to process and dispatch.`,
        "green"
      )
    : isFailed
      ? emailFailureBanner(
          "PayFast payment unsuccessful",
          `No funds were received for this order.${
            args.failureDetail ? ` PayFast status: ${escEmail(args.failureDetail)}.` : ""
          } <u>Do not dispatch.</u> The order is held as cancelled so you can contact the customer and arrange another payment method.`
        )
      : isUnconfirmed
        ? emailFailureBanner(
            "Payment NOT confirmed — do not dispatch yet",
            "The customer completed the PayFast step, but PayFast has not confirmed this payment to the website. <u>Check the PayFast dashboard for this amount before dispatching.</u> A second email follows automatically if the payment is confirmed or declined."
          )
        : emailAlertBox(
            `<strong>EFT pending:</strong> Customer must pay <strong>${formatEmailPrice(args.total)}</strong> to ${escEmail(bank.bank)} / ${escEmail(bank.accountNo)} with reference <strong>${escEmail(args.orderNumber)}</strong>.`,
            "gold"
          );

  const customerCol = `
    <p style="margin:0 0 8px;font-weight:700;font-size:15px;color:${EMAIL_BRAND.primary};">${escEmail(fullName)}</p>
    <p style="margin:0 0 4px;"><a href="mailto:${escEmail(args.customer.email)}" style="color:${EMAIL_BRAND.teal};text-decoration:none;">${escEmail(args.customer.email)}</a></p>
    <p style="margin:0;"><a href="tel:${escEmail((args.customer.phone || "").replace(/\s/g, ""))}" style="color:${EMAIL_BRAND.teal};text-decoration:none;">${escEmail(args.customer.phone || "—")}</a></p>`;

  const adminIntro = isPaid
    ? "Payment confirmed by PayFast. This order is paid and ready to process."
    : isFailed
      ? "A customer attempted to pay by card and the payment did NOT succeed. Nothing has been received. Call or email them to arrange an alternative payment method."
      : isUnconfirmed
        ? "A customer went through PayFast for this order, but no confirmation has reached the website. Treat the order as UNPAID until you have verified it in the PayFast dashboard."
        : "A new order was placed on the website. Process dispatch when payment is confirmed.";

  const adminBody = `
    ${isFailed || isUnconfirmed ? adminBanner : ""}
    <p style="margin:0 0 20px;font-size:15px;color:${EMAIL_BRAND.muted};">${adminIntro}</p>
    ${emailHighlightTotal(isPaid ? "Amount received" : "Order total (unpaid)", formatEmailPrice(args.total))}
    ${emailTwoColumns(
      "Customer",
      customerCol,
      isCollection ? "Collection" : "Shipping address",
      buildShippingBlockHtml(args.customer, deliveryMethod)
    )}
    ${isFailed || isUnconfirmed ? "" : adminBanner}
    ${itemsTable}`;

  const adminHtml = wrapEmailLayout({
    headline: isPaid
      ? "Payment confirmed"
      : isFailed
        ? "PAYMENT UNSUCCESSFUL"
        : isUnconfirmed
          ? "Order placed — payment UNCONFIRMED"
          : "New order received",
    subheadline: `<strong>${escEmail(args.orderNumber)}</strong>`,
    badge: badgeLabel,
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
        subject: adminSubject,
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
      console.info(`Order emails queued OK for ${args.orderNumber} (${outcome}) → customer + admin`);
    }
  } catch (err) {
    console.error("Order outcome email failed:", err);
  }
}

/**
 * EFT / bank-transfer orders only — the money is expected later, so telling
 * everyone the order exists is correct. NEVER call this for a PayFast order:
 * a PayFast order is only announced once the ITN confirms the outcome.
 */
export async function sendOrderPlacedEmails(
  args: Omit<SendOrderPlacedEmailArgs, "outcome">
): Promise<void> {
  return sendOrderOutcomeEmails({ ...args, outcome: "awaiting_eft" });
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

/**
 * @deprecated Superseded by sendOrderOutcomeEmails({ outcome: "paid" }), which carries the
 * full order (items, address, totals). Kept only for a future "mark as paid in admin" flow —
 * do NOT wire this into the checkout or ITN path, or an order can be announced twice.
 */
export async function sendPaymentReceivedEmails(args: SendPaymentReceivedEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  const { fromEmail, adminEmails, replyToEmail } = getEmailConfig();

  const fullName = `${args.customer.first_name} ${args.customer.last_name}`.trim();
  const siteUrl = getCustomerFacingSiteUrl();
  const orderTrackPath = `/account/orders/${encodeURIComponent(args.orderNumber)}`;
  const accessToken = createOrderAccessToken(args.orderNumber, args.customer.email);
  const orderAccessUrl = `${siteUrl}/account/order-access?order=${encodeURIComponent(args.orderNumber)}&token=${encodeURIComponent(accessToken)}`;

  const customerHtml = wrapEmailLayout({
    headline: "Payment received",
    subheadline: `Order ${escEmail(args.orderNumber)}`,
    badge: "Confirmed",
    bodyHtml: `
      <p style="margin:0 0 16px;">Hi <strong>${escEmail(args.customer.first_name)}</strong>,</p>
      <p style="margin:0 0 16px;">We have received your payment of <strong>${formatEmailPrice(args.total)}</strong>. Your order is now being prepared for dispatch.</p>
      ${emailButton(orderAccessUrl, "View my order")}
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
