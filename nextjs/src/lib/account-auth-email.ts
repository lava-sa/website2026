import { createAuthAnonClient, createServiceClient } from "@/lib/supabase";
import { getEmailConfig, getResendClient } from "@/lib/email-config";

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

async function sendAuthActionEmail(
  email: string,
  actionLink: string,
  kind: "signup" | "reset"
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) return false;

  const { fromEmail, replyToEmail } = getEmailConfig();
  const subject =
    kind === "signup"
      ? "Activate your Lava-SA member account"
      : "Reset your Lava-SA member password";

  const intro =
    kind === "signup"
      ? "Create your free Lava member login — access operating manuals, Lava Points, and order history. No purchase required."
      : "Use the secure link below to set or reset your password for lava-sa.com.";

  const buttonLabel = kind === "signup" ? "Activate member account" : "Set new password";

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a3333;max-width:520px">
      <p style="margin:0 0 16px">Hi,</p>
      <p style="margin:0 0 16px">${intro}</p>
      <p style="margin:0 0 24px">
        <a href="${actionLink}" style="display:inline-block;background:#0d4d4d;color:#fff;font-weight:700;padding:12px 20px;text-decoration:none">
          ${buttonLabel}
        </a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#555">Or copy this link into your browser:</p>
      <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#666">${actionLink}</p>
      <p style="margin:0;font-size:12px;color:#888">If you didn't request this, you can ignore this email.</p>
      <p style="margin:16px 0 0;font-size:12px;color:#888">— Lava-SA · German vacuum sealers since 2007</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject,
    html,
    replyTo: replyToEmail,
  });

  if (error) {
    console.error(`[member-auth-email] Resend ${kind} failed:`, error.message);
    return false;
  }

  return true;
}

/** New visitor — free member account (manuals, points). Sends invite email. */
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

/** Existing / invited member — password reset or first password on lava-sa.com */
export async function sendPasswordResetEmail(email: string, redirectTo: string) {
  const supabase = createServiceClient();

  const link = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (link.error) {
    if (authUserNotFoundMessage(link.error.message)) {
      return {
        ok: false as const,
        code: "not_registered" as const,
        message:
          "No member login exists for this email yet. Create a free member account instead — no purchase required.",
      };
    }
    console.error("[password-reset] generateLink failed:", link.error.message);
    return {
      ok: false as const,
      code: "probe_failed" as const,
      message: "We could not verify this email. Please try again or contact support.",
    };
  }

  const actionLink = link.data?.properties?.action_link;
  if (!actionLink) {
    console.error("[password-reset] generateLink returned no action_link");
    return {
      ok: false as const,
      code: "email_failed" as const,
      message: "We could not send the reset email. Please try again or contact support.",
    };
  }

  if (await sendAuthActionEmail(email, actionLink, "reset")) {
    return { ok: true as const, kind: "recovery" as const };
  }

  const anon = createAuthAnonClient();
  const { error: resetError } = await anon.auth.resetPasswordForEmail(email, { redirectTo });

  if (resetError) {
    console.error("[password-reset] anon reset failed:", resetError.message);
    return {
      ok: false as const,
      code: "email_failed" as const,
      message: "We could not send the reset email. Please try again or contact support.",
    };
  }

  return { ok: true as const, kind: "recovery" as const };
}
