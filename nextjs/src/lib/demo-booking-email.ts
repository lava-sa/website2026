import { getEmailConfig, getResendClient } from "@/lib/email-config";
import { ANNEKE_PHONE } from "@/lib/contact";
import type { DemoType } from "@/lib/demo-booking-config";
import { formatDateDisplay, formatSlotLabel } from "@/lib/demo-availability";

const SHOWROOM_ADDRESS =
  "5 Stirling Road, Bryanston, Johannesburg, 2191";

const ANNEKE_DEMO_EMAIL = "anneke@lava-sa.co.za";

interface CustomerEmailProps {
  reference: string;
  customerName: string;
  demo: DemoType;
  dateDisplay: string;
  timeDisplay: string;
  notes?: string;
}

export function buildCustomerDemoEmail(p: CustomerEmailProps): string {
  const location =
    p.demo.slug === "showroom"
      ? SHOWROOM_ADDRESS
      : "Anneke will send you a video call link before your demonstration.";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#063a46;padding:32px 40px;text-align:center;">
            <p style="margin:0;color:#c9a227;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Lava-SA</p>
            <h1 style="margin:12px 0 0;color:#fff;font-size:22px;font-weight:700;">Demonstration Confirmed</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:36px 40px;">
            <p style="margin:0 0 16px;color:#333;font-size:15px;">Dear ${p.customerName},</p>
            <p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;">
              Your vacuum sealer demonstration has been booked. We look forward to showing you how LAVA can work for you.
            </p>
            <table width="100%" style="background:#f8f8f8;border-left:4px solid #c9a227;margin-bottom:24px;">
              <tr><td style="padding:20px 24px;font-size:14px;">
                <p style="margin:0 0 12px;font-weight:700;color:#063a46;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Booking details</p>
                <p style="margin:4px 0;color:#666;"><strong style="color:#333;">Reference:</strong> ${p.reference}</p>
                <p style="margin:4px 0;color:#666;"><strong style="color:#333;">Type:</strong> ${p.demo.title}</p>
                <p style="margin:4px 0;color:#666;"><strong style="color:#333;">Date:</strong> ${p.dateDisplay}</p>
                <p style="margin:4px 0;color:#666;"><strong style="color:#333;">Time:</strong> ${p.timeDisplay}</p>
                <p style="margin:4px 0;color:#666;"><strong style="color:#333;">${p.demo.slug === "showroom" ? "Location" : "Online"}:</strong> ${location}</p>
                ${p.notes ? `<p style="margin:8px 0 0;color:#666;"><strong style="color:#333;">Your notes:</strong> ${p.notes}</p>` : ""}
              </td></tr>
            </table>
            <p style="margin:0 0 8px;color:#333;font-size:14px;font-weight:700;">Need to reschedule?</p>
            <p style="margin:0;color:#666;font-size:14px;line-height:1.6;">
              Contact Anneke at least 24 hours in advance:<br>
              <a href="tel:${ANNEKE_PHONE.tel}" style="color:#063a46;">${ANNEKE_PHONE.displayLocal}</a> ·
              <a href="mailto:info@lava-sa.com" style="color:#063a46;">info@lava-sa.com</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#063a46;padding:20px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:12px;opacity:0.8;">Lava-SA · German Vacuum Sealers Since 2007</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

interface StaffEmailProps extends CustomerEmailProps {
  customerEmail: string;
  customerPhone: string;
}

export function buildStaffDemoEmail(p: StaffEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
    <tr><td align="center">
      <table width="580" style="max-width:580px;width:100%;background:#fff;border:1px solid #ddd;">
        <tr>
          <td style="background:#063a46;padding:20px 28px;">
            <p style="margin:0;color:#c9a227;font-size:10px;letter-spacing:2px;text-transform:uppercase;">New demonstration booking</p>
            <h2 style="margin:8px 0 0;color:#fff;font-size:18px;">${p.demo.title}</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;font-size:14px;color:#333;">
            <p style="margin:0 0 16px;font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:1px;color:#063a46;">Customer</p>
            <p style="margin:4px 0;"><strong>Name:</strong> ${p.customerName}</p>
            <p style="margin:4px 0;"><strong>Phone:</strong> <a href="tel:${p.customerPhone}">${p.customerPhone}</a></p>
            <p style="margin:4px 0;"><strong>Email:</strong> <a href="mailto:${p.customerEmail}">${p.customerEmail}</a></p>
            <hr style="margin:20px 0;border:none;border-top:1px solid #eee;" />
            <p style="margin:0 0 16px;font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:1px;color:#063a46;">Slot</p>
            <p style="margin:4px 0;"><strong>Reference:</strong> ${p.reference}</p>
            <p style="margin:4px 0;"><strong>Date:</strong> ${p.dateDisplay}</p>
            <p style="margin:4px 0;"><strong>Time:</strong> ${p.timeDisplay}</p>
            ${p.notes ? `<p style="margin:12px 0 0;"><strong>Notes:</strong> ${p.notes}</p>` : ""}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

export async function sendDemoBookingEmails(args: {
  reference: string;
  demo: DemoType;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY missing — demo booking emails skipped.");
    return;
  }

  const { fromEmail, adminEmails } = getEmailConfig();
  const dateDisplay = formatDateDisplay(args.date);
  const timeDisplay = formatSlotLabel(args.timeSlot);

  const base = {
    reference: args.reference,
    demo: args.demo,
    dateDisplay,
    timeDisplay,
    customerName: args.customerName,
    notes: args.notes,
  };

  const staffTo = [...new Set([ANNEKE_DEMO_EMAIL, ...adminEmails])];

  await resend.emails.send({
    from: fromEmail,
    to: args.customerEmail,
    subject: `Demonstration confirmed — ${args.demo.title} | ${args.reference}`,
    html: buildCustomerDemoEmail(base),
  });

  await resend.emails.send({
    from: fromEmail,
    to: staffTo,
    replyTo: args.customerEmail,
    subject: `New demo booking: ${args.demo.title} — ${dateDisplay} at ${timeDisplay}`,
    html: buildStaffDemoEmail({
      ...base,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
    }),
  });
}
