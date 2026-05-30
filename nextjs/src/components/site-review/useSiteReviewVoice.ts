"use client";

import { useCallback, useRef, useState } from "react";
import { buildIceServers } from "@/lib/site-review/types";
import type { SiteReviewRole, WebRTCSignalPayload } from "@/lib/site-review/types";

export function useSiteReviewVoice(role: SiteReviewRole, sendWebRTC: (p: WebRTCSignalPayload) => void) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const makingOfferRef = useRef(false);
  const ignoreOfferRef = useRef(false);

  const [voiceState, setVoiceState] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [muted, setMuted] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensurePc = useCallback(() => {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection({ iceServers: buildIceServers() });
    pc.onicecandidate = (e) => {
      if (e.candidate) sendWebRTC({ kind: "ice", candidate: e.candidate.toJSON() });
    };
    pc.ontrack = (e) => {
      const [stream] = e.streams;
      if (remoteAudioRef.current && stream) {
        remoteAudioRef.current.srcObject = stream;
        void remoteAudioRef.current.play().catch(() => {});
      }
    };
    pcRef.current = pc;
    return pc;
  }, [sendWebRTC]);

  const attachLocalAudio = useCallback(async (pc: RTCPeerConnection) => {
    if (!localStreamRef.current) {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }
    for (const track of localStreamRef.current.getAudioTracks()) {
      if (!pc.getSenders().some((s) => s.track?.id === track.id)) {
        pc.addTrack(track, localStreamRef.current!);
      }
    }
  }, []);

  const stopVoice = useCallback(() => {
    sendWebRTC({ kind: "hangup" });
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    setSharingScreen(false);
    setVoiceState("idle");
  }, [sendWebRTC]);

  const startVoice = useCallback(async () => {
    setError(null);
    setVoiceState("connecting");
    try {
      const pc = ensurePc();
      await attachLocalAudio(pc);
      if (role === "host") {
        makingOfferRef.current = true;
        ignoreOfferRef.current = true;
        await pc.setLocalDescription(await pc.createOffer());
        sendWebRTC({ kind: "offer", sdp: pc.localDescription!.toJSON() });
        makingOfferRef.current = false;
      }
      setVoiceState("connected");
    } catch (e) {
      setVoiceState("error");
      setError(e instanceof Error ? e.message : "Microphone denied");
    }
  }, [attachLocalAudio, ensurePc, role, sendWebRTC]);

  const handleRemoteSignal = useCallback(
    async (from: SiteReviewRole, payload: WebRTCSignalPayload) => {
      if (from === role) return;
      const pc = ensurePc();
      if (payload.kind === "offer") {
        if (ignoreOfferRef.current || makingOfferRef.current) return;
        ignoreOfferRef.current = true;
        await attachLocalAudio(pc);
        await pc.setRemoteDescription(payload.sdp);
        await pc.setLocalDescription(await pc.createAnswer());
        sendWebRTC({ kind: "answer", sdp: pc.localDescription!.toJSON() });
        setVoiceState("connected");
      } else if (payload.kind === "answer") {
        await pc.setRemoteDescription(payload.sdp);
        setVoiceState("connected");
      } else if (payload.kind === "ice") {
        try {
          await pc.addIceCandidate(payload.candidate);
        } catch {
          /* stale */
        }
      } else if (payload.kind === "hangup") {
        stopVoice();
      }
    },
    [attachLocalAudio, ensurePc, role, sendWebRTC, stopVoice]
  );

  const toggleMute = useCallback(() => {
    const next = !muted;
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !next;
    });
    setMuted(next);
  }, [muted]);

  const startScreenShare = useCallback(async () => {
    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = display;
      const pc = ensurePc();
      const videoTrack = display.getVideoTracks()[0];
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(videoTrack);
      else pc.addTrack(videoTrack, display);
      videoTrack.onended = () => {
        screenStreamRef.current?.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
        setSharingScreen(false);
      };
      if (role === "host") {
        await pc.setLocalDescription(await pc.createOffer());
        sendWebRTC({ kind: "offer", sdp: pc.localDescription!.toJSON() });
      }
      setSharingScreen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Screen share cancelled");
    }
  }, [ensurePc, role, sendWebRTC]);

  const stopScreenShare = useCallback(async () => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === "video");
    if (sender) await sender.replaceTrack(null);
    setSharingScreen(false);
  }, []);

  const getMixedAudioStream = useCallback(async (): Promise<MediaStream | null> => {
    try {
      if (!localStreamRef.current) {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      const ctx = new AudioContext();
      const dest = ctx.createMediaStreamDestination();
      ctx.createMediaStreamSource(localStreamRef.current).connect(dest);
      if (remoteAudioRef.current?.srcObject instanceof MediaStream) {
        ctx.createMediaStreamSource(remoteAudioRef.current.srcObject).connect(dest);
      }
      return dest.stream;
    } catch {
      return localStreamRef.current;
    }
  }, []);

  return {
    voiceState,
    muted,
    sharingScreen,
    error,
    remoteAudioRef,
    startVoice,
    stopVoice,
    toggleMute,
    startScreenShare,
    stopScreenShare,
    handleRemoteSignal,
    getMixedAudioStream,
  };
}
