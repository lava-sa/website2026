/**
 * Import WebToffee / WooCommerce order export CSV (one row per line item)
 * into Supabase `order_history` AND `orders` + `order_items`.
 *
 * Usage (from nextjs/):
 *   node scripts/import-webtoffee-orders-csv.mjs "path/to/orders.csv"
 *   node scripts/import-webtoffee-orders-csv.mjs --dry-run "path/to/orders.csv"
 *
 * Idempotent: order_history on wp_order_id; orders on order_number.
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

/** Maps Woo status → live `orders` table status (Admin → Orders) */
function mapLiveOrderStatus(wooStatus) {
  const s = String(wooStatus || "").trim().toLowerCase();
  if (["completed", "processing", "on-hold"].includes(s)) return "paid";
  if (s === "pending") return "pending";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  if (s === "refunded") return "refunded";
  if (s === "failed") return "failed";
  return "paid";
}

function mapPaymentMethod(title) {
  const t = String(title || "").trim().toLowerCase();
  if (t.includes("eft") || t.includes("bank") || t.includes("transfer")) return "bank_transfer";
  return "payfast";
}

function cleanPhone(p) {
  return String(p || "").replace(/^['+\s]+/, "").trim().slice(0, 40) || null;
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

      const wooStatus = row["Order Status"]?.trim() || "processing";
      const email = (row["Email (Billing)"] || "").toLowerCase().trim() || null;

      byOrder.set(orderNum, {
        wp_order_id: orderNum,
        wp_order_number: String(orderNum),
        order_number: String(orderNum),
        customer_email: email,
        customer_first_name: row["First Name (Billing)"]?.trim() || null,
        customer_last_name: row["Last Name (Billing)"]?.trim() || null,
        first_name: row["First Name (Billing)"]?.trim() || "Customer",
        last_name: row["Last Name (Billing)"]?.trim() || "-",
        email: email || "unknown@import.local",
        phone: cleanPhone(row["Phone (Billing)"]),
        address: row["Address 1&2 (Billing)"]?.trim() || null,
        city: row["City (Billing)"]?.trim() || null,
        province: row["State Code (Billing)"]?.trim() || null,
        postal_code: row["Postcode (Billing)"]?.trim() || null,
        notes: row["Customer Note"]?.trim() || null,
        order_date: dateIso,
        woo_status: wooStatus,
        status: normalizeWooStatus(wooStatus),
        live_status: mapLiveOrderStatus(wooStatus),
        payment_method: mapPaymentMethod(row["Payment Method Title"]),
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

async function importLiveOrders(supabase, orders, skuToId) {
  let ok = 0;
  let failed = 0;

  for (const o of orders) {
    const orderPayload = {
      order_number: o.order_number,
      first_name: o.first_name.slice(0, 120),
      last_name: o.last_name.slice(0, 120),
      email: o.email.slice(0, 320),
      phone: o.phone,
      address: o.address,
      city: o.city,
      province: o.province,
      postal_code: o.postal_code,
      notes: o.notes ? o.notes.slice(0, 2000) : null,
      subtotal: o.subtotal,
      shipping: o.shipping_total,
      total: o.total,
      status: o.live_status,
      payment_method: o.payment_method,
      created_at: o.order_date,
      updated_at: o.order_date,
    };

    const itemRows = o.items.map((it) => ({
      product_id: it.sku ? skuToId.get(String(it.sku).trim().toUpperCase()) ?? null : null,
      product_name: it.name.slice(0, 500),
      product_sku: it.sku ? it.sku.slice(0, 120) : null,
      quantity: it.quantity,
      unit_price: it.unit_price,
      line_total: it.line_total,
    }));

    try {
      const { data: existing, error: findErr } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", o.order_number)
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

      if (itemRows.length) {
        const { error: itErr } = await supabase.from("order_items").insert(
          itemRows.map((r) => ({ ...r, order_id: orderId }))
        );
        if (itErr) throw itErr;
      }

      ok++;
    } catch (e) {
      console.error(`  ✗ Order ${o.order_number}:`, e.message ?? e);
      failed++;
    }
  }

  return { ok, failed };
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
      `  #${o.wp_order_id}  ${o.order_date.slice(0, 10)}  R${o.total.toFixed(2)}  ${o.first_name} ${o.last_name}  → ${o.live_status}  (${o.items.length} lines)`
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

  const historyPayload = orders.map((o) => ({
    wp_order_id: o.wp_order_id,
    wp_order_number: o.wp_order_number,
    customer_email: o.customer_email,
    customer_first_name: o.customer_first_name,
    customer_last_name: o.customer_last_name,
    order_date: o.order_date,
    status: o.status,
    num_items: o.num_items,
    subtotal: o.subtotal,
    tax_total: o.tax_total,
    shipping_total: o.shipping_total,
    total: o.total,
    items: o.items,
  }));

  const { error: histErr } = await supabase.from("order_history").upsert(historyPayload, {
    onConflict: "wp_order_id",
  });
  if (histErr) {
    console.error("\norder_history upsert failed:", histErr.message);
    process.exit(1);
  }
  console.log(`\n✅ order_history: ${orders.length} orders`);

  const { data: prods, error: pErr } = await supabase.from("products").select("id, sku");
  if (pErr) {
    console.error("Could not load products:", pErr.message);
    process.exit(1);
  }
  const skuToId = new Map();
  for (const p of prods ?? []) {
    if (p.sku) skuToId.set(String(p.sku).trim().toUpperCase(), p.id);
  }

  const { ok, failed } = await importLiveOrders(supabase, orders, skuToId);
  console.log(`✅ orders (Admin → Orders): ${ok} imported/updated${failed ? `, ${failed} failed` : ""}`);

  await linkOrderHistoryToCustomers(supabase);
  console.log("✅ Linked order_history to customers where emails match.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
