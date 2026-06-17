import { getPublicSiteUrl } from "@/lib/seo";

/** Where Supabase sends users after invite / password-recovery (must match Dashboard allow list). */
export function getMemberPasswordSetupRedirectUrl(requestOrigin?: string): string {
  const isProduction = process.env.VERCEL_ENV === "production";
  const base = isProduction
    ? getPublicSiteUrl()
    : (requestOrigin?.replace(/\/$/, "") || getPublicSiteUrl());
  return `${base.replace(/\/$/, "")}/auth/callback?next=/account/reset-password`;
}
