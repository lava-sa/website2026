export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { createServiceClient } from "@/lib/supabase";
import { getEftBankDetails } from "@/lib/bank-details";
import OrderStatusTimeline from "@/components/account/OrderStatusTimeline";
import { buildOrderTimeline, formatOrderStatusLabel } from "@/lib/order-status";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    robots: { index: false, follow: false },
  };
}

export default async function AccountOrderDetailPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect(`/account/login?from=/account/orders/${encodeURIComponent(orderNumber)}`);

  const service = createServiceClient();
  const { data: order } = await service
    .from("orders")
    .select(
      `
      id,
      order_number,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      province,
      postal_code,
      notes,
      subtotal,
      shipping,
      total,
      status,
      payment_method,
      created_at,
      order_items (
        product_name,
        product_sku,
        quantity,
        unit_price,
        line_total
      )
    `
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (!order || order.email.toLowerCase() !== user.email.toLowerCase()) {
    notFound();
  }

  const timeline = buildOrderTimeline(order.status, order.payment_method);
  const bank = getEftBankDetails();
  const showEft =
    order.payment_method === "bank_transfer" &&
    (order.status === "pending" || order.status === "paid");

  return (
    <main className="min-h-screen bg-surface/30 py-10">
      <div className="section-container max-w-4xl">
        <Link
          href="/account/profile"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>

        <div className="bg-white border border-border p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-secondary mb-2">
                Order tracking
              </p>
              <h1 className="font-heading text-3xl font-bold text-primary">
                {order.order_number}
              </h1>
              <p className="text-sm text-copy-muted mt-2">
                Placed{" "}
                {new Date(order.created_at).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span className="inline-block self-start text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border bg-amber-50 text-amber-800 border-amber-200">
              {formatOrderStatusLabel(order.status)}
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-heading text-xl font-bold text-primary mb-4">Shipping progress</h2>
              <OrderStatusTimeline steps={timeline} />
              <p className="text-xs text-copy-muted mt-4">
                Courier tracking links will appear here once your parcel is dispatched.
              </p>
            </div>

            <div className="space-y-6">
              {showEft && (
                <div className="border-2 border-secondary/30 bg-secondary/5 p-5">
                  <h3 className="font-bold text-primary mb-3">EFT payment still required</h3>
                  <dl className="text-sm space-y-2">
                    <div className="flex justify-between gap-4">
                      <dt className="text-copy-muted">Bank</dt>
                      <dd className="font-semibold text-primary">{bank.bank}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-copy-muted">Account</dt>
                      <dd className="font-semibold text-primary">{bank.accountNo}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-copy-muted">Reference</dt>
                      <dd className="font-bold text-secondary">{order.order_number}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-copy-muted">Amount</dt>
                      <dd className="font-bold text-primary">
                        R{Number(order.total).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="border border-border p-5">
                <h3 className="font-bold text-primary mb-3">Delivery address</h3>
                <p className="text-sm text-copy leading-relaxed">
                  {[order.first_name, order.last_name].filter(Boolean).join(" ")}
                  <br />
                  {order.address}
                  <br />
                  {[order.city, order.province].filter(Boolean).join(", ")}
                  <br />
                  {order.postal_code}
                </p>
                {order.notes && (
                  <p className="text-sm text-copy-muted mt-3 pt-3 border-t border-border">
                    <strong>Notes:</strong> {order.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <Package className="h-5 w-5 text-secondary" />
            <h2 className="font-heading text-xl font-bold text-primary">Order items</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 font-bold text-copy-muted">Product</th>
                  <th className="py-3 px-4 font-bold text-copy-muted">Qty</th>
                  <th className="py-3 pl-4 font-bold text-copy-muted text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.order_items ?? []).map((item) => (
                  <tr key={`${item.product_sku}-${item.product_name}`} className="border-b border-border/60">
                    <td className="py-4 pr-4 text-primary font-medium">{item.product_name}</td>
                    <td className="py-4 px-4 text-copy-muted">{item.quantity}</td>
                    <td className="py-4 pl-4 text-right font-bold text-primary">
                      R{Number(item.line_total).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="pt-4 text-copy-muted">
                    Subtotal
                  </td>
                  <td className="pt-4 text-right text-primary">
                    R{Number(order.subtotal).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-2 text-copy-muted">
                    Delivery
                  </td>
                  <td className="py-2 text-right text-primary">
                    R{Number(order.shipping).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="pt-2 font-bold text-primary">
                    Order total
                  </td>
                  <td className="pt-2 text-right text-xl font-black text-primary">
                    R{Number(order.total).toLocaleString("en-ZA", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
