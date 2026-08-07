import { createHmac, timingSafeEqual } from "node:crypto";

/** 14 days — long enough to be useful, short enough to expire a stale basket. */
export const CART_RECOVERY_TTL_SEC = 14 * 24 * 60 * 60;

function signingSecret(): string {
  const secret =
    process.env.ORDER_ACCESS_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SITE_ACCESS_SECRET?.trim();
  if (!secret) {
    throw new Error("ORDER_ACCESS_SECRET or SUPABASE_SERVICE_ROLE_KEY required for cart recovery tokens");
  }
  return secret;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sign(payload: string): string {
  return createHmac("sha256", signingSecret()).update(payload).digest("base64url");
}

/**
 * Signed link that restores an abandoned basket. Carries only the cart id and
 * email — never the contents, so a leaked link cannot expose what someone
 * bought, and the server re-reads the basket from the database.
 */
export function createCartRecoveryToken(cartId: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + CART_RECOVERY_TTL_SEC;
  const payload = `${cartId}|${normalizeEmail(email)}|${exp}`;
  return Buffer.from(`${payload}|${sign(payload)}`, "utf8").toString("base64url");
}

export function verifyCartRecoveryToken(
  token: string
): { cartId: string; email: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastPipe = decoded.lastIndexOf("|");
    if (lastPipe === -1) return null;

    const sig = decoded.slice(lastPipe + 1);
    const payload = decoded.slice(0, lastPipe);
    const expected = sign(payload);

    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    const [cartId, email, expStr] = payload.split("|");
    if (!cartId || !email || !expStr) return null;

    const exp = Number(expStr);
    if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;

    return { cartId, email: normalizeEmail(email) };
  } catch {
    return null;
  }
}
