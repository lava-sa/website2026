"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle } from "lucide-react";

const SA_PROVINCES = [
  "Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo",
  "Mpumalanga","Northern Cape","North West","Western Cape",
];

const ENQUIRY_TYPES = [
  "Product enquiry",
  "Order / delivery question",
  "Warranty or repair",
  "Spare part needed",
  "Bulk / business order",
  "Something else",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", province: "Gauteng",
    enquiry_type: "Product enquiry", message: "",
  });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [status, setStatus]   = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => { setForm(p => ({ ...p, [field]: e.target.value })); setErrors(p => ({ ...p, [field]: "" })); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())    e.name    = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Please enter a message";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    // TODO: wire to Resend API route once RESEND_API_KEY is set
    await new Promise(r => setTimeout(r, 1200));
    setStatus("done");
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/homepage/lava-sa-vacuum-sealers-header-pick-003.webp"
            alt="" fill className="object-cover object-center"
          />
        </div>
        <div className="relative section-container">
          <p className="overline text-secondary mb-3">We&apos;re Here to Help</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Talk to a real person.<br />Not a chatbot.
          </h1>
          <p className="mt-5 text-on-dark-muted text-lg max-w-xl leading-relaxed">
            When you contact Lava South Africa, Anneke Hofmeyr answers personally —
            every call, every email, every warranty claim.
          </p>
        </div>
      </section>

      {/* ── Info cards ────────────────────────────────────────────────────── */}
      <div className="bg-on-dark-subtle border-b border-on-dark-border">
        <div className="section-container py-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
            {[
              { icon: Phone,  title: "Call",    value: "+27 72 160 5556",    sub: "Mon–Fri 9am–5pm", href: "tel:+27721605556" },
              { icon: Mail,   title: "Email",   value: "info@lava-sa.co.za", sub: "Reply within 1 business day", href: "mailto:info@lava-sa.co.za" },
              { icon: MapPin, title: "Address", value: "5 Stirling Road",    sub: "Bryanston, Sandton 2191", href: null },
              { icon: Clock,  title: "Hours",   value: "Mon–Fri",            sub: "09:00 – 17:00", href: null },
            ].map(({ icon: Icon, title, value, sub, href }) => {
              const inner = (
                <div className="flex items-center gap-4 py-5 px-4 lg:px-6">
                  <div className="h-10 w-10 bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-on-dark-muted mb-0.5">{title}</p>
                    <p className="text-sm font-bold text-white leading-snug">{value}</p>
                    <p className="text-[11px] text-on-dark-muted">{sub}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={title} href={href} className="hover:bg-white/5 transition-colors block">{inner}</a>
              ) : (
                <div key={title}>{inner}</div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main: form + sidebar ──────────────────────────────────────────── */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          {/* ── Contact Form ───────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-2">Send Us a Message</h2>
            <p className="text-copy-muted mb-8">
              Fill in the form below and we&apos;ll get back to you within one business day.
            </p>

            {status === "done" ? (
              <div className="bg-emerald-50 border border-emerald-200 p-10 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Message sent!</h3>
                <p className="text-copy-muted">
                  Thanks, {form.name.split(" ")[0]}. We&apos;ll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Your Name" error={errors.name} required>
                    <input type="text" value={form.name} onChange={set("name")}
                      placeholder="Your full name" className={inputCls(errors.name)} />
                  </Field>
                  <Field label="Email Address" error={errors.email} required>
                    <input type="email" value={form.email} onChange={set("email")}
                      placeholder="anneke@example.co.za" className={inputCls(errors.email)} />
                  </Field>
                  <Field label="Phone Number">
                    <input type="tel" value={form.phone} onChange={set("phone")}
                      placeholder="082 123 4567" className={inputCls()} />
                  </Field>
                  <Field label="Province">
                    <select value={form.province} onChange={set("province")} className={inputCls()}>
                      {SA_PROVINCES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Enquiry Type" className="sm:col-span-2">
                    <select value={form.enquiry_type} onChange={set("enquiry_type")} className={inputCls()}>
                      {ENQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Message" error={errors.message} required>
                  <textarea value={form.message} onChange={set("message")} rows={5}
                    placeholder="Tell us what you need — machine recommendation, order question, warranty claim, etc."
                    className={`${inputCls(errors.message)} resize-none`} />
                </Field>
                <button type="submit" disabled={status === "sending"}
                  className="btn-primary flex items-center gap-2 px-10 py-4 disabled:opacity-60">
                  {status === "sending" ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="h-4 w-4" /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Anneke card */}
            <div className="border border-border overflow-hidden">
              <div className="relative h-56">
                <Image
                  src="/images/about/founders.webp"
                  alt="Anneke Hofmeyr — Lava South Africa Manager"
                  fill className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold">Anneke Hofmeyr</p>
                  <p className="text-white/70 text-xs">Manager · Lava South Africa</p>
                </div>
              </div>
              <div className="p-5 bg-surface">
                <p className="text-sm text-copy leading-relaxed">
                  &ldquo;Every question gets a personal response. If you&apos;re not sure
                  which machine is right for you, call us — it&apos;s the quickest way to
                  get the right answer.&rdquo;
                </p>
                <a href="tel:+27721605556"
                  className="mt-4 btn-primary flex items-center justify-center gap-2 py-3 text-sm">
                  <Phone className="h-4 w-4" />
                  +27 72 160 5556
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="border border-border p-5 bg-surface">
              <p className="text-[10px] font-bold uppercase tracking-widest text-copy-muted mb-4">Helpful Links</p>
              <ul className="space-y-2.5">
                {[
                  ["Delivery & Shipping Info",   "/legal/shipping-returns"],
                  ["Warranty Information",        "/legal/terms#guarantee"],
                  ["Returns Policy",              "/legal/shipping-returns#returns"],
                  ["Spare Parts",                 "/products/spare-parts"],
                  ["All Vacuum Machines",         "/products/vacuum-machines"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} className="text-sm text-copy hover:text-primary transition-colors flex items-center gap-2">
                      <span className="h-1 w-1 bg-secondary rounded-full shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}

function inputCls(error?: string) {
  return `w-full border px-4 py-2.5 text-sm text-copy focus:outline-none focus:border-primary transition-colors ${
    error ? "border-red-400 bg-red-50" : "border-border bg-white"
  }`;
}

function Field({ label, error, required, className, children }: {
  label: string; error?: string; required?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
