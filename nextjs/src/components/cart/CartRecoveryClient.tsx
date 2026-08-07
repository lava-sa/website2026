"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ShoppingCart, AlertTriangle } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-context";

/**
 * Restores a basket from a recovery link.
 *
 * The saved lines are merged into whatever is already in the cart rather than
 * replacing it — someone who has started a new basket must not have it wiped by
 * clicking an old email. Prices come back from the server at today's values.
 */
export default function CartRecoveryClient({ token }: { token: string }) {
  const router = useRouter();
  const { items, addItem, updateQty, isHydrated } = useCart();
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  const [message, setMessage] = useState("");
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const ran = useRef(false);

  useEffect(() => {
    if (!isHydrated || ran.current) return;
    ran.current = true;

    if (!token) {
      setState("error");
      setMessage("That link is missing its code. Please use the button in your email.");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/cart/recover?token=${encodeURIComponent(token)}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          setState("error");
          setMessage(data.error ?? "We couldn't open that basket.");
          return;
        }

        const restored: (CartItem & { shippingEnabled?: boolean })[] = data.items ?? [];
        setUnavailable(data.unavailable ?? []);

        for (const line of restored) {
          const existing = items.find((i) => i.id === line.id);
          if (existing) {
            // Already in the basket — keep the larger quantity, don't stack.
            if (line.quantity > existing.quantity) updateQty(line.id, line.quantity);
          } else {
            const { quantity, ...rest } = line;
            addItem(rest);
            if (quantity > 1) updateQty(line.id, quantity);
          }
        }

        setState("done");
        if (restored.length > 0) {
          setTimeout(() => router.push("/cart"), 1200);
        }
      } catch {
        setState("error");
        setMessage("Something went wrong opening your basket. Please try again.");
      }
    })();
  }, [isHydrated, token, items, addItem, updateQty, router]);

  if (state === "loading") {
    return (
      <div className="bg-white border border-border p-10 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-copy-muted">Opening your saved basket…</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="bg-white border border-border p-10 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-3">We couldn&apos;t open that basket</h1>
        <p className="text-copy-muted mb-6">{message}</p>
        <Link href="/products/vacuum-machines" className="btn-primary px-8 py-3">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border p-10 text-center">
      <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-primary mb-3">Your basket is back</h1>
      <p className="text-copy-muted mb-6">Taking you to your cart…</p>

      {unavailable.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-left mb-6">
          <strong>No longer available:</strong> {unavailable.join(", ")}. Everything else has been
          restored.
        </div>
      )}

      <Link href="/cart" className="btn-primary px-8 py-3">
        Go to my cart
      </Link>
    </div>
  );
}
