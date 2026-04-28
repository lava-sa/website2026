/**
 * Remove spam / fake / non-purchasing junk profiles from `customers`.
 *
 * NEVER deletes:
 * - Email appears in `orders` or `order_history`
 * - order_count > 0 or total_spent > 0
 * - Has billing_address_1 or phone (likely real people)
 * - Emails in PROTECT_EMAILS (staff)
 *
 * Deletes (high confidence) when not protected:
 * - Disposable / trash-mail domains
 * - Local-part is mostly digits (phone-style logins)
 * - Very long random-looking local part on non-major domains
 *
 * Usage:
 *   node scripts/cleanup-spam-customers.mjs
 *   node scripts/cleanup-spam-customers.mjs --execute
 *
 * Modes:
 *   (default) Heuristic: disposable domains, obfuscated locals, random slugs, etc.
 *   --aggressive  Also delete EVERY row that is not “protected” (see below). Use when
 *                 you want to keep only purchasers + people with real contact details.
 *
 * Protected (never deleted):
 *   Staff emails, purchaser emails (orders + order_history), order_count > 0,
 *   total_spent > 0, billing_address_1, phone (8+ chars).
 *   With --aggressive only: having both first + last name does NOT protect by itself.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROTECT_EMAILS = new Set(
  ["info@lava-sa.co.za", "anneke@lava-sa.co.za", "ignatius@crmsolutions.app"].map((e) => e.toLowerCase())
);

/** Never treat as spam (system / partner domains) */
const PROTECT_EMAIL_DOMAINS = new Set(["wordpress.org", "automattic.com"]);

/** Major providers: still require "junk signals" if no purchase — we only auto-delete junk domains + patterns */
const MAJOR_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "live.co.za",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "mail.com",
  "gmx.com",
  "gmx.de",
  "web.de",
  "rocketmail.com",
]);

/** Obvious disposable / abuse domains seen in exports + common lists */
const DISPOSABLE_DOMAINS = [
  "vargosmail.com",
  "polosmail.com",
  "fringmail.com",
  "forgodcoin.com",
  "blyxen.org",
  "emailgsa2.xyz",
  "estrella.blyxen.org",
  "34bf.forgodcoin.com",
  "a13f.forgodcoin.com",
  "mailinator.com",
  "guerrillamail.com",
  "yopmail.com",
  "tempmail.com",
  "throwaway.email",
  "discard.email",
  "trashmail.com",
  "getnada.com",
  "moakt.com",
  "tmail.com",
  "emailfake.com",
  "crazymailing.com",
  "vargosmail.com",
  "maildrop.cc",
  "mailnesia.com",
  "mintemail.com",
  "spam4.me",
  "grr.la",
  "pokemail.net",
  "spamgourmet.com",
];

function loadEnvLocal() {
  const p = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(p)) {
    console.error("Missing .env.local at", p);
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function normEmail(e) {
  return String(e ?? "")
    .trim()
    .toLowerCase();
}

function domainOf(email) {
  const i = email.lastIndexOf("@");
  if (i === -1) return "";
  return email.slice(i + 1).trim().toLowerCase();
}

function localPart(email) {
  const i = email.lastIndexOf("@");
  if (i === -1) return email;
  return email.slice(0, i);
}

function isDisposableDomain(domain) {
  if (!domain) return false;
  const d = domain.toLowerCase();
  for (const x of DISPOSABLE_DOMAINS) {
    if (d === x || d.endsWith("." + x)) return true;
  }
  // Cheap / abuse TLD patterns
  if (/\.(tk|ml|ga|cf|gq|xyz)$/i.test(d) && !d.endsWith(".co.za")) {
    if (MAJOR_DOMAINS.has(d)) return false;
    return true;
  }
  // Random subdomains on suspicious patterns
  if (/forgodcoin|vargosmail|fringmail|polosmail|emailgsa\d/i.test(d)) return true;
  return false;
}

/** Local part is 9+ digits (WP login as phone) */
function isNumericLocal(local) {
  return /^\d{9,}$/.test(local.replace(/\s/g, ""));
}

/** Long random alphanumeric slug (no dots, typical bot signup) */
function isRandomSlugLocal(local, minLen = 14) {
  const l = local.replace(/\./g, "");
  if (l.length < minLen) return false;
  if (!/^[a-z0-9]+$/i.test(l)) return false;
  const vowels = (l.match(/[aeiou]/gi) || []).length;
  if (vowels / l.length < 0.09) return true;
  if (l.length >= 18 && /[0-9]/.test(l) && /[a-z]/i.test(l)) return true;
  return false;
}

/** Dots / digit-suffix tricks common in spam */
function isSuspiciousLocal(local) {
  const dots = (local.match(/\./g) || []).length;
  if (dots >= 4) return true;
  if (/\.{2,}/.test(local)) return true;
  if (/[a-z]{3,}\d{4,}$/i.test(local)) return true;
  if (/^\d{6,}[a-z]/i.test(local)) return true;
  if (local.length >= 22 && /^[a-z0-9._-]+$/i.test(local) && dots >= 2) return true;
  return false;
}

/** Real people usually have some vowels and are not 20+ char random slugs */
function looksLikeHumanLocalOnMajorProvider(local, domain) {
  if (!MAJOR_DOMAINS.has(domain)) return true;
  const core = local.split(/[.+_-]/).join("");
  if (core.length >= 18 && isRandomSlugLocal(local, 12)) return false;
  if (isSuspiciousLocal(local)) return false;
  return true;
}

function isJunkEmail(email, domain) {
  const local = localPart(email);
  if (isDisposableDomain(domain)) return true;
  if (isNumericLocal(local)) return true;
  if (isSuspiciousLocal(local)) return true;
  if (!MAJOR_DOMAINS.has(domain) && !domain.endsWith(".co.za") && !domain.endsWith(".org.za")) {
    if (isRandomSlugLocal(local, 12)) return true;
  }
  if (MAJOR_DOMAINS.has(domain) && !looksLikeHumanLocalOnMajorProvider(local, domain)) return true;
  return false;
}

function isProtectedRow(row, purchaserEmails, aggressive) {
  const email = normEmail(row.email);
  if (!email) return true;
  if (PROTECT_EMAILS.has(email)) return true;
  const dom = domainOf(email);
  if (PROTECT_EMAIL_DOMAINS.has(dom)) return true;
  if (purchaserEmails.has(email)) return true;
  const oc = Number(row.order_count ?? 0);
  if (Number.isFinite(oc) && oc > 0) return true;
  const spent = Number(row.total_spent ?? 0);
  if (Number.isFinite(spent) && spent > 0) return true;
  const addr = String(row.billing_address_1 ?? "").trim();
  if (addr.length > 3) return true;
  const phone = String(row.phone ?? "").trim();
  if (phone.length >= 8) return true;
  if (!aggressive) {
    const fn = String(row.first_name ?? "").trim();
    const ln = String(row.last_name ?? "").trim();
    if (fn.length >= 2 && ln.length >= 2) return true;
  }
  return false;
}

async function fetchAllPurchaserEmails(supabase) {
  const set = new Set();
  const addRows = (rows, key) => {
    for (const r of rows ?? []) {
      const e = normEmail(r[key]);
      if (e.includes("@")) set.add(e);
    }
  };

  let from = 0;
  const page = 1000;
  for (;;) {
    const { data, error } = await supabase.from("orders").select("email").range(from, from + page - 1);
    if (error) throw error;
    if (!data?.length) break;
    addRows(data, "email");
    if (data.length < page) break;
    from += page;
  }

  from = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("order_history")
      .select("customer_email")
      .range(from, from + page - 1);
    if (error) throw error;
    if (!data?.length) break;
    addRows(data, "customer_email");
    if (data.length < page) break;
    from += page;
  }

  return set;
}

async function fetchAllCustomers(supabase) {
  const out = [];
  let from = 0;
  const page = 1000;
  for (;;) {
    const { data, error } = await supabase
      .from("customers")
      .select(
        "id, email, order_count, total_spent, billing_address_1, phone, first_name, last_name, wp_user_id"
      )
      .range(from, from + page - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < page) break;
    from += page;
  }
  return out;
}

async function main() {
  const execute = process.argv.includes("--execute");
  const aggressive = process.argv.includes("--aggressive");

  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing Supabase env in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("Loading purchaser emails from orders + order_history…");
  const purchasers = await fetchAllPurchaserEmails(supabase);
  console.log(`  ${purchasers.size} distinct purchaser emails`);

  console.log("Loading customers…");
  const customers = await fetchAllCustomers(supabase);
  console.log(`  ${customers.length} customer rows`);
  if (aggressive) {
    console.log("Mode: AGGRESSIVE — delete all non-protected rows (only purchasers + contact-rich profiles kept).");
  } else {
    console.log("Mode: heuristic — obvious spam / fake patterns only (use --aggressive for full prune).");
  }

  const toDelete = [];
  const skippedProtected = [];
  const skippedNotJunk = [];

  for (const row of customers) {
    if (isProtectedRow(row, purchasers, aggressive)) {
      skippedProtected.push(row);
      continue;
    }
    const email = normEmail(row.email);
    const domain = domainOf(email);
    if (aggressive || isJunkEmail(email, domain)) {
      toDelete.push(row);
    } else {
      skippedNotJunk.push(row);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Protected (purchaser / has address / phone / order_count / staff): ${skippedProtected.length}`);
  console.log(`Not protected, left alone (heuristic mode only):                  ${skippedNotJunk.length}`);
  console.log(`Flagged for deletion:                                            ${toDelete.length}`);

  if (toDelete.length) {
    console.log("\nSample deletions (first 15):");
    for (const r of toDelete.slice(0, 15)) {
      console.log(`  ${r.email}`);
    }
  }

  if (!execute) {
    console.log("\nDry run only. Re-run with --execute to delete these rows from Supabase.");
    return;
  }

  const ids = toDelete.map((r) => r.id);
  const batch = 100;
  let deleted = 0;
  for (let i = 0; i < ids.length; i += batch) {
    const chunk = ids.slice(i, i + batch);
    const { error } = await supabase.from("customers").delete().in("id", chunk);
    if (error) {
      console.error("Delete batch error:", error.message);
      process.exit(1);
    }
    deleted += chunk.length;
    console.log(`  deleted ${deleted} / ${ids.length}`);
  }
  console.log(`\nDone. Removed ${deleted} customer rows.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
