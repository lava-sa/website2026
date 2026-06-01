export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import JanetCallsClient, { type JanetCallRow } from "./JanetCallsClient";

async function getRows(): Promise<JanetCallRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("janet_call_events")
    .select("id, created_at, event_type, caller_number, destination, duration_seconds, notes")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("janet_call_events:", error.message);
    return [];
  }
  return (data ?? []) as JanetCallRow[];
}

export default async function JanetCallsPage() {
  const rows = await getRows();

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Janet calls</h1>
          <p className="text-sm text-gray-500 mt-1">
            Missed calls answered and forwarding events — populated when telephony is wired up (verification / provider
            setup).
          </p>
        </div>
        <JanetCallsClient rows={rows} />
      </div>
    </AdminShell>
  );
}
