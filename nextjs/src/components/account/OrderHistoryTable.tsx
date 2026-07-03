"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import {
  type AccountOrderRow,
  getOrderPointsDisplay,
  summarizeItems,
} from "@/lib/account-orders";
import { formatDate, formatZAR } from "@/lib/format";

type Props = {
  orders: AccountOrderRow[];
};

function formatStatusLabel(order: AccountOrderRow): string {
  const isEftOutstanding =
    order.paymentMethod === "bank_transfer" &&
    (order.status === "pending" || order.status === "paid");
  if (isEftOutstanding) return "EFT outstanding";
  return order.status.replace(/^wc-/, "").replace(/-/g, " ");
}

function statusBadgeClass(order: AccountOrderRow): string {
  const isEftOutstanding =
    order.paymentMethod === "bank_transfer" &&
    (order.status === "pending" || order.status === "paid");
  if (
    order.status === "delivered" ||
    order.status === "wc-completed" ||
    order.status === "completed"
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (order.status === "shipped") return "bg-blue-50 text-blue-700 border-blue-200";
  if (order.status === "cancelled" || order.status === "wc-cancelled") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  if (isEftOutstanding) return "bg-amber-50 text-amber-800 border-amber-300";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function OrderLineItems({ order }: { order: AccountOrderRow }) {
  if (order.items.length === 0) {
    return <p className="text-sm text-copy-muted">No line items recorded.</p>;
  }

  return (
    <ul className="space-y-2">
      {order.items.map((item, index) => (
        <li
          key={`${item.name}-${index}`}
          className="flex justify-between gap-4 text-sm border-b border-border/40 pb-2 last:border-0 last:pb-0"
        >
          <span className="text-primary">
            {item.name}
            {item.quantity != null && item.quantity > 1 ? (
              <span className="text-copy-muted"> × {item.quantity}</span>
            ) : null}
          </span>
          {item.lineTotal != null ? (
            <span className="font-semibold text-primary shrink-0">
              {formatZAR(item.lineTotal)}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function ExpandableOrderRow({ order }: { order: AccountOrderRow }) {
  const [open, setOpen] = useState(false);
  const points = getOrderPointsDisplay(order.pointsAwarded, order.date, order.status);
  const itemSummary = summarizeItems(order.items);
  const canExpand = order.items.length > 0;
  const hasDetailPage = Boolean(order.detailHref);

  return (
    <>
      <tr
        className={`border-b border-border/60 ${canExpand || hasDetailPage ? "cursor-pointer hover:bg-surface/40" : ""}`}
        onClick={() => {
          if (canExpand) setOpen((v) => !v);
        }}
      >
        <td className="py-4 pr-4 text-sm text-copy whitespace-nowrap">
          {formatDate(order.date)}
        </td>
        <td className="py-4 px-4 text-sm font-mono text-primary whitespace-nowrap">
          #{order.orderNumber}
        </td>
        <td className="py-4 px-4 text-sm text-primary min-w-[10rem]">
          <div className="flex items-start gap-2">
            {canExpand ? (
              open ? (
                <ChevronDown className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
              ) : (
                <ChevronRight className="h-4 w-4 text-copy-muted shrink-0 mt-0.5" />
              )
            ) : null}
            <span>{itemSummary}</span>
          </div>
        </td>
        <td className={`py-4 px-4 text-sm whitespace-nowrap ${points.muted ? "text-copy-muted" : "text-secondary font-bold"}`}>
          {points.text}
        </td>
        <td className="py-4 px-4 text-sm font-bold text-primary whitespace-nowrap">
          {formatZAR(order.total)}
        </td>
        <td className="py-4 pl-4 text-right whitespace-nowrap">
          {hasDetailPage ? (
            <Link
              href={order.detailHref!}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary transition-colors"
            >
              Details
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            <span
              className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 border ${statusBadgeClass(order)}`}
            >
              {formatStatusLabel(order)}
            </span>
          )}
        </td>
      </tr>
      {open && canExpand ? (
        <tr className="bg-surface/30 border-b border-border/60">
          <td colSpan={6} className="px-4 py-4">
            <div className="pl-6 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-copy-muted mb-3">
                Order items
              </p>
              <OrderLineItems order={order} />
              {hasDetailPage ? (
                <Link
                  href={order.detailHref!}
                  className="inline-block mt-4 text-xs font-bold text-secondary hover:text-primary transition-colors"
                >
                  View tracking &amp; full order →
                </Link>
              ) : null}
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

function MobileOrderCard({ order }: { order: AccountOrderRow }) {
  const [open, setOpen] = useState(false);
  const points = getOrderPointsDisplay(order.pointsAwarded, order.date, order.status);
  const itemSummary = summarizeItems(order.items);

  return (
    <div className="bg-white border border-border p-4">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex justify-between items-start gap-3 mb-2">
          <div>
            <p className="font-mono text-xs text-secondary font-bold">#{order.orderNumber}</p>
            <p className="text-xs text-copy-muted mt-0.5">{formatDate(order.date)}</p>
          </div>
          <p className="font-black text-primary">{formatZAR(order.total)}</p>
        </div>
        <p className="text-sm font-semibold text-primary">{itemSummary}</p>
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className={points.muted ? "text-copy-muted" : "text-secondary font-bold"}>
            {points.text === "—" ? "No points" : `${points.text} pts`}
          </span>
          <span className="text-copy-muted flex items-center gap-1">
            {open ? "Hide items" : "Show items"}
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </span>
        </div>
      </button>

      {open ? (
        <div className="mt-4 pt-4 border-t border-border/60">
          <OrderLineItems order={order} />
          {order.detailHref ? (
            <Link
              href={order.detailHref}
              className="inline-block mt-3 text-xs font-bold text-secondary hover:text-primary transition-colors"
            >
              View tracking &amp; full order →
            </Link>
          ) : (
            <span
              className={`inline-block mt-3 text-[10px] font-bold uppercase px-2 py-0.5 border ${statusBadgeClass(order)}`}
            >
              {formatStatusLabel(order)}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default function OrderHistoryTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-border p-8 text-center">
        <p className="text-copy-muted mb-4">No orders found for this account.</p>
        <Link
          href="/products/vacuum-machines"
          className="inline-block bg-primary text-white font-bold px-6 py-3 text-sm hover:bg-primary/90 transition-colors"
        >
          Shop Vacuum Machines
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block bg-white border border-border overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b-2 border-primary/10 bg-surface/40">
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-copy-muted">
                Date
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-copy-muted">
                Order #
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-copy-muted">
                Item Purchased
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-copy-muted">
                Lava Points
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-copy-muted">
                Amount
              </th>
              <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-copy-muted text-right">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <ExpandableOrderRow key={`${order.source}-${order.id}`} order={order} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <MobileOrderCard key={`${order.source}-${order.id}`} order={order} />
        ))}
      </div>
    </>
  );
}
