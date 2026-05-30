import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import type { SiteReviewRoom } from "./types";

export function generateRoomToken(): string {
  return randomBytes(24).toString("base64url");
}

export async function getRoomByToken(token: string): Promise<SiteReviewRoom | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("site_review_rooms")
    .select(
      "id, token, title, host_label, guest_label, status, expires_at, ended_at, recording_url, transcript, ai_summary, action_items, created_at"
    )
    .eq("token", token)
    .maybeSingle();

  if (error || !data) return null;
  const room = data as SiteReviewRoom;
  if (room.expires_at && new Date(room.expires_at) < new Date()) return null;
  return room;
}

export function roomIsJoinable(room: SiteReviewRoom): boolean {
  return room.status === "active";
}

export function siteReviewRoomUrl(token: string, role: "host" | "guest"): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${base}/site-review/${token}?role=${role}`;
}
