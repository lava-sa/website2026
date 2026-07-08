/**
 * Availability helpers for Book a Demonstration.
 * Pure functions — no Supabase imports.
 */

import {
  BOOKABLE_WEEKDAYS,
  DEMO_TIME_SLOTS,
} from "@/lib/demo-booking-config";

export interface ExistingDemoBooking {
  time_slot: string;
}

export interface SlotStatus {
  time: string;
  available: boolean;
  label: string;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Tue, Wed, Thu only — not in the past */
export function isBookableDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return BOOKABLE_WEEKDAYS.has(date.getDay()) && date >= today;
}

export function formatSlotLabel(slot: string): string {
  const [hStr, mStr] = slot.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${ampm}`;
}

export function formatDateDisplay(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Slots for a date — shared across showroom and online (one demo at a time). */
export function computeAvailableDemoSlots(
  existingBookings: ExistingDemoBooking[]
): SlotStatus[] {
  const taken = new Set(existingBookings.map((b) => b.time_slot));

  return DEMO_TIME_SLOTS.map((time) => ({
    time,
    available: !taken.has(time),
    label: formatSlotLabel(time),
  }));
}

export function generateDemoReference(dateStr: string): string {
  const compact = dateStr.replace(/-/g, "");
  const suffix = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `LAVA-DEMO-${compact}-${suffix}`;
}
