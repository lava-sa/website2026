import AdminShell from "@/components/admin/AdminShell";
import { createClient } from "@supabase/supabase-js";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { ShoppingCart } from "lucide-react";

const STATUS_COLOURS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  paid:       "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
  refunded:   "bg-gray-100 text-gray-600",
};

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

async function getOrders() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, first_name, last_name, email, total, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

type Order = {
  id: string;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
  total: number;
  status: string;
  created_at: string;
};

export default async function AdminOrdersPage() {
  const orders = await getOrders() as Order[];

  const totalRevenue = orders
    .filter((o) => !["cancelled", "refunded"].includes(o.status))
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  return (
    <AdminShell>
      <div className="max-w-6xl">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {orders.length} orders · Total revenue: {formatZAR(totalRevenue)}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers start buying.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Order</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Total</th>
                    <th className="text-left px-5 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-bold text-primary">#{o.order_number ?? o.id.slice(0, 8).toUpperCase()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{o.first_name} {o.last_name}</p>
                        <p className="text-xs text-gray-400">{o.email}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs">{formatDate(o.created_at)}</td>
                      <td className="px-5 py-4 font-bold text-gray-900">{formatZAR(o.total)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 self-start ${STATUS_COLOURS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {o.status}
                          </span>
                          <OrderStatusSelect orderId={o.id} current={o.status} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </AdminShell>
  );
}
