import { createHash } from "crypto";

/** PHP-style urlencode: spaces → +, everything else standard percent-encoded */
function pfEncode(value: string): string {
  return encodeURIComponent(value.trim()).replace(/%20/g, "+");
}

/**
 * Byte-for-byte match for PHP's urlencode(), which is what PayFast hashes.
 * encodeURIComponent leaves !'()*~ alone; PHP escapes them. The value is NOT
 * trimmed — PayFast signs exactly what it posts.
 */
function phpUrlEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * Generate a PayFast MD5 signature.
 * @param orderedParams  Key-value pairs IN THE ORDER they appear in the form.
 *                       Do NOT include "signature" itself.
 * @param passphrase     PayFast passphrase (server-side env var only).
 */
export function generateSignature(
  orderedParams: [string, string][],
  passphrase: string
): string {
  const filtered = orderedParams.filter(([, v]) => v !== "" && v != null);
  let str = filtered.map(([k, v]) => `${k}=${pfEncode(v)}`).join("&");
  if (passphrase) {
    str += `&passphrase=${pfEncode(passphrase)}`;
  }
  return createHash("md5").update(str).digest("hex");
}

/** Returns the correct PayFast payment URL based on the sandbox flag */
export function getPayFastUrl(): string {
  const sandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === "true";
  return sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

/**
 * Signature over an ITN payload, per PayFast's ITN spec:
 * every posted field except `signature`, in the order received, urlencoded
 * PHP-style, joined with &, with the passphrase appended when one is set.
 *
 * Unlike the outgoing payment request, empty fields are NOT dropped and values
 * are NOT trimmed — PayFast hashes exactly what it posts, and an ITN always
 * carries empty fields (custom_str1..5 etc.). Dropping them made every genuine
 * ITN fail verification, so no order ever reached "paid" (found 6 Aug 2026).
 */
function itnSignature(
  entries: [string, string][],
  passphrase: string,
  opts: { dropEmpty?: boolean; trim?: boolean } = {}
): string {
  const usable = opts.dropEmpty ? entries.filter(([, v]) => v !== "" && v != null) : entries;
  const encode = (v: string) => (opts.trim ? phpUrlEncode(v.trim()) : phpUrlEncode(v));
  let str = usable.map(([k, v]) => `${k}=${encode(v)}`).join("&");
  if (passphrase) str += `&passphrase=${phpUrlEncode(passphrase)}`;
  return createHash("md5").update(str).digest("hex");
}

export type ItnSignatureCheck = {
  valid: boolean;
  /** Which encoding variant matched — "spec" is the documented one. */
  variant?: string;
  /** Variants tried, for diagnosing a mismatch in the logs. */
  attempted: string[];
};

/**
 * Verify an ITN notification signature.
 *
 * Tries the documented form first, then a small set of known-tolerable
 * variations, and reports which one matched. The variations exist because a
 * silent format mismatch here costs real orders; the matched variant is logged
 * so the encoding can be pinned down rather than guessed at forever.
 *
 * @param rawEntries  Ordered entries from the ITN POST body (URLSearchParams order).
 * @param passphrase  PayFast passphrase.
 * @param received    The signature value received from PayFast.
 */
export function verifyITNSignature(
  rawEntries: [string, string][],
  passphrase: string,
  received: string
): ItnSignatureCheck {
  const entries = rawEntries.filter(([k]) => k !== "signature");

  const variants: [string, string][] = [
    ["spec", itnSignature(entries, passphrase)],
    ["spec-trimmed", itnSignature(entries, passphrase, { trim: true })],
    ["drop-empty", itnSignature(entries, passphrase, { dropEmpty: true })],
    ["drop-empty-trimmed", itnSignature(entries, passphrase, { dropEmpty: true, trim: true })],
    ["no-passphrase", itnSignature(entries, "")],
    ["no-passphrase-drop-empty", itnSignature(entries, "", { dropEmpty: true })],
  ];

  const match = variants.find(([, sig]) => sig === received);
  return {
    valid: Boolean(match),
    variant: match?.[0],
    attempted: variants.map(([name]) => name),
  };
}

/**
 * Confirm the ITN is really from PayFast by calling their validate endpoint.
 * Returns true if valid.
 */
export async function validateITNWithPayFast(body: string): Promise<boolean> {
  const sandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === "true";
  const host = sandbox
    ? "https://sandbox.payfast.co.za"
    : "https://www.payfast.co.za";

  const res = await fetch(`${host}/eng/query/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();
  return text.trim() === "VALID";
}
