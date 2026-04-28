/**
 * One-off: import WooCommerce order export CSV into Supabase `orders` + `order_items`.
 *
 * Usage (from nextjs/):
 *   node scripts/import-woo-orders-csv.mjs "C:\path\to\order-export.csv"
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Idempotent on order_number: updates order row, replaces line items.
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

function parseMoney(s) {
  const cleaned = String(s).replace(/[^\d.,-]/g, "").replace(",", "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function parseIntSafe(s, fallback) {
  const n = parseInt(String(s).replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseOrderDate(raw) {
  const t = String(raw).trim();
  if (!t) return null;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function mapOrderStatus(wooStatus) {
  const s = String(wooStatus || "")
    .trim()
    .toLowerCase();
  if (["completed", "processing", "on-hold"].includes(s)) return "paid";
  if (s === "pending") return "pending";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "refunded") return "refunded";
  if (s === "failed") return "failed";
  return "paid";
}

function cleanPhone(p) {
  return String(p || "")
    .replace(/^['+\s]+/, "")
    .trim()
    .slice(0, 40);
}

function buildLineItemsFromRow(row) {
  const map = new Map(Object.entries(row).map(([k, v]) => [normHeader(k), String(v ?? "").trim()]));
  const out = [];
  for (let i = 1; i <= 40; i++) {
    const name = map.get(`product item ${i} name`) ?? "";
    if (!name) continue;
    const qtyRaw = map.get(`product item ${i} quantity`) ?? "1";
    const totalRaw =
      map.get(`product item ${i} total`) ?? map.get(`product item ${i} subtotal`) ?? "0";
    const sku = map.get(`product item ${i} sku`) ?? "";
    const quantity = Math.max(1, parseIntSafe(qtyRaw, 1));
    const lineTotal = parseMoney(totalRaw) || 0;
    const unitPrice = quantity > 0 ? Math.round((lineTotal / quantity) * 100) / 100 : lineTotal;
    out.push({ name, sku, quantity, unitPrice, lineTotal });
  }
  return out;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath || !fs.existsSync(csvPath)) {
    console.error('Usage: node scripts/import-woo-orders-csv.mjs "C:\\path\\to\\export.csv"');
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

  const { data: prods, error: pErr } = await supabase.from("products").select("id, sku");
  if (pErr) {
    console.error("Could not load products:", pErr.message);
    process.exit(1);
  }
  const skuToId = new Map();
  for (const p of prods ?? []) {
    if (p.sku) skuToId.set(String(p.sku).trim().toUpperCase(), p.id);
  }

  const text = fs.readFileSync(csvPath, "utf8");
  const { rows } = parseCsv(text);
  console.log(`Parsed ${rows.length} data rows`);

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    const rowNum = idx + 2;

    const orderNumber = pick(row, ["order_number", "Order Number", "wp_order_number"]);
    if (!orderNumber) {
      console.warn(`Row ${rowNum}: skip — no order_number`);
      skipped++;
      continue;
    }

    const email = (
      pick(row, ["billing_email", "Billing Email", "customer_email", "Customer Email"]) || ""
    ).toLowerCase();
    if (!email || !email.includes("@")) {
      console.warn(`Row ${rowNum}: skip order ${orderNumber} — no valid email`);
      skipped++;
      continue;
    }

    const firstName = pick(row, ["billing_first_name", "Billing First Name"]) || "Customer";
    const lastName = pick(row, ["billing_last_name", "Billing Last Name"]) || "-";
    const addr1 = pick(row, ["billing_address_1", "Billing Address 1"]);
    const addr2 = pick(row, ["billing_address_2", "Billing Address 2"]);
    const address = [addr1, addr2].filter(Boolean).join(", ") || null;
    const city = pick(row, ["billing_city", "Billing City"]) || null;
    const province = pick(row, ["billing_state", "Billing State"]) || null;
    const postal = pick(row, ["billing_postcode", "Billing Postcode"]) || null;
    const notes = pick(row, ["customer_note", "Customer Note"]) || null;

    const subtotal = parseMoney(pick(row, ["order_subtotal", "subtotal"]) || "0");
    const shipping = parseMoney(pick(row, ["shipping_total", "Shipping Total"]) || "0");
    const total = parseMoney(pick(row, ["order_total", "total", "Order Total"]) || "");
    if (!Number.isFinite(total)) {
      console.warn(`Row ${rowNum}: skip order ${orderNumber} — invalid total`);
      skipped++;
      continue;
    }

    const sub = Number.isFinite(subtotal) ? subtotal : 0;
    const ship = Number.isFinite(shipping) ? shipping : 0;

    const orderDate =
      parseOrderDate(pick(row, ["order_date", "Order Date"])) || new Date().toISOString();
    const wooStatus = pick(row, ["status", "Order Status"]);
    const status = mapOrderStatus(wooStatus);
    const pfPaymentId = pick(row, ["transaction_id", "Transaction ID"]) || null;

    const orderPayload = {
      order_number: String(orderNumber),
      first_name: firstName.slice(0, 120),
      last_name: lastName.slice(0, 120),
      email: email.slice(0, 320),
      phone: cleanPhone(pick(row, ["billing_phone", "Billing Phone"])) || null,
      address,
      city,
      province,
      postal_code: postal,
      notes: notes ? notes.slice(0, 2000) : null,
      subtotal: sub,
      shipping: ship,
      total,
      status,
      pf_payment_id: pfPaymentId,
      created_at: orderDate,
      updated_at: orderDate,
    };

    const rawItems = buildLineItemsFromRow(row);
    const itemRows = rawItems.map((it) => {
      const pid = it.sku ? skuToId.get(String(it.sku).trim().toUpperCase()) ?? null : null;
      return {
        product_id: pid,
        product_name: it.name.slice(0, 500),
        product_sku: it.sku ? it.sku.slice(0, 120) : null,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        line_total: it.lineTotal,
      };
    });

    try {
      const { data: existing, error: findErr } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderPayload.order_number)
        .maybeSingle();

      if (findErr) throw findErr;

      let orderId;
      if (existing?.id) {
        orderId = existing.id;
        const { error: upErr } = await supabase.from("orders").update(orderPayload).eq("id", orderId);
        if (upErr) throw upErr;
        await supabase.from("order_items").delete().eq("order_id", orderId);
      } else {
        const { data: ins, error: insErr } = await supabase
          .from("orders")
          .insert(orderPayload)
          .select("id")
          .single();
        if (insErr) throw insErr;
        orderId = ins.id;
      }

      if (itemRows.length > 0) {
        const { error: itErr } = await supabase.from("order_items").insert(
          itemRows.map((r) => ({ ...r, order_id: orderId }))
        );
        if (itErr) throw itErr;
      }

      ok++;
      if (ok % 100 === 0) console.log(`  … ${ok} imported`);
    } catch (e) {
      console.error(`Row ${rowNum} order ${orderNumber}:`, e.message ?? e);
      failed++;
    }
  }

  console.log(`Done. Imported/updated: ${ok}, skipped: ${skipped}, failed: ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
