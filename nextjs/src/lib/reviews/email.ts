import { getEmailConfig, getResendClient } from "@/lib/email-config";
import { EMAIL_BRAND, escEmail, wrapEmailLayout } from "@/lib/email-template";
import { getPublicSiteUrl } from "@/lib/seo";

/** Always notified when a customer submits a review (written or video). */
export const REVIEW_NOTIFICATION_EMAILS = [
  "anneke@lava-sa.co.za",
  "reviews@lava-sa.com",
] as const;

export type ReviewSubmissionEmailArgs = {
  name: string;
  email?: string | null;
  headline?: string | null;
  machine?: string | null;
  reviewScope?: string | null;
  productSlug?: string | null;
  rating?: number | null;
  reviewType?: "written" | "video" | string | null;
};

function reviewNotificationRecipients(adminEmails: string[]): string[] {
  const merged = [...REVIEW_NOTIFICATION_EMAILS, ...adminEmails];
  const seen = new Set<string>();
  return merged.filter((addr) => {
    const key = addr.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function customerFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "there";
}

function isValidCustomerEmail(email: string | null | undefined): email is string {
  if (!email?.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

async function sendNewReviewNotificationEmail(args: ReviewSubmissionEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const { adminEmails, fromEmail, replyToEmail } = getEmailConfig();
  const recipients = reviewNotificationRecipients(adminEmails);
  const adminUrl = `${getPublicSiteUrl()}/admin/reviews`;
  const customerEmail = isValidCustomerEmail(args.email) ? args.email.trim() : null;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1f2937;">
      A new customer review has been submitted and is waiting for moderation.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Customer</td><td style="padding:8px 0;font-weight:600;">${escEmail(args.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;">${customerEmail ? escEmail(customerEmail) : "— (not provided)"}</td></tr>
      ${args.rating ? `<tr><td style="padding:8px 0;color:#6b7280;">Rating</td><td style="padding:8px 0;">${args.rating} / 5</td></tr>` : ""}
      ${args.headline ? `<tr><td style="padding:8px 0;color:#6b7280;">Headline</td><td style="padding:8px 0;">${escEmail(args.headline)}</td></tr>` : ""}
      ${args.machine ? `<tr><td style="padding:8px 0;color:#6b7280;">Product</td><td style="padding:8px 0;">${escEmail(args.machine)}</td></tr>` : ""}
      ${args.reviewType ? `<tr><td style="padding:8px 0;color:#6b7280;">Type</td><td style="padding:8px 0;">${escEmail(args.reviewType)}</td></tr>` : ""}
    </table>
    <p style="margin:24px 0 0;">
      <a href="${adminUrl}" style="display:inline-block;background:#0d2b3e;color:#fff;font-weight:700;text-decoration:none;padding:12px 20px;">
        Review in Admin →
      </a>
    </p>`;

  const html = wrapEmailLayout({
    headline: "New customer review submitted",
    subheadline: args.headline ?? args.machine ?? undefined,
    badge: args.reviewType === "video" ? "Video" : "Written",
    bodyHtml,
  });

  const res = await resend.emails.send({
    from: fromEmail,
    to: recipients,
    replyTo: replyToEmail ?? customerEmail ?? undefined,
    subject: `New LAVA review from ${args.name}${args.headline ? `: ${args.headline}` : ""}`,
    html,
  });

  if (res.error) {
    console.error("New review notification email failed:", JSON.stringify(res.error));
  } else {
    console.info(`Review notification queued → ${recipients.join(", ")}`);
  }
}

async function sendReviewThankYouEmail(args: ReviewSubmissionEmailArgs): Promise<void> {
  if (!isValidCustomerEmail(args.email)) return;

  const resend = getResendClient();
  if (!resend) return;

  const { fromEmail, replyToEmail } = getEmailConfig();
  const firstName = customerFirstName(args.name);
  const isVideo = args.reviewType === "video";

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${EMAIL_BRAND.text};">
      Baie dankie for taking the time to share your LAVA experience with us.
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${EMAIL_BRAND.text};">
      As a valued Lava-SA customer, your feedback means a great deal to our small team.
      Anneke will read your ${isVideo ? "video story" : "review"} personally.
    </p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:${EMAIL_BRAND.text};">
      Once approved, it will appear on our website within 1–2 business days to help other
      South Africans choose with confidence.
    </p>
    <p style="margin:20px 0 0;font-size:15px;line-height:1.65;color:${EMAIL_BRAND.text};">
      With gratitude,<br/>
      <strong>Anneke &amp; the Lava-SA Team</strong>
    </p>`;

  const html = wrapEmailLayout({
    headline: `Thank you, ${escEmail(firstName)}!`,
    subheadline: "We received your review",
    badge: isVideo ? "Video story" : "Written review",
    bodyHtml,
  });

  const res = await resend.emails.send({
    from: fromEmail,
    to: [args.email.trim()],
    replyTo: replyToEmail ?? "info@lava-sa.com",
    subject: `Thank you for your LAVA review, ${firstName}`,
    html,
  });

  if (res.error) {
    console.error("Review thank-you email failed:", JSON.stringify(res.error));
  } else {
    console.info(`Review thank-you queued → ${args.email.trim()}`);
  }
}

/** Notify the review team and thank the customer (when email is available). */
export async function sendReviewSubmissionEmails(args: ReviewSubmissionEmailArgs): Promise<void> {
  try {
    await Promise.all([
      sendNewReviewNotificationEmail(args),
      sendReviewThankYouEmail(args),
    ]);
  } catch (err) {
    console.error("Review submission emails failed:", err);
  }
}
