"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

type Props = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  className?: string;
  /** Use compact widget for tight layouts (e.g. homepage footer) */
  compact?: boolean;
};

export function TurnstileWidget({ onToken, onExpire, className, compact }: Props) {
  const ref = useRef<TurnstileInstance>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  if (!siteKey) {
    if (process.env.NODE_ENV === "development") {
      return (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2">
          Turnstile not configured (dev mode). Set NEXT_PUBLIC_TURNSTILE_SITE_KEY and
          TURNSTILE_SECRET_KEY before going live.
        </p>
      );
    }
    return (
      <p className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2">
        Security verification is temporarily unavailable. Please call or WhatsApp us instead.
      </p>
    );
  }

  return (
    <div className={className}>
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        onSuccess={onToken}
        onExpire={() => {
          ref.current?.reset();
          onExpire?.();
        }}
        onError={() => onExpire?.()}
        options={{
          theme: "light",
          size: compact ? "compact" : "normal",
        }}
      />
    </div>
  );
}
