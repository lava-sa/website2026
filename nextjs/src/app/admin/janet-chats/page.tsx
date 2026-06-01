export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import JanetChatsClient, { type JanetChatRow } from "./JanetChatsClient";

async function getRows(): Promise<JanetChatRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("janet_support_chats")
    .select(
      "id, created_at, session_id, page_url, source, first_name, last_name, phone, email, industry, transcript, action_taken"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    console.error("janet_support_chats:", error.message);
    return [];
  }
  return (data ?? []) as JanetChatRow[];
}

export default async function JanetChatsPage() {
  const rows = await getRows();

  return (
    <AdminShell>
      <div className="max-w-[100rem]">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Janet support chats</h1>
          <p className="text-sm text-gray-500 mt-1">
            Voice session transcripts (and future text chat) with fields for contact details and follow-up actions.
          </p>
        </div>
        <JanetChatsClient rows={rows} />
      </div>
    </AdminShell>
  );
}
