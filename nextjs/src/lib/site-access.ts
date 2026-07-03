/**
 * Site preview gate — works in Edge middleware and Node API routes (Web Crypto).
 */

export const SITE_ACCESS_COOKIE = "site_access";

const ACCESS_TOKEN = "granted";
const DERIVE_KEY = "lava-site-access-v1";

/** True when SITE_ACCESS_PASSWORD is set and SITE_ACCESS_ENABLED is not "false". */
export function isSiteAccessEnabled(): boolean {
  if (process.env.SITE_ACCESS_ENABLED === "false") return false;
  return Boolean(process.env.SITE_ACCESS_PASSWORD?.trim());
}

async function hmacSha256Hex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function getSigningSecret(): Promise<string | null> {
  const explicit = process.env.SITE_ACCESS_SECRET?.trim();
  if (explicit) return explicit;
  const password = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!password) return null;
  return hmacSha256Hex(DERIVE_KEY, password);
}

export async function signSiteAccessCookie(): Promise<string | null> {
  const secret = await getSigningSecret();
  if (!secret) return null;
  return hmacSha256Hex(secret, ACCESS_TOKEN);
}

export async function verifySiteAccessCookie(cookieValue: string | undefined): Promise<boolean> {
  const expected = await signSiteAccessCookie();
  if (!expected || !cookieValue) return false;
  return timingSafeEqualStr(cookieValue, expected);
}

export function verifySiteAccessPassword(password: string): boolean {
  const expected = process.env.SITE_ACCESS_PASSWORD?.trim();
  if (!expected) return false;
  return timingSafeEqualStr(password, expected);
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
    pathname.startsWith("/api/admin") ||
    pathname === "/lava-sa" ||
    pathname.startsWith("/lava-sa/")
  ) {
    return true;
  }
  return false;
}
