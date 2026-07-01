"use client";

import Link from "next/link";
import { Package, KeyRound, AlertTriangle } from "lucide-react";
import AuthLogo from "@/components/ui/AuthLogo";

type Props = {
  orderNumber: string;
  email: string;
  token: string;
  error?: string | null;
};

const ERROR_COPY: Record<string, { title: string; body: string }> = {
  expired: {
    title: "This link has expired",
    body: "Order access links are valid for 24 hours. Check your inbox for the latest order email, or set a password below to sign in anytime.",
  },
  invalid: {
    title: "Link could not be verified",
    body: "This link does not match our records. Open the link from your order confirmation email, or contact us at info@lava-sa.com.",
  },
  signin: {
    title: "Could not sign you in automatically",
    body: "Please try again in a moment. If it keeps failing, set a password below — that always works for future visits.",
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

export default function PostPurchaseOrderAccess({ orderNumber, email, token, error }: Props) {
  const enterHref = `/api/account/order-access/enter?order=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(token)}`;
  const passwordHref = `/account/login?mode=reset&email=${encodeURIComponent(email)}&from=${encodeURIComponent(`/account/orders/${orderNumber}`)}`;
  const err = error ? ERROR_COPY[error] : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-md">
        <AuthLogo href="/" />

        <div className="bg-white border border-border shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="shrink-0 w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-secondary" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-secondary mb-1">
                Post-purchase access
              </p>
              <h1 className="text-xl font-bold text-primary leading-tight">View your order</h1>
              <p className="text-sm text-copy-muted mt-1">
                Order <strong className="text-primary">{orderNumber}</strong>
              </p>
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
          ) : (
            <div className="bg-emerald-50/80 border border-emerald-200 px-4 py-4 text-sm text-emerald-900 mb-5">
              <p className="font-bold mb-1">You&apos;re in the right place</p>
              <p className="leading-relaxed text-emerald-900/90">
                This page is only for customers who just ordered. No password needed — tap the button
                below once to open <strong>{orderNumber}</strong>.
              </p>
              <p className="text-xs text-emerald-800/80 mt-2">
                Sent to {maskEmail(email)} · link valid 24 hours
              </p>
            </div>
          )}

          {!err || err.title !== "This link has expired" ? (
            token ? (
              <a
                href={enterHref}
                className="flex w-full items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-6 hover:bg-primary/90 transition-colors mb-4"
              >
                View my order →
              </a>
            ) : null
          ) : (
            <Link
              href={passwordHref}
              className="flex w-full items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-6 hover:bg-primary/90 transition-colors mb-4"
            >
              Set password & sign in →
            </Link>
          )}

          <div className="border-t border-border pt-5 mt-2">
            <p className="text-xs font-bold uppercase tracking-wide text-copy-muted mb-3 flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5" aria-hidden />
              For your next visit
            </p>
            <p className="text-sm text-copy-muted mb-3 leading-relaxed">
              Set a password once — then sign in anytime from{" "}
              <Link href="/account/login" className="text-secondary font-semibold hover:text-primary">
                My Account
              </Link>{" "}
              without needing an email link.
            </p>
            <Link
              href={passwordHref}
              className="text-sm font-bold text-secondary hover:text-primary transition-colors"
            >
              Create or reset password →
            </Link>
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
