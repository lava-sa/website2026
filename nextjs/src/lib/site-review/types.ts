export type SiteReviewRole = "host" | "guest";
export type SiteReviewRoomStatus = "active" | "ended";

export interface SiteReviewRoom {
  id: string;
  token: string;
  title: string;
  host_label: string;
  guest_label: string;
  status: SiteReviewRoomStatus;
  expires_at: string | null;
  ended_at: string | null;
  recording_url: string | null;
  transcript: string | null;
  ai_summary: string | null;
  action_items: SiteReviewActionItem[];
  created_at: string;
}

export interface SiteReviewActionItem {
  text: string;
  assignee?: string;
  priority?: "low" | "medium" | "high";
  page_path?: string;
}

export interface SiteReviewMessage {
  id: string;
  room_id: string;
  created_at: string;
  sender_name: string;
  sender_role: SiteReviewRole;
  body: string;
}

export interface SiteReviewTask {
  id: string;
  room_id: string;
  created_at: string;
  text: string;
  done: boolean;
  sort_order: number;
  created_by: string | null;
  assignee: string | null;
}

export type SiteReviewSignal =
  | { type: "chat"; message: SiteReviewMessage }
  | { type: "task-upsert"; task: SiteReviewTask }
  | { type: "task-delete"; taskId: string }
  | { type: "navigate"; pathname: string; hostName: string }
  | { type: "presence"; role: SiteReviewRole; name: string; online: boolean }
  | { type: "webrtc"; from: SiteReviewRole; payload: WebRTCSignalPayload };

export type WebRTCSignalPayload =
  | { kind: "offer"; sdp: RTCSessionDescriptionInit }
  | { kind: "answer"; sdp: RTCSessionDescriptionInit }
  | { kind: "ice"; candidate: RTCIceCandidateInit }
  | { kind: "hangup" };

export const SITE_REVIEW_CHANNEL_PREFIX = "site-review";

export const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export function buildIceServers(): RTCIceServer[] {
  const servers = [...DEFAULT_ICE_SERVERS];
  const turnUrl = process.env.NEXT_PUBLIC_TURN_URL?.trim();
  if (turnUrl) {
    servers.push({
      urls: turnUrl,
      ...(process.env.NEXT_PUBLIC_TURN_USERNAME?.trim()
        ? { username: process.env.NEXT_PUBLIC_TURN_USERNAME.trim() }
        : {}),
      ...(process.env.NEXT_PUBLIC_TURN_CREDENTIAL?.trim()
        ? { credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL.trim() }
        : {}),
    });
  }
  return servers;
}
