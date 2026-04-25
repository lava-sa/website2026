import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Link `order_history.customer_id` from `customers.email` where missing.
 * Batched to avoid per-row round trips.
 */
export async function linkOrderHistoryToCustomers(supabase: SupabaseClient): Promise<void> {
  const { data: customers, error: cErr } = await supabase.from("customers").select("id, email");
  if (cErr || !customers?.length) return;

  const emailToId = new Map(
    customers
      .filter((c) => c.email)
      .map((c) => [String(c.email).toLowerCase().trim(), c.id as string])
  );

  const { data: rows, error: rErr } = await supabase
    .from("order_history")
    .select("id, customer_email")
    .is("customer_id", null);

  if (rErr || !rows?.length) return;

  const byCustomer = new Map<string, string[]>();
  for (const r of rows) {
    const e = r.customer_email?.toLowerCase().trim();
    if (!e) continue;
    const cid = emailToId.get(e);
    if (!cid) continue;
    const list = byCustomer.get(cid) ?? [];
    list.push(r.id as string);
    byCustomer.set(cid, list);
  }

  const CHUNK = 150;
  for (const [customerId, ids] of byCustomer) {
    for (let i = 0; i < ids.length; i += CHUNK) {
      const chunk = ids.slice(i, i + CHUNK);
      await supabase.from("order_history").update({ customer_id: customerId }).in("id", chunk);
    }
  }
}
