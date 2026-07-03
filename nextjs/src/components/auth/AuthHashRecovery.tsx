"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Supabase magic links sometimes land on Site URL (/) with #access_token=…
 * when redirect_to is not allowlisted. Forward hash tokens to /auth/callback.
 */
export default function AuthHashRecovery() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/auth/callback")) return;

    const hash = window.location.hash;
    if (!hash.includes("access_token=")) return;

    const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
    const type = hashParams.get("type");
    const next =
      type === "recovery"
        ? "/account/reset-password"
        : new URLSearchParams(window.location.search).get("next") ?? "/account/profile";

    const target = `/auth/callback?next=${encodeURIComponent(next)}${hash}`;
    window.location.replace(target);
  }, [pathname]);

  return null;
}
