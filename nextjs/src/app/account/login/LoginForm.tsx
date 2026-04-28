"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Loader2, Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Mode = "login" | "forgot";

function LoginFormInner() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/account/dashboard";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password. If you're a returning customer, use 'Set up my account' below to create your password."
          : error.message
      );
    } else {
      router.push(from);
      router.refresh();
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(
        `Password reset email sent to ${email}. Check your inbox — use the link to set your password and log in.`
      );
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/images/logo/lava-sa-logo-petrol.webp"
              alt="Lava-SA logo"
              width={160}
              height={45}
              className="h-11 w-auto object-contain mx-auto"
            />
          </Link>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-copy-muted">
            My Account
          </p>
        </div>

        <div className="bg-white border border-border p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center">
              <LogIn className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary text-sm">
                {mode === "login" ? "Sign In" : "Reset Password"}
              </p>
              <p className="text-xs text-copy-muted">
                {mode === "login"
                  ? "Access your Lava Points & orders"
                  : "We'll email you a reset link"}
              </p>
            </div>
          </div>

          {success ? (
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-4 text-sm text-emerald-800 mb-4">
              {success}
            </div>
          ) : (
            <form
              onSubmit={mode === "login" ? handleLogin : handleForgot}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                  Email Address
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

              {/* Password (login mode only) */}
              {mode === "login" && (
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full border border-border bg-white px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copy-muted" />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-copy-muted hover:text-primary transition-colors"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email || (mode === "login" && !password)}
                className="w-full bg-primary text-white font-bold py-3 text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {mode === "login" ? "Signing in…" : "Sending…"}</>
                ) : (
                  mode === "login" ? "Sign In →" : "Send Reset Link →"
                )}
              </button>
            </form>
          )}

          {/* Mode toggle */}
          <div className="mt-5 pt-5 border-t border-border/60 text-center text-xs text-copy-muted space-y-2">
            {mode === "login" ? (
              <>
                <p>
                  Returning customer? If you have never logged in here before,{" "}
                  <button
                    onClick={() => { setMode("forgot"); setError(""); }}
                    className="text-primary font-bold hover:underline"
                  >
                    set up your account
                  </button>
                  .
                </p>
              </>
            ) : (
              <button
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
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
