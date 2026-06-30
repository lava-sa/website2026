import { getEmailConfig, getResendClient } from "@/lib/email-config";
import { escEmail, wrapEmailLayout } from "@/lib/email-template";
import { getPublicSiteUrl } from "@/lib/seo";

type NewReviewEmailArgs = {
  name: string;
  email: string;
  headline?: string | null;
  machine?: string | null;
  reviewScope?: string | null;
  productSlug?: string | null;
  rating?: number | null;
  reviewType?: string | null;
};

export async function sendNewReviewNotificationEmail(args: NewReviewEmailArgs): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  const { adminEmails, fromEmail, replyToEmail } = getEmailConfig();
  const adminUrl = `${getPublicSiteUrl()}/admin/reviews`;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#1f2937;">
      A new customer review has been submitted and is waiting for moderation.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Customer</td><td style="padding:8px 0;font-weight:600;">${escEmail(args.name)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;">${escEmail(args.email)}</td></tr>
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

  try {
    await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      replyTo: replyToEmail ?? args.email,
      subject: `New LAVA review from ${args.name}${args.headline ? `: ${args.headline}` : ""}`,
      html,
    });
  } catch (err) {
    console.error("New review notification email failed:", err);
  }
}
