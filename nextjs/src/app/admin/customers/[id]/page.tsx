export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import { formatZAR, formatDate } from "@/lib/format";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: customer, error } = await supabase.from("customers").select("*").eq("id", id).single();
  if (error || !customer) notFound();

  const email = String(customer.email ?? "");

  type HistRow = {
    id: string;
    wp_order_id: number;
    wp_order_number: string | null;
    total: number | string;
    status: string | null;
    order_date: string;
  };

  const [{ data: shopOrders }, { data: byCust }, { data: byEmail }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, total, status, created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("order_history")
      .select("id, wp_order_id, wp_order_number, total, status, order_date")
      .eq("customer_id", id)
      .order("order_date", { ascending: false })
      .limit(100),
    supabase
      .from("order_history")
      .select("id, wp_order_id, wp_order_number, total, status, order_date")
      .eq("customer_email", email)
      .order("order_date", { ascending: false })
      .limit(100),
  ]);

  const histMap = new Map<string, HistRow>();
  for (const r of [...(byCust ?? []), ...(byEmail ?? [])] as HistRow[]) {
    histMap.set(r.id, r);
  }
  const history = Array.from(histMap.values()).sort(
    (a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
  );

  return (
    <AdminShell>
      <div className="max-w-5xl">
        <div className="mb-6">
          <Link href="/admin/customers" className="text-xs font-bold text-gray-500 hover:text-primary">
            ← Customers
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mt-2">
            {[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "Customer"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">{email}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            ["Total spent", formatZAR(Number(customer.total_spent ?? 0))],
            ["Orders (CRM)", String(customer.order_count ?? "—")],
            ["Points", String(customer.points_balance ?? "—")],
            ["Last order", customer.last_order_date ? formatDate(customer.last_order_date) : "—"],
          ].map(([k, v]) => (
            <div key={k} className="bg-white border border-gray-200 p-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{k}</p>
              <p className="text-lg font-black text-primary mt-1">{v}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-3">Shop orders (this site)</h2>
            {(shopOrders ?? []).length === 0 ? (
              <p className="text-sm text-gray-400">No orders with this email yet.</p>
            ) : (
              <ul className="space-y-2 text-sm max-h-80 overflow-y-auto">
                {shopOrders!.map((o) => (
                  <li key={o.id} className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                    <span className="font-mono text-xs text-primary">{o.order_number}</span>
                    <span className="text-gray-500 text-xs">{formatDate(o.created_at)}</span>
                    <span className="font-bold">{formatZAR(Number(o.total))}</span>
                    <span className="text-[10px] uppercase text-gray-400">{o.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white border border-gray-200 p-5">
            <h2 className="font-bold text-gray-900 text-sm mb-3">Historical orders</h2>
            {history.length === 0 ? (
              <p className="text-sm text-gray-400">No imported history linked to this customer.</p>
            ) : (
              <ul className="space-y-2 text-sm max-h-80 overflow-y-auto">
                {history.slice(0, 50).map((o) => (
                  <li key={o.id} className="flex justify-between gap-2 border-b border-gray-100 pb-2">
                    <span className="font-mono text-xs text-primary">WP {o.wp_order_id}</span>
                    <span className="text-gray-500 text-xs">{formatDate(o.order_date)}</span>
                    <span className="font-bold">{formatZAR(Number(o.total))}</span>
                    <span className="text-[10px] uppercase text-gray-400 truncate">{o.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
