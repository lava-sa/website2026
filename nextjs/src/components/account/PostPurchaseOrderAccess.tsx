"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, KeyRound, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import AuthLogo from "@/components/ui/AuthLogo";
import PasswordInput from "@/components/ui/PasswordInput";

type Props = {
  orderNumber: string;
  email: string;
  token: string;
  firstName: string;
  error?: string | null;
};

const ERROR_COPY: Record<string, { title: string; body: string }> = {
  expired: {
    title: "This link has expired",
    body: "Order access links are valid for 24 hours. Check your inbox for the latest order email, or use password reset from My Account.",
  },
  invalid: {
    title: "Link could not be verified",
    body: "This link does not match our records. Open the link from your order confirmation email, or contact us at info@lava-sa.com.",
  },
  signin: {
    title: "Could not sign you in automatically",
    body: "Please try again in a moment. If it keeps failing, set your personal password below — that always works for future visits.",
  },
  missing: {
    title: "Incomplete link",
    body: "Open the full link from your order confirmation email (View my order).",
  },
};

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${"•".repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}

export default function PostPurchaseOrderAccess({
  orderNumber,
  email,
  token,
  firstName,
  error,
}: Props) {
  const enterHref = `/api/account/order-access/enter?order=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(token)}`;
  const passwordResetHref = `/account/login?mode=reset&email=${encodeURIComponent(email)}&from=${encodeURIComponent(`/account/orders/${orderNumber}`)}`;
  const err = error ? ERROR_COPY[error] : null;
  const tokenValid = Boolean(token && !err);
  const displayName = firstName.trim() || "there";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordDone, setPasswordDone] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    setFormError("");
    setLoading(true);

    const res = await fetch("/api/account/order-access/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderNumber, token, password }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
    };
    setLoading(false);

    if (!res.ok) {
      setFormError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setPasswordDone(true);
    setSuccessMessage(
      data.message ||
        "Password saved. You can sign in anytime from My Account, or open your order below."
    );
    setPassword("");
    setConfirm("");
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-md">
        <AuthLogo href="/" />

        <div className="bg-white border border-border shadow-sm p-6 sm:p-8">
          <div className="bg-secondary/10 border border-secondary/25 px-4 py-4 mb-6">
            <p className="text-sm text-primary leading-relaxed">
              Hi <strong>{displayName}</strong>. This is your dedicated account page. You got here
              by using a Temporary Password that will expire soon. Please set your personal password
              here — this is your Personal Profile Page where you can return to view your purchases,
              your account information, and your Lava Points.
            </p>
          </div>

          <div className="flex items-start gap-3 mb-5">
            <div className="shrink-0 w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-secondary mb-1">
                Your order
              </p>
              <h1 className="text-xl font-bold text-primary leading-tight">{orderNumber}</h1>
              {email ? (
                <p className="text-xs text-copy-muted mt-1">Sent to {maskEmail(email)} · link valid 24 hours</p>
              ) : null}
            </div>
          </div>

          {err ? (
            <div className="bg-amber-50 border border-amber-200 px-4 py-4 text-sm text-amber-900 mb-5 flex gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-bold mb-1">{err.title}</p>
                <p className="leading-relaxed">{err.body}</p>
              </div>
            </div>
          ) : null}

          {tokenValid ? (
            <a
              href={enterHref}
              className="flex w-full items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-6 hover:bg-primary/90 transition-colors mb-6"
            >
              View my order →
            </a>
          ) : err?.title === "This link has expired" && email ? (
            <Link
              href={passwordResetHref}
              className="flex w-full items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-6 hover:bg-primary/90 transition-colors mb-6"
            >
              Reset password via email →
            </Link>
          ) : null}

          <div className="border-t border-border pt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-copy-muted mb-3 flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5" aria-hidden />
              Set your personal password
            </p>

            {passwordDone ? (
              <div className="bg-emerald-50 border border-emerald-200 px-4 py-4 text-sm text-emerald-900">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" aria-hidden />
                  <div>
                    <p className="font-bold mb-1">Password saved</p>
                    <p className="leading-relaxed">{successMessage}</p>
                    {tokenValid ? (
                      <a
                        href={enterHref}
                        className="inline-block mt-3 font-bold text-secondary hover:text-primary transition-colors"
                      >
                        View my order →
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : tokenValid ? (
              <>
                <p className="text-sm text-copy-muted mb-4 leading-relaxed">
                  Choose a password for your Lava account. You&apos;ll use this with your email to
                  sign in from{" "}
                  <Link href="/account/login" className="text-secondary font-semibold hover:text-primary">
                    My Account
                  </Link>{" "}
                  without needing an email link.
                </p>

                <form onSubmit={handleSetPassword} className="space-y-4">
                  <div>
                    <label
                      htmlFor="order-access-password"
                      className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide"
                    >
                      New password
                    </label>
                    <PasswordInput
                      id="order-access-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      required
                      leadingIcon
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order-access-confirm"
                      className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide"
                    >
                      Confirm password
                    </label>
                    <PasswordInput
                      id="order-access-confirm"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                      leadingIcon
                      disabled={loading}
                    />
                  </div>

                  {formError ? (
                    <div className="bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">
                      {formError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading || !password || !confirm}
                    className="w-full bg-primary text-white font-bold py-3 text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Save password →"
                    )}
                  </button>
                </form>
              </>
            ) : email ? (
              <p className="text-sm text-copy-muted leading-relaxed">
                Your access link has expired.{" "}
                <Link href={passwordResetHref} className="text-secondary font-bold hover:text-primary">
                  Request a password reset email
                </Link>{" "}
                to set a password and sign in anytime.
              </p>
            ) : (
              <p className="text-sm text-copy-muted leading-relaxed">
                Open the full link from your order confirmation email to set your password here.
              </p>
            )}
          </div>

          <p className="text-xs text-copy-muted mt-6 pt-4 border-t border-border leading-relaxed">
            Not you?{" "}
            <Link href="/account/login" className="font-semibold text-secondary hover:text-primary">
              Regular sign in
            </Link>{" "}
            · Questions?{" "}
            <a href="mailto:info@lava-sa.com" className="font-semibold text-secondary hover:text-primary">
              info@lava-sa.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
