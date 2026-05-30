"use client";

import { useState } from "react";
import { Copy, Check, Plus, ExternalLink, Loader2 } from "lucide-react";

export type SiteReviewRoomRow = {
  id: string;
  token: string;
  title: string;
  host_label: string;
  guest_label: string;
  status: string;
  expires_at: string | null;
  ended_at: string | null;
  recording_url: string | null;
  ai_summary: string | null;
  created_at: string;
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

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      className="inline-flex items-center gap-1 text-xs font-bold text-primary"
    >
      {ok ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {ok ? "Copied" : label}
    </button>
  );
}

export default function SiteReviewAdminClient({ initialRooms }: { initialRooms: SiteReviewRoomRow[] }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [creating, setCreating] = useState(false);
  const [links, setLinks] = useState<{ hostUrl: string; guestUrl: string; title: string } | null>(null);
  const [form, setForm] = useState({
    title: "LAVA website launch review",
    hostLabel: "Ignatius",
    guestLabel: "Anneke",
    expiresInDays: 14,
  });

  async function createRoom() {
    setCreating(true);
    setLinks(null);
    try {
      const res = await fetch("/api/admin/site-review/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setLinks({ hostUrl: json.hostUrl, guestUrl: json.guestUrl, title: json.room.title });
      setRooms((p) => [json.room, ...p]);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not create room");
    } finally {
      setCreating(false);
    }
  }

  const base = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">
      <div className="bg-white border border-primary/20 border-l-4 border-l-primary p-6 space-y-4 text-sm text-gray-700">
        <h2 className="font-black text-gray-900 text-base">How to run a site review</h2>
        <p className="text-gray-600">
          Use this instead of Teams for launch walkthroughs: same website in the browser, voice, chat,
          tasks, and AI notes — no public footer link; only the links you create below.
        </p>
        <ol className="list-decimal list-inside space-y-3 marker:font-bold marker:text-primary">
          <li>
            <strong className="text-gray-900">Create a room</strong> (form below). You get two links:{" "}
            <strong>Host</strong> (you) and <strong>Guest</strong> (e.g. Anneke). Send only the guest link
            to your client; open the host link yourself.
          </li>
          <li>
            <strong className="text-gray-900">Both join the room.</strong> You see the site in a preview
            panel plus chat and tasks on the right. No shop header, Janet, or cart — distraction-free.
          </li>
          <li>
            <strong className="text-gray-900">Walk the site (host).</strong> Use Go or the preset buttons
            (Home, Products, Contact). The guest can turn on <em>Follow host</em> so their preview stays
            on the same page.
          </li>
          <li>
            <strong className="text-gray-900">Join voice.</strong> Host clicks <em>Join voice</em> first,
            then guest. Allow the microphone when asked. Use <em>Share screen</em> only if you need to show
            something outside the website preview.
          </li>
          <li>
            <strong className="text-gray-900">Chat and tasks.</strong> Type messages or add checklist items
            (e.g. “Update hero headline”). Both sides see updates live; everything is saved in the database.
          </li>
          <li>
            <strong className="text-gray-900">Record (optional).</strong> Tick POPIA consent, then Record /
            Stop. Audio is stored privately in Supabase. You can skip recording if chat and tasks are enough.
          </li>
          <li>
            <strong className="text-gray-900">End session (host only).</strong> Click{" "}
            <em>End session &amp; email notes</em>. The room closes, Gemini writes a summary and action
            items, and an email goes to the admin inbox (if Resend is configured).
          </li>
          <li>
            <strong className="text-gray-900">After the meeting.</strong> Use the summary and the table
            below for your launch to-do list. For another meeting, create a <strong>new room</strong> — ended
            rooms cannot be reused.
          </li>
        </ol>
        <p className="text-xs text-gray-500 border-t border-gray-100 pt-3">
          Tip: If voice fails on some networks, try Chrome or Edge, or add TURN env vars later. Keep Zoom as
          a backup only if needed.
        </p>
      </div>

      <div className="bg-white border border-gray-200 p-6 space-y-4">
        <h2 className="font-black">New review room</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {(
            [
              ["title", "Title", "text"],
              ["hostLabel", "Host name", "text"],
              ["guestLabel", "Guest name", "text"],
              ["expiresInDays", "Expires (days)", "number"],
            ] as const
          ).map(([key, label, type]) => (
            <label key={key} className="text-xs font-bold text-gray-600">
              {label}
              <input
                type={type}
                className="mt-1 w-full border border-gray-200 px-3 py-2 text-sm"
                value={String(form[key])}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    [key]: type === "number" ? Number(e.target.value) || 14 : e.target.value,
                  }))
                }
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void createRoom()}
          disabled={creating}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-bold disabled:opacity-50"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create room
        </button>
        {links && (
          <div className="border-l-4 border-green-600 bg-green-50 p-4 text-sm space-y-2">
            <p className="font-bold text-green-900">{links.title}</p>
            <p>
              Host: <CopyBtn text={links.hostUrl} label="Copy host link" />
            </p>
            <p className="text-xs break-all text-gray-700">{links.hostUrl}</p>
            <p>
              Guest: <CopyBtn text={links.guestUrl} label="Copy guest link" />
            </p>
            <p className="text-xs break-all text-gray-700">{links.guestUrl}</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              {["Created", "Title", "Status", "Open"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rooms.map((r) => {
              const host = `${base}/site-review/${r.token}?role=host`;
              const guest = `${base}/site-review/${r.token}?role=guest`;
              return (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-xs">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3 font-semibold">{r.title}</td>
                  <td className="px-4 py-3 text-xs uppercase">{r.status}</td>
                  <td className="px-4 py-3 space-y-1">
                    <a href={host} target="_blank" rel="noopener noreferrer" className="flex gap-1 text-primary text-xs font-bold">
                      Host <ExternalLink className="h-3 w-3" />
                    </a>
                    <a href={guest} target="_blank" rel="noopener noreferrer" className="flex gap-1 text-primary text-xs font-bold">
                      Guest <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
            {!rooms.length && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No rooms yet — create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
