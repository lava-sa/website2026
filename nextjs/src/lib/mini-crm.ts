import { getEmailConfig, getResendClient } from "@/lib/email-config";
import { createServiceClient } from "@/lib/supabase";

export type SegmentType = "opted_in" | "purchasers" | "region";

type Recipient = {
  email: string;
  first_name: string | null;
};

type BroadcastRow = {
  id: string;
  name: string;
  segment_type: SegmentType;
  region: string | null;
  template_key: string;
  subject: string;
  html_body: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  scheduled_for: string | null;
};

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildMarketingHtml(args: {
  htmlBody: string;
  email: string;
  firstName: string | null;
  broadcastName: string;
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://lava-sa.online";
  const firstName = args.firstName?.trim() || "there";
  const bodyWithName = args.htmlBody.replaceAll("{{first_name}}", escapeHtml(firstName));
  const unsubscribeUrl = `${siteUrl}/mailing/unsubscribe?email=${encodeURIComponent(args.email)}`;

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0d2b3e;line-height:1.55;">
      ${bodyWithName}
      <hr style="margin:28px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="margin:0 0 8px;font-size:12px;color:#4b5563;">
        You are receiving this email because you gave LAVA South Africa consent to send product updates or offers.
      </p>
      <p style="margin:0 0 8px;font-size:12px;color:#4b5563;">
        POPIA notice: we process your contact details to deliver marketing communication you opted into.
      </p>
      <p style="margin:0;font-size:12px;color:#4b5563;">
        Campaign: ${escapeHtml(args.broadcastName)} ·
        <a href="${unsubscribeUrl}" style="color:#0d2b3e;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function uniqRecipients(rows: Recipient[]): Recipient[] {
  const map = new Map<string, Recipient>();
  for (const row of rows) {
    const email = row.email.trim().toLowerCase();
    if (!email) continue;
    if (!map.has(email)) {
      map.set(email, { email, first_name: row.first_name ?? null });
    }
  }
  return Array.from(map.values());
}

async function recipientsForOptedIn(): Promise<Recipient[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("mailing_list_subscribers")
    .select("email, first_name")
    .eq("opted_in", true);
  if (error) throw new Error(error.message);
  return uniqRecipients((data ?? []) as Recipient[]);
}

async function recipientsForPurchasers(): Promise<Recipient[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("customers")
    .select("email, first_name")
    .gt("order_count", 0)
    .eq("marketing_opt_in", true);
  if (error) throw new Error(error.message);
  return uniqRecipients((data ?? []) as Recipient[]);
}

async function recipientsForRegion(region: string): Promise<Recipient[]> {
  const value = region.trim();
  if (!value) return [];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("customers")
    .select("email, first_name, billing_state, shipping_state, marketing_opt_in")
    .eq("marketing_opt_in", true)
    .or(`billing_state.ilike.%${value}%,shipping_state.ilike.%${value}%`);
  if (error) throw new Error(error.message);
  return uniqRecipients((data ?? []) as Recipient[]);
}

export async function resolveRecipients(segment: SegmentType, region: string | null): Promise<Recipient[]> {
  if (segment === "opted_in") return recipientsForOptedIn();
  if (segment === "purchasers") return recipientsForPurchasers();
  return recipientsForRegion(region ?? "");
}

export async function dispatchBroadcastById(id: string): Promise<{
  ok: boolean;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  error?: string;
}> {
  const supabase = createServiceClient();
  const resend = getResendClient();

  if (!resend) {
    return { ok: false, recipientCount: 0, sentCount: 0, failedCount: 0, error: "RESEND_API_KEY is missing" };
  }

  const { data: row, error: rowError } = await supabase
    .from("marketing_broadcasts")
    .select("id, name, segment_type, region, template_key, subject, html_body, status, scheduled_for")
    .eq("id", id)
    .maybeSingle();

  if (rowError) {
    return { ok: false, recipientCount: 0, sentCount: 0, failedCount: 0, error: rowError.message };
  }
  if (!row) {
    return { ok: false, recipientCount: 0, sentCount: 0, failedCount: 0, error: "Broadcast not found" };
  }

  const broadcast = row as BroadcastRow;
  if (broadcast.status === "sent") {
    return { ok: true, recipientCount: 0, sentCount: 0, failedCount: 0 };
  }

  const recipients = await resolveRecipients(broadcast.segment_type, broadcast.region);
  const recipientCount = recipients.length;

  await supabase
    .from("marketing_broadcasts")
    .update({
      status: "sending",
      recipient_count: recipientCount,
      sent_count: 0,
      failed_count: 0,
      last_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  const { fromEmail, replyToEmail } = getEmailConfig();
  let sentCount = 0;
  let failedCount = 0;

  for (const recipient of recipients) {
    try {
      const html = buildMarketingHtml({
        htmlBody: broadcast.html_body,
        email: recipient.email,
        firstName: recipient.first_name,
        broadcastName: broadcast.name,
      });

      const result = await resend.emails.send({
        from: fromEmail,
        to: [recipient.email],
        ...(replyToEmail ? { replyTo: replyToEmail } : {}),
        subject: broadcast.subject,
        html,
      });

      if (result.error) failedCount += 1;
      else sentCount += 1;
    } catch {
      failedCount += 1;
    }
  }

  const status = failedCount > 0 && sentCount === 0 ? "failed" : "sent";
  const sentAt = new Date().toISOString();
  await supabase
    .from("marketing_broadcasts")
    .update({
      status,
      sent_at: sentAt,
      sent_count: sentCount,
      failed_count: failedCount,
      updated_at: sentAt,
    })
    .eq("id", id);

  return { ok: true, recipientCount, sentCount, failedCount };
}

export async function dispatchDueScheduledBroadcasts(): Promise<{ processed: number; sent: number; failed: number }> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("marketing_broadcasts")
    .select("id")
    .eq("status", "scheduled")
    .lte("scheduled_for", now)
    .order("scheduled_for", { ascending: true })
    .limit(20);

  if (error || !data?.length) return { processed: 0, sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;
  for (const row of data) {
    const result = await dispatchBroadcastById(String(row.id));
    if (result.ok && result.sentCount > 0) sent += 1;
    else failed += 1;
  }
  return { processed: data.length, sent, failed };
}
