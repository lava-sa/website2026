"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2, Eye, EyeOff, User } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  // Default landing after login is the WordPress-style /lava-sa path (dashboard root)
  const fromParam = params.get("from") || "/lava-sa";
  // If redirected from an internal /admin/* path, rewrite to /lava-sa/*
  const from = fromParam.startsWith("/admin")
    ? fromParam.replace(/^\/admin/, "/lava-sa")
    : fromParam;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      // After successful login, go straight to admin dashboard
      router.push("/admin");
    } else {
      setError("Incorrect username or password. Please try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo/lava-sa-logo-petrol.webp"
            alt="Lava South Africa"
            width={160}
            height={45}
            className="h-11 w-auto object-contain mx-auto"
          />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-copy-muted">
            Admin Dashboard
          </p>
        </div>

        <div className="bg-white border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-primary text-sm">Sign In</p>
              <p className="text-xs text-copy-muted">Lava-SA Admin Area</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onAnimationStart={(e) => { if ((e.animationName || "").includes("autofill")) setUsername((e.target as HTMLInputElement).value); }}
                  placeholder="admin"
                  autoComplete="username"
                  autoFocus
                  required
                  className="w-full border border-border bg-white px-4 py-3 pl-10 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-copy-muted" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onAnimationStart={(e) => { if ((e.animationName || "").includes("autofill")) setPassword((e.target as HTMLInputElement).value); }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  className="w-full border border-border bg-white px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-copy-muted hover:text-primary transition-colors"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-primary text-white font-bold py-3 text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-copy-muted mt-6">
          <a href="/" className="hover:text-primary transition-colors">← Back to website</a>
        </p>

      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
