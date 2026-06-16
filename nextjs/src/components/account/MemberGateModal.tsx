"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, Lock, UserPlus, KeyRound, X } from "lucide-react";
import PasswordInput from "@/components/ui/PasswordInput";
import { createClient } from "@/utils/supabase/client";

type Props = {
  open: boolean;
  onClose: () => void;
  returnTo: string;
  title?: string;
  subtitle?: string;
};

export default function MemberGateModal({
  open,
  onClose,
  returnTo,
  title = "Member access required",
  subtitle = "Sign in to open the operating manual. Free to join — no purchase required.",
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : signInError.message
      );
      return;
    }

    onClose();
    if (returnTo.startsWith("http")) {
      window.open(returnTo, "_blank", "noopener,noreferrer");
    } else {
      router.push(returnTo);
    }
    router.refresh();
  }

  const signupHref = `/account/login?mode=signup&from=${encodeURIComponent(returnTo)}`;
  const resetHref = `/account/login?mode=reset&from=${encodeURIComponent(returnTo)}`;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/55"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-gate-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-2 text-copy-muted hover:text-primary"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 pt-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 id="member-gate-title" className="font-black text-primary text-lg leading-tight">
                {title}
              </h2>
              <p className="text-xs text-copy-muted mt-1 leading-relaxed">{subtitle}</p>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <PasswordInput
                id="member-gate-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error ? (
              <p className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 text-sm hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Sign in &amp; open manual
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-primary mb-2">
                New visitor — free, no purchase required
              </p>
              <Link
                href={signupHref}
                className="inline-flex w-full items-center justify-center gap-2 border-2 border-secondary bg-secondary/10 text-primary font-black text-xs uppercase tracking-wide py-3 hover:bg-secondary/20 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Create member account
              </Link>
              <p className="text-[11px] text-copy-muted mt-2 leading-relaxed">
                Get manual access now. Create a password via email — takes about a minute.
              </p>
            </div>

            <div className="pt-4 border-t border-border/60">
              <p className="text-[11px] font-bold uppercase tracking-wide text-primary mb-2">
                Existing customer
              </p>
              <Link
                href={resetHref}
                className="inline-flex w-full items-center justify-center gap-2 border border-border text-primary font-bold text-xs uppercase tracking-wide py-3 hover:bg-surface transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Reset password
              </Link>
              <p className="text-[11px] text-copy-muted mt-2 leading-relaxed">
                Ordered before or already have a login? Reset your password for this site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
