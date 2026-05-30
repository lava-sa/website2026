"use client";

import { useCallback, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  SITE_REVIEW_CHANNEL_PREFIX,
  type SiteReviewMessage,
  type SiteReviewSignal,
  type SiteReviewTask,
  type SiteReviewRole,
  type WebRTCSignalPayload,
} from "@/lib/site-review/types";

export function useSiteReviewChannel(
  token: string,
  role: SiteReviewRole,
  displayName: string,
  onSignal: (signal: SiteReviewSignal) => void
) {
  const onSignalRef = useRef(onSignal);
  onSignalRef.current = onSignal;
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  const broadcast = useCallback((payload: SiteReviewSignal) => {
    void channelRef.current?.send({ type: "broadcast", event: "signal", payload });
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`${SITE_REVIEW_CHANNEL_PREFIX}:${token}`, {
      config: { broadcast: { self: false } },
    });
    channel.on("broadcast", { event: "signal" }, ({ payload }) => {
      if (payload && typeof payload === "object" && "type" in payload) {
        onSignalRef.current(payload as SiteReviewSignal);
      }
    });
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        void channel.send({
          type: "broadcast",
          event: "signal",
          payload: { type: "presence", role, name: displayName, online: true },
        });
      }
    });
    channelRef.current = channel;
    return () => {
      void channel.send({
        type: "broadcast",
        event: "signal",
        payload: { type: "presence", role, name: displayName, online: false },
      });
      void supabase.removeChannel(channel);
    };
  }, [token, role, displayName]);

  return {
    sendChat: (message: SiteReviewMessage) => broadcast({ type: "chat", message }),
    sendTask: (task: SiteReviewTask) => broadcast({ type: "task-upsert", task }),
    sendNavigate: (pathname: string, hostName: string) =>
      broadcast({ type: "navigate", pathname, hostName }),
    sendWebRTC: (payload: WebRTCSignalPayload) =>
      broadcast({ type: "webrtc", from: role, payload }),
  };
}
