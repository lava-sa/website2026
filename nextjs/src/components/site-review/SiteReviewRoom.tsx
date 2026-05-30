"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  MonitorUp,
  MonitorOff,
  Circle,
  Square,
  PhoneOff,
  Send,
  Plus,
  Check,
  ExternalLink,
  Loader2,
  Users,
  ListTodo,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  SiteReviewMessage,
  SiteReviewRoom,
  SiteReviewRole,
  SiteReviewSignal,
  SiteReviewTask,
} from "@/lib/site-review/types";
import { useSiteReviewChannel } from "./useSiteReviewChannel";
import { useSiteReviewVoice } from "./useSiteReviewVoice";

const PRESET_PATHS = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Vacuum machines", path: "/products/vacuum-machines" },
  { label: "Contact", path: "/contact" },
];

type Props = {
  token: string;
  role: SiteReviewRole;
  initialRoom: SiteReviewRoom;
  initialMessages: SiteReviewMessage[];
  initialTasks: SiteReviewTask[];
  joinable: boolean;
};

export default function SiteReviewRoom({
  token,
  role,
  initialRoom,
  initialMessages,
  initialTasks,
  joinable,
}: Props) {
  const displayName = role === "host" ? initialRoom.host_label : initialRoom.guest_label;
  const [room, setRoom] = useState(initialRoom);
  const [messages, setMessages] = useState(initialMessages);
  const [tasks, setTasks] = useState(initialTasks);
  const [chatInput, setChatInput] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [browsePath, setBrowsePath] = useState("/");
  const [followHost, setFollowHost] = useState(role === "guest");
  const [peerOnline, setPeerOnline] = useState(false);
  const [ending, setEnding] = useState(false);
  const [endedSummary, setEndedSummary] = useState<string | null>(null);
  const [recordConsent, setRecordConsent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploadingRecording, setUploadingRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);
  const sendWebRTCRef = useRef<(p: import("@/lib/site-review/types").WebRTCSignalPayload) => void>(
    () => {}
  );

  const voice = useSiteReviewVoice(role, (p) => sendWebRTCRef.current(p));

  const onSignal = useCallback(
    (signal: SiteReviewSignal) => {
      if (signal.type === "chat") {
        setMessages((prev) =>
          prev.some((m) => m.id === signal.message.id) ? prev : [...prev, signal.message]
        );
      } else if (signal.type === "task-upsert") {
        setTasks((prev) => {
          const i = prev.findIndex((t) => t.id === signal.task.id);
          if (i >= 0) {
            const n = [...prev];
            n[i] = signal.task;
            return n;
          }
          return [...prev, signal.task];
        });
      } else if (signal.type === "navigate" && role === "guest" && followHost) {
        setBrowsePath(signal.pathname);
      } else if (signal.type === "presence" && signal.role !== role) {
        setPeerOnline(signal.online);
      } else if (signal.type === "webrtc") {
        void voice.handleRemoteSignal(signal.from, signal.payload);
      }
    },
    [role, followHost, voice]
  );

  const channel = useSiteReviewChannel(token, role, displayName, onSignal);
  sendWebRTCRef.current = channel.sendWebRTC;

  const siteOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const previewUrl = useMemo(
    () => `${siteOrigin}${browsePath.startsWith("/") ? browsePath : `/${browsePath}`}`,
    [siteOrigin, browsePath]
  );

  const navigateAsHost = (pathname: string) => {
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    setBrowsePath(path);
    if (role === "host") channel.sendNavigate(path, displayName);
  };

  const sendMessage = async () => {
    const body = chatInput.trim();
    if (!body || !joinable) return;
    setChatInput("");
    const res = await fetch(`/api/site-review/${token}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, role, senderName: displayName }),
    });
    const json = await res.json();
    if (json.message) {
      setMessages((p) => [...p, json.message]);
      channel.sendChat(json.message);
    }
  };

  const addTask = async () => {
    const text = taskInput.trim();
    if (!text || !joinable) return;
    setTaskInput("");
    const res = await fetch(`/api/site-review/${token}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, createdBy: displayName }),
    });
    const json = await res.json();
    if (json.task) {
      setTasks((p) => [...p, json.task]);
      channel.sendTask(json.task);
    }
  };

  const toggleTask = async (task: SiteReviewTask) => {
    const res = await fetch(`/api/site-review/${token}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    });
    const json = await res.json();
    if (json.task) {
      setTasks((p) => p.map((t) => (t.id === task.id ? json.task : t)));
      channel.sendTask(json.task);
    }
  };

  const startRecording = async () => {
    if (!recordConsent) return;
    const stream = await voice.getMixedAudioStream();
    if (!stream) return;
    recordChunksRef.current = [];
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime });
    rec.ondataavailable = (e) => {
      if (e.data.size) recordChunksRef.current.push(e.data);
    };
    rec.start(1000);
    recorderRef.current = rec;
    setRecording(true);
  };

  const stopRecording = async () => {
    const rec = recorderRef.current;
    if (!rec) return;
    setRecording(false);
    await new Promise<void>((resolve) => {
      rec.onstop = () => resolve();
      rec.stop();
    });
    const blob = new Blob(recordChunksRef.current, { type: rec.mimeType });
    const ext = rec.mimeType.includes("mp4") ? "mp4" : "webm";
    setUploadingRecording(true);
    try {
      const urlRes = await fetch(`/api/site-review/${token}/recording?ext=${ext}`);
      const { signedUrl, path } = await urlRes.json();
      if (!signedUrl) throw new Error("No upload URL");
      await fetch(signedUrl, { method: "PUT", body: blob });
      await fetch(`/api/site-review/${token}/recording`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
    } catch {
      alert("Recording upload failed — chat and tasks are still saved.");
    } finally {
      setUploadingRecording(false);
    }
  };

  const endSession = async () => {
    if (!confirm("End session and generate AI notes?")) return;
    setEnding(true);
    try {
      const res = await fetch(`/api/site-review/${token}/end`, { method: "POST" });
      const json = await res.json();
      if (json.room) {
        setRoom((r) => ({ ...r, status: "ended" }));
        setEndedSummary(json.summary ?? null);
      }
      voice.stopVoice();
    } finally {
      setEnding(false);
    }
  };

  if (room.status === "ended" || endedSummary) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-gray-900 border border-gray-700 p-8 space-y-4">
          <h1 className="text-xl font-black">Session ended</h1>
          {endedSummary && (
            <div className="text-sm whitespace-pre-wrap bg-gray-800 p-4 max-h-64 overflow-y-auto">
              {endedSummary}
            </div>
          )}
          <Link href="/" className="text-secondary text-sm font-semibold hover:underline">
            Back to website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <audio ref={voice.remoteAudioRef} autoPlay playsInline className="hidden" />

      <header className="shrink-0 border-b border-gray-800 bg-gray-900 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">Site review</p>
          <h1 className="text-lg font-bold">{room.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Users className="h-4 w-4" />
          <span>
            {displayName} ({role})
          </span>
          <span className={cn("w-2 h-2 rounded-full", peerOnline ? "bg-green-500" : "bg-gray-600")} />
          {peerOnline ? "Partner online" : "Waiting…"}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <div className="flex-1 flex flex-col min-h-[40vh] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-gray-800">
          <div className="px-3 py-2 bg-gray-900 flex flex-wrap gap-2 items-center border-b border-gray-800">
            {role === "host" ? (
              <>
                <input
                  value={browsePath}
                  onChange={(e) => setBrowsePath(e.target.value)}
                  className="flex-1 min-w-[100px] bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm rounded"
                />
                <button
                  type="button"
                  onClick={() => navigateAsHost(browsePath)}
                  className="px-3 py-1.5 bg-primary text-xs font-bold rounded"
                >
                  Go
                </button>
                {PRESET_PATHS.map((p) => (
                  <button
                    key={p.path}
                    type="button"
                    onClick={() => navigateAsHost(p.path)}
                    className="px-2 py-1 text-[10px] font-bold uppercase bg-gray-800 rounded"
                  >
                    {p.label}
                  </button>
                ))}
              </>
            ) : (
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={followHost}
                  onChange={(e) => setFollowHost(e.target.checked)}
                />
                Follow host
              </label>
            )}
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-secondary"
            >
              Open tab <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <iframe title="Site preview" src={previewUrl} className="flex-1 w-full bg-white" />
        </div>

        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col bg-gray-900">
          <div className="p-3 border-b border-gray-800 space-y-2">
            <p className="text-[10px] font-bold uppercase text-gray-500">Voice & screen</p>
            <div className="flex flex-wrap gap-2">
              {voice.voiceState === "idle" || voice.voiceState === "error" ? (
                <button
                  type="button"
                  onClick={() => void voice.startVoice()}
                  disabled={!joinable}
                  className="flex items-center gap-1 px-3 py-2 bg-green-700 text-xs font-bold rounded disabled:opacity-50"
                >
                  <Mic className="h-4 w-4" /> Join voice
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={voice.toggleMute}
                    className="px-3 py-2 bg-gray-800 text-xs font-bold rounded"
                  >
                    {voice.muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  {!voice.sharingScreen ? (
                    <button
                      type="button"
                      onClick={() => void voice.startScreenShare()}
                      className="px-3 py-2 bg-gray-800 text-xs font-bold rounded"
                    >
                      <MonitorUp className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void voice.stopScreenShare()}
                      className="px-3 py-2 bg-amber-800 text-xs font-bold rounded"
                    >
                      <MonitorOff className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={voice.stopVoice}
                    className="px-3 py-2 bg-red-900 text-xs font-bold rounded"
                  >
                    <PhoneOff className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {voice.error && <p className="text-xs text-red-400">{voice.error}</p>}
            <label className="flex gap-2 text-[10px] text-gray-400">
              <input
                type="checkbox"
                checked={recordConsent}
                onChange={(e) => setRecordConsent(e.target.checked)}
              />
              I consent to recording for internal review (POPIA).
            </label>
            <div className="flex gap-2">
              {!recording ? (
                <button
                  type="button"
                  disabled={!recordConsent}
                  onClick={() => void startRecording()}
                  className="flex items-center gap-1 px-3 py-2 bg-gray-800 text-xs font-bold rounded disabled:opacity-40"
                >
                  <Circle className="h-3 w-3 fill-red-500 text-red-500" /> Record
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void stopRecording()}
                  className="flex items-center gap-1 px-3 py-2 bg-red-900 text-xs font-bold rounded"
                >
                  <Square className="h-3 w-3" /> Stop
                </button>
              )}
              {uploadingRecording && (
                <span className="text-xs flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
                </span>
              )}
            </div>
          </div>

          <div className="p-3 border-b border-gray-800 flex-1 min-h-[120px] flex flex-col overflow-hidden">
            <p className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1 mb-2">
              <ListTodo className="h-3 w-3" /> Tasks
            </p>
            <ul className="flex-1 overflow-y-auto text-sm space-y-1 mb-2">
              {tasks.map((t) => (
                <li key={t.id} className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => void toggleTask(t)}
                    className={cn(
                      "w-4 h-4 border rounded shrink-0 mt-0.5",
                      t.done && "bg-green-600 border-green-600"
                    )}
                  >
                    {t.done && <Check className="h-3 w-3" />}
                  </button>
                  <span className={cn(t.done && "line-through text-gray-500")}>{t.text}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-1">
              <input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void addTask()}
                placeholder="Add task…"
                className="flex-1 bg-gray-800 border border-gray-700 px-2 py-1.5 text-xs rounded"
              />
              <button type="button" onClick={() => void addTask()} className="p-2 bg-primary rounded">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-3 h-36 flex flex-col">
            <p className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1 mb-2">
              <MessageSquare className="h-3 w-3" /> Chat
            </p>
            <ul className="flex-1 overflow-y-auto text-xs space-y-1 mb-2">
              {messages.map((m) => (
                <li key={m.id}>
                  <strong className="text-secondary">{m.sender_name}:</strong> {m.body}
                </li>
              ))}
            </ul>
            <div className="flex gap-1">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void sendMessage()}
                className="flex-1 bg-gray-800 border border-gray-700 px-2 py-1.5 text-xs rounded"
              />
              <button type="button" onClick={() => void sendMessage()} className="p-2 bg-primary rounded">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {role === "host" && (
            <div className="p-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => void endSession()}
                disabled={ending}
                className="w-full py-2.5 bg-red-800 text-xs font-bold uppercase rounded disabled:opacity-50"
              >
                {ending ? "Ending…" : "End session & email notes"}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
