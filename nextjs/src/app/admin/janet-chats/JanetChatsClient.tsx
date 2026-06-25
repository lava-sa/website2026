"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type JanetChatRow = {
  id: string;
  created_at: string;
  session_id: string | null;
  page_url: string | null;
  source: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  industry: string | null;
  transcript: string | null;
  action_taken: string | null;
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

export default function JanetChatsClient({ rows }: { rows: JanetChatRow[] }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function patch(id: string, payload: Record<string, string>) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/janet-chats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  const inputCls =
    "w-full min-w-[7rem] border border-gray-200 bg-white px-2 py-1.5 text-xs focus:outline-none focus:border-primary";

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "Date",
                "Source",
                "First name",
                "Last name",
                "Phone",
                "Company / use",
                "Transcript",
                "Action taken",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-3 font-bold text-gray-600 text-[10px] uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.id} className="align-top hover:bg-gray-50">
                <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                <td className="px-3 py-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-primary/10 text-primary">
                    {r.source || "—"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <input
                    defaultValue={r.first_name ?? ""}
                    className={inputCls}
                    disabled={savingId === r.id}
                    onBlur={(e) => {
                      if (e.target.value !== (r.first_name ?? ""))
                        void patch(r.id, { first_name: e.target.value });
                    }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    defaultValue={r.last_name ?? ""}
                    className={inputCls}
                    disabled={savingId === r.id}
                    onBlur={(e) => {
                      if (e.target.value !== (r.last_name ?? ""))
                        void patch(r.id, { last_name: e.target.value });
                    }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    defaultValue={r.phone ?? ""}
                    className={inputCls}
                    disabled={savingId === r.id}
                    onBlur={(e) => {
                      if (e.target.value !== (r.phone ?? ""))
                        void patch(r.id, { phone: e.target.value });
                    }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    defaultValue={r.industry ?? ""}
                    className={`${inputCls} min-w-[10rem]`}
                    placeholder="e.g. Sunrise Butchery — hunting"
                    disabled={savingId === r.id}
                    onBlur={(e) => {
                      if (e.target.value !== (r.industry ?? ""))
                        void patch(r.id, { industry: e.target.value });
                    }}
                  />
                </td>
                <td className="px-3 py-2 max-w-xs">
                  <pre className="text-[11px] text-gray-700 whitespace-pre-wrap break-words font-sans max-h-40 overflow-y-auto border border-gray-100 p-2 bg-gray-50">
                    {r.transcript || "—"}
                  </pre>
                  {r.page_url && (
                    <p className="text-[10px] text-gray-400 mt-1 truncate" title={r.page_url}>
                      Page: {r.page_url}
                    </p>
                  )}
                </td>
                <td className="px-3 py-2 min-w-[12rem]">
                  <textarea
                    defaultValue={r.action_taken ?? ""}
                    rows={3}
                    className={`${inputCls} resize-y min-h-[4rem]`}
                    placeholder="e.g. LAVA V.300 White purchased — or message Anneke to follow up"
                    disabled={savingId === r.id}
                    onBlur={(e) => {
                      if (e.target.value !== (r.action_taken ?? ""))
                        void patch(r.id, { action_taken: e.target.value });
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div className="px-4 py-12 text-center text-gray-400 text-sm">
          No Janet chats yet. After a visitor finishes a voice session, transcripts appear here (run migration{" "}
          <code className="text-xs bg-gray-100 px-1">016_janet_admin_tables.sql</code> in Supabase).
        </div>
      )}
    </div>
  );
}
