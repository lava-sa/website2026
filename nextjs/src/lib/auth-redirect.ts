import { SITE_URL, getCustomerFacingSiteUrl } from "@/lib/seo";

/** Where Supabase sends users after invite / password-recovery (local dev may use localhost). */
function memberAuthCallbackBase(requestOrigin?: string): string {
  if (process.env.VERCEL_ENV === "production") return getCustomerFacingSiteUrl();

  const candidate =
    requestOrigin?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "http://localhost:3000";

  if (/lava-sa\.(online|co\.za)/i.test(candidate)) return getCustomerFacingSiteUrl();

  return candidate.replace(/\/$/, "");
}

/** Where Supabase sends users after invite / password-recovery (must match Dashboard allow list). */
export function getMemberPasswordSetupRedirectUrl(requestOrigin?: string): string {
  return `${memberAuthCallbackBase(requestOrigin)}/auth/callback?next=/account/reset-password`;
}

/**
 * One-click order tracking (emails + success page).
 * Always lava-sa.com — independent of NEXT_PUBLIC_SITE_URL / Supabase Site URL mistakes.
 */
export function getOrderTrackingAuthRedirectUrl(orderNumber: string): string {
  const next = `/account/orders/${encodeURIComponent(orderNumber)}`;
  return `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`;
}
