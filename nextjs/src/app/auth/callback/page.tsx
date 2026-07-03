"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account/profile";
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function finish() {
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setMessage(error.message);
          router.replace(
            `/account/login?error=auth_callback_failed&from=${encodeURIComponent(next)}`
          );
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      const tokenHash = params.get("token_hash");
      const type = params.get("type");
      if (tokenHash && type) {
        const otpTypes: EmailOtpType[] =
          type === "recovery"
            ? ["recovery", "email"]
            : type === "magiclink"
              ? ["magiclink", "email"]
              : [type as EmailOtpType, "email"];
        let verified = false;
        for (const otpType of otpTypes) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType,
          });
          if (!error) {
            verified = true;
            break;
          }
        }
        if (cancelled) return;
        if (!verified) {
          setMessage("This sign-in link has expired. Request a new one below.");
          router.replace(
            `/account/login?error=otp_expired&from=${encodeURIComponent(next)}&mode=reset`
          );
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      // Implicit magic link: #access_token=… (must be handled in the browser)
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        router.replace(next);
        router.refresh();
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (event === "SIGNED_IN" && newSession) {
          subscription.unsubscribe();
          router.replace(next);
          router.refresh();
        }
      });

      window.setTimeout(async () => {
        if (cancelled) return;
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          subscription.unsubscribe();
          router.replace(next);
          router.refresh();
          return;
        }
        subscription.unsubscribe();
        router.replace(
          `/account/login?error=auth_callback_failed&from=${encodeURIComponent(next)}`
        );
      }, 1500);
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [params, next, router]);

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-6">
      <p className="text-sm text-copy-muted">{message}</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-surface flex items-center justify-center p-6">
          <p className="text-sm text-copy-muted">Signing you in…</p>
        </main>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
