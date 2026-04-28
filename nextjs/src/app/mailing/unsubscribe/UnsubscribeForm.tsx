"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function MailingUnsubscribeForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/mailing-list/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(typeof data?.error === "string" ? data.error : null);
        setStatus("error");
        return;
      }
      if (data?.ok) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-6 flex gap-3 text-sm text-emerald-900">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="font-bold">You are unsubscribed.</p>
          <p className="mt-1 text-emerald-800/90">
            If this address was on our list, it has been removed. You can join again anytime from the
            footer of our website.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-border p-6">
      <div>
        <label htmlFor="unsub-email" className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
          Email address
        </label>
        <input
          id="unsub-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
      </div>
      {status === "error" && (
        <p className="text-xs text-red-600">
          {errorMessage ?? "Could not complete the request. Check your email and try again."}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 hover:bg-primary/90 disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating…
          </>
        ) : (
          "Unsubscribe"
        )}
      </button>
    </form>
  );
}
