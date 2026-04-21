export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import OrdersClient from "./OrdersClient";

async function getOrders() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, first_name, last_name, email, total, status, payment_method, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return (
    <AdminShell>
      <OrdersClient orders={orders} />
    </AdminShell>
  );
}
