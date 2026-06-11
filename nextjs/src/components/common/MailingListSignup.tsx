"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { HoneypotField } from "@/components/security/HoneypotField";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";

interface Props {
  source: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  inverted?: boolean;
}

const INTEREST_OPTIONS = [
  { value: "vacuum_machines", label: "Vacuum Machines" },
  { value: "vacuum_bags_rolls", label: "Vacuum Bags & Rolls" },
  { value: "containers_lids", label: "Containers & Lids" },
  { value: "butchery_accessories", label: "Butchery Accessories" },
  { value: "sous_vide", label: "Sous Vide" },
] as const;

type InterestValue = (typeof INTEREST_OPTIONS)[number]["value"];

export default function MailingListSignup({
  source,
  title = "Join the LAVA Mailing List",
  subtitle = "Get product drops, practical food-storage tips, and occasional member-only specials.",
  compact = false,
  inverted = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [interestCategory, setInterestCategory] = useState<InterestValue | "">("");
  const [machineIndustry, setMachineIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    if (!email.trim() || !interestCategory) return;
    if (interestCategory === "vacuum_machines" && !machineIndustry.trim()) return;

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
    if (siteKey && !turnstileToken) {
      setErrorMessage("Please complete the security check below.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          source,
          interest_category: interestCategory,
          machine_industry: interestCategory === "vacuum_machines" ? machineIndustry.trim() : null,
          turnstileToken: turnstileToken || undefined,
          website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Could not subscribe right now. Please try again.");
        return;
      }
      setStatus("done");
      if (res.ok) {
        setEmail("");
        setFirstName("");
        setInterestCategory("");
        setMachineIndustry("");
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
        <form onSubmit={handleSubmit} className="relative space-y-3">
          <HoneypotField value={website} onChange={setWebsite} />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              required
              value={interestCategory}
              onChange={(e) => setInterestCategory(e.target.value as InterestValue)}
              className="sm:col-span-1 border border-border bg-white px-3 py-2.5 text-sm text-copy focus:outline-none focus:border-primary"
            >
              <option value="">Select interest category *</option>
              {INTEREST_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {interestCategory === "vacuum_machines" ? (
              <input
                type="text"
                required
                value={machineIndustry}
                onChange={(e) => setMachineIndustry(e.target.value)}
                placeholder="What industry are you in? *"
                className="sm:col-span-2 border border-border bg-white px-3 py-2.5 text-sm text-copy focus:outline-none focus:border-primary"
              />
            ) : (
              <div className="sm:col-span-2" />
            )}
          </div>
          <TurnstileWidget
            onToken={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            className="flex justify-start"
          />
          {status === "error" && errorMessage && (
            <p className="text-xs text-red-600">{errorMessage}</p>
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

