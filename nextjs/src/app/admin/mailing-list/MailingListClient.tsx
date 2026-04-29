"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Download, Mail, RotateCcw, Search, Send, UserMinus, Users } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  source: string | null;
  interest_category: string | null;
  machine_industry: string | null;
  opted_in: boolean;
  opted_in_at: string;
  unsubscribed_at: string | null;
  created_at: string;
}

interface Broadcast {
  id: string;
  name: string;
  segment_type: "opted_in" | "purchasers" | "region";
  region: string | null;
  template_key: string;
  subject: string;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  scheduled_for: string | null;
  sent_at: string | null;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

interface Template {
  key: string;
  name: string;
  subject: string;
  html_body: string;
}

function fmtDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

function exportCsv(rows: Subscriber[], filename: string) {
  const headers = ["Email", "First Name", "Source", "Interest Category", "Machine Industry", "Opted In", "Opted In At", "Unsubscribed At", "Created At"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.email,
        r.first_name ?? "",
        r.source ?? "",
        r.interest_category ?? "",
        r.machine_industry ?? "",
        r.opted_in ? "Yes" : "No",
        r.opted_in_at ?? "",
        r.unsubscribed_at ?? "",
        r.created_at ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MailingListClient({
  subscribers,
  broadcasts,
  templates,
}: {
  subscribers: Subscriber[];
  broadcasts: Broadcast[];
  templates: Template[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "unsubscribed">("active");
  const [source, setSource] = useState("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [templateKey, setTemplateKey] = useState(templates[0]?.key ?? "product-news");
  const [campaignName, setCampaignName] = useState("");
  const [segmentType, setSegmentType] = useState<"opted_in" | "purchasers" | "region">("opted_in");
  const [region, setRegion] = useState("");
  const [subject, setSubject] = useState(templates[0]?.subject ?? "");
  const [htmlBody, setHtmlBody] = useState(templates[0]?.html_body ?? "");
  const [scheduledFor, setScheduledFor] = useState("");
  const [broadcastPending, setBroadcastPending] = useState<"draft" | "schedule" | "now" | null>(null);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [resendPending, setResendPending] = useState<string | null>(null);

  async function setOptedIn(subscriberId: string, optedIn: boolean) {
    setActionError(null);
    setPendingId(subscriberId);
    try {
      const res = await fetch(`/api/admin/mailing-list/${subscriberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opted_in: optedIn }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setActionError(data.error ?? "Update failed");
        return;
      }
      router.refresh();
    } catch {
      setActionError("Network error");
    } finally {
      setPendingId(null);
    }
  }

  const sources = useMemo(
    () => Array.from(new Set(subscribers.map((s) => s.source || "unknown"))).sort(),
    [subscribers]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (status === "active" && !s.opted_in) return false;
      if (status === "unsubscribed" && s.opted_in) return false;
      if (source !== "all" && (s.source || "unknown") !== source) return false;
      if (!q) return true;
      return (
        s.email.toLowerCase().includes(q) ||
        (s.first_name ?? "").toLowerCase().includes(q) ||
        (s.source ?? "").toLowerCase().includes(q)
      );
    });
  }, [search, status, source, subscribers]);

  const activeCount = subscribers.filter((s) => s.opted_in).length;
  const unsubCount = subscribers.length - activeCount;
  const templateMap = useMemo(() => new Map(templates.map((t) => [t.key, t])), [templates]);

  function onTemplateChange(nextKey: string) {
    setTemplateKey(nextKey);
    const template = templateMap.get(nextKey);
    if (!template) return;
    setSubject(template.subject);
    setHtmlBody(template.html_body);
  }

  async function createBroadcast(mode: "draft" | "schedule" | "now") {
    setBroadcastError(null);
    setBroadcastPending(mode);
    try {
      const payload = {
        name: campaignName.trim(),
        segment_type: segmentType,
        region: segmentType === "region" ? region.trim() : null,
        template_key: templateKey,
        subject: subject.trim(),
        html_body: htmlBody.trim(),
        send_mode: mode,
        scheduled_for: mode === "schedule" && scheduledFor ? new Date(scheduledFor).toISOString() : null,
      };

      const res = await fetch("/api/admin/mailing-list/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setBroadcastError(data.error ?? "Could not create broadcast");
        return;
      }
      router.refresh();
    } catch {
      setBroadcastError("Network error while creating broadcast");
    } finally {
      setBroadcastPending(null);
    }
  }

  async function resendBroadcast(id: string) {
    setBroadcastError(null);
    setResendPending(id);
    try {
      const res = await fetch(`/api/admin/mailing-list/broadcasts/${id}/send`, { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setBroadcastError(data.error ?? "Could not send broadcast");
        return;
      }
      router.refresh();
    } catch {
      setBroadcastError("Network error while sending broadcast");
    } finally {
      setResendPending(null);
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mailing List</h1>
          <p className="text-sm text-gray-500 mt-1">
            {subscribers.length.toLocaleString("en-ZA")} total contacts
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => exportCsv(filtered, "lava-sa-mailing-list-filtered.csv")}
            className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-xs font-bold px-4 py-2.5 hover:border-primary hover:text-primary transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export filtered ({filtered.length})
          </button>
          <button
            onClick={() => exportCsv(subscribers.filter((s) => s.opted_in), "lava-sa-mailing-list-active.csv")}
            className="inline-flex items-center gap-2 bg-secondary text-white text-xs font-bold px-4 py-2.5 hover:bg-secondary/90 transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Export active ({activeCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total contacts", value: subscribers.length, icon: Users, color: "text-primary" },
          { label: "Active", value: activeCount, icon: Mail, color: "text-emerald-600" },
          { label: "Unsubscribed", value: unsubCount, icon: Mail, color: "text-gray-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${color}`} />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
            </div>
            <p className={`text-xl font-black ${color}`}>{value.toLocaleString("en-ZA")}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, name, source..."
            className="w-full border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | "active" | "unsubscribed")}
          className="border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        >
          <option value="all">All statuses</option>
          <option value="active">Active only</option>
          <option value="unsubscribed">Unsubscribed only</option>
        </select>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
        >
          <option value="all">All sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <span className="text-xs text-gray-400">{filtered.length} shown</span>
      </div>

      {actionError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2">{actionError}</div>
      )}

      <div className="bg-white border border-gray-200 p-4 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="text-lg font-black text-gray-900">Mini CRM Broadcasts</h2>
            <p className="text-xs text-gray-500 mt-1">
              Use segments and templates to send POPIA-compliant marketing emails with unsubscribe links.
            </p>
          </div>
        </div>

        {broadcastError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-2">{broadcastError}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Broadcast name (e.g. April offer)"
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <select
            value={templateKey}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            {templates.map((t) => (
              <option key={t.key} value={t.key}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <select
            value={segmentType}
            onChange={(e) => setSegmentType(e.target.value as "opted_in" | "purchasers" | "region")}
            className="border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary"
          >
            <option value="opted_in">Segment: Opted-in (all leads)</option>
            <option value="purchasers">Segment: Purchasers</option>
            <option value="region">Segment: Region</option>
          </select>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Region (required for region segment)"
            disabled={segmentType !== "region"}
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:bg-gray-100"
          />
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            className="border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject"
          className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-primary mb-3"
        />
        <textarea
          value={htmlBody}
          onChange={(e) => setHtmlBody(e.target.value)}
          rows={8}
          className="w-full border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary"
          placeholder="<p>Hi {{first_name}}, ...</p>"
        />
        <p className="text-[11px] text-gray-500 mt-2">
          Use <code>{"{{first_name}}"}</code> in templates. Every marketing email automatically includes POPIA notice and unsubscribe link.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="button"
            disabled={broadcastPending !== null}
            onClick={() => void createBroadcast("draft")}
            className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-700 text-xs font-bold px-4 py-2.5 hover:border-primary hover:text-primary disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={broadcastPending !== null}
            onClick={() => void createBroadcast("schedule")}
            className="inline-flex items-center gap-2 border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold px-4 py-2.5 disabled:opacity-50"
          >
            <CalendarClock className="h-3.5 w-3.5" />
            Schedule
          </button>
          <button
            type="button"
            disabled={broadcastPending !== null}
            onClick={() => void createBroadcast("now")}
            className="inline-flex items-center gap-2 bg-secondary text-white text-xs font-bold px-4 py-2.5 hover:bg-secondary/90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            Send now
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden mb-6">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-wide text-gray-700">Recent Broadcasts</h3>
          <span className="text-xs text-gray-500">{broadcasts.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Name", "Segment", "Status", "Recipients", "Schedule/Sent", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {broadcasts.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.subject}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {b.segment_type}
                    {b.region ? ` (${b.region})` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 text-gray-700">{b.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {b.recipient_count || 0} / sent {b.sent_count || 0} / failed {b.failed_count || 0}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {b.sent_at ? `Sent ${fmtDate(b.sent_at)}` : b.scheduled_for ? `Scheduled ${fmtDate(b.scheduled_for)}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {(b.status === "draft" || b.status === "failed" || b.status === "scheduled") && (
                      <button
                        type="button"
                        disabled={resendPending === b.id}
                        onClick={() => void resendBroadcast(b.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase border border-secondary/40 text-secondary px-2 py-1 hover:bg-secondary/10 disabled:opacity-50"
                      >
                        <Send className="h-3 w-3" />
                        Send
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {broadcasts.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">No broadcasts yet.</div>
        )}
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Email", "First Name", "Source", "Interest", "Industry", "Status", "Subscribed", "Unsubscribed", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, 500).map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{s.email}</td>
                  <td className="px-4 py-3 text-gray-700">{s.first_name ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.source ?? "unknown"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.interest_category ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.machine_industry ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 ${s.opted_in ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {s.opted_in ? "active" : "unsubscribed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(s.opted_in_at)}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(s.unsubscribed_at)}</td>
                  <td className="px-4 py-3">
                    {s.opted_in ? (
                      <button
                        type="button"
                        disabled={pendingId === s.id}
                        onClick={() => void setOptedIn(s.id, false)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase border border-gray-300 text-gray-600 px-2 py-1 hover:border-red-300 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
                      >
                        <UserMinus className="h-3 w-3" />
                        Unsubscribe
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={pendingId === s.id}
                        onClick={() => void setOptedIn(s.id, true)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase border border-emerald-300 text-emerald-700 px-2 py-1 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Re-subscribe
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 500 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
            Showing first 500 of {filtered.length}. Use export for full list.
          </div>
        )}
        {filtered.length === 0 && (
          <div className="px-4 py-12 text-center text-gray-400 text-sm">No mailing list entries match your filters.</div>
        )}
      </div>
    </div>
  );
}

