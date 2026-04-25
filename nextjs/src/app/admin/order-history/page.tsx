export const dynamic = "force-dynamic";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import { formatZAR, formatDate } from "@/lib/format";

type Row = {
  id: string;
  wp_order_id: number;
  wp_order_number: string | null;
  customer_email: string | null;
  order_date: string;
  status: string | null;
  total: number | string;
  num_items: number | null;
};

async function getRows(): Promise<Row[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("order_history")
    .select("id, wp_order_id, wp_order_number, customer_email, order_date, status, total, num_items")
    .order("order_date", { ascending: false })
    .limit(500);

  if (error) return [];
  return (data ?? []) as Row[];
}

function toNum(v: number | string) {
  return typeof v === "number" ? v : parseFloat(String(v)) || 0;
}

export default async function OrderHistoryAdminPage() {
  const rows = await getRows();

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Order history</h1>
            <p className="text-sm text-gray-500 mt-1">
              Imported / migrated historical orders (last 500 shown).{" "}
              <Link href="/admin/import" className="text-primary font-bold hover:underline">
                Import CSV
              </Link>
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-gray-600 border border-gray-200 px-4 py-2 hover:border-primary"
          >
            Current shop orders →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {["WP ID", "Order #", "Date", "Email", "Items", "Total", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{r.wp_order_id}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{r.wp_order_number ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{formatDate(r.order_date)}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[200px]">{r.customer_email ?? "—"}</td>
                    <td className="px-4 py-3 text-xs tabular-nums">{r.num_items ?? "—"}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 tabular-nums">{formatZAR(toNum(r.total))}</td>
                    <td className="px-4 py-3 text-[10px] font-bold uppercase text-gray-500">{r.status ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <div className="px-4 py-12 text-center text-gray-400 text-sm">
              No historical rows yet. Use Import order history to load CSV exports.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
