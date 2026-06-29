import { getPublicSiteUrl } from "@/lib/seo";

function authCallbackBase(requestOrigin?: string): string {
  const isProduction = process.env.VERCEL_ENV === "production";
  const base = isProduction
    ? getPublicSiteUrl()
    : (requestOrigin?.replace(/\/$/, "") || getPublicSiteUrl());
  return base.replace(/\/$/, "");
}

/** Where Supabase sends users after invite / password-recovery (must match Dashboard allow list). */
export function getMemberPasswordSetupRedirectUrl(requestOrigin?: string): string {
  return `${authCallbackBase(requestOrigin)}/auth/callback?next=/account/reset-password`;
}

/** One-click order tracking from order emails (magic link → signed in → order page). */
export function getOrderTrackingAuthRedirectUrl(
  orderNumber: string,
  requestOrigin?: string
): string {
  const next = `/account/orders/${encodeURIComponent(orderNumber)}`;
  return `${authCallbackBase(requestOrigin)}/auth/callback?next=${encodeURIComponent(next)}`;
}
