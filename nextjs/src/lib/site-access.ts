import { createHmac, timingSafeEqual } from "crypto";

export const SITE_ACCESS_COOKIE = "site_access";

const ACCESS_TOKEN = "granted";

/** True when SITE_ACCESS_PASSWORD is set and SITE_ACCESS_ENABLED is not "false". */
export function isSiteAccessEnabled(): boolean {
  if (process.env.SITE_ACCESS_ENABLED === "false") return false;
  return Boolean(process.env.SITE_ACCESS_PASSWORD?.trim());
}

function getSigningSecret(): string | null {
  const explicit = process.env.SITE_ACCESS_SECRET?.trim();
  if (explicit) return explicit;
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!password) return null;
  return createHmac("sha256", "lava-site-access-v1").update(password).digest("hex");
}

export function signSiteAccessCookie(): string | null {
  const secret = getSigningSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(ACCESS_TOKEN).digest("hex");
}

export function verifySiteAccessCookie(cookieValue: string | undefined): boolean {
  const expected = signSiteAccessCookie();
  if (!expected || !cookieValue) return false;
  try {
    const a = Buffer.from(cookieValue, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifySiteAccessPassword(password: string): boolean {
  const expected = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!expected) return false;
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Paths that must work without the site-access cookie (webhooks, gate, admin). */
export function isSiteAccessExemptPath(pathname: string): boolean {
  if (pathname === "/site-access" || pathname.startsWith("/site-access/")) {
    return true;
  }
  if (pathname === "/api/site-access") return true;
  if (pathname === "/api/payfast/itn") return true;
  if (pathname.startsWith("/api/cron/")) return true;
  if (pathname === "/auth/callback" || pathname.startsWith("/auth/callback")) {
    return true;
  }
  if (
    pathname.startsWith("/admin") ||
    pathname === "/lava-sa" ||
    pathname.startsWith("/lava-sa/")
  ) {
    return true;
  }
  return false;
}
