import type { NextRequest } from "next/server";
import {
  isHoneypotTripped,
  isSuspiciousSignupEmail,
  isSuspiciousSignupName,
} from "@/lib/security/signup-guard";
import { isTurnstileConfigured, verifyTurnstileToken } from "@/lib/security/turnstile";
import {
  SITE_ACCESS_COOKIE,
  isSiteAccessEnabled,
  verifySiteAccessCookie,
} from "@/lib/site-access";

/** Public POST endpoints that accept form submissions from the website. */
export const GATED_WRITE_API_PREFIXES = [
  "/api/contact",
  "/api/reviews",
  "/api/mailing-list",
  "/api/demo-bookings",
] as const;

export function isGatedWriteApi(pathname: string): boolean {
  return GATED_WRITE_API_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/** Real client IP — prefers Cloudflare when proxied. */
export function getClientIp(req: NextRequest | Request): string | undefined {
  const headers = req.headers;
  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    undefined
  );
}

export async function hasSiteAccessFromRequest(req: NextRequest): Promise<boolean> {
  if (!isSiteAccessEnabled()) return true;
  const cookie = req.cookies.get(SITE_ACCESS_COOKIE)?.value;
  return verifySiteAccessCookie(cookie);
}

export type PublicFormPayload = {
  turnstileToken?: string;
  website?: string;
  email?: string;
  name?: string;
  first_name?: string;
};

export type PublicFormGuardResult =
  | { ok: true }
  | { ok: false; silent: true }
  | { ok: false; silent: false; status: number; error: string };

export async function verifyPublicFormSubmission(
  req: NextRequest,
  body: PublicFormPayload
): Promise<PublicFormGuardResult> {
  if (isHoneypotTripped(body.website)) {
    return { ok: false, silent: true };
  }

  if (isSiteAccessEnabled() && !(await hasSiteAccessFromRequest(req))) {
    return {
      ok: false,
      silent: false,
      status: 403,
      error: "This site is in preview — please enter the access password first.",
    };
  }

  if (isTurnstileConfigured()) {
    const ip = getClientIp(req);
    const captcha = await verifyTurnstileToken(body.turnstileToken, ip);
    if (!captcha.ok) {
      return {
        ok: false,
        silent: false,
        status: 400,
        error: captcha.error ?? "Security check failed.",
      };
    }
  }

  const email = body.email?.trim().toLowerCase();
  if (email) {
    if (!email.includes("@")) {
      return { ok: false, silent: false, status: 400, error: "Please enter a valid email address." };
    }
    if (isSuspiciousSignupEmail(email)) {
      return { ok: false, silent: false, status: 400, error: "Please use a valid email address." };
    }
  }

  const fullName = body.name?.trim() ?? body.first_name?.trim() ?? "";
  if (fullName && isSuspiciousSignupName(fullName)) {
    return { ok: false, silent: false, status: 400, error: "Please enter your real name." };
  }

  return { ok: true };
}

export function guardFailureResponse(guard: Extract<PublicFormGuardResult, { ok: false }>) {
  if (guard.silent) {
    return { body: { ok: true, success: true }, status: 200 };
  }
  return { body: { error: guard.error }, status: guard.status };
}
