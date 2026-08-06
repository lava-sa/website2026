"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * PayFast confirms a payment out-of-band (ITN), which can land a few seconds
 * after the customer is returned to the site. While the order is still
 * "pending" we say so honestly and poll until the real outcome arrives —
 * we never render a success message we have not verified.
 */
export default function PaymentStatusWatcher({
  orderNumber,
  token,
  pollMs = 3000,
  maxAttempts = 15,
}: {
  orderNumber: string;
  token: string;
  pollMs?: number;
  maxAttempts?: number;
}) {
  const router = useRouter();
  const [givenUp, setGivenUp] = useState(false);

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;
    let noticeSent = false;

    /**
     * If PayFast still hasn't confirmed after a couple of checks, tell the server
     * so the customer and info@lava-sa.com both get an explicitly UNCONFIRMED
     * notice. Without this, a silent ITN failure means nobody hears anything.
     */
    function sendUnconfirmedNotice() {
      if (noticeSent) return;
      noticeSent = true;
      fetch("/api/payfast/returned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderNumber, token }),
        keepalive: true,
      }).catch(() => {
        // Best effort — the admin order list is the backstop.
      });
    }

    const timer = setInterval(async () => {
      attempts += 1;
      if (attempts > maxAttempts) {
        clearInterval(timer);
        sendUnconfirmedNotice();
        if (!cancelled) setGivenUp(true);
        return;
      }
      try {
        const res = await fetch(
          `/api/checkout/order-status?order=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { status?: string };
        if (data.status && data.status !== "pending") {
          clearInterval(timer);
          if (!cancelled) router.refresh();
          return;
        }
        // Still pending after ~9s — PayFast is not going to tell us in time.
        if (attempts >= 3) sendUnconfirmedNotice();
      } catch {
        // transient network error — try again on the next tick
      }
    }, pollMs);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [orderNumber, token, pollMs, maxAttempts, router]);

  if (givenUp) {
    return (
      <p className="text-sm text-copy-muted">
        Still waiting for PayFast. We will email you the moment the payment result comes
        through — no need to pay again.
      </p>
    );
  }

  return (
    <p className="flex items-center justify-center gap-2 text-sm text-copy-muted">
      <Loader2 className="h-4 w-4 animate-spin" />
      Checking with PayFast…
    </p>
  );
}
