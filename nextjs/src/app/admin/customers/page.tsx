export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import CustomersClient from "./CustomersClient";

async function getCustomers() {
  const supabase = createServiceClient();

  // Try the customers table first (migrated WooCommerce data)
  const { data: customers, error } = await supabase
    .from("customers")
    .select(`
      id, email, first_name, last_name, phone,
      billing_city, billing_state,
      total_spent, order_count, points_balance,
      is_vip, marketing_opt_in, registered_at, last_order_date
    `)
    .order("total_spent", { ascending: false });

  if (error || !customers || customers.length === 0) {
    // Fall back: derive unique customers from orders table
    const { data: orders } = await supabase
      .from("orders")
      .select("email, first_name, last_name, phone, city, province, total, created_at")
      .order("created_at", { ascending: false });

    if (!orders) return [];

    // Deduplicate by email, aggregate totals
    const map = new Map<string, {
      email: string; first_name: string; last_name: string;
      phone: string | null; city: string | null; province: string | null;
      total_spent: number; order_count: number; last_order_date: string;
    }>();

    for (const o of orders) {
      if (!o.email) continue;
      const key = o.email.toLowerCase();
      if (map.has(key)) {
        const ex = map.get(key)!;
        ex.total_spent   += o.total ?? 0;
        ex.order_count   += 1;
      } else {
        map.set(key, {
          email:           o.email,
          first_name:      o.first_name ?? "",
          last_name:       o.last_name  ?? "",
          phone:           o.phone      ?? null,
          city:            o.city       ?? null,
          province:        o.province   ?? null,
          total_spent:     o.total      ?? 0,
          order_count:     1,
          last_order_date: o.created_at,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.total_spent - a.total_spent);
  }

  return customers;
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <AdminShell>
      <CustomersClient customers={customers} />
    </AdminShell>
  );
}
