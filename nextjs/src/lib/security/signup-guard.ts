/** Honeypot + spam heuristics for public forms (pure JS — safe for Edge middleware). */

const BLOCKED_EMAIL_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamailblock.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "throwawaymail.com",
  "trashmail.com",
  "getnada.com",
  "yopmail.com",
  "sharklasers.com",
  "maildrop.cc",
  "dispostable.com",
  "fakeinbox.com",
  "mailnesia.com",
  "mohmal.com",
  "emailondeck.com",
];

/** Common misspellings of the big free providers — almost always typos or fakes. */
const TYPO_EMAIL_DOMAINS = new Set([
  "gmial.com", "gmai.com", "gmal.com", "gmail.co", "gmail.con", "gmail.cm",
  "gnail.com", "gmaill.com", "gmailc.com", "gmali.com",
  "hotmial.com", "hotmal.com", "hotmai.com", "hotmail.co", "hotmail.con",
  "hotnail.com", "hotmali.com", "hormail.com",
  "yaho.com", "yahooo.com", "yahoo.co", "yaoo.com", "yhaoo.com", "yahho.com",
  "outlok.com", "outook.com", "outlook.co", "outlool.com", "outllok.com",
  "iclod.com", "iclould.com", "icloud.co",
]);

/** Keyboard-mash sequences — a person bashing keys, not a real address. */
const KEYBOARD_RUNS = [
  "qwerty", "qwertz", "asdf", "asdfgh", "zxcv", "zxcvbn", "qazwsx",
  "wasd", "hjkl", "poiuy", "lkjh", "mnbvc", "yuiop",
];

/** Placeholder / obviously-not-real local parts. */
const PLACEHOLDER_LOCALS = new Set([
  "test", "tests", "testing", "test123", "asdf", "asdfasdf", "abc", "abcd",
  "abcde", "abc123", "example", "noemail", "no-email", "none", "null",
  "fake", "fakeemail", "spam", "xxx", "xxxx", "aaa", "aaaa", "qwerty",
  "name", "email", "user", "admin", "nomail", "na", "nn", "notreal",
]);

/** Practical consumer local-part character set — rejects (){}^&*%!# etc. */
const VALID_LOCAL_CHARS = /^[a-z0-9._+'-]+$/;

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

function localPartLooksFake(local: string): boolean {
  const l = local.toLowerCase();

  if (PLACEHOLDER_LOCALS.has(l)) return true;

  // Same character repeated: aaaaaa, xxxx
  if (l.length >= 4 && /^(.)\1+$/.test(l)) return true;

  // Keyboard runs
  if (KEYBOARD_RUNS.some((run) => l.includes(run))) return true;

  const letters = (l.match(/[a-z]/g) ?? []).length;
  const digits = (l.match(/[0-9]/g) ?? []).length;

  // No letters at all: 123456, 08211100 (very rare for a real person)
  if (letters === 0) return true;

  // Long, purely alphabetic, but no vowels at all → gibberish (jkhsdfkjh)
  if (/^[a-z]+$/.test(l) && l.length >= 7 && !/[aeiou]/.test(l)) return true;

  // Six or more consecutive consonants → not a natural word/name
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/.test(l)) return true;

  // Long local that's mostly digits with almost no letters → machine-like
  if (l.length >= 6 && digits / l.length > 0.7 && letters < 3) return true;

  return false;
}

export function isSuspiciousSignupEmail(email: string): boolean {
  const lower = email.trim().toLowerCase();
  const atCount = (lower.match(/@/g) ?? []).length;
  if (atCount !== 1) return true;

  const [local, domain = ""] = lower.split("@");
  if (!local || !domain) return true;

  if (lower.length > 254 || local.length > 64) return true;

  // Blocked disposable + provider typos
  if (BLOCKED_EMAIL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) return true;
  if (TYPO_EMAIL_DOMAINS.has(domain)) return true;

  // Local-part character whitelist (kills 12^&(*(%89@…)
  if (!VALID_LOCAL_CHARS.test(local)) return true;

  // Domain shape: label(s) + TLD of 2+ letters, no doubles / edge dots-hyphens
  const domainOk =
    /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/.test(domain) &&
    !domain.includes("..") &&
    !domain.includes("--") &&
    !/(^[.-])|([.-]$)/.test(domain);
  if (!domainOk) return true;

  if (lower.includes("..")) return true;
  if (hasDottedSpamLocalPart(local)) return true;
  if (localPartLooksFake(local)) return true;

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
