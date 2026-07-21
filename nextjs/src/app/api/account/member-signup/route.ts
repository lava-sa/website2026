import { NextRequest, NextResponse } from "next/server";
import { sendMemberSignupEmail } from "@/lib/account-auth-email";
import { getMemberPasswordSetupRedirectUrl } from "@/lib/auth-redirect";
import { emailDomainCanReceiveMail } from "@/lib/security/email-domain-check";
import {
  guardFailureResponse,
  verifyPublicFormSubmission,
} from "@/lib/security/public-form-guard";

export const dynamic = "force-dynamic";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Free member signup — new visitors (manuals, points). No purchase required. */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
      return NextResponse.json(
        { error: "Member signup is temporarily unavailable. Please contact us for help." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    const guard = await verifyPublicFormSubmission(req, {
      turnstileToken: body.turnstileToken,
      website: body.website,
      email,
    });
    if (!guard.ok) {
      const fail = guardFailureResponse(guard);
      return NextResponse.json(fail.body, { status: fail.status });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    if (!(await emailDomainCanReceiveMail(email))) {
      return NextResponse.json({ error: "Please use a valid, working email address." }, { status: 400 });
    }

    const redirectTo = getMemberPasswordSetupRedirectUrl(new URL(req.url).origin);
    const result = await sendMemberSignupEmail(email, redirectTo);

    if (result.ok) {
      return NextResponse.json({ ok: true });
    }

    if (result.code === "already_registered") {
      return NextResponse.json({ error: result.message, code: result.code }, { status: 409 });
    }

    return NextResponse.json({ error: result.message }, { status: 500 });
  } catch (err) {
    console.error("[member-signup]", err);
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 });
  }
}
