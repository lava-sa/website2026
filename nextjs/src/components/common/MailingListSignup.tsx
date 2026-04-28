"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

interface Props {
  source: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  inverted?: boolean;
}

export default function MailingListSignup({
  source,
  title = "Join the LAVA Mailing List",
  subtitle = "Get product drops, practical food-storage tips, and occasional member-only specials.",
  compact = false,
  inverted = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          source,
        }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) {
        setEmail("");
        setFirstName("");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className={compact ? "p-0" : "border border-border bg-surface p-6 sm:p-8"}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`h-9 w-9 flex items-center justify-center shrink-0 ${inverted ? "bg-white/10 text-secondary" : "bg-secondary/10 text-secondary"}`}>
          <Mail className="h-4 w-4" />
        </div>
        <div>
          <h3 className={`text-xl font-black leading-tight ${inverted ? "text-white" : "text-primary"}`}>{title}</h3>
          <p className={`text-sm mt-1 ${inverted ? "text-white/70" : "text-copy-muted"}`}>{subtitle}</p>
        </div>
      </div>

      {status === "done" ? (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          You are on the list. Welcome to LAVA updates.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="border border-border bg-white px-3 py-2.5 text-sm text-copy focus:outline-none focus:border-primary"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="sm:col-span-2 border border-border bg-white px-3 py-2.5 text-sm text-copy focus:outline-none focus:border-primary"
            />
          </div>
          {status === "error" && (
            <p className="text-xs text-red-600">Could not subscribe right now. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-bold px-5 py-2.5 hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>Join Mailing List</>
            )}
          </button>
          <p className={`text-[11px] ${inverted ? "text-white/60" : "text-copy-muted"}`}>
            No spam.{" "}
            <Link
              href="/mailing/unsubscribe"
              className={`underline underline-offset-2 ${inverted ? "text-white/80 hover:text-white" : "text-primary hover:text-secondary"}`}
            >
              Unsubscribe
            </Link>{" "}
            any time.
          </p>
        </form>
      )}
    </section>
  );
}

