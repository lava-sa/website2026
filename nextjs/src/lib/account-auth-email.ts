import { createServiceClient } from "@/lib/supabase";

function authUserExistsMessage(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("already") ||
    lower.includes("registered") ||
    lower.includes("exists")
  );
}

function authUserNotFoundMessage(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.includes("not found") ||
    lower.includes("no user") ||
    lower.includes("user not found")
  );
}

async function ensureCustomerRow(email: string) {
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) return;

  await supabase.from("customers").insert({ email });
}

/** New visitor — free member account (manuals, points). Sends Supabase invite email. */
export async function sendMemberSignupEmail(email: string, redirectTo: string) {
  const supabase = createServiceClient();
  const invite = await supabase.auth.admin.inviteUserByEmail(email, { redirectTo });

  if (!invite.error) {
    await ensureCustomerRow(email);
    return { ok: true as const, kind: "invite" as const };
  }

  if (authUserExistsMessage(invite.error.message)) {
    return {
      ok: false as const,
      code: "already_registered" as const,
      message:
        "This email already has a member account. Use password reset if you need a new password, or sign in.",
    };
  }

  console.error("[member-signup] invite failed:", invite.error.message);
  return {
    ok: false as const,
    code: "invite_failed" as const,
    message: "We could not send the activation email. Please try again or contact support.",
  };
}

/** Existing customer — password reset / first password on new member site. */
export async function sendPasswordResetEmail(email: string, redirectTo: string) {
  const supabase = createServiceClient();

  const probe = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (probe.error) {
    if (authUserNotFoundMessage(probe.error.message)) {
      return {
        ok: false as const,
        code: "not_registered" as const,
        message:
          "No member login exists for this email yet. Create a free member account instead — no purchase required.",
      };
    }
    console.error("[password-reset] generateLink failed:", probe.error.message);
    return {
      ok: false as const,
      code: "probe_failed" as const,
      message: "We could not verify this email. Please try again or contact support.",
    };
  }

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (resetError) {
    console.error("[password-reset] email failed:", resetError.message);
    return {
      ok: false as const,
      code: "email_failed" as const,
      message: "We could not send the reset email. Please try again or contact support.",
    };
  }

  return { ok: true as const, kind: "recovery" as const };
}
