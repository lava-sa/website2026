export type ConsentChoice = "granted" | "denied";

export interface ConsentPreferences {
  essential: true;       // always granted — never stored as a choice
  analytics: ConsentChoice;
  version: number;       // bump when categories change to re-prompt
  timestamp: string;
}

const STORAGE_KEY = "lava_cookie_consent";
const CURRENT_VERSION = 1;

export function getConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentPreferences;
    // Re-prompt if the consent schema was updated
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: ConsentChoice): ConsentPreferences {
  const prefs: ConsentPreferences = {
    essential: true,
    analytics,
    version: CURRENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  // Notify any listeners (e.g. analytics initialisation)
  window.dispatchEvent(new CustomEvent("consent-updated", { detail: prefs }));
  return prefs;
}

export function clearConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === "granted";
}
