/** Lava-SA main office line */
export const MAIN_PHONE = {
  display: "+27 72 160 5556",
  displayLocal: "+27 (0)72 160 5556",
  tel: "+27721605556",
  whatsapp: "27721605556",
} as const;

/** Anneke Hofmeyr — direct sales & support */
export const ANNEKE_PHONE = {
  display: "+27 79 512 6771",
  displayLocal: "+27 (0)79 512 6771",
  tel: "+27795126771",
  whatsapp: "27795126771",
  label: "Anneke",
} as const;

/** Plain-text for meta, emails, legal copy */
export const PHONES_DISPLAY_LONG =
  `${MAIN_PHONE.displayLocal} or ${ANNEKE_PHONE.displayLocal} (Anneke)` as const;

/** Office / trading hours — Mon–Fri 08:00–15:30 (Anneke, June 2026) */
export const BUSINESS_HOURS = {
  days: "Mon–Fri",
  daysLong: "Monday – Friday",
  opens: "08:00",
  closes: "15:30",
  /** Mon–Fri, 08:00–15:30 */
  display: "Mon–Fri, 08:00–15:30",
  /** 08:00 – 15:30 */
  displayRange: "08:00 – 15:30",
  /** Mon–Fri, 8am–3:30pm */
  displayFriendly: "Mon–Fri, 8am–3:30pm",
  /** Monday – Friday, 08:00 – 15:30 SAST */
  displayLegal: "Monday – Friday, 08:00 – 15:30 SAST",
} as const;

export const CALLBACK_TIME_OPTIONS = [
  `Any time (${BUSINESS_HOURS.display})`,
  "Morning (08:00–12:00)",
  "Midday (12:00–14:00)",
  "Afternoon (14:00–15:30)",
] as const;
