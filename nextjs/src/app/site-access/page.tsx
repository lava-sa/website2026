"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AuthLogo from "@/components/ui/AuthLogo";
import PasswordInput from "@/components/ui/PasswordInput";

function SiteAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/site-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Incorrect password. Please try again.");
        return;
      }
      const dest = from.startsWith("/") && !from.startsWith("/site-access") ? from : "/";
      router.push(dest);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-white/15 bg-petrol-800/80 p-8 sm:p-10 shadow-2xl">
        <AuthLogo variant="dark" />

        <h1 className="text-center text-xl font-black uppercase tracking-wide text-white">
          Preview access
        </h1>
        <p className="mt-3 text-center text-sm text-white/70 leading-relaxed">
          This website is password-protected while it is under review. Enter the access
          password provided by Lava-SA to continue.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="site-password" className="sr-only">
              Access password
            </label>
            <PasswordInput
              id="site-password"
              variant="dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access password"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-300 font-medium" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-50 text-petrol-900 font-black uppercase tracking-wider py-3.5 transition-colors"
          >
            {loading ? "Checking…" : "Enter site"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/50">
          Need access? Contact{" "}
          <a href="mailto:info@lava-sa.com" className="text-secondary hover:underline">
            info@lava-sa.com
          </a>
        </p>
      </div>
    </main>
  );
}

export default function SiteAccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 flex items-center justify-center text-white/60 text-sm">
          Loading…
        </main>
      }
    >
      <SiteAccessForm />
    </Suspense>
  );
}
