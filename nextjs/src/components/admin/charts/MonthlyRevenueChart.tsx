"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatZAR, formatZARCompact } from "@/lib/format";

export interface MonthlyDataPoint {
  month: string;       // e.g. "Jan" or "Jan 26"
  revenue: number;     // ZAR
  orders: number;
}

type TooltipPayload = {
  payload?: MonthlyDataPoint;
  value?: number;
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  if (!data) return null;
  return (
    <div className="bg-white border border-border shadow-lg px-4 py-3 text-xs">
      <p className="font-black text-primary mb-1">{label}</p>
      <p className="text-copy font-semibold">{formatZAR(data.revenue)}</p>
      <p className="text-copy-muted">{data.orders} orders</p>
    </div>
  );
}

export default function MonthlyRevenueChart({ data }: { data: MonthlyDataPoint[] }) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-copy-muted">
        No revenue data available yet.
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 600 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatZARCompact}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.revenue === maxRevenue ? "#0d3b47" : "#2d6b7a"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
