/**
 * Book a Demonstration — demo types and slot schedule.
 * Tue / Wed / Thu only · 10:00, 11:00, 12:00 (on the hour).
 *
 * Set DEMO_BOOKING_ENABLED true + restore footer link when Anneke is ready.
 */

/** Public booking UI and API — off until Anneke can run demonstrations. */
export const DEMO_BOOKING_ENABLED = false;

export interface DemoType {
  slug: string;
  title: string;
  description: string;
}

export const DEMO_TYPES: DemoType[] = [
  {
    slug: "showroom",
    title: "Showroom Demonstration",
    description:
      "Visit our Bryanston showroom and see the vacuum machines in action with Anneke.",
  },
  {
    slug: "online",
    title: "Online Demonstration",
    description:
      "Anneke demonstrates live via video call — ideal if you cannot visit in person. A link is sent before your slot.",
  },
];

/** Hourly demo slots (24h) — 3 per demonstration morning */
export const DEMO_TIME_SLOTS = ["10:00", "11:00", "12:00"] as const;

/** getDay(): 0=Sun … 2=Tue, 3=Wed, 4=Thu */
export const BOOKABLE_WEEKDAYS = new Set([2, 3, 4]);

export function getDemoType(slug: string): DemoType | undefined {
  return DEMO_TYPES.find((d) => d.slug === slug);
}
