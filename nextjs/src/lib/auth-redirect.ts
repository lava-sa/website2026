import type { EmailOtpType } from "@supabase/supabase-js";
import { SITE_URL, getCustomerFacingSiteUrl } from "@/lib/seo";

function isLocalDevHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/** Use localhost callback only when the API request itself came from local dev. */
function memberAuthCallbackBase(requestOrigin?: string): string {
  const origin = requestOrigin?.replace(/\/$/, "") ?? "";
  if (origin) {
    try {
      const host = new URL(origin).hostname.toLowerCase();
      if (isLocalDevHost(host) && process.env.NODE_ENV === "development") {
        return origin;
      }
    } catch {
      /* fall through to live domain */
    }
  }

  return getCustomerFacingSiteUrl();
}

/** Where Supabase sends users after invite / password-recovery (must match Dashboard allow list). */
export function getMemberPasswordSetupRedirectUrl(requestOrigin?: string): string {
  const next = encodeURIComponent("/account/reset-password");
  return `${memberAuthCallbackBase(requestOrigin)}/auth/callback?next=${next}`;
}

/**
 * One-click order tracking (emails + success page).
 * Always lava-sa.com — independent of NEXT_PUBLIC_SITE_URL / Supabase Site URL mistakes.
 */
export function getOrderTrackingAuthRedirectUrl(orderNumber: string): string {
  const next = `/account/orders/${encodeURIComponent(orderNumber)}`;
  return `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`;
}

/**
 * One-click auth URL on lava-sa.com — bypasses Supabase /auth/v1/verify (Site URL → localhost bug).
 */
export function buildCustomerAuthCallbackUrl(params: {
  tokenHash: string;
  otpType: EmailOtpType;
  nextPath: string;
}): string {
  const query = new URLSearchParams({
    token_hash: params.tokenHash,
    type: params.otpType,
    next: params.nextPath,
  });
  return `${getCustomerFacingSiteUrl()}/auth/callback?${query.toString()}`;
}
