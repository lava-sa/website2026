/**
 * Import WebToffee / WooCommerce order export CSV (one row per line item)
 * into Supabase `order_history`.
 *
 * Usage (from nextjs/):
 *   node scripts/import-webtoffee-orders-csv.mjs "path/to/orders.csv"
 *   node scripts/import-webtoffee-orders-csv.mjs --dry-run "path/to/orders.csv"
 *
 * Idempotent on wp_order_id — safe to re-run.
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
  const lines = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      cur += c;
      continue;
    }
    if (!inQuotes && (c === "\n" || (c === "\r" && text[i + 1] === "\n"))) {
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
  if (!rawLines.length) return [];
  const headers = parseCsvLine(rawLines[0]);
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
  return rows;
}

function parseMoney(s) {
  const cleaned = String(s).replace(/[^\d.,-]/g, "").replace(",", "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function parseIntSafe(s) {
  const n = parseInt(String(s).replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : NaN;
}

function parseOrderDate(raw) {
  const t = String(raw).trim();
  if (!t) return null;
  const iso = t.includes("T") ? t : t.replace(" ", "T") + "+02:00";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function normalizeWooStatus(raw) {
  const s = String(raw || "").trim().toLowerCase();
  const map = {
    processing: "wc-processing",
    completed: "wc-completed",
    "on-hold": "wc-on-hold",
    pending: "wc-pending",
    cancelled: "wc-cancelled",
    canceled: "wc-cancelled",
    refunded: "wc-refunded",
    failed: "wc-failed",
  };
  return map[s] ?? (s.startsWith("wc-") ? s : `wc-${s}`);
}

function groupWebToffeeOrders(rows) {
  const byOrder = new Map();

  for (const row of rows) {
    const orderNum = parseIntSafe(row["Order Number"]);
    if (!Number.isFinite(orderNum) || orderNum <= 0) continue;

    const qty = Math.max(1, parseIntSafe(row.Quantity) || 1);
    const unitPrice = parseMoney(row["Item Cost"]);
    const lineTotal = Math.round(unitPrice * qty * 100) / 100;

    const item = {
      name: row["Item Name"]?.trim() || "Item",
      sku: row.SKU?.trim() || null,
      quantity: qty,
      unit_price: unitPrice,
      line_total: lineTotal,
    };

    if (!byOrder.has(orderNum)) {
      const dateIso = parseOrderDate(row["Order Date"]);
      if (!dateIso) {
        console.warn(`Order ${orderNum}: invalid date "${row["Order Date"]}" — skipped`);
        continue;
      }

      byOrder.set(orderNum, {
        wp_order_id: orderNum,
        wp_order_number: String(orderNum),
        customer_email: (row["Email (Billing)"] || "").toLowerCase().trim() || null,
        customer_first_name: row["First Name (Billing)"]?.trim() || null,
        customer_last_name: row["Last Name (Billing)"]?.trim() || null,
        order_date: dateIso,
        status: normalizeWooStatus(row["Order Status"]),
        subtotal: parseMoney(row["Order Subtotal Amount"]),
        tax_total: parseMoney(row["Order Total Tax Amount"]),
        shipping_total: parseMoney(row["Order Shipping Amount"]),
        total: parseMoney(row["Order Total Amount"]),
        items: [item],
      });
    } else {
      byOrder.get(orderNum).items.push(item);
    }
  }

  return [...byOrder.values()].map((o) => ({
    ...o,
    num_items: o.items.reduce((sum, it) => sum + it.quantity, 0),
  }));
}

async function linkOrderHistoryToCustomers(supabase) {
  const { data: customers } = await supabase.from("customers").select("id, email");
  if (!customers?.length) return;

  const emailToId = new Map(
    customers.filter((c) => c.email).map((c) => [String(c.email).toLowerCase().trim(), c.id])
  );

  const { data: rows } = await supabase
    .from("order_history")
    .select("id, customer_email")
    .is("customer_id", null);

  if (!rows?.length) return;

  for (const r of rows) {
    const e = r.customer_email?.toLowerCase().trim();
    if (!e) continue;
    const cid = emailToId.get(e);
    if (!cid) continue;
    await supabase.from("order_history").update({ customer_id: cid }).eq("id", r.id);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const csvPath = args.find((a) => !a.startsWith("--"));

  if (!csvPath || !fs.existsSync(csvPath)) {
    console.error('Usage: node scripts/import-webtoffee-orders-csv.mjs [--dry-run] "C:\\path\\to\\export.csv"');
    process.exit(1);
  }

  const text = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(text);
  const orders = groupWebToffeeOrders(rows);

  console.log(`Parsed ${rows.length} line rows → ${orders.length} orders\n`);

  for (const o of orders) {
    console.log(
      `  #${o.wp_order_id}  ${o.order_date.slice(0, 10)}  R${o.total.toFixed(2)}  ${o.customer_first_name} ${o.customer_last_name}  (${o.items.length} lines, ${o.num_items} qty)`
    );
  }

  if (dryRun) {
    console.log("\nDry run — no database writes.");
    return;
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

  const payload = orders.map((o) => ({
    ...o,
    items: o.items,
  }));

  const { error } = await supabase.from("order_history").upsert(payload, {
    onConflict: "wp_order_id",
  });

  if (error) {
    console.error("\nUpsert failed:", error.message);
    process.exit(1);
  }

  await linkOrderHistoryToCustomers(supabase);

  console.log(`\n✅ Imported/updated ${orders.length} orders in order_history.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
