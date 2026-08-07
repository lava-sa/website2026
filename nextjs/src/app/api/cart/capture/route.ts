export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getProductsByIds, resolveProductUnitPrice } from "@/lib/products";
import { parseFunnelCartItemId } from "@/lib/funnel";

/**
 * Records a checkout basket against an email so it can be recovered if the
 * customer leaves without paying.
 *
 * Called from the checkout page once the customer has entered a valid email —
 * that is the point at which they have shown clear intent to buy from us,
 * which is also what makes a later reminder defensible rather than unsolicited.
 *
 * Anti-abuse: the basket must consist of real published products (so this
 * cannot be used as a free "email anyone" endpoint without effort), a silent
 * honeypot field is honoured, and one row per email means at most one reminder
 * per person regardless of how often this is called.
 */

const MAX_ITEMS = 40;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

/** Migration 034 not run yet — PostgREST says "schema cache", Postgres says 42P01. */
export function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /schema cache|does not exist/i.test(error.message ?? "")
  );
}

export async function POST(req: NextRequest) {
  let body: {
    email?: string;
    first_name?: string;
    phone?: string;
    items?: { id?: string; name?: string; quantity?: number }[];
    website?: string; // honeypot
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — a bot filled a field no human can see. Look successful, do nothing.
  if (body.website && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items.slice(0, MAX_ITEMS) : [];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // ── Verify the basket against the real catalogue ─────────────────────────
  // Prices here are for the reminder's display only; checkout re-validates
  // everything. But requiring real product ids keeps this from being a
  // general-purpose mailing endpoint.
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const lookupIds = [
    ...new Set(
      rawItems
        .map((i) => String(i.id ?? ""))
        .filter(Boolean)
        .map((id) => parseFunnelCartItemId(id)?.baseProductId ?? id)
        .filter((id) => UUID.test(id)) // junk never reaches the database
    ),
  ];

  if (lookupIds.length === 0) {
    return NextResponse.json({ error: "No recognised products in cart" }, { status: 400 });
  }

  let rows;
  try {
    rows = await getProductsByIds(lookupIds);
  } catch (err) {
    console.error("Cart capture product lookup failed:", err);
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ error: "No recognised products in cart" }, { status: 400 });
  }

  const byId = new Map(rows.map((r) => [r.id, r]));
  const items: { id: string; name: string; quantity: number; price: number }[] = [];
  let subtotal = 0;
  let itemCount = 0;

  for (const raw of rawItems) {
    const id = parseFunnelCartItemId(String(raw.id ?? ""))?.baseProductId ?? String(raw.id ?? "");
    const row = byId.get(id);
    if (!row) continue;

    const quantity = Math.min(Math.max(Number(raw.quantity ?? 1) || 1, 1), 99);
    const price = resolveProductUnitPrice(row);

    items.push({ id: row.id, name: row.name, quantity, price });
    subtotal += price * quantity;
    itemCount += quantity;
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "No recognised products in cart" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // Upsert on email. If this person was already reminded, the reminder flag is
  // left as-is on purpose — refreshing a basket must not earn a second email.
  const { error } = await supabase
    .from("abandoned_carts")
    .upsert(
      {
        email,
        first_name: String(body.first_name ?? "").trim() || null,
        phone: String(body.phone ?? "").trim() || null,
        items,
        item_count: itemCount,
        subtotal,
        last_activity_at: now,
        updated_at: now,
      },
      { onConflict: "email" }
    );

  if (error) {
    // PostgREST reports a missing table via its schema cache, not Postgres 42P01.
    if (isMissingTable(error)) {
      console.warn("abandoned_carts table missing — run supabase/034_abandoned_carts.sql");
    } else {
      console.error("Cart capture failed:", error.message);
    }
    // Never surface this to the customer: capture is a background nicety and
    // must not interfere with someone trying to check out.
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}
