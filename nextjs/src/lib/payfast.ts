import { createHash } from "crypto";

/** PHP-style urlencode: spaces → +, everything else standard percent-encoded */
function pfEncode(value: string): string {
  return encodeURIComponent(value.trim()).replace(/%20/g, "+");
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
 * Verify an ITN notification signature.
 * @param rawEntries  Ordered entries from the ITN POST body (URLSearchParams order).
 * @param passphrase  PayFast passphrase.
 * @param received    The signature value received from PayFast.
 */
export function verifyITNSignature(
  rawEntries: [string, string][],
  passphrase: string,
  received: string
): boolean {
  const withoutSig = rawEntries.filter(([k]) => k !== "signature");
  const expected = generateSignature(withoutSig, passphrase);
  return expected === received;
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
