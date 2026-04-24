import { Resend } from "resend";

const DEFAULT_FROM_EMAIL = "Lava-SA Orders <noreply@lava-sa.online>";
const DEFAULT_ADMIN_EMAILS = ["info@lava-sa.co.za"];

export interface EmailConfig {
  fromEmail: string;
  adminEmails: string[];
  replyToEmail?: string;
}

export function getEmailConfig(): EmailConfig {
  const fromEmail =
    process.env.EMAIL_FROM?.trim() ||
    process.env.ORDER_EMAIL_FROM?.trim() ||
    DEFAULT_FROM_EMAIL;

  const adminRaw =
    process.env.EMAIL_ADMIN_TO?.trim() ||
    process.env.ORDER_EMAIL_ADMIN_TO?.trim() ||
    "";

  const adminEmails = (adminRaw
    ? adminRaw.split(",").map((email) => email.trim()).filter(Boolean)
    : DEFAULT_ADMIN_EMAILS);

  const replyToEmail =
    process.env.EMAIL_REPLY_TO?.trim() ||
    process.env.ORDER_EMAIL_REPLY_TO?.trim() ||
    undefined;

  return { fromEmail, adminEmails, replyToEmail };
}

export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing - skipping email dispatch.");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}
