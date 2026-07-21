import { createAuthAnonClient, createServiceClient } from "@/lib/supabase";
import { buildCustomerAuthCallbackUrl } from "@/lib/auth-redirect";
import { getEmailConfig, getResendClient } from "@/lib/email-config";
import { emailButton, escEmail, wrapEmailLayout } from "@/lib/email-template";

/** Keep the verified Resend address; show "Lava-SA" not "Lava-SA Orders". */
function authFromAddress(fromEmail: string): string {
  const match = fromEmail.match(/<([^>]+)>/);
  const address = match?.[1]?.trim() || fromEmail.trim();
  return `Lava-SA <${address}>`;
}

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

/** Supabase may embed Site URL (localhost) when redirect_to is not allowlisted — force the intended target. */
function withRedirectTo(actionLink: string, redirectTo: string): string {
  try {
    const url = new URL(actionLink);
    url.searchParams.set("redirect_to", redirectTo);
    return url.toString();
  } catch {
    return actionLink;
  }
}

function recoveryCallbackUrl(tokenHash: string): string {
  return buildCustomerAuthCallbackUrl({
    tokenHash,
    otpType: "recovery",
    nextPath: "/account/reset-password",
  });
}

/** Invite activation — same password-setup landing as recovery. */
function inviteCallbackUrl(tokenHash: string): string {
  return buildCustomerAuthCallbackUrl({
    tokenHash,
    otpType: "invite",
    nextPath: "/account/reset-password",
  });
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

  const headline =
    kind === "signup" ? "Welcome to your Lava-SA member account" : "Reset your member password";

  const intro =
    kind === "signup"
      ? "Create your free Lava member login — open operating manuals, track Lava Points, and view order history. No purchase required."
      : "Use the secure link below to set or reset your password for lava-sa.com.";

  const buttonLabel = kind === "signup" ? "Activate member account" : "Set new password";
  const safeLink = escEmail(actionLink);

  const bodyHtml = `
    <p style="margin:0 0 16px;">Hi,</p>
    <p style="margin:0 0 8px;">${intro}</p>
    ${emailButton(actionLink, buttonLabel)}
    <p style="margin:20px 0 8px;font-size:13px;color:#6b7280;">Or copy this link into your browser:</p>
    <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#6b7280;">
      <a href="${safeLink}" style="color:#1b6b6b;text-decoration:underline;">${safeLink}</a>
    </p>
    <p style="margin:0;font-size:13px;color:#6b7280;">If you didn&apos;t request this, you can ignore this email.</p>
  `;

  const html = wrapEmailLayout({
    headline,
    bodyHtml,
  });

  const { error } = await resend.emails.send({
    from: authFromAddress(fromEmail),
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

/**
 * New visitor — free member account (manuals, points).
 * Uses generateLink (no Supabase-branded email) + Resend with a lava-sa.com callback URL.
 * Never use inviteUserByEmail here — that sends From: Supabase Auth and embeds Dashboard Site URL
 * (often localhost:3000).
 */
export async function sendMemberSignupEmail(email: string, redirectTo: string) {
  const supabase = createServiceClient();

  const link = await supabase.auth.admin.generateLink({
    type: "invite",
    email,
    options: { redirectTo },
  });

  if (link.error) {
    if (authUserExistsMessage(link.error.message)) {
      return {
        ok: false as const,
        code: "already_registered" as const,
        message:
          "This email already has a member account. Use password reset if you need a new password, or sign in.",
      };
    }
    console.error("[member-signup] generateLink failed:", link.error.message);
    return {
      ok: false as const,
      code: "invite_failed" as const,
      message: "We could not send the activation email. Please try again or contact support.",
    };
  }

  const hashedToken = link.data?.properties?.hashed_token;
  if (hashedToken) {
    const directLink = inviteCallbackUrl(hashedToken);
    if (await sendAuthActionEmail(email, directLink, "signup")) {
      await ensureCustomerRow(email);
      return { ok: true as const, kind: "invite" as const };
    }
  }

  const actionLink = link.data?.properties?.action_link;
  if (!actionLink) {
    console.error("[member-signup] generateLink returned no action_link");
    return {
      ok: false as const,
      code: "email_failed" as const,
      message: "We could not send the activation email. Please try again or contact support.",
    };
  }

  const safeLink = withRedirectTo(actionLink, redirectTo);
  if (await sendAuthActionEmail(email, safeLink, "signup")) {
    await ensureCustomerRow(email);
    return { ok: true as const, kind: "invite" as const };
  }

  return {
    ok: false as const,
    code: "email_failed" as const,
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

  const hashedToken = link.data?.properties?.hashed_token;
  if (hashedToken) {
    const directLink = recoveryCallbackUrl(hashedToken);
    if (await sendAuthActionEmail(email, directLink, "reset")) {
      return { ok: true as const, kind: "recovery" as const };
    }
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

  const safeLink = withRedirectTo(actionLink, redirectTo);
  if (await sendAuthActionEmail(email, safeLink, "reset")) {
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
