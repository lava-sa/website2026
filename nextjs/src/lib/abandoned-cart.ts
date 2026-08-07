import { createServiceClient } from "@/lib/supabase";
import { getEmailConfig, getResendClient } from "@/lib/email-config";
import {
  EMAIL_BRAND,
  emailButton,
  emailOrderItemsTable,
  escEmail,
  formatEmailPrice,
  wrapEmailLayout,
} from "@/lib/email-template";
import { getCustomerFacingSiteUrl } from "@/lib/seo";
import { createCartRecoveryToken } from "@/lib/cart-recovery-token";

/**
 * Abandoned-cart reminders.
 *
 * Deliberately conservative: ONE reminder per person, ever; never sent if an
 * order followed the basket; never sent to anyone who has unsubscribed; and no
 * discount, because training customers that abandoning earns a voucher is an
 * expensive habit to unlearn.
 */

/** How long a basket must be untouched before it counts as abandoned. */
const QUIET_MINUTES = Number(process.env.ABANDONED_CART_DELAY_MINUTES ?? 60);

/** Baskets older than this are stale — no reminder, it would just be odd. */
const MAX_AGE_HOURS = Number(process.env.ABANDONED_CART_MAX_AGE_HOURS ?? 72);

/** Belt and braces against a runaway loop mailing a whole table. */
const MAX_PER_RUN = Number(process.env.ABANDONED_CART_MAX_PER_RUN ?? 25);

type CartRow = {
  id: string;
  email: string;
  first_name: string | null;
  items: { id: string; name: string; quantity: number; price: number }[] | null;
  subtotal: number | null;
  created_at: string;
  last_activity_at: string;
};

export type SweepResult = {
  considered: number;
  sent: number;
  skippedOrdered: number;
  skippedUnsubscribed: number;
  failed: number;
  note?: string;
};

function buildReminderHtml(cart: CartRow, recoveryUrl: string, unsubscribeUrl: string): string {
  const items = cart.items ?? [];
  const rows = items
    .map(
      (item, i) => `
        <tr style="background:${i % 2 === 0 ? "#ffffff" : "#f9fafb"};">
          <td style="padding:12px 14px;border-bottom:1px solid ${EMAIL_BRAND.border};font-size:14px;color:${EMAIL_BRAND.text};">${escEmail(item.name)}</td>
          <td style="padding:12px 10px;border-bottom:1px solid ${EMAIL_BRAND.border};text-align:center;font-size:14px;">${item.quantity}</td>
          <td style="padding:12px 14px;border-bottom:1px solid ${EMAIL_BRAND.border};text-align:right;font-size:14px;font-weight:600;">${formatEmailPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const subtotal = Number(cart.subtotal ?? 0);
  const greeting = cart.first_name?.trim()
    ? `Hi <strong>${escEmail(cart.first_name.trim())}</strong>,`
    : "Hello,";

  return wrapEmailLayout({
    headline: "You left something behind",
    subheadline: "Your basket is still saved",
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:16px;">${greeting} you started an order with us and didn't finish checking out. Your basket is still here if you'd like to complete it.</p>
      ${emailOrderItemsTable(rows, formatEmailPrice(subtotal), "Calculated at checkout", formatEmailPrice(subtotal))}
      ${emailButton(recoveryUrl, "Return to my basket")}
      <p style="margin:20px 0 0;font-size:14px;color:${EMAIL_BRAND.muted};">
        Prices and stock are confirmed when you check out. If anything sold out in the meantime we'll show you on the page.
      </p>
      <p style="margin:12px 0 0;font-size:14px;color:${EMAIL_BRAND.muted};">
        Need a hand choosing? Reply to this email and Anneke will help.
      </p>
      <p style="margin:24px 0 0;font-size:12px;color:${EMAIL_BRAND.muted};">
        This is a one-off reminder about your own basket — we won't send another.
        <a href="${unsubscribeUrl}" style="color:${EMAIL_BRAND.muted};text-decoration:underline;">Unsubscribe</a>
      </p>`,
  });
}

/**
 * Find baskets that went quiet and remind their owners — once.
 * Safe to call at any frequency: every stop-condition is checked per cart and
 * the reminder flag is set before the mail is sent.
 */
export async function sweepAbandonedCarts(): Promise<SweepResult> {
  const result: SweepResult = {
    considered: 0,
    sent: 0,
    skippedOrdered: 0,
    skippedUnsubscribed: 0,
    failed: 0,
  };

  const supabase = createServiceClient();
  const now = Date.now();
  const quietBefore = new Date(now - QUIET_MINUTES * 60_000).toISOString();
  const staleBefore = new Date(now - MAX_AGE_HOURS * 3_600_000).toISOString();

  const { data: carts, error } = await supabase
    .from("abandoned_carts")
    .select("id, email, first_name, items, subtotal, created_at, last_activity_at")
    .is("reminder_sent_at", null)
    .is("recovered_at", null)
    .is("dismissed_at", null)
    .lt("last_activity_at", quietBefore)
    .gt("last_activity_at", staleBefore)
    .order("last_activity_at", { ascending: true })
    .limit(MAX_PER_RUN);

  if (error) {
    // PostgREST reports a missing table via its schema cache, not Postgres 42P01.
    const missingTable =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /schema cache|does not exist/i.test(error.message ?? "");

    if (missingTable) {
      return { ...result, note: "abandoned_carts table missing — run supabase/034_abandoned_carts.sql" };
    }
    console.error("Abandoned cart sweep query failed:", error.message);
    return { ...result, note: error.message };
  }

  result.considered = carts?.length ?? 0;
  if (result.considered === 0) return result;

  const resend = getResendClient();
  if (!resend) return { ...result, note: "RESEND_API_KEY missing — nothing sent" };

  const { fromEmail, replyToEmail } = getEmailConfig();
  const siteUrl = getCustomerFacingSiteUrl();

  for (const cart of (carts ?? []) as CartRow[]) {
    // ── Stop condition 1: they already ordered. Never nag a paying customer.
    const { data: order } = await supabase
      .from("orders")
      .select("order_number")
      .ilike("email", cart.email)
      .gte("created_at", cart.created_at)
      .limit(1)
      .maybeSingle();

    if (order) {
      await supabase
        .from("abandoned_carts")
        .update({
          recovered_at: new Date().toISOString(),
          recovered_order_number: order.order_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cart.id);
      result.skippedOrdered++;
      continue;
    }

    // ── Stop condition 2: they have unsubscribed from our email.
    const { data: subscriber } = await supabase
      .from("mailing_list_subscribers")
      .select("unsubscribed_at")
      .ilike("email", cart.email)
      .maybeSingle();

    if (subscriber?.unsubscribed_at) {
      await supabase
        .from("abandoned_carts")
        .update({ dismissed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", cart.id);
      result.skippedUnsubscribed++;
      continue;
    }

    // ── Claim the send BEFORE dispatching, so a crash or overlapping run can
    // never produce a second reminder. Losing one reminder beats double-mailing.
    const claim = await supabase
      .from("abandoned_carts")
      .update({ reminder_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", cart.id)
      .is("reminder_sent_at", null)
      .select("id")
      .maybeSingle();

    if (!claim.data) continue; // another run got there first

    const token = createCartRecoveryToken(cart.id, cart.email);
    const recoveryUrl = `${siteUrl}/cart/recover?token=${encodeURIComponent(token)}`;
    const unsubscribeUrl = `${siteUrl}/mailing/unsubscribe?email=${encodeURIComponent(cart.email)}`;

    try {
      const res = await resend.emails.send({
        from: fromEmail,
        to: [cart.email],
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: "You left something in your basket",
        html: buildReminderHtml(cart, recoveryUrl, unsubscribeUrl),
      });
      if (res.error) {
        console.error("Abandoned cart email failed:", JSON.stringify(res.error));
        result.failed++;
      } else {
        result.sent++;
      }
    } catch (err) {
      console.error("Abandoned cart email threw:", err);
      result.failed++;
    }
  }

  return result;
}
