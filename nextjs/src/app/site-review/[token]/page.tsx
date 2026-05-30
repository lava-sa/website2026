import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteReviewRoom from "@/components/site-review/SiteReviewRoom";
import { getRoomByToken } from "@/lib/site-review/room-access";
import { createServiceClient } from "@/lib/supabase";
import type { SiteReviewMessage, SiteReviewRole, SiteReviewTask } from "@/lib/site-review/types";

export const metadata: Metadata = {
  title: "Site review session",
  robots: { index: false, follow: false },
};

export default async function SiteReviewTokenPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { token } = await params;
  const { role: roleParam } = await searchParams;
  const role: SiteReviewRole = roleParam === "host" ? "host" : "guest";

  const room = await getRoomByToken(token);
  if (!room) notFound();

  const supabase = createServiceClient();
  const [messagesRes, tasksRes] = await Promise.all([
    supabase.from("site_review_messages").select("*").eq("room_id", room.id).order("created_at"),
    supabase.from("site_review_tasks").select("*").eq("room_id", room.id).order("sort_order"),
  ]);

  return (
    <SiteReviewRoom
      token={token}
      role={role}
      initialRoom={room}
      initialMessages={(messagesRes.data ?? []) as SiteReviewMessage[]}
      initialTasks={(tasksRes.data ?? []) as SiteReviewTask[]}
      joinable={room.status === "active"}
    />
  );
}
