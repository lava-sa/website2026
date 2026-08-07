/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MANAGED FILE — canonical source: _commerce-core/src/payfast.ts
 * Edit it there and run `node scripts/sync.mjs` to push to every site.
 * Local edits will be overwritten and will fail `sync.mjs --check`.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PayFast signing and ITN verification.
 *
 * The two directions follow DIFFERENT rules and conflating them has cost real
 * money on this codebase:
 *
 *   outgoing payment request -> blank fields are OMITTED, values trimmed
 *   incoming ITN             -> blank fields are INCLUDED, values NOT trimmed
 *
 * PayFast always posts empty custom_str1..5 / custom_int1..5 in an ITN and
 * includes them in the signature. Verifying an ITN with the outgoing rules
 * rejects every genuine notification, so orders never reach "paid" and nobody
 * is told. That shipped to two live stores (found 6 Aug 2026).
 */

import { createHash } from "crypto";

/** PHP-style urlencode for the OUTGOING request: trims, spaces -> +. */
function pfEncode(value: string): string {
  return encodeURIComponent(value.trim()).replace(/%20/g, "+");
}

/**
 * Byte-for-byte match for PHP's urlencode(), which is what PayFast hashes.
 * encodeURIComponent leaves !'()*~ alone; PHP escapes them. No trimming —
 * PayFast signs exactly what it posts.
 */
function phpUrlEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/[!'()*~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/**
 * Signature for the OUTGOING payment request.
 * @param orderedParams Key-value pairs IN FORM ORDER, without "signature".
 */
export function generateSignature(
  orderedParams: [string, string][],
  passphrase: string
): string {
  const filtered = orderedParams.filter(([, v]) => v !== "" && v != null);
  let str = filtered.map(([k, v]) => `${k}=${pfEncode(v)}`).join("&");
  if (passphrase) str += `&passphrase=${pfEncode(passphrase)}`;
  return createHash("md5").update(str).digest("hex");
}

/** Payment URL for the configured environment. */
export function getPayFastUrl(): string {
  const sandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === "true";
  return sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

/** Signature over an INCOMING ITN payload, per PayFast's ITN spec. */
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
  attempted: string[];
};

/**
 * Verify an ITN signature. Tries the documented form first, then known
 * variations, reporting which matched — so a mismatch is diagnosable from logs
 * instead of silently discarding real payments.
 *
 * Callers should treat a mismatch as non-fatal ONLY when
 * validateITNWithPayFast() independently confirms the payload.
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
  return { valid: Boolean(match), variant: match?.[0], attempted: variants.map(([n]) => n) };
}

/**
 * Ask PayFast to confirm it really sent this payload. Authoritative — an
 * attacker cannot make PayFast return VALID for something it never sent.
 */
export async function validateITNWithPayFast(body: string): Promise<boolean> {
  const sandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === "true";
  const host = sandbox ? "https://sandbox.payfast.co.za" : "https://www.payfast.co.za";

  const res = await fetch(`${host}/eng/query/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  return (await res.text()).trim() === "VALID";
}
