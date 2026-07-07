"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, LogIn, UserPlus, KeyRound } from "lucide-react";
import AuthLogo from "@/components/ui/AuthLogo";
import PasswordInput from "@/components/ui/PasswordInput";
import { createClient } from "@/utils/supabase/client";

type Mode = "login" | "signup" | "reset";

function resolveInitialMode(param: string | null): Mode {
  if (param === "signup" || param === "setup") return "signup";
  if (param === "reset") return "reset";
  return "login";
}

const MODE_META: Record<
  Exclude<Mode, "login">,
  {
    icon: typeof UserPlus;
    title: string;
    subtitle: string;
    helper: string;
    submitLabel: string;
    loadingLabel: string;
    endpoint: string;
    success: (email: string) => string;
  }
> = {
  signup: {
    icon: UserPlus,
    title: "Create free member account",
    subtitle: "No purchase required — access manuals, Lava Points & member offers",
    helper:
      "New to Lava-SA or browsing before you buy? Create a free member login to open operating manuals and track rewards when you order later.",
    submitLabel: "Send activation email →",
    loadingLabel: "Sending…",
    endpoint: "/api/account/member-signup",
    success: (email) =>
      `Activation email sent to ${email}. Check your inbox and spam folder (from Supabase or noreply@mail.app.supabase.io). Open the link to create your password, then sign in.`,
  },
  reset: {
    icon: KeyRound,
    title: "Reset password",
    subtitle: "For existing customers & returning members",
    helper:
      "Ordered from us before or already have a Lava member login? We'll email a secure link to set or reset your password on this site.",
    submitLabel: "Send password reset email →",
    loadingLabel: "Sending…",
    endpoint: "/api/account/password-reset",
    success: (email) =>
      `Password reset email sent to ${email}. Check your inbox and spam folder. Use the link to set a new password, then sign in.`,
  },
};

function LoginFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/account/profile";
  const requestedMode = params.get("mode");
  const prefilledEmail = params.get("email") || "";
  const authCallbackError = params.get("error");
  const isOrderTracking = from.startsWith("/account/orders/");
  const isReviewGate = params.get("reason") === "review";

  const [mode, setMode] = useState<Mode>(resolveInitialMode(requestedMode));
  const [email, setEmail] = useState(prefilledEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prefilledEmail) setEmail(prefilledEmail);
  }, [prefilledEmail]);

  const supabase = createClient();

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setSuccess("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password. New visitor? Create a free account. Existing customer? Try password reset."
          : signInError.message
      );
    } else {
      router.push(from);
      router.refresh();
    }
  }

  async function handleEmailFlow(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "login") return;

    const meta = MODE_META[mode];
    setError("");
    setLoading(true);

    const res = await fetch(meta.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
    setLoading(false);

    if (!res.ok) {
      if (data.code === "already_registered" && mode === "signup") {
        setError(data.error || "This email already has an account.");
        return;
      }
      if (data.code === "not_registered" && mode === "reset") {
        setError(data.error || "No account found for this email.");
        return;
      }
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setSuccess(meta.success(email));
  }

  const emailMeta = mode !== "login" ? MODE_META[mode] : null;
  const ModeIcon = emailMeta?.icon ?? LogIn;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AuthLogo href="/" />
        <p className="-mt-4 mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-copy-muted">
          My Account
        </p>

        <div className="bg-white border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center">
              <ModeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary text-sm">
                {mode === "login" ? "Sign in" : emailMeta?.title}
              </p>
              <p className="text-xs text-copy-muted">
                {mode === "login"
                  ? "Access your Lava Points, orders & manuals"
                  : emailMeta?.subtitle}
              </p>
            </div>
          </div>

          {emailMeta ? (
            <p className="text-xs text-copy-muted leading-relaxed mb-5 border-l-2 border-secondary/40 pl-3">
              {emailMeta.helper}
            </p>
          ) : null}

          {authCallbackError === "auth_callback_failed" && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-900 mb-4">
              That sign-in link could not be verified. Open your order confirmation email and use{" "}
              <strong>View my order</strong> (the post-purchase page), or set your password below.
            </div>
          )}

          {authCallbackError === "otp_expired" && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-900 mb-4">
              That sign-in link has <strong>expired</strong> or was already used.{" "}
              {from.startsWith("/account/orders/") ? (
                <>
                  Open the <strong>View my order</strong> link in your latest order email, or set a
                  password below.
                </>
              ) : (
                <>Use password reset below, or request a fresh link from your order email.</>
              )}
            </div>
          )}

          {mode === "login" && isOrderTracking && !authCallbackError && (
            <div className="bg-surface border border-border px-4 py-4 text-sm text-copy mb-4">
              <p className="font-bold text-primary mb-1">Just placed an order?</p>
              <p className="text-copy-muted leading-relaxed">
                Use the <strong>View my order</strong> link in your order email — it opens a
                dedicated post-purchase page (no password needed). Or choose{" "}
                <strong>password reset</strong> below to set a password for next time.
              </p>
            </div>
          )}

          {isReviewGate && !authCallbackError && !success && (
            <div className="bg-surface border border-border px-4 py-4 text-sm text-copy mb-4">
              <p className="font-bold text-primary mb-1">Submit a customer review</p>
              <p className="text-copy-muted leading-relaxed">
                We couldn&apos;t find{" "}
                {prefilledEmail ? (
                  <strong>{prefilledEmail}</strong>
                ) : (
                  "that email"
                )}{" "}
                in our records. If you&apos;ve ordered from lava-sa.com, use{" "}
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="font-bold text-secondary underline"
                >
                  password reset
                </button>{" "}
                with your order email. New visitor?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-bold text-secondary underline"
                >
                  Create a free member account
                </button>
                . Bought in store only?{" "}
                <Link href="/contact" className="font-bold text-secondary underline">
                  Contact Anneke
                </Link>{" "}
                so we can add your details.
              </p>
            </div>
          )}

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-4 text-sm text-emerald-800 mb-4">
              {success}
              {mode === "signup" && (
                <p className="mt-3 text-xs text-emerald-900/80">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-bold underline"
                  >
                    Sign in
                  </button>
                  {" "}or{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="font-bold underline"
                  >
                    reset password
                  </button>
                  .
                </p>
              )}
              {mode === "reset" && (
                <p className="mt-3 text-xs text-emerald-900/80">
                  New visitor?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-bold underline"
                  >
                    Create a free member account
                  </button>
                  {" "}instead — no purchase required.
                </p>
              )}
            </div>
          ) : (
            <form
              onSubmit={mode === "login" ? handleLogin : handleEmailFlow}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                    required
                    className="w-full border border-border bg-white px-4 py-3 pl-10 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copy-muted" />
                </div>
              </div>

              {mode === "login" && (
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <PasswordInput
                    id="account-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    leadingIcon
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium space-y-2">
                  <p>{error}</p>
                  {mode === "signup" && error.includes("already") ? (
                    <button
                      type="button"
                      onClick={() => switchMode("reset")}
                      className="font-bold text-primary underline"
                    >
                      Use password reset instead →
                    </button>
                  ) : null}
                  {mode === "reset" && error.includes("No member login") ? (
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="font-bold text-primary underline"
                    >
                      Create free member account →
                    </button>
                  ) : null}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email || (mode === "login" && !password)}
                className="w-full bg-primary text-white font-bold py-3 text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in…" : emailMeta?.loadingLabel}
                  </>
                ) : mode === "login" ? (
                  "Sign in →"
                ) : (
                  emailMeta?.submitLabel
                )}
              </button>
            </form>
          )}

          <div className="mt-5 pt-5 border-t border-border/60 text-center text-xs text-copy-muted space-y-3">
            {mode === "login" ? (
              <>
                <div className="space-y-2">
                  <p className="font-bold text-primary text-[11px] uppercase tracking-wide">
                    New visitor — no purchase needed
                  </p>
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="w-full border-2 border-secondary text-primary font-black text-[11px] uppercase tracking-wide py-2.5 hover:bg-surface transition-colors"
                  >
                    Create free member account
                  </button>
                  <p className="text-[11px] leading-relaxed">
                    Download operating manuals, save Lava Points when you buy later.
                  </p>
                </div>
                <div className="space-y-2 pt-3 border-t border-border/50">
                  <p className="font-bold text-primary text-[11px] uppercase tracking-wide">
                    Existing customer
                  </p>
                  <button
                    type="button"
                    onClick={() => switchMode("reset")}
                    className="text-primary font-bold hover:underline"
                  >
                    Forgot password or first login on new site?
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-primary font-bold hover:underline"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-copy-muted mt-6">
          <Link href="/" className="hover:text-primary transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
