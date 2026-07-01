import { createHmac, timingSafeEqual } from "node:crypto";

/** 24 hours — long enough to find the email; still time-limited and signed. */
export const ORDER_ACCESS_TOKEN_TTL_SEC = 86400;

function signingSecret(): string {
  const secret =
    process.env.ORDER_ACCESS_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SITE_ACCESS_SECRET?.trim();
  if (!secret) {
    throw new Error("ORDER_ACCESS_SECRET or SUPABASE_SERVICE_ROLE_KEY required for order access tokens");
  }
  return secret;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function signPayload(payload: string): string {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

/** Signed token for post-checkout order access (email + order, valid 24h). */
export function createOrderAccessToken(orderNumber: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + ORDER_ACCESS_TOKEN_TTL_SEC;
  const payload = `${orderNumber}|${normalizeEmail(email)}|${exp}`;
  const sig = signPayload(payload);
  return Buffer.from(`${payload}|${sig}`, "utf8").toString("base64url");
}

export function verifyOrderAccessToken(
  token: string
): { orderNumber: string; email: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastPipe = decoded.lastIndexOf("|");
    if (lastPipe === -1) return null;

    const sig = decoded.slice(lastPipe + 1);
    const payload = decoded.slice(0, lastPipe);
    const expected = signPayload(payload);

    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

    const [orderNumber, email, expStr] = payload.split("|");
    if (!orderNumber || !email || !expStr) return null;

    const exp = Number(expStr);
    if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;

    return { orderNumber, email: normalizeEmail(email) };
  } catch {
    return null;
  }
}

export function orderAccessPageUrl(orderNumber: string, email: string): string {
  const token = createOrderAccessToken(orderNumber, email);
  const q = new URLSearchParams({
    order: orderNumber,
    token,
  });
  return `/account/order-access?${q.toString()}`;
}
