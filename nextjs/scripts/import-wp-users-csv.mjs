/**
 * Import WordPress / WooCommerce **user export** CSV into Supabase `customers`.
 * Does NOT import passwords, session tokens, or other auth secrets — only CRM-safe fields.
 *
 * Usage (from nextjs/):
 *   node scripts/import-wp-users-csv.mjs "C:\path\to\user-export.csv"
 *   node scripts/import-wp-users-csv.mjs "...\user-export.csv" --only-shop-relevant
 *
 * --only-shop-relevant: only rows where roles include "customer" or "shop_manager"
 *   or order_count > 0 or billing_email is non-empty (skips most idle "subscriber" spam).
 *
 * Requires .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Upserts on **email** (unique). First row wins if duplicate emails appear in CSV.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function normHeader(s) {
  return String(s).toLowerCase().trim().replace(/\s+/g, " ");
}

function pick(row, keys) {
  const map = new Map(Object.keys(row).map((k) => [normHeader(k), String(row[k] ?? "").trim()]));
  for (const k of keys) {
    const v = map.get(normHeader(k));
    if (v) return v;
  }
  return "";
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function splitCsvText(text) {
  const t = text.replace(/^\uFEFF/, "");
  const lines = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '"') {
      if (inQuotes && t[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      cur += c;
      continue;
    }
    if (!inQuotes && (c === "\n" || (c === "\r" && t[i + 1] === "\n"))) {
      if (c === "\r") i++;
      if (cur.trim()) lines.push(cur);
      cur = "";
      continue;
    }
    if (!inQuotes && c === "\r") {
      if (cur.trim()) lines.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  if (cur.trim()) lines.push(cur);
  return lines;
}

function parseCsv(text) {
  const rawLines = splitCsvText(text.replace(/^\uFEFF/, ""));
  if (rawLines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(rawLines[0]).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < rawLines.length; i++) {
    const cells = parseCsvLine(rawLines[i]);
    if (cells.every((c) => !c)) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}

function parseTs(raw) {
  const t = String(raw ?? "").trim();
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function cleanPhone(p) {
  return String(p || "")
    .replace(/^['+\s]+/, "")
    .trim()
    .slice(0, 40) || null;
}

function parseOrderCount(raw) {
  const n = parseInt(String(raw).replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function isShopRelevant(row) {
  const roles = pick(row, ["roles"]).toLowerCase();
  const orders = parseOrderCount(pick(row, ["orders"]));
  const billEmail = pick(row, ["billing_email"]);
  const hasBilling =
    pick(row, ["billing_first_name", "billing_phone", "billing_address_1"]).length > 0;
  if (orders > 0) return true;
  if (billEmail && billEmail.includes("@")) return true;
  if (hasBilling) return true;
  if (roles.includes("customer")) return true;
  if (roles.includes("shop_manager")) return true;
  if (roles.includes("administrator")) return true;
  return false;
}

function rowToCustomer(row) {
  const idRaw = pick(row, ["ID", "id"]);
  const wpUserId = parseInt(idRaw, 10);
  if (!Number.isFinite(wpUserId)) return null;

  const email = pick(row, ["user_email", "email"]).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const custIdRaw = pick(row, ["customer_id"]);
  const wpCustomerId = parseInt(custIdRaw, 10);
  const wp_customer_id = Number.isFinite(wpCustomerId) ? wpCustomerId : null;

  const first_name = pick(row, ["first_name"]) || pick(row, ["billing_first_name"]) || null;
  const last_name = pick(row, ["last_name"]) || pick(row, ["billing_last_name"]) || null;
  const display_name = pick(row, ["display_name"]) || null;

  return {
    wp_user_id: wpUserId,
    wp_customer_id,
    email,
    first_name: first_name ? first_name.slice(0, 200) : null,
    last_name: last_name ? last_name.slice(0, 200) : null,
    display_name: display_name ? display_name.slice(0, 200) : null,
    phone: cleanPhone(pick(row, ["billing_phone"])),

    billing_address_1: nullIfEmpty(pick(row, ["billing_address_1"])),
    billing_address_2: nullIfEmpty(pick(row, ["billing_address_2"])),
    billing_city: nullIfEmpty(pick(row, ["billing_city"])),
    billing_state: nullIfEmpty(pick(row, ["billing_state"])),
    billing_postcode: nullIfEmpty(pick(row, ["billing_postcode"])),
    billing_country: nullIfEmpty(pick(row, ["billing_country"])) || "ZA",
    billing_company: nullIfEmpty(pick(row, ["billing_company"])),

    shipping_address_1: nullIfEmpty(pick(row, ["shipping_address_1"])),
    shipping_address_2: nullIfEmpty(pick(row, ["shipping_address_2"])),
    shipping_city: nullIfEmpty(pick(row, ["shipping_city"])),
    shipping_state: nullIfEmpty(pick(row, ["shipping_state"])),
    shipping_postcode: nullIfEmpty(pick(row, ["shipping_postcode"])),
    shipping_country: nullIfEmpty(pick(row, ["shipping_country"])) || "ZA",

    registered_at: parseTs(pick(row, ["user_registered"])) || new Date().toISOString(),
    last_active_at: parseTs(pick(row, ["wc_last_active", "last_update"])),
    order_count: parseOrderCount(pick(row, ["orders"])),

    is_active: pick(row, ["user_status"]) === "0" || pick(row, ["user_status"]) === "",
    marketing_opt_in: false,
    updated_at: new Date().toISOString(),
  };
}

function nullIfEmpty(s) {
  const t = String(s ?? "").trim();
  return t ? t.slice(0, 500) : null;
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const flags = new Set(process.argv.filter((a) => a.startsWith("--")));
  const onlyShopRelevant = flags.has("--only-shop-relevant");

  const csvPath = args[0];
  if (!csvPath || !fs.existsSync(csvPath)) {
    console.error(
      'Usage: node scripts/import-wp-users-csv.mjs "C:\\path\\to\\user-export.csv" [--only-shop-relevant]'
    );
    process.exit(1);
  }

  const env = loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const text = fs.readFileSync(csvPath, "utf8");
  const { rows } = parseCsv(text);
  console.log(`Parsed ${rows.length} user rows from CSV`);
  if (onlyShopRelevant) console.log("Filter: --only-shop-relevant (customers / orders / billing / staff roles)");

  const seenEmail = new Set();
  const batch = [];
  let skippedFilter = 0;
  let skippedDup = 0;
  let skippedInvalid = 0;
  let upserted = 0;

  async function flush() {
    if (batch.length === 0) return;
    const chunk = batch.splice(0, batch.length);
    const { error } = await supabase.from("customers").upsert(chunk, { onConflict: "email" });
    if (error) {
      console.error("Batch upsert error:", error.message);
      for (const one of chunk) {
        const { error: e2 } = await supabase.from("customers").upsert([one], { onConflict: "email" });
        if (e2) console.error("  email", one.email, e2.message);
        else upserted++;
      }
    } else {
      upserted += chunk.length;
    }
    if (upserted % 200 === 0 && upserted > 0) console.log(`  … ${upserted} customers upserted`);
  }

  for (const row of rows) {
    if (onlyShopRelevant && !isShopRelevant(row)) {
      skippedFilter++;
      continue;
    }
    const rec = rowToCustomer(row);
    if (rec === null) {
      skippedInvalid++;
      continue;
    }
    if (seenEmail.has(rec.email)) {
      skippedDup++;
      continue;
    }
    seenEmail.add(rec.email);
    batch.push(rec);
    if (batch.length >= 80) await flush();
  }
  await flush();

  console.log(
    `Done. Upserted: ${upserted}, skipped (filter): ${skippedFilter}, skipped (invalid id/email): ${skippedInvalid}, skipped (duplicate email in file): ${skippedDup}`
  );
  console.log(
    "Note: Passwords and session tokens from the CSV were never sent to Supabase. Run order-history link or your app’s customer sync if you need customer_id on orders."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
