"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import AuthLogo from "@/components/ui/AuthLogo";
import PasswordInput from "@/components/ui/PasswordInput";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const supabase = createClient();

  // Supabase redirects here with a session already set via the URL fragment
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User arrived via reset link — form is now active
      }
    });
  }, [supabase.auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/account/dashboard"), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <AuthLogo href="/" />
        <p className="-mt-4 mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-copy-muted">
          Set Your Password
        </p>

        <div className="bg-white border border-border p-8 shadow-sm">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <p className="font-bold text-primary mb-2">Password set successfully!</p>
              <p className="text-sm text-copy-muted">Redirecting to your dashboard…</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-copy-muted mb-6">
                Choose a password for your Lava account. You'll use this together with your email to sign in.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                    New Password
                  </label>
                  <PasswordInput
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    autoFocus
                    required
                    leadingIcon
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <PasswordInput
                    id="confirm-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                    leadingIcon
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="w-full bg-primary text-white font-bold py-3 text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  ) : (
                    "Set Password & Sign In →"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
