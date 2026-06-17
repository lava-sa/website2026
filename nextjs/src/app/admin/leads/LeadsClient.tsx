"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search, UserPlus, Mail, MessagesSquare, Users } from "lucide-react";
import type { AdminLead, LeadSource } from "@/lib/admin-leads";

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sourceLabel(s: LeadSource) {
  if (s === "member") return "Member";
  if (s === "newsletter") return "Newsletter";
  return "Janet";
}

function exportCSV(rows: AdminLead[]) {
  const headers = [
    "Email",
    "First name",
    "Last name",
    "Phone",
    "Sources",
    "Member status",
    "Newsletter",
    "Janet chats",
    "Is customer",
    "Last activity",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.email,
        r.first_name ?? "",
        r.last_name ?? "",
        r.phone ?? "",
        r.sources.map(sourceLabel).join("; "),
        r.member_status,
        r.newsletter_opted_in ? "Yes" : "No",
        r.janet_chat_count,
        r.is_customer ? "Yes" : "No",
        r.last_activity_at,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lava-sa-leads.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function LeadsClient({ leads }: { leads: AdminLead[] }) {
  const [search, setSearch] = useState("");
  const [membersOnly, setMembersOnly] = useState(false);
  const [newsletterOnly, setNewsletterOnly] = useState(false);
  const [janetOnly, setJanetOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((r) => {
      if (membersOnly && !r.sources.includes("member")) return false;
      if (newsletterOnly && !r.sources.includes("newsletter")) return false;
      if (janetOnly && !r.sources.includes("janet")) return false;
      if (!q) return true;
      const hay = [
        r.email,
        r.first_name,
        r.last_name,
        r.phone,
        r.newsletter_interest,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [leads, search, membersOnly, newsletterOnly, janetOnly]);

  const memberCount = leads.filter((l) => l.sources.includes("member")).length;
  const newsletterCount = leads.filter((l) => l.sources.includes("newsletter")).length;
  const janetCount = leads.filter((l) => l.sources.includes("janet")).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            People who engaged on the website but have <strong>not purchased</strong> — member signups,
            mailing list, and Janet chats. Anyone in <strong>Customers</strong> (including WooCommerce
            imports) is excluded here.
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportCSV(filtered)}
          className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total contacts", value: leads.length, icon: Users },
          { label: "Member signups", value: memberCount, icon: UserPlus },
          { label: "Newsletter", value: newsletterCount, icon: Mail },
          { label: "Janet enquiries", value: janetCount, icon: MessagesSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wide mb-2">
              <Icon className="h-4 w-4" />
              {label}
            </div>
            <p className="text-2xl font-black text-gray-900 tabular-nums">{value.toLocaleString("en-ZA")}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, name, phone…"
            className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <input type="checkbox" checked={membersOnly} onChange={(e) => setMembersOnly(e.target.checked)} />
          Members
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <input type="checkbox" checked={newsletterOnly} onChange={(e) => setNewsletterOnly(e.target.checked)} />
          Newsletter
        </label>
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <input type="checkbox" checked={janetOnly} onChange={(e) => setJanetOnly(e.target.checked)} />
          Janet
        </label>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Contact", "Sources", "Member", "Newsletter", "Janet", "Last activity"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-bold text-gray-600 text-[10px] uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.email} className="border-b border-gray-100 hover:bg-gray-50/80">
                  <td className="px-4 py-3 align-top">
                    <p className="font-bold text-gray-900">{row.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[row.first_name, row.last_name].filter(Boolean).join(" ") || "—"}
                      {row.phone ? ` · ${row.phone}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-1">
                      {row.sources.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-primary/10 text-primary"
                        >
                          {sourceLabel(s)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-600">
                    {row.member_status === "none" ? (
                      "—"
                    ) : (
                      <>
                        <span className="font-bold text-gray-800">{row.member_status}</span>
                        {row.last_sign_in_at ? (
                          <span className="block text-gray-400 mt-0.5">
                            Last login {fmtDate(row.last_sign_in_at)}
                          </span>
                        ) : null}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-600">
                    {row.sources.includes("newsletter") ? (
                      <>
                        {row.newsletter_opted_in ? "Opted in" : "Unsubscribed"}
                        {row.newsletter_interest ? (
                          <span className="block text-gray-400 mt-0.5">{row.newsletter_interest}</span>
                        ) : null}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-600">
                    {row.janet_chat_count > 0 ? (
                      <>
                        {row.janet_chat_count} chat{row.janet_chat_count !== 1 ? "s" : ""}
                        <Link href="/admin/janet-chats" className="block text-primary font-bold mt-0.5 hover:underline">
                          View chats
                        </Link>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-500 whitespace-nowrap">
                    {fmtDate(row.last_activity_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">No leads match your filters.</div>
        ) : null}
      </div>

      <p className="text-xs text-gray-400">
        Contact form submissions are emailed to info@lava-sa.com and are not stored here yet.
        Member accounts live in Supabase Auth; this page merges them with newsletter and Janet data.
      </p>
    </div>
  );
}
