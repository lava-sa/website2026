import Link from "next/link";
import { Check, Minus } from "lucide-react";

interface SpecRow {
  label: string;
  values: (string | boolean | null)[];
}

interface ComparisonTableProps {
  title: string;
  subtitle?: string;
  models: {
    name: string;
    slug: string;
    price: string;
    badge?: string;
    badgeColor?: string;
  }[];
  rows: SpecRow[];
}

function Cell({ value }: { value: string | boolean | null }) {
  if (value === true)  return <Check className="h-4 w-4 text-emerald-600 mx-auto" />;
  if (value === false) return <Minus className="h-4 w-4 text-copy-muted mx-auto" />;
  if (value === null)  return <Minus className="h-4 w-4 text-copy-muted mx-auto" />;
  return <span>{value}</span>;
}

export default function ComparisonTable({
  title,
  subtitle,
  models,
  rows,
}: ComparisonTableProps) {
  return (
    <div className="py-16">
      {/* Header */}
      <div className="mb-8">
        <p className="overline mb-2">Side by side</p>
        <h3 className="text-2xl font-bold text-primary">{title}</h3>
        {subtitle && <p className="mt-2 text-copy-muted text-sm">{subtitle}</p>}
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border min-w-[540px]">
          <thead>
            <tr className="bg-primary text-white">
              {/* Empty corner */}
              <th className="py-4 px-5 text-left font-semibold w-44 border-r border-white/10">
                Specification
              </th>
              {models.map((m, i) => (
                <th
                  key={m.slug}
                  className={`py-4 px-5 text-center font-semibold border-r border-white/10 last:border-r-0 ${
                    i === 0 ? "" : ""
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {m.badge && (
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 ${
                          m.badgeColor ?? "bg-secondary text-white"
                        }`}
                      >
                        {m.badge}
                      </span>
                    )}
                    <span className="leading-tight">{m.name}</span>
                    <span className="text-on-dark-muted font-normal text-xs">{m.price}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={row.label}
                className={ri % 2 === 0 ? "bg-surface" : "bg-white"}
              >
                <td className="py-3 px-5 font-semibold text-primary border-r border-border">
                  {row.label}
                </td>
                {row.values.map((val, ci) => (
                  <td
                    key={ci}
                    className="py-3 px-5 text-center text-copy border-r border-border last:border-r-0"
                  >
                    <Cell value={val} />
                  </td>
                ))}
              </tr>
            ))}
            {/* CTA row */}
            <tr className="bg-petrol-50">
              <td className="py-4 px-5 font-semibold text-primary border-r border-border">
                View Machine
              </td>
              {models.map((m) => (
                <td key={m.slug} className="py-4 px-5 text-center border-r border-border last:border-r-0">
                  <Link
                    href={`/products/${m.slug}`}
                    className="inline-block btn-primary text-xs px-5 py-2.5"
                  >
                    View →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
