"use client";

export type JanetCallRow = {
  id: string;
  created_at: string;
  event_type: string;
  caller_number: string | null;
  destination: string | null;
  duration_seconds: number | null;
  notes: string | null;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function typeLabel(t: string) {
  if (t === "missed_answered") return "Missed (answered)";
  if (t === "forwarding") return "Forwarding";
  return t;
}

export default function JanetCallsClient({ rows }: { rows: JanetCallRow[] }) {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <p className="font-bold">Telephony integration pending</p>
        <p className="text-xs mt-1 text-amber-800">
          Once call forwarding / missed-call webhooks are connected, events will list here. Use this table for tests and
          manual entries via Supabase or a future API.
        </p>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Date", "Type", "Caller", "Destination", "Duration", "Notes"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 text-gray-800">
                      {typeLabel(r.event_type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{r.caller_number ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{r.destination ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {r.duration_seconds != null ? `${r.duration_seconds}s` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700 max-w-md">{r.notes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">
            No call events yet. Run migration <code className="text-xs bg-gray-100 px-1">016_janet_admin_tables.sql</code>{" "}
            and connect your telephony provider when ready.
          </div>
        )}
      </div>
    </div>
  );
}
