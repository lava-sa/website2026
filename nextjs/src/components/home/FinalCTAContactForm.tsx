"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { HoneypotField } from "@/components/security/HoneypotField";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";

const ENQUIRY_OPTIONS = [
  "V.100 Premium X",
  "V.300 Premium X",
  "V.500",
  "V.400 Premium",
  "Vacuum Bags & Accessories",
  "Technical Support",
  "Other",
];

const inputCls =
  "w-full border border-border px-4 py-3 text-sm text-primary placeholder-on-dark-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-on-dark-muted";

export default function FinalCTAContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    enquiry_type: "",
    message: "",
    website: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMessage("Please enter your name, email, and message.");
      setStatus("error");
      return;
    }

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
    if (siteKey && !turnstileToken) {
      setErrorMessage("Please complete the security check.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          province: "Gauteng",
          enquiry_type: form.enquiry_type || "Product enquiry",
          callback_time: "Any time",
          message: form.message.trim(),
          website: form.website,
          turnstileToken: turnstileToken || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("done");
      setForm({
        name: "",
        email: "",
        phone: "",
        enquiry_type: "",
        message: "",
        website: "",
      });
      setTurnstileToken("");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-7 rounded border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
        <p className="font-bold text-primary">Message sent — thank you!</p>
        <p className="mt-2 text-sm text-copy-muted">Anneke will reply within 1 business day.</p>
      </div>
    );
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
      <HoneypotField value={form.website} onChange={(v) => setForm((p) => ({ ...p, website: v }))} />

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-copy">Your name</label>
        <input
          type="text"
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Jan van der Berg"
          className={inputCls}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-copy">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@example.com"
          className={inputCls}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-copy">Phone / WhatsApp</label>
        <input
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+27 XX XXX XXXX"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-copy">What can we help with?</label>
        <select
          value={form.enquiry_type}
          onChange={set("enquiry_type")}
          className={inputCls}
        >
          <option value="">Select a machine…</option>
          {ENQUIRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-copy">Message</label>
        <textarea
          rows={3}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us what you need and we'll get back to you..."
          className={`${inputCls} resize-none`}
          required
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2">{errorMessage}</p>
      )}

      <div className="flex flex-row items-center justify-between gap-3 pt-1">
        <TurnstileWidget
          compact
          onToken={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          className="shrink-0 min-w-0"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:-translate-y-0.5 disabled:opacity-60 whitespace-nowrap"
        >
          {status === "sending" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </span>
          ) : (
            "Send Message →"
          )}
        </button>
      </div>
    </form>
  );
}
