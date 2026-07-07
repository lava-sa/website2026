import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/account-auth-email";
import { getMemberPasswordSetupRedirectUrl } from "@/lib/auth-redirect";
import { isSuspiciousSignupEmail } from "@/lib/security/signup-guard";
import { emailDomainCanReceiveMail } from "@/lib/security/email-domain-check";

export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Password reset for existing member accounts (returning / past customers). */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
      return NextResponse.json(
        { error: "Password reset is temporarily unavailable. Please contact us for help." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (isSuspiciousSignupEmail(email)) {
      return NextResponse.json({ error: "Please use a valid email address." }, { status: 400 });
    }

    if (!(await emailDomainCanReceiveMail(email))) {
      return NextResponse.json({ error: "Please use a valid, working email address." }, { status: 400 });
    }

    const redirectTo = getMemberPasswordSetupRedirectUrl(new URL(req.url).origin);
    const result = await sendPasswordResetEmail(email, redirectTo);

    if (result.ok) {
      return NextResponse.json({ ok: true });
    }

    if (result.code === "not_registered") {
      return NextResponse.json({ error: result.message, code: result.code }, { status: 404 });
    }

    return NextResponse.json({ error: result.message }, { status: 500 });
  } catch (err) {
    console.error("[password-reset]", err);
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 });
  }
}
