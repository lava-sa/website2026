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

    const target = `/auth/callback${window.location.search}${hash}`;
    window.location.replace(target);
  }, [pathname]);

  return null;
}
