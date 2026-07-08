"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  Check,
  Loader2,
  CalendarDays,
  Clock,
  User,
  Monitor,
} from "lucide-react";
import { HoneypotField } from "@/components/security/HoneypotField";
import { TurnstileWidget } from "@/components/security/TurnstileWidget";
import { DEMO_TYPES, type DemoType } from "@/lib/demo-booking-config";
import {
  formatDateStr,
  formatSlotLabel,
  formatDateDisplay,
  isBookableDate,
  type SlotStatus,
} from "@/lib/demo-availability";
import { ANNEKE_PHONE } from "@/lib/contact";

const SHOWROOM_ADDRESS = "5 Stirling Road, Bryanston, Johannesburg, 2191";

const STEPS = [
  { label: "Demo Type", icon: Monitor },
  { label: "Date", icon: CalendarDays },
  { label: "Time", icon: Clock },
  { label: "Your Details", icon: User },
];

function slotEndLabel(timeSlot: string): string {
  const hour = parseInt(timeSlot.split(":")[0], 10) + 1;
  return formatSlotLabel(`${String(hour).padStart(2, "0")}:00`);
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done
                    ? "border-secondary bg-secondary"
                    : active
                      ? "border-primary bg-primary"
                      : "border-border bg-white"
                }`}
              >
                {done ? (
                  <Check size={14} className="text-white" strokeWidth={2.5} />
                ) : (
                  <Icon
                    size={15}
                    className={active ? "text-white" : "text-copy-muted"}
                    strokeWidth={1.5}
                  />
                )}
              </div>
              <span
                className={`hidden text-[10px] font-semibold uppercase tracking-widest sm:block ${
                  active ? "text-primary" : done ? "text-secondary" : "text-copy-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 h-px w-10 sm:w-16 transition-colors duration-300 ${
                  i < current ? "bg-secondary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1DemoType({
  selected,
  onSelect,
}: {
  selected: DemoType | null;
  onSelect: (demo: DemoType) => void;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-dark">Choose your demonstration</h2>
      <p className="mb-8 text-sm text-copy-muted">
        See LAVA vacuum sealers in action with Anneke — in our Bryanston showroom or online via
        video call.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {DEMO_TYPES.map((demo) => {
          const isSelected = selected?.slug === demo.slug;
          return (
            <button
              key={demo.slug}
              type="button"
              onClick={() => onSelect(demo)}
              className={`flex flex-col gap-1 border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white hover:border-secondary hover:bg-primary-wash"
              }`}
            >
              <span
                className={`text-sm font-bold leading-snug ${
                  isSelected ? "text-white" : "text-dark"
                }`}
              >
                {demo.title}
              </span>
              <span
                className={`text-xs leading-relaxed ${
                  isSelected ? "text-on-dark-muted" : "text-copy-muted"
                }`}
              >
                {demo.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Step2Date({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 90);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function cellDate(day: number): Date {
    return new Date(viewYear, viewMonth, day);
  }

  function isDisabled(day: number): boolean {
    const d = cellDate(day);
    return !isBookableDate(d) || d > maxDate;
  }

  function isSelected(day: number): boolean {
    return formatDateStr(cellDate(day)) === selected;
  }

  function isToday(day: number): boolean {
    return formatDateStr(cellDate(day)) === formatDateStr(today);
  }

  const canGoBack =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const maxMonth = new Date(today);
  maxMonth.setMonth(maxMonth.getMonth() + 3);
  const canGoForward =
    viewYear < maxMonth.getFullYear() ||
    (viewYear === maxMonth.getFullYear() && viewMonth < maxMonth.getMonth());

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-dark">Choose a date</h2>
      <p className="mb-8 text-sm text-copy-muted">
        Tuesday, Wednesday &amp; Thursday · 10:00 AM – 1:00 PM
      </p>

      <div className="border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canGoBack}
            className="flex h-8 w-8 items-center justify-center text-copy-muted transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-dark">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            disabled={!canGoForward}
            className="flex h-8 w-8 items-center justify-center text-copy-muted transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronLeft size={18} className="rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-border">
          {DAYS.map((d) => (
            <div
              key={d}
              className={`py-2.5 text-center text-[10px] font-bold uppercase tracking-widest ${
                ["Tue", "Wed", "Thu"].includes(d) ? "text-primary" : "text-copy-muted/50"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="h-10" />;
            }
            const disabled = isDisabled(day);
            const selectedDay = isSelected(day);
            const todayDay = isToday(day);

            return (
              <button
                key={day}
                type="button"
                onClick={() => !disabled && onSelect(formatDateStr(cellDate(day)))}
                disabled={disabled}
                className={`flex h-10 items-center justify-center text-sm transition-colors ${
                  selectedDay
                    ? "bg-primary font-bold text-white"
                    : todayDay && !disabled
                      ? "font-bold text-secondary hover:bg-primary-wash"
                      : disabled
                        ? "cursor-not-allowed text-border"
                        : "text-dark hover:bg-primary-wash hover:text-primary"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <p className="mt-4 text-sm text-copy-muted">
          Selected:{" "}
          <span className="font-medium text-dark">{formatDateDisplay(selected)}</span>
        </p>
      )}
    </div>
  );
}

function Step3Time({
  date,
  demoSlug,
  selected,
  onSelect,
}: {
  date: string;
  demoSlug: string;
  selected: string | null;
  onSelect: (slot: string) => void;
}) {
  const [slots, setSlots] = useState<SlotStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/demo-bookings/available-slots?date=${date}&demo=${demoSlug}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load slots");
      setSlots(data.slots);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load available times.");
    } finally {
      setLoading(false);
    }
  }, [date, demoSlug]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-dark">Select a time</h2>
      <p className="mb-8 text-sm text-copy-muted">
        {formatDateDisplay(date)} · one-hour demonstration slots
      </p>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-copy-muted">
          <Loader2 size={15} className="animate-spin text-secondary" />
          Loading available times…
        </div>
      )}

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={fetchSlots}
            className="ml-3 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {availableCount === 0 ? (
            <div className="border border-border bg-white p-8 text-center">
              <p className="text-sm text-copy-muted">
                No slots available on this date. Please choose another day.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => slot.available && onSelect(slot.time)}
                    disabled={!slot.available}
                    className={`border py-4 text-sm font-bold transition-all duration-150 ${
                      selected === slot.time
                        ? "border-primary bg-primary text-white"
                        : slot.available
                          ? "border-border bg-white text-dark hover:border-secondary hover:bg-primary-wash"
                          : "cursor-not-allowed border-border/50 bg-surface text-copy-muted/50 line-through"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-copy-muted">
                {availableCount} slot{availableCount !== 1 ? "s" : ""} available · demonstrations
                run 10:00 AM – 1:00 PM
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

interface ContactState {
  name: string;
  email: string;
  phone: string;
  notes: string;
  website: string;
}

function Step4Contact({
  demo,
  date,
  timeSlot,
  contact,
  onChange,
  onSubmit,
  submitting,
  submitError,
  turnstileToken,
  onTurnstileToken,
}: {
  demo: DemoType;
  date: string;
  timeSlot: string;
  contact: ContactState;
  onChange: (field: keyof ContactState, value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string | null;
  turnstileToken: string;
  onTurnstileToken: (token: string) => void;
}) {
  const dateDisplay = formatDateDisplay(date);
  const timeDisplay = formatSlotLabel(timeSlot);
  const endDisplay = slotEndLabel(timeSlot);
  const location =
    demo.slug === "showroom"
      ? SHOWROOM_ADDRESS
      : "Anneke will send you a video call link before your demonstration.";

  const valid = contact.name.trim() && contact.email.trim() && contact.phone.trim();

  return (
    <div>
      <h2 className="mb-1 text-xl font-bold text-dark">Your details</h2>
      <p className="mb-8 text-sm text-copy-muted">
        We&apos;ll send your confirmation to your email address.
      </p>

      <div className="mb-8 border border-border bg-white p-5">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[3px] text-primary">
          Booking Summary
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-copy-muted">Demonstration</span>
            <span className="text-right font-medium text-dark">{demo.title}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-copy-muted">Date</span>
            <span className="text-right font-medium text-dark">{dateDisplay}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-copy-muted">Time</span>
            <span className="text-right font-medium text-dark">
              {timeDisplay} – {endDisplay}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-copy-muted">
              {demo.slug === "showroom" ? "Location" : "Online"}
            </span>
            <span className="max-w-[55%] text-right font-medium text-dark">{location}</span>
          </div>
        </div>
      </div>

      <div className="relative space-y-4">
        <HoneypotField
          value={contact.website}
          onChange={(website) => onChange("website", website)}
        />
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-dark">
            Full Name <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            value={contact.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Your full name"
            className="w-full border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-copy-muted/50 outline-none transition-colors focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-dark">
            Email Address <span className="text-secondary">*</span>
          </label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-copy-muted/50 outline-none transition-colors focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-dark">
            Phone Number <span className="text-secondary">*</span>
          </label>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+27 82 000 0000"
            className="w-full border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-copy-muted/50 outline-none transition-colors focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-dark">
            Notes{" "}
            <span className="font-normal normal-case tracking-normal text-copy-muted">
              (optional)
            </span>
          </label>
          <textarea
            value={contact.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            placeholder="Which machine or use case you'd like to see, questions for Anneke…"
            rows={3}
            className="w-full resize-none border border-border bg-white px-4 py-3 text-sm text-dark placeholder:text-copy-muted/50 outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <TurnstileWidget
        onToken={onTurnstileToken}
        onExpire={() => onTurnstileToken("")}
        className="mt-4 flex justify-center"
      />

      {submitError && (
        <div className="mt-4 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={
          !valid ||
          submitting ||
          (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() && !turnstileToken)
        }
        className="mt-6 flex w-full items-center justify-center gap-2 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Confirming…
          </>
        ) : (
          "Confirm Booking"
        )}
      </button>

      <p className="mt-3 text-center text-xs text-copy-muted">
        By confirming you agree to our{" "}
        <a href="/legal/terms" className="underline hover:text-dark">
          Terms &amp; Conditions
        </a>
        . A confirmation email will be sent immediately.
      </p>
    </div>
  );
}

function ConfirmationScreen({
  reference,
  demo,
  date,
  timeSlot,
  customerName,
}: {
  reference: string;
  demo: DemoType;
  date: string;
  timeSlot: string;
  customerName: string;
}) {
  const dateDisplay = formatDateDisplay(date);
  const timeDisplay = formatSlotLabel(timeSlot);
  const endDisplay = slotEndLabel(timeSlot);
  const location =
    demo.slug === "showroom"
      ? SHOWROOM_ADDRESS
      : "Anneke will send you a video call link before your demonstration.";

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Check size={28} className="text-secondary" strokeWidth={2} />
      </div>

      <p className="mb-1 text-xs font-bold uppercase tracking-[3px] text-secondary">
        Booking Confirmed
      </p>
      <h2 className="mb-2 text-2xl font-bold text-dark">
        See you soon, {customerName.split(" ")[0]}
      </h2>
      <p className="mb-8 text-sm text-copy-muted">
        A confirmation has been sent to your email address.
      </p>

      <div className="mb-8 border border-border bg-white p-6 text-left">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-primary">
            Demonstration Details
          </p>
          <span className="bg-surface px-3 py-1 font-mono text-xs font-bold text-copy-muted">
            {reference}
          </span>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <span className="text-copy-muted">Type</span>
            <span className="text-right font-medium text-dark">{demo.title}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <span className="text-copy-muted">Date</span>
            <span className="text-right font-medium text-dark">{dateDisplay}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <span className="text-copy-muted">Time</span>
            <span className="text-right font-medium text-dark">
              {timeDisplay} – {endDisplay}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-copy-muted">
              {demo.slug === "showroom" ? "Location" : "Online"}
            </span>
            <span className="max-w-[55%] text-right font-medium text-dark">{location}</span>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-copy-muted">
        Need to reschedule? Contact Anneke at least 24 hours in advance on{" "}
        <a
          href={`tel:${ANNEKE_PHONE.tel}`}
          className="font-medium text-primary hover:text-secondary"
        >
          {ANNEKE_PHONE.displayLocal}
        </a>{" "}
        or{" "}
        <a href="mailto:info@lava-sa.com" className="font-medium text-primary hover:text-secondary">
          info@lava-sa.com
        </a>
        .
      </p>

      <a
        href="/"
        className="inline-block bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark"
      >
        Back to Home
      </a>
    </div>
  );
}

export default function DemoBookingWizard() {
  const [step, setStep] = useState(0);
  const [demo, setDemo] = useState<DemoType | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactState>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    website: "",
  });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function handleContactChange(field: keyof ContactState, value: string) {
    setContact((prev) => ({ ...prev, [field]: value }));
  }

  function handleSelectDemo(d: DemoType) {
    setDemo(d);
    setDate(null);
    setSlot(null);
  }

  function handleSelectDate(d: string) {
    setDate(d);
    setSlot(null);
  }

  async function handleSubmit() {
    if (!demo || !date || !slot) return;

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
    if (siteKey && !turnstileToken) {
      setSubmitError("Please complete the security check below.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/demo-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demoSlug: demo.slug,
          date,
          timeSlot: slot,
          customerName: contact.name,
          customerEmail: contact.email,
          customerPhone: contact.phone,
          notes: contact.notes,
          turnstileToken: turnstileToken || undefined,
          website: contact.website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setReference(data.reference);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const confirmed = !!(reference && demo && date && slot);

  if (confirmed && demo && date && slot) {
    return (
      <>
        <div className="bg-primary px-4 py-16 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-secondary">
            Lava-SA
          </p>
          <h1 className="text-3xl font-bold tracking-wide text-white sm:text-4xl">
            Demonstration Confirmed
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-on-dark-muted">
            A confirmation has been sent to your email address.
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <div className="border border-border bg-white p-8 sm:p-12">
            <ConfirmationScreen
              reference={reference!}
              demo={demo}
              date={date}
              timeSlot={slot}
              customerName={contact.name}
            />
          </div>
        </div>
      </>
    );
  }

  const canAdvance = [!!demo, !!date, !!slot, !!(contact.name && contact.email && contact.phone)];

  return (
    <>
      <div className="bg-primary px-4 py-16 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-secondary">Lava-SA</p>
        <h1 className="text-3xl font-bold tracking-wide text-white sm:text-4xl">
          Book a Demonstration
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-on-dark-muted">
          Choose online or showroom, pick a Tuesday–Thursday morning slot, and confirm — we&apos;ll
          send a confirmation straight to your inbox.
        </p>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="border border-border bg-white p-6 sm:p-10">
          <StepIndicator current={step} />

          <div className="min-h-[320px]">
            {step === 0 && <Step1DemoType selected={demo} onSelect={handleSelectDemo} />}
            {step === 1 && <Step2Date selected={date} onSelect={handleSelectDate} />}
            {step === 2 && demo && date && (
              <Step3Time
                date={date}
                demoSlug={demo.slug}
                selected={slot}
                onSelect={setSlot}
              />
            )}
            {step === 3 && demo && date && slot && (
              <Step4Contact
                demo={demo}
                date={date}
                timeSlot={slot}
                contact={contact}
                onChange={handleContactChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitError={submitError}
                turnstileToken={turnstileToken}
                onTurnstileToken={setTurnstileToken}
              />
            )}
          </div>

          {step < 3 && (
            <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`flex items-center gap-1.5 text-sm text-copy-muted transition-colors hover:text-dark ${
                  step === 0 ? "invisible" : ""
                }`}
              >
                <ChevronLeft size={15} />
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance[step]}
                className="bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === 2 ? "Continue" : "Next"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6 flex justify-start border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-sm text-copy-muted transition-colors hover:text-dark"
              >
                <ChevronLeft size={15} />
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
