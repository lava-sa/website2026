"use client";

import { useEffect, useRef } from "react";

/**
 * Fires once when the customer lands back on /checkout/cancel from PayFast.
 *
 * PayFast does not reliably send an ITN for a declined or abandoned attempt, so
 * this tells the server the payment did not complete: the order is marked
 * cancelled and the "payment unsuccessful" emails go out to the customer and to
 * info@lava-sa.com. The server ignores the call for any order that is not still
 * pending, and only ever emails once.
 */
export default function ReportFailedPayment({
  orderNumber,
  token,
}: {
  orderNumber: string;
  token: string;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fetch("/api/payfast/failed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: orderNumber, token }),
      keepalive: true,
    }).catch(() => {
      // Best effort — the ITN handler and admin order list are the backstop.
    });
  }, [orderNumber, token]);

  return null;
}
