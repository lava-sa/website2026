import { getPublicSiteUrl } from "@/lib/seo";

/** LAVA brand tokens for HTML email (inline styles only). */
export const EMAIL_BRAND = {
  primary: "#0d2b3e",
  primaryDark: "#081f2e",
  teal: "#1b6b6b",
  gold: "#b8973a",
  goldLight: "#fffef8",
  bg: "#f4f5f7",
  card: "#ffffff",
  border: "#e5e7eb",
  muted: "#6b7280",
  text: "#1f2937",
};

export function escEmail(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatEmailPrice(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type WrapEmailArgs = {
  /** Main headline in the header band */
  headline: string;
  /** Smaller line under headline (e.g. order number) */
  subheadline?: string;
  /** Badge text in header (e.g. PayFast, EFT) */
  badge?: string;
  bodyHtml: string;
  /** Optional line above footer */
  prefooterHtml?: string;
};

/** Centered card layout with LAVA header — works in Gmail, Outlook, Apple Mail. */
export function wrapEmailLayout(args: WrapEmailArgs): string {
  const siteUrl = getPublicSiteUrl();
  const logoUrl = `${siteUrl}/images/logo/lava-sa-logo-white.webp`;
  const badge = args.badge
    ? `<span style="display:inline-block;margin-top:10px;padding:6px 14px;background:${EMAIL_BRAND.gold};color:${EMAIL_BRAND.primary};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;border-radius:4px;">${escEmail(args.badge)}</span>`
    : "";
  const sub = args.subheadline
    ? `<p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,0.85);">${args.subheadline}</p>`
    : "";
  const prefooter = args.prefooterHtml
    ? `<tr><td style="padding:0 28px 20px;">${args.prefooterHtml}</td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${EMAIL_BRAND.bg};font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_BRAND.bg};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:${EMAIL_BRAND.card};border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(13,43,62,0.08);">
  <tr>
    <td style="background:linear-gradient(135deg,${EMAIL_BRAND.primary} 0%,${EMAIL_BRAND.teal} 100%);padding:28px 28px 24px;text-align:center;">
      <a href="${siteUrl}" style="text-decoration:none;">
        <img src="${logoUrl}" alt="Lava-SA" width="160" height="46" style="display:block;margin:0 auto;height:auto;max-width:160px;border:0;" />
      </a>
      <h1 style="margin:20px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${args.headline}</h1>
      ${sub}
      ${badge}
    </td>
  </tr>
  <tr>
    <td style="padding:28px;color:${EMAIL_BRAND.text};font-size:15px;line-height:1.55;">
      ${args.bodyHtml}
    </td>
  </tr>
  ${prefooter}
  <tr>
    <td style="padding:20px 28px;background:${EMAIL_BRAND.primary};text-align:center;">
      <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.9);">
        <strong>LAVA South Africa</strong> &middot; Premium German vacuum sealing
      </p>
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.65);">
        <a href="${siteUrl}" style="color:#d4b87a;text-decoration:none;">lava-sa.com</a>
        &nbsp;&middot;&nbsp; +27 72 160 5556
        &nbsp;&middot;&nbsp;
        <a href="mailto:info@lava-sa.com" style="color:#d4b87a;text-decoration:none;">info@lava-sa.com</a>
      </p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function emailSectionTitle(title: string): string {
  return `<p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${EMAIL_BRAND.teal};">${escEmail(title)}</p>`;
}

export function emailHighlightTotal(label: string, amount: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:${EMAIL_BRAND.primary};border-radius:6px;">
      <tr>
        <td style="padding:18px 22px;">
          <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:0.05em;">${escEmail(label)}</p>
          <p style="margin:6px 0 0;font-size:28px;font-weight:700;color:#ffffff;">${amount}</p>
        </td>
      </tr>
    </table>`;
}

export function emailDetailGrid(rows: { label: string; value: string }[]): string {
  const cells = rows
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 12px 8px 0;font-size:13px;color:${EMAIL_BRAND.muted};width:38%;vertical-align:top;">${escEmail(r.label)}</td>
        <td style="padding:8px 0;font-size:14px;color:${EMAIL_BRAND.text};vertical-align:top;">${r.value}</td>
      </tr>`
    )
    .join("");
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid ${EMAIL_BRAND.border};border-radius:6px;">
      <tbody>${cells}</tbody>
    </table>`;
}

export function emailTwoColumns(leftTitle: string, leftHtml: string, rightTitle: string, rightHtml: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td width="48%" valign="top" style="padding-right:12px;">
          ${emailSectionTitle(leftTitle)}
          <div style="padding:14px;background:#f9fafb;border:1px solid ${EMAIL_BRAND.border};border-radius:6px;font-size:14px;line-height:1.5;color:${EMAIL_BRAND.text};">
            ${leftHtml}
          </div>
        </td>
        <td width="4%"></td>
        <td width="48%" valign="top" style="padding-left:12px;">
          ${emailSectionTitle(rightTitle)}
          <div style="padding:14px;background:#f9fafb;border:1px solid ${EMAIL_BRAND.border};border-radius:6px;font-size:14px;line-height:1.5;color:${EMAIL_BRAND.text};">
            ${rightHtml}
          </div>
        </td>
      </tr>
    </table>`;
}

export function emailOrderItemsTable(
  rowsHtml: string,
  subtotal: string,
  shipping: string,
  total: string
): string {
  return `
    ${emailSectionTitle("Order items")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-collapse:collapse;">
      <thead>
        <tr style="background:${EMAIL_BRAND.primary};">
          <th style="padding:12px 14px;text-align:left;font-size:12px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.04em;">Item</th>
          <th style="padding:12px 10px;text-align:center;font-size:12px;font-weight:700;color:#fff;width:56px;">Qty</th>
          <th style="padding:12px 14px;text-align:right;font-size:12px;font-weight:700;color:#fff;width:100px;">Total</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      <tr>
        <td style="padding:6px 0;text-align:right;font-size:14px;color:${EMAIL_BRAND.muted};">Subtotal</td>
        <td style="padding:6px 0;text-align:right;font-size:14px;color:${EMAIL_BRAND.text};width:120px;font-weight:600;">${subtotal}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;text-align:right;font-size:14px;color:${EMAIL_BRAND.muted};">Delivery</td>
        <td style="padding:6px 0;text-align:right;font-size:14px;color:${EMAIL_BRAND.text};width:120px;font-weight:600;">${shipping}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;text-align:right;font-size:16px;font-weight:700;color:${EMAIL_BRAND.primary};border-top:2px solid ${EMAIL_BRAND.border};">Order total</td>
        <td style="padding:12px 0 0;text-align:right;font-size:18px;font-weight:700;color:${EMAIL_BRAND.primary};width:120px;border-top:2px solid ${EMAIL_BRAND.border};">${total}</td>
      </tr>
    </table>`;
}

export function emailButton(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto 8px;">
      <tr>
        <td style="border-radius:6px;background:${EMAIL_BRAND.teal};">
          <a href="${href}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${escEmail(label)}</a>
        </td>
      </tr>
    </table>`;
}

export function emailAlertBox(html: string, variant: "gold" | "teal" = "gold"): string {
  const border = variant === "gold" ? EMAIL_BRAND.gold : EMAIL_BRAND.teal;
  const bg = variant === "gold" ? EMAIL_BRAND.goldLight : "#f0f9f9";
  return `
    <div style="margin:0 0 20px;padding:16px 18px;background:${bg};border-left:4px solid ${border};border-radius:4px;font-size:14px;line-height:1.5;color:${EMAIL_BRAND.text};">
      ${html}
    </div>`;
}
