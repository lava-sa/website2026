"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageCircle, Mic, MicOff, Loader2 } from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";
import type { Session } from "@google/genai";
import { useCart } from "@/lib/cart-context";
import { buildJanetKnowledgePromptBlock } from "@/lib/janet-knowledge";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Prompts
// ─────────────────────────────────────────────────────────────────────────────
type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

const MACHINE_SPECS = [
  { name: "V.100 Premium X", price: "R11,000", suction: "35 ltr/min", maxVacuum: "-0.94 bar", width: "340 mm", seal: "Double", auto: "No", bestFor: "Occasional home use" },
  { name: "V.300 Premium X", price: "R13,500", suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "Yes", bestFor: "Regular home / hunting" },
  { name: "V.300 Black",     price: "R14,200", suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "Yes", bestFor: "Style-conscious users" },
  { name: "V.300 White",     price: "R14,200", suction: "35 ltr/min", maxVacuum: "-0.96 bar", width: "340 mm", seal: "Double", auto: "Yes", bestFor: "Maximum vacuum power" },
  { name: "V.400 Premium",   price: "R29,890", suction: "35 ltr/min", maxVacuum: "-0.92 bar", width: "450 mm", seal: "Triple", auto: "Yes", bestFor: "Restaurant / butchery" },
  { name: "V.500 Premium 72cm", price: "R41,210", suction: "110 ltr/min", maxVacuum: "-0.92 bar", width: "750 mm", seal: "Triple", auto: "Yes", bestFor: "High-volume commercial" },
  { name: "V.500 Premium XXL", price: "R68,280", suction: "110 ltr/min", maxVacuum: "-0.92 bar", width: "1200 mm", seal: "Triple", auto: "Yes", bestFor: "Carcases & industrial" },
];

function buildSystemPrompt(urlPath: string, pageContext: string) {
  return `
You are Janet — a warm, knowledgeable, and professional voice advisor for LAVA South Africa, a premium German vacuum sealing company.

IMPORTANT — GREET FIRST: Speak first as soon as the session opens. Do not wait for the visitor. Greet warmly, then ask ONLY for their first name (not surname, phone, or email yet). Example: "Hi! I'm Janet, your LAVA product advisor. What's your first name?" Use their first name naturally afterward.

IMPORTANT — LANGUAGE: Speak English by default. Do not switch to Afrikaans or Zulu unless the user explicitly asks.

YOUR ROLE
- Advise on LAVA vacuum sealers, embossed channel bags, rolls, and butchery accessories.
- Use the screen text below for prices and product names on the current page.

PRICES
- Say the number first, then "Rand" (e.g. R 6999 → "6999 Rand").

PAGE AWARENESS
- Current path: ${urlPath}
- Screen text from the page they are viewing:
---
${pageContext}
---
- Never downgrade: if they view a V.300 or V.400, help them buy that machine unless they ask for budget options.

${buildJanetKnowledgePromptBlock()}

GLOBAL MACHINE CATALOG
${JSON.stringify(MACHINE_SPECS, null, 2)}

SALES & add_to_cart TOOL
- Answer questions first; do not rush the sale.
- When they agree to buy, call add_to_cart immediately with productId = the website slug from screen text, productName, and numeric price. Do not promise it is in the cart until the tool succeeds.
- After success: tell them to open the cart (top right) and complete checkout — name, phone, and email are collected there.

CONTACT CAPTURE — TWO PHASES (critical)
PHASE 1 — START OF CALL: First name only. Do not ask for phone or email at the start.

PHASE 2 — END OF CALL (only if add_to_cart was NOT used this session):
- Before ending, you MUST offer: "Would you like Anneke from our team to give you a quick call back?"
- If yes:
  1) Ask for MOBILE NUMBER first: "What's the best mobile number for Anneke to reach you?" Read digits back once to confirm.
  2) Then ask for EMAIL only if they want email too: "If you'd like a quote by email as well, what's your email? Say it slowly — for example name at lavasa dot co dot za." Do NOT ask them to spell every letter unless a part is unclear. Say "at" and "dot", not symbols.
  3) Do NOT ask for first name again if you already have it.
  4) After you have phone (and email if given), call save_lead with firstName, phone, email.
- If add_to_cart WAS used: do NOT ask for phone or email. Checkout captures everything. Say goodbye briefly.

save_lead TOOL
- Call when you have their callback mobile number (required). Include firstName from the start of the call and email if they gave it.

RULES
- Under 3 sentences per turn when possible. Sound like a phone call, not a brochure.
- Never invent bag sizes or nicknames (no "small", "jumbo", etc.).
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio Helpers
// ─────────────────────────────────────────────────────────────────────────────
function resampleAudio(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const length = Math.round(input.length / ratio);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) out[i] = input[Math.floor(i * ratio)] ?? 0;
  return out;
}

function float32ToBase64Pcm16(input: Float32Array): string {
  const int16 = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]!));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer as ArrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function base64Pcm16ToFloat32(b64: string): Float32Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const int16 = new Int16Array(bytes.buffer as ArrayBuffer);
  const float = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float[i] = int16[i]! / (int16[i]! < 0 ? 0x8000 : 0x7fff);
  }
  return float;
}

// ─────────────────────────────────────────────────────────────────────────────
// Janet Agent Component
// ─────────────────────────────────────────────────────────────────────────────
export const JanetAgent = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [status, setStatus]     = useState<SessionStatus>("idle");
  const [isMuted, setIsMuted]   = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { addItem }             = useCart(); // LAVA Tool access

  // Telemetry & State
  const [transcript, setTranscript] = useState<string[]>([]);
  const startedAtRef = useRef("");
  const sessionIdRef = useRef("");
  const cartAddedRef = useRef(false);
  const leadRef = useRef<{ firstName?: string; phone?: string; email?: string }>({});
  const [inputDeviceLabel, setInputDeviceLabel] = useState("Not detected yet");
  const [outputDeviceLabel, setOutputDeviceLabel] = useState("System default");

  const sessionRef   = useRef<Session | null>(null);
  const streamRef    = useRef<MediaStream | null>(null);
  const micCtxRef    = useRef<AudioContext | null>(null);
  const playCtxRef   = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTime = useRef(0);
  const isMutedRef   = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    return () => {
      void teardown(false); // don't force save on silent backend unmount
    };
  }, []);

  useEffect(() => {
    async function refreshAudioDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const input = devices.find((d) => d.kind === "audioinput");
        const output = devices.find((d) => d.kind === "audiooutput");
        setInputDeviceLabel(input?.label || "Unknown microphone (permission required)");
        setOutputDeviceLabel(output?.label || "System default output");
      } catch {
        setInputDeviceLabel("Unknown microphone");
        setOutputDeviceLabel("System default output");
      }
    }

    void refreshAudioDevices();
    navigator.mediaDevices.addEventListener("devicechange", refreshAudioDevices);
    return () => navigator.mediaDevices.removeEventListener("devicechange", refreshAudioDevices);
  }, []);

  // Window event listener to trigger Janet remotely
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-janet", handleOpen);
    return () => window.removeEventListener("open-janet", handleOpen);
  }, []);

  // ── Teardown & Save Telemetry ───────────────────────────────────────────────
  const teardown = useCallback(async (saveSession = true) => {
    const session = sessionRef.current;
    sessionRef.current = null; // Stops processor immediately

    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    micCtxRef.current?.close().catch(() => undefined);
    playCtxRef.current?.close().catch(() => undefined);
    session?.close();

    processorRef.current = null;
    streamRef.current = null;
    micCtxRef.current = null;
    playCtxRef.current = null;
    nextPlayTime.current = 0;

    if (saveSession && startedAtRef.current && sessionIdRef.current) {
      try {
        await fetch("/api/janet-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            pageUrl: window.location.pathname,
            transcript: transcript.join("\n"),
            durationSeconds: Math.round((Date.now() - new Date(startedAtRef.current).getTime()) / 1000),
            startedAt: startedAtRef.current,
            firstName: leadRef.current.firstName,
            phone: leadRef.current.phone,
            email: leadRef.current.email,
            cartAdded: cartAddedRef.current,
          }),
        });
      } catch (err) {
        console.error("Janet telemetry save failed:", err);
      }
    }
  }, [transcript]);

  // ── Audio Playback ──────────────────────────────────────────────────────────
  const playAudio = useCallback((b64: string) => {
    try {
      if (!playCtxRef.current) {
        playCtxRef.current = new AudioContext({ sampleRate: 24000 });
        nextPlayTime.current = 0;
      }
      const ctx = playCtxRef.current;
      if (ctx.state === "suspended") ctx.resume().catch(() => undefined);

      const pcm = base64Pcm16ToFloat32(b64);
      const buf = ctx.createBuffer(1, pcm.length, 24000);
      buf.copyToChannel(pcm as Float32Array<ArrayBuffer>, 0);

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);

      const startAt = Math.max(ctx.currentTime, nextPlayTime.current);
      src.start(startAt);
      nextPlayTime.current = startAt + buf.duration;
    } catch (e) {
      console.warn("Janet playback error:", e);
    }
  }, []);

  // ── Record Mic & Send ───────────────────────────────────────────────────────
  const startMic = useCallback(async (activeSession: Session) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    streamRef.current = stream;
    const activeTrack = stream.getAudioTracks()[0];
    const activeInputLabel = activeTrack?.label?.trim();
    if (activeInputLabel) setInputDeviceLabel(activeInputLabel);

    const ctx = new AudioContext();
    micCtxRef.current = ctx;

    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(2048, 1, 1);
    processorRef.current = processor;

    const silence = ctx.createGain();
    silence.gain.value = 0;

    processor.onaudioprocess = (e) => {
      const live = sessionRef.current;
      if (!live || isMutedRef.current) return;
      const input = e.inputBuffer.getChannelData(0);
      const resampled = resampleAudio(input, ctx.sampleRate, 16000);
      const b64 = float32ToBase64Pcm16(resampled);
      try {
        live.sendRealtimeInput({ audio: { data: b64, mimeType: "audio/pcm;rate=16000" } });
      } catch {}
    };

    source.connect(processor);
    processor.connect(silence);
    silence.connect(ctx.destination);
  }, []);

  // ── Connect via Live WebSocket ──────────────────────────────────────────────
  const startSession = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg("");
    setTranscript([]);
    sessionIdRef.current = crypto.randomUUID();
    cartAddedRef.current = false;
    leadRef.current = {};
    startedAtRef.current = new Date().toISOString();

    const currentUrlPath = window.location.pathname;
    const pageContext = document.body.innerText.substring(0, 3000); // Scrape up to 3000 chars of the page content

    try {
      const res = await fetch("/api/gemini-token");
      if (!res.ok) throw new Error("Token fetch failed");
      const { apiKey, model, apiVersion } = (await res.json()) as {
        apiKey: string;
        model?: string;
        apiVersion?: "v1alpha" | "v1beta";
      };

      const ai = new GoogleGenAI({
        apiKey,
        apiVersion: apiVersion ?? "v1alpha",
      });

      const session = await ai.live.connect({
        model: model ?? "gemini-2.5-flash-native-audio-preview-12-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: buildSystemPrompt(currentUrlPath, pageContext),
          outputAudioTranscription: {}, // To save transcript
          inputAudioTranscription: {}, 
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Aoede" }, // Aoede = Janet (Female)
            },
          },
          tools: [{
            functionDeclarations: [
              {
                name: "add_to_cart",
                description: "Call the moment the user agrees to buy. Use the real product slug from the page.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    productId: { type: "STRING", description: "Website product slug from screen text" },
                    productName: { type: "STRING", description: "Full product name from the page" },
                    price: { type: "NUMBER", description: "Numeric price without currency symbols" },
                  },
                  required: ["productId", "productName", "price"],
                },
              },
              {
                name: "save_lead",
                description: "Save callback details when the customer wants Anneke to call back and you have their mobile number.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    firstName: { type: "STRING", description: "First name from start of call" },
                    phone: { type: "STRING", description: "Mobile number for callback (required)" },
                    email: { type: "STRING", description: "Email if they provided it (optional)" },
                  },
                  required: ["phone"],
                },
              },
            ],
          }],
        },
        callbacks: {
          onopen: () => {
            console.log("✅ Janet Voice Session Connected!");
          },
          onmessage: (msg) => {
            // Audio Playback
            if (msg.data) playAudio(msg.data);

            // Transcripts for Telemetry Saving
            const aiText = msg.serverContent?.outputTranscription?.text;
            if (aiText) {
               setTranscript(prev => [...prev, `Janet: ${aiText}`]);
            }
            const userText = msg.serverContent?.inputTranscription?.text;
            if (userText) {
               setTranscript(prev => [...prev, `Customer: ${userText}`]);
            }

            // TOOL CALL HANDLING
            const toolCall = msg.toolCall;
            if (toolCall) {
              const responses = toolCall.functionCalls.map((call) => {
                if (call.name === "add_to_cart") {
                  const args = call.args as {
                    productId?: string;
                    productName?: string;
                    price?: number | string;
                  };
                  const slug = String(args.productId || "unknown").trim();
                  const numPrice = Number(String(args.price).replace(/[^0-9.]/g, "")) || 0;
                  addItem({
                    id: slug,
                    slug,
                    name: args.productName || "LAVA product",
                    price: numPrice,
                    sku: slug.slice(0, 32).toUpperCase(),
                    image: null,
                  });
                  cartAddedRef.current = true;
                  return {
                    id: call.id,
                    name: call.name,
                    response: {
                      result: {
                        success: true,
                        message: "Added to cart. Do not ask for phone or email — checkout collects them.",
                      },
                    },
                  };
                }
                if (call.name === "save_lead") {
                  const args = call.args as {
                    firstName?: string;
                    phone?: string;
                    email?: string;
                  };
                  if (args.firstName) leadRef.current.firstName = args.firstName.trim();
                  if (args.phone) leadRef.current.phone = args.phone.trim();
                  if (args.email) leadRef.current.email = args.email.trim();
                  return {
                    id: call.id,
                    name: call.name,
                    response: { result: { success: true, message: "Lead saved for Anneke." } },
                  };
                }
                return { id: call.id, name: call.name, response: { result: { error: "Unknown tool" } } };
              });
              
              if (responses.length > 0 && sessionRef.current) {
                 try {
                   sessionRef.current.sendToolResponse({ functionResponses: responses });
                 } catch (err) {
                   console.error("Tool response failed:", err);
                 }
              }
            }
          },
          onerror: (err) => {
            console.error("Janet session error:", err);
            setErrorMsg("Connection dropped. Please try again.");
            setStatus("error");
          },
          onclose: () => {
            setStatus("ended");
          },
        },
      });

      sessionRef.current = session;
      setStatus("active");

      // Trigger Janet to greet
      setTimeout(() => {
        if (sessionRef.current) {
          try {
            sessionRef.current.sendClientContent({
              turns: [{ role: "user", parts: [{ text: "Hello website visitor arriving" }] }],
              turnComplete: true,
            });
          } catch {}
        }
      }, 500);

      // Start Microphone
      try {
        await startMic(session);
      } catch (micErr) {
        setErrorMsg("Microphone access denied — please allow mic permissions.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Janet is currently offline. Please try again later.");
      setStatus("error");
    }
  }, [playAudio, startMic, addItem]);

  // ── UI Handlers ─────────────────────────────────────────────────────────────
  const openChat = () => { setIsOpen(true); setStatus("idle"); setErrorMsg(""); };
  const closeChat = async () => { await teardown(true); setIsOpen(false); setStatus("idle"); };
  const endCall = async () => { await teardown(true); setStatus("ended"); };

  const isConnecting = status === "connecting";
  const isActive = status === "active";
  const isRunning = isConnecting || isActive;

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER PURE ORB UI
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-0 right-0 z-[1200] flex flex-col items-end gap-3 font-sans">
      {!isOpen ? (
        <div className="relative group flex flex-col items-end">
          {/* AI disclosure tooltip */}
          <div className="absolute bottom-full mb-2 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            <div className="bg-zinc-800 text-white text-[11px] font-medium px-3 py-1.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 shrink-0" />
              AI assistant — not a human
            </div>
          </div>
        <button
          onClick={openChat}
          className="flex items-center gap-0 shadow-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300"
          style={{ borderRadius: "0px" }}
        >
          <div className="bg-secondary px-5 py-4 flex flex-col items-center justify-center text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/70 leading-none mb-1">Chat with</p>
            <p className="text-lg font-black text-white leading-none tracking-tight">Janet</p>
          </div>
          <div className="bg-primary flex items-center justify-center px-5 py-4 relative self-stretch">
            <Mic className="h-6 w-6 text-white" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-400">
              <span className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-75" />
            </span>
          </div>
        </button>
        </div>
      ) : (
        <div
          className="bg-white shadow-2xl border border-border flex flex-col overflow-hidden"
          style={{ width: "360px", height: "480px", borderRadius: "0px" }}
        >
          <div className="bg-primary px-5 py-4 flex items-center justify-between shrink-0 z-20 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center shrink-0 relative text-pink-100">
                <span className="text-white font-black text-lg">J</span>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-pink-400 rounded-full border-2 border-primary" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none">Janet</p>
                <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mt-1">AI Sales Assistant</p>
              </div>
            </div>
            <button onClick={closeChat} className="p-2 text-white/60 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 px-6 py-6 relative overflow-hidden">
            
            {/* Star Aesthetic Style Heading */}
            <div className="text-center mb-8 flex flex-col items-center mt-2">
               <p className="text-[11px] font-bold tracking-[0.15em] text-copy-muted uppercase mb-3">Your Personal Guide</p>
               <h3 className="text-3xl font-black text-primary text-center mb-3">Hi — I'm Janet</h3>
               <p className="text-sm text-copy-muted max-w-[260px] text-center">
                 Ask me anything about our German vacuum sealers and accessories.
               </p>
            </div>

            {/* Breathing Mic Button in Center */}
            <div
              className={`relative flex items-center justify-center rounded-full \${
                isActive && !isMuted ? "bg-pink-600 scale-110 shadow-[0_0_50px_rgba(219,39,119,0.3)]" : "bg-primary shadow-xl"
              } transition-all duration-500 z-10 m-auto mt-2`}
              style={{ width: 100, height: 100 }}
            >
              <Mic className="text-white w-12 h-12" />
              {isConnecting && (
                <span className="absolute inset-0 rounded-full border-[5px] border-pink-400 border-t-transparent animate-spin opacity-80 z-0" />
              )}
              {isActive && !isMuted && (
                <span className="absolute inset-0 rounded-full border-[6px] border-pink-400 animate-ping opacity-60 z-0" />
              )}
            </div>

            <p className="mt-8 font-bold text-secondary text-center text-xs uppercase tracking-[0.2em]">
              {isConnecting ? "Connecting..." : status === "ended" ? "Call Ended." : status === "error" ? errorMsg : isActive && isMuted ? "Microphone Muted" : isActive ? "Janet is active..." : "Tap below to chat"}
            </p>

            <div className="mt-3 w-full max-w-[300px] bg-white border border-border px-3 py-2 text-[10px] text-copy-muted leading-tight">
              <p className="font-bold uppercase tracking-wide text-[9px] text-gray-500 mb-1">Audio devices</p>
              <p className="truncate"><span className="font-semibold">Mic:</span> {inputDeviceLabel}</p>
              <p className="truncate"><span className="font-semibold">Output:</span> {outputDeviceLabel}</p>
            </div>

            <div className="mt-8 w-full max-w-[260px]">
              {!isRunning ? (
                <button
                  onClick={startSession}
                  className="flex items-center justify-center w-full bg-secondary text-white px-5 py-4 text-sm font-bold tracking-wide uppercase hover:bg-secondary/90 transition-colors shadow-md rounded-none"
                >
                  {status === "error" || status === "ended" ? "Start New Call" : "Start Voice Call"}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    disabled={isConnecting}
                    onClick={() => setIsMuted((m) => !m)}
                    className={`flex-1 flex items-center justify-center py-4 text-sm font-bold uppercase tracking-wider transition-colors rounded-none shadow-sm \${isMuted ? "bg-red-500 text-white" : "bg-white border border-border text-primary hover:bg-zinc-100"} \${isConnecting && "opacity-50 cursor-not-allowed"}`}
                  >
                    {isMuted ? "Unmute" : "Mute"}
                  </button>
                  <button
                    disabled={isConnecting}
                    onClick={endCall}
                    className="flex-1 flex items-center justify-center py-4 text-sm font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors rounded-none shadow-sm"
                  >
                    End Call
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
