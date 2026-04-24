import { NextRequest, NextResponse } from "next/server";
import { getEmailConfig, getResendClient } from "@/lib/email-config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, province, enquiry_type, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resend = getResendClient();
    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }
    const { fromEmail, adminEmails } = getEmailConfig();

    const emailRes = await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      replyTo: email,
      subject: `[Contact Form] ${enquiry_type} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0d2b3e;border-bottom:3px solid #b8973a;padding-bottom:8px">
            New Contact Form Submission
          </h2>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;font-weight:bold;width:140px;color:#666">Name</td><td style="padding:8px">${name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#666">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#666">Phone</td><td style="padding:8px">${phone || "—"}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:8px;font-weight:bold;color:#666">Province</td><td style="padding:8px">${province || "—"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#666">Enquiry type</td><td style="padding:8px">${enquiry_type || "—"}</td></tr>
          </table>
          <h3 style="color:#0d2b3e">Message</h3>
          <div style="background:#f5f5f5;padding:16px;border-left:4px solid #b8973a;white-space:pre-wrap">${message}</div>
          <p style="color:#999;font-size:12px;margin-top:24px">
            Sent via lava-sa.online contact form · ${new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}
          </p>
        </div>
      `,
    });
    if (emailRes.error) {
      console.error("Contact form Resend error:", emailRes.error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
