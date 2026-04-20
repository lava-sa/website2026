"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatNumber } from "@/lib/format";

export interface StatusDataPoint {
  status: string;
  count: number;
  color: string;
}

type TooltipPayload = {
  payload?: StatusDataPoint;
  name?: string;
  value?: number;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  if (!d) return null;
  return (
    <div className="bg-white border border-border shadow-lg px-3 py-2 text-xs">
      <p className="font-black text-primary capitalize">{d.status}</p>
      <p className="text-copy">{formatNumber(d.count)} orders</p>
    </div>
  );
}

export default function OrderStatusDonut({ data }: { data: StatusDataPoint[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);

  if (!total) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-copy-muted">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <div className="w-40 h-40 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-black text-primary leading-none">{formatNumber(total)}</p>
          <p className="text-[10px] uppercase tracking-wider text-copy-muted font-bold mt-0.5">Total</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-1.5">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
            <span className="capitalize font-semibold text-copy flex-1">{d.status}</span>
            <span className="text-copy-muted tabular-nums">{formatNumber(d.count)}</span>
            <span className="text-copy-muted tabular-nums w-10 text-right">
              {total > 0 ? `${Math.round((d.count / total) * 100)}%` : "0%"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
