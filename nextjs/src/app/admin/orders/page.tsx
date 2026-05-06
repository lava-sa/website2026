export const dynamic = "force-dynamic";
import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import OrdersClient from "./OrdersClient";

async function getOrders() {
  const supabase = createServiceClient();
  const withTrashAndTest = await supabase
    .from("orders")
    .select("id, order_number, first_name, last_name, email, total, status, payment_method, notes, is_test, created_at, trashed_at")
    .order("created_at", { ascending: false });

  if (!withTrashAndTest.error) return withTrashAndTest.data ?? [];

  if ((withTrashAndTest.error as { code?: string }).code === "42703") {
    const withTrashOnly = await supabase
      .from("orders")
      .select("id, order_number, first_name, last_name, email, total, status, payment_method, notes, created_at, trashed_at")
      .order("created_at", { ascending: false });
    if (!withTrashOnly.error) return (withTrashOnly.data ?? []).map((row) => ({ ...row, is_test: false }));
  }

  // Backward compatibility for databases that have not run the trash migration yet.
  if ((withTrashAndTest.error as { code?: string }).code === "42703") {
    const fallback = await supabase
      .from("orders")
      .select("id, order_number, first_name, last_name, email, total, status, payment_method, notes, created_at")
      .order("created_at", { ascending: false });
    return (fallback.data ?? []).map((row) => ({ ...row, trashed_at: null, is_test: false }));
  }

  return [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return (
    <AdminShell>
      <OrdersClient orders={orders} />
    </AdminShell>
  );
}
