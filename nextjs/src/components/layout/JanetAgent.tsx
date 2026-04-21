"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageCircle, Mic, MicOff, Loader2 } from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";
import type { Session } from "@google/genai";
import { useCart } from "@/lib/cart-context"; // LAVA Cart Hook

// ─────────────────────────────────────────────────────────────────────────────
// Types & Prompts
// ─────────────────────────────────────────────────────────────────────────────
type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

const MACHINE_SPECS = [
  { name: "V.100 Premium X", price: "R11,000", suction: "35 ltr/min", maxVacuum: "-0.94 bar", width: "340 mm", seal: "Double", auto: "No", bestFor: "Occasional home use" },
  { name: "V.300 Premium X", price: "R14,500", suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "Yes", bestFor: "Regular home / hunting" },
  { name: "V.300 Black",     price: "R14,200", suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "Yes", bestFor: "Style-conscious users" },
  { name: "V.300 White",     price: "R14,200", suction: "35 ltr/min", maxVacuum: "-0.96 bar", width: "340 mm", seal: "Double", auto: "Yes", bestFor: "Maximum vacuum power" },
  { name: "V.400 Premium",   price: "R29,890", suction: "35 ltr/min", maxVacuum: "-0.92 bar", width: "450 mm", seal: "Triple", auto: "Yes", bestFor: "Restaurant / butchery" },
  { name: "V.500 Premium 72cm", price: "R41,210", suction: "110 ltr/min", maxVacuum: "-0.92 bar", width: "750 mm", seal: "Triple", auto: "Yes", bestFor: "High-volume commercial" },
  { name: "V.500 Premium XXL", price: "R68,280", suction: "110 ltr/min", maxVacuum: "-0.92 bar", width: "1200 mm", seal: "Triple", auto: "Yes", bestFor: "Carcases & industrial" },
];

function buildSystemPrompt(urlPath: string, pageContext: string) {
  let instructions = `
You are Janet — a warm, knowledgeable, and professional voice advisor for LAVA South Africa, a premium German vacuum sealing company.

IMPORTANT — GREET FIRST: You must speak first as soon as the session opens. Do not wait for the visitor to speak. Greet them warmly and naturally, for example: "Hi! I'm Janet, your LAVA product advisor. How can I help you today?" Then wait for their response.

IMPORTANT — LANGUAGE: Speak English by default. DO NOT switch to Afrikaans or Zulu unless the user explicitly asks you to speak in another language.

YOUR ROLE
- Advise customers on high-end LAVA vacuum sealers, bags, and butchery accessories. 
- Answer questions honestly, cleanly, and naturally, using the Screen Text below to become an instant expert on whatever product they are viewing.

PRICES
- Always say the number first, then the word "Rand". For example, R 6999 is spoken as "6999 Rand".

PAGE AWARENESS & SCREEN CONTEXT
- You know that the user is currently looking at this website path: ${urlPath}
- Below is the EXACT text scraped from the page they are looking at right now, containing all features, product names, sizes, and prices.
---
${pageContext}
---
- Use this exact screen text to answer their questions. 
- You must NEVER downgrade a customer. If they are looking at a premium V300 or V400 machine, help them buy THAT machine. Do not push a cheaper V100 unless they specifically ask for a budget option.
- Casually acknowledge what they are looking at during your greeting based on the page text.

GLOBAL MACHINE CATALOG
- Here is your internal global knowledge of all our core Vacuum Sealing Machines so you never get stuck comparing them:
${JSON.stringify(MACHINE_SPECS, null, 2)}
- Use this grid to compare machines flawlessly, even if the user is not on the comparison page.

SALES & TOOLS
- First, thoroughly chat with the customer and answer their questions. DO NOT rush the sale.
- When they are ready to buy, ask them if they would like to add the product to their cart.
- CRITICAL TOOL RULE: If the user says "Yes please" or "Add it", YOU MUST STOP SPEAKING AND IMMEDIATELY EXECUTE the 'add_to_cart' tool function! Do NOT just say you will do it. You MUST physically trigger the tool.
- Do not verbally promise to add it until AFTER you have successfully called the tool. Once you call the tool, conclude the sale explicitly and smoothly: "Fantastic! I've placed the [Product Name] into your cart. To complete your order, just click on your cart in the top right of the screen and follow the checkout steps. Thank you, and have a wonderful day!"

CONTACT CAPTURE & FOLLOW-UP (CONDITIONAL)
- IF the visitor successfully asked you to add an item to their cart, DO NOT ask for their contact details at the end. Checkout will capture it automatically. Just say goodbye normally.
- IF they DID NOT place an item in their cart (they just chatted), ask: "Would you like Anneke to give you a call?"
- If they say yes, then politely ask for their Name, Phone Number, and Email so she can reach out. Repeat the details back to confirm accuracy.

RULES
- Keep responses conversational, punchy, and UNDER 3 sentences per response.
- Be patient. Actively listen and have a conversational flow. Answer questions properly before pitching.
- Never read lists out entirely, speak naturally like a human on a phone call.
  `;
  return instructions;
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

    if (saveSession && startedAtRef.current) {
      try {
        await fetch("/api/janet-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: crypto.randomUUID(),
            pageUrl: window.location.pathname,
            transcript: transcript.join("\n"),
            durationSeconds: Math.round((Date.now() - new Date(startedAtRef.current).getTime()) / 1000),
            startedAt: startedAtRef.current,
          }),
        });
      } catch (err) {
        console.error("Janet Telemetry saved failed:", err);
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
    startedAtRef.current = new Date().toISOString();

    const currentUrlPath = window.location.pathname;
    const pageContext = document.body.innerText.substring(0, 3000); // Scrape up to 3000 chars of the page content

    try {
      const res = await fetch("/api/gemini-token");
      if (!res.ok) throw new Error("Token fetch failed");
      const { apiKey } = (await res.json()) as { apiKey: string };

      const ai = new GoogleGenAI({ apiKey });

      const session = await ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-12-2025",
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
                description: "CRITICAL: You MUST call this function the EXACT moment the user agrees to buy a product or asks you to add it to their cart. Do not speak instead of calling this.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    productId: { type: "STRING", description: "A simple ID slug. e.g. 'v300' or 'bags_25x30'" },
                    productName: { type: "STRING", description: "The full readable name of the product you read from the screen" },
                    price: { type: "NUMBER", description: "The numerical price of the item from the screen (no currency symbols)" }
                  },
                  required: ["productId", "productName", "price"]
                }
              }
            ]
          }]
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
                  const args = call.args as any;
                  
                  if (args.productId?.includes("bags")) {
                     addItem({ id: "bags-25x30", slug: "vacuum-bags-25x30", name: "Vacuum Sealing Bags 25x30 (50 Pack) - 20% OFF", price: 279, sku: "BAG-2530", image: null });
                  } else {
                     const numPrice = Number(String(args.price).replace(/[^0-9.]/g, '')) || 0;
                     addItem({ 
                        id: args.productId || "unknown", 
                        slug: args.productId || "unknown", 
                        name: args.productName || "Lava Product", 
                        price: numPrice, 
                        sku: args.productId?.toUpperCase() || "SKU-UNKNOWN", 
                        image: null 
                     });
                  }
                  return { id: call.id, name: call.name, response: { result: { success: true, message: "Added successfully to UI cart." } } };
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
    <div className="fixed bottom-0 right-0 z-[200] flex flex-col items-end gap-3 font-sans">
      {!isOpen ? (
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
                <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold mt-1">LAVA Sales Agent</p>
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
