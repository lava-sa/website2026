export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderTestToggle from "@/components/admin/OrderTestToggle";

type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string | null;
  is_test?: boolean | null;
  created_at: string;
  trashed_at?: string | null;
  order_items: OrderItem[];
};

function fmtCurrency(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 0 }).format(n);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = createServiceClient();

  let { data, error } = await supabase
    .from("orders")
    .select(`
      id, order_number, first_name, last_name, email, phone, address, city, province, postal_code,
      notes, subtotal, shipping, total, status, payment_method, is_test, created_at, trashed_at,
      order_items(id, product_id, product_name, product_sku, quantity, unit_price, line_total)
    `)
    .eq("id", id)
    .single();

  if (error && (error as { code?: string }).code === "42703") {
    const fallback = await supabase
      .from("orders")
      .select(`
        id, order_number, first_name, last_name, email, phone, address, city, province, postal_code,
        notes, subtotal, shipping, total, status, payment_method, created_at, trashed_at,
        order_items(id, product_id, product_name, product_sku, quantity, unit_price, line_total)
      `)
      .eq("id", id)
      .single();
    data = fallback.data ? { ...fallback.data, is_test: false } : null;
    error = fallback.error;
  }

  if (error || !data) notFound();
  const order = data as unknown as OrderRow;

  const productIds = [...new Set((order.order_items ?? []).map((i) => i.product_id).filter((v): v is string => !!v))];
  const imageByProductId = new Map<string, string>();
  if (productIds.length) {
    const { data: products } = await supabase
      .from("products")
      .select("id, primary_image_url")
      .in("id", productIds);
    for (const product of products ?? []) {
      if (product.primary_image_url) imageByProductId.set(product.id, product.primary_image_url);
    }
  }

  const { data: navRows } = await supabase
    .from("orders")
    .select("id")
    .is("trashed_at", null)
    .order("created_at", { ascending: false })
    .limit(2000);
  const navIds = (navRows ?? []).map((r) => r.id);
  const navIndex = navIds.indexOf(order.id);
  const previousId = navIndex > 0 ? navIds[navIndex - 1] : null;
  const nextId = navIndex >= 0 && navIndex < navIds.length - 1 ? navIds[navIndex + 1] : null;

  return (
    <AdminShell>
      <div className="max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline">← Back to orders</Link>
            <h1 className="text-2xl font-black text-gray-900 mt-1">Order {order.order_number ?? order.id.slice(0, 8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500 mt-1">Placed {fmtDate(order.created_at)}</p>
            {order.trashed_at && <p className="text-xs text-red-600 mt-1">In Trash since {fmtDate(order.trashed_at)}</p>}
          </div>
          <div className="flex items-center gap-2">
            {previousId && <Link href={`/admin/orders/${previousId}`} className="text-xs font-bold px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary">← Previous</Link>}
            {nextId && <Link href={`/admin/orders/${nextId}`} className="text-xs font-bold px-3 py-2 border border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary">Next →</Link>}
            <OrderTestToggle orderId={order.id} initial={Boolean(order.is_test)} />
            <OrderStatusSelect orderId={order.id} current={order.status} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-3">Customer</h2>
            <p className="font-semibold text-gray-900">{order.first_name} {order.last_name}</p>
            <p className="text-sm text-gray-600">{order.email}</p>
            {order.phone && <p className="text-sm text-gray-600">{order.phone}</p>}
            <p className="text-sm text-gray-700 mt-2">
              {[order.address, order.city, order.province, order.postal_code].filter(Boolean).join(", ") || "No address provided"}
            </p>
            {order.notes && <p className="text-sm text-gray-600 mt-2"><span className="font-semibold text-gray-700">Notes:</span> {order.notes}</p>}
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-3">Totals</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold text-gray-900">{fmtCurrency(Number(order.subtotal ?? 0))}</span></p>
              <p className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold text-gray-900">{fmtCurrency(Number(order.shipping ?? 0))}</span></p>
              <p className="flex justify-between border-t border-gray-100 pt-2"><span className="font-bold text-gray-800">Total</span><span className="font-bold text-gray-900">{fmtCurrency(Number(order.total ?? 0))}</span></p>
              <p className="text-xs text-gray-500 pt-1">Payment: {order.payment_method === "bank_transfer" ? "EFT" : "PayFast"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Order Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Product", "SKU", "Qty", "Unit", "Line Total"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-bold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.order_items ?? []).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-900">
                      <div className="flex items-center gap-3">
                        {imageByProductId.get(item.product_id ?? "") ? (
                          <img
                            src={imageByProductId.get(item.product_id ?? "")}
                            alt={item.product_name}
                            className="h-10 w-10 object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-10 w-10 border border-gray-200 bg-gray-50" />
                        )}
                        <span>{item.product_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.product_sku ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-gray-900">{fmtCurrency(Number(item.unit_price ?? 0))}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{fmtCurrency(Number(item.line_total ?? 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
