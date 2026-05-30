export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import { createServiceClient } from "@/lib/supabase";
import SiteReviewAdminClient, { type SiteReviewRoomRow } from "./SiteReviewAdminClient";

async function getRooms(): Promise<SiteReviewRoomRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_review_rooms")
    .select(
      "id, token, title, host_label, guest_label, status, expires_at, ended_at, recording_url, ai_summary, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.error("site_review_rooms:", error.message);
    return [];
  }
  return (data ?? []) as SiteReviewRoomRow[];
}

export default async function AdminSiteReviewPage() {
  const rooms = await getRooms();
  return (
    <AdminShell>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Site review sessions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create a room, copy the guest link for Anneke, and join as host.
          </p>
        </div>
        <SiteReviewAdminClient initialRooms={rooms} />
      </div>
    </AdminShell>
  );
}
