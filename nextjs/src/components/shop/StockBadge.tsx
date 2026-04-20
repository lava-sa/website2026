import type { StockStatus } from "@/types/product";

const CONFIG: Record<StockStatus, { label: string; dot: string; text: string }> = {
  in_stock:     { label: "In Stock",       dot: "bg-emerald-500", text: "text-emerald-700" },
  out_of_stock: { label: "Out of Stock",   dot: "bg-red-500",     text: "text-red-700" },
  on_backorder: { label: "On Backorder",   dot: "bg-amber-500",   text: "text-amber-700" },
  on_order:     { label: "Special Order — Contact us", dot: "bg-primary", text: "text-primary" },
};

export default function StockBadge({ status, quantity }: { status: StockStatus; quantity?: number | null }) {
  const cfg = CONFIG[status] ?? CONFIG.on_order;
  
  let labelText = cfg.label;
  if (status === "in_stock" && quantity != null && quantity > 0) {
    labelText = `${quantity} in stock`;
  }

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-semibold ${cfg.text}`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {labelText}
    </span>
  );
}
