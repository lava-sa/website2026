/** Honeypot + basic spam heuristics for public forms */

const BLOCKED_EMAIL_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "10minutemail.com",
];

export function isHoneypotTripped(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

function hasDottedSpamLocalPart(local: string): boolean {
  if (!local.includes(".")) return false;
  const segments = local.split(".").filter(Boolean);
  if (segments.length < 4) return false;
  const short = segments.filter((s) => s.length <= 2).length;
  return short >= Math.ceil(segments.length * 0.6);
}

export function isSuspiciousSignupEmail(email: string): boolean {
  const lower = email.toLowerCase();
  const [local, domain = ""] = lower.split("@");
  if (BLOCKED_EMAIL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) {
    return true;
  }
  if (lower.includes("..") || lower.length > 254) return true;
  if (hasDottedSpamLocalPart(local)) return true;
  return false;
}

/** Random bot names e.g. sKlFxjADGtvNEOXRW */
export function isSuspiciousSignupName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 12) return false;
  if (trimmed.includes(" ")) return false;
  if (!/^[A-Za-z0-9]+$/.test(trimmed)) return false;

  const upper = (trimmed.match(/[A-Z]/g) ?? []).length;
  const lower = (trimmed.match(/[a-z]/g) ?? []).length;
  if (upper >= 2 && lower >= 2) return true;

  if (!/[aeiouAEIOU]/.test(trimmed)) return true;

  return false;
}
