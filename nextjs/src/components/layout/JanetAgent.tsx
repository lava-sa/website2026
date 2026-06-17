"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, MessageCircle, Mic, MicOff, Loader2 } from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";
import type { Session } from "@google/genai";
import { useCart } from "@/lib/cart-context";
import { buildJanetKnowledgePromptBlock } from "@/lib/janet-knowledge";
import { ANNEKE_PHONE, MAIN_PHONE } from "@/lib/contact";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Prompts
// ─────────────────────────────────────────────────────────────────────────────
type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

const MACHINE_SPECS = [
  { name: "V.100 Premium", price: "R6,495", suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "No", bestFor: "Budget home use (limited stock — discontinued model)" },
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
You are Janet — a warm, knowledgeable voice sales assistant for LAVA South Africa, a premium German vacuum sealing company. You behave like a friendly in-store assistant who can actually move around the website for the visitor.

GREET FIRST: Speak first the moment the session opens — do not wait. Greet warmly, introduce yourself, then ask for their first name. Example: "Hi, I'm Janet, your LAVA product advisor — what's your first name?" The instant they tell you their name, call capture_contact with firstName so we never lose it. Use their first name naturally afterwards.

LANGUAGE: Speak English by default. Only switch to Afrikaans or Zulu if the visitor explicitly asks.

DISCOVER THEIR NEED (important — do this early):
- Ask what they want to use vacuum sealing for. Listen for the use-case and classify it, then call capture_contact with the "industry" field set to the best match:
  • "home" — home kitchen / household use
  • "home_industry" — small home-based food business (e.g. baking rusks, biltong from home, home bakery, cottage food, selling at markets). If they mention making/selling food FROM HOME, this is home_industry, NOT professional.
  • "hunting" — hunters / game / venison
  • "fishing" — anglers / fishing
  • "butchery" — butcheries
  • "restaurant" — restaurants / catering / commercial kitchens
  • "retail" — shops / resellers
- Never assume "professional/commercial" unless they clearly run a commercial operation. When unsure, ask a short clarifying question.

CONTROLLING THE WEBSITE (this is what makes you special — use it proactively):
- You can move the page for the visitor. When it helps, offer and then do it.
- scroll_to_section: scroll the current page to a part they care about (e.g. "products", "sizes", "specs", "reviews", "faq"). Say something like "I can scroll down to the machines for you" then call it.
- navigate_to: take them to another page. Use real site paths. Useful ones:
  • /products/vacuum-machines (all machines) • /products/bags-rolls • /products/sous-vide
  • /products/<slug> for a specific product (use the slug from the screen text)
  • /contact (book a call / leave details) • /rewards • /help/faq
- After you navigate or scroll, briefly tell them what you did ("Done — you're on the machines page now").

PRICES: Say the number first, then "Rand" (e.g. R 6999 → "6999 Rand").

PAGE AWARENESS
- Current path: ${urlPath}
- Visible content on the page they are viewing right now:
---
${pageContext}
---
- Refer to the product they are looking at by name. Never downgrade: if they're viewing a V.300 or V.400, help them with that machine unless they ask for cheaper options.

${buildJanetKnowledgePromptBlock()}

GLOBAL MACHINE CATALOG
${JSON.stringify(MACHINE_SPECS, null, 2)}

SELLING & add_to_cart
- Answer questions first; advise honestly (compare machines when asked). Don't rush the sale.
- When they agree to buy, call add_to_cart with productId = the website slug from the screen text, productName, and numeric price. Don't claim it's in the cart until the tool succeeds.
- After success: tell them to open the cart (top right) to check out — full name, phone and email are collected there.

LEAD CAPTURE — NATURAL, NOT ROBOTIC
- Capture details as they come up in conversation using capture_contact (all fields optional, send whatever you just learned): firstName, lastName, phone, email, industry.
- If they are interested but not buying today, offer a callback naturally: "Would you like Anneke to give you a call? I can take a few details, or pop you over to our contact page." Office: ${MAIN_PHONE.display}. Anneke direct: ${ANNEKE_PHONE.display}. 
  • If they want to leave details by voice: ask for their phone number (and surname if natural), confirm once, then call capture_contact with those fields.
  • If they'd rather fill it in themselves: use navigate_to with /contact and tell them the form is right there.
- If they already added to cart, don't collect phone/email — checkout handles it. Just confirm the next step warmly.

STYLE
- Keep turns short — usually 1–3 sentences. Sound like a real phone call, not a brochure.
- Never invent bag sizes or nicknames (no "small", "jumbo", etc.) — use the centimetre sizes above.
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
// Page scraping & UI control helpers (let Janet "see" and move the page)
// ─────────────────────────────────────────────────────────────────────────────
function scrapePageContext(): string {
  if (typeof document === "undefined") return "";
  const main = document.querySelector("main");
  const text = (main as HTMLElement | null)?.innerText || document.body.innerText || "";
  return text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().substring(0, 4000);
}

/** Scroll the page to the most relevant section for a free-text query. Returns true if it found a target. */
function scrollToQuery(query: string): boolean {
  if (typeof document === "undefined") return false;
  const q = query.trim().toLowerCase();
  if (!q) return false;

  // 1) direct id / anchor match
  const byId = document.getElementById(q) || document.querySelector(`[id="${q}"]`);
  if (byId) {
    byId.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }

  // 2) heading / section text contains the query
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>("h1, h2, h3, section[id], [data-section]")
  );
  const match = candidates.find((el) => (el.textContent || "").toLowerCase().includes(q));
  if (match) {
    match.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }

  // 3) common intents → coarse scroll
  if (/(bottom|contact|footer|book|review|faq)/.test(q)) {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    return true;
  }
  if (/(top|start|hero)/.test(q)) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Janet Agent Component
// ─────────────────────────────────────────────────────────────────────────────
export const JanetAgent = () => {
  const router                  = useRouter();
  const [isOpen, setIsOpen]     = useState(false);
  const [status, setStatus]     = useState<SessionStatus>("idle");
  const [isMuted, setIsMuted]   = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { addItem }             = useCart(); // LAVA Tool access

  // Telemetry & State
  const transcriptRef = useRef<string[]>([]); // source of truth for saving (avoids stale state)
  const startedAtRef = useRef("");
  const sessionIdRef = useRef("");
  const cartAddedRef = useRef(false);
  const savedRef = useRef(false); // guards against double-save (End Call + onclose)
  const leadRef = useRef<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    industry?: string;
  }>({});
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

    if (saveSession && !savedRef.current && startedAtRef.current && sessionIdRef.current) {
      savedRef.current = true;
      try {
        await fetch("/api/janet-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            pageUrl: window.location.pathname,
            transcript: transcriptRef.current.join("\n"),
            durationSeconds: Math.round((Date.now() - new Date(startedAtRef.current).getTime()) / 1000),
            startedAt: startedAtRef.current,
            firstName: leadRef.current.firstName,
            lastName: leadRef.current.lastName,
            phone: leadRef.current.phone,
            email: leadRef.current.email,
            industry: leadRef.current.industry,
            cartAdded: cartAddedRef.current,
          }),
        });
      } catch (err) {
        console.error("Janet telemetry save failed:", err);
      }
    }
  }, []);

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
    transcriptRef.current = [];
    sessionIdRef.current = crypto.randomUUID();

    // Request mic before opening the live session so the browser prompt appears immediately
    try {
      const probe = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      probe.getTracks().forEach((t) => t.stop());
      const devices = await navigator.mediaDevices.enumerateDevices();
      const input = devices.find((d) => d.kind === "audioinput");
      if (input?.label) setInputDeviceLabel(input.label);
    } catch (micErr) {
      const denied =
        micErr instanceof DOMException &&
        (micErr.name === "NotAllowedError" || micErr.name === "SecurityError");
      setErrorMsg(
        denied
          ? "Microphone blocked — click the lock icon beside the web address, allow Microphone, then try again."
          : "Microphone unavailable — check your device or try another browser."
      );
      setStatus("error");
      return;
    }

    cartAddedRef.current = false;
    savedRef.current = false;
    leadRef.current = {};
    startedAtRef.current = new Date().toISOString();

    const currentUrlPath = window.location.pathname;
    const pageContext = scrapePageContext(); // main-content text Janet can "see"

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
                name: "navigate_to",
                description:
                  "Take the visitor to another page on the LAVA website (client-side, keeps the voice call alive). Use real site paths like /products/vacuum-machines, /products/bags-rolls, /products/sous-vide, /products/<slug>, /contact, /rewards, /help/faq.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    path: { type: "STRING", description: "Site-relative path starting with / (e.g. /contact)" },
                  },
                  required: ["path"],
                },
              },
              {
                name: "scroll_to_section",
                description:
                  "Scroll the CURRENT page to a relevant section for the visitor. Pass a short keyword such as 'products', 'sizes', 'specs', 'reviews', 'faq', 'contact', 'top' or 'bottom'.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    target: { type: "STRING", description: "Section keyword or heading text to scroll to" },
                  },
                  required: ["target"],
                },
              },
              {
                name: "capture_contact",
                description:
                  "Record contact / qualification details the moment you learn them in conversation. Call it whenever you hear a first name, surname, phone, email, or figure out their use-case. Send only the fields you just learned — all are optional.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    firstName: { type: "STRING", description: "First name" },
                    lastName: { type: "STRING", description: "Surname" },
                    phone: { type: "STRING", description: "Mobile / phone number" },
                    email: { type: "STRING", description: "Email address" },
                    industry: {
                      type: "STRING",
                      description:
                        "Use-case: home, home_industry, hunting, fishing, butchery, restaurant, or retail",
                    },
                  },
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

            // Transcripts for Telemetry Saving (ref = source of truth, state = optional UI)
            const aiText = msg.serverContent?.outputTranscription?.text;
            if (aiText) {
               transcriptRef.current.push(`Janet: ${aiText}`);
            }
            const userText = msg.serverContent?.inputTranscription?.text;
            if (userText) {
               transcriptRef.current.push(`Customer: ${userText}`);
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
                if (call.name === "capture_contact") {
                  const args = call.args as {
                    firstName?: string;
                    lastName?: string;
                    phone?: string;
                    email?: string;
                    industry?: string;
                  };
                  if (args.firstName) leadRef.current.firstName = args.firstName.trim();
                  if (args.lastName) leadRef.current.lastName = args.lastName.trim();
                  if (args.phone) leadRef.current.phone = args.phone.trim();
                  if (args.email) leadRef.current.email = args.email.trim();
                  if (args.industry) leadRef.current.industry = args.industry.trim();
                  return {
                    id: call.id,
                    name: call.name,
                    response: { result: { success: true, message: "Saved." } },
                  };
                }
                if (call.name === "navigate_to") {
                  const args = call.args as { path?: string };
                  let path = String(args.path || "").trim();
                  if (path && !path.startsWith("/")) path = `/${path}`;
                  let ok = false;
                  if (path) {
                    try {
                      router.push(path);
                      ok = true;
                      // Give the new page a moment, then feed Janet the fresh page content
                      setTimeout(() => {
                        const fresh = scrapePageContext();
                        try {
                          sessionRef.current?.sendClientContent({
                            turns: [
                              {
                                role: "user",
                                parts: [
                                  {
                                    text: `SYSTEM: The visitor is now on ${path}. Visible content:\n${fresh}`,
                                  },
                                ],
                              },
                            ],
                            turnComplete: false,
                          });
                        } catch {}
                      }, 1200);
                    } catch {}
                  }
                  return {
                    id: call.id,
                    name: call.name,
                    response: {
                      result: ok
                        ? { success: true, message: `Navigated to ${path}.` }
                        : { success: false, message: "Could not navigate." },
                    },
                  };
                }
                if (call.name === "scroll_to_section") {
                  const args = call.args as { target?: string };
                  const found = scrollToQuery(String(args.target || ""));
                  return {
                    id: call.id,
                    name: call.name,
                    response: {
                      result: {
                        success: found,
                        message: found ? "Scrolled." : "Section not found on this page.",
                      },
                    },
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
            void teardown(true); // ensure the session is logged even if the socket closes on its own
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
              turns: [{
                role: "user",
                parts: [{
                  text: "SYSTEM: A visitor just opened the chat. Greet them now, introduce yourself as Janet, and ask for their first name.",
                }],
              }],
              turnComplete: true,
            });
          } catch {}
        }
      }, 500);

      // Start Microphone
      try {
        await startMic(session);
      } catch (micErr) {
        const denied =
          micErr instanceof DOMException &&
          (micErr.name === "NotAllowedError" || micErr.name === "SecurityError");
        setErrorMsg(
          denied
            ? "Microphone blocked — click the lock icon beside the web address, allow Microphone, then tap Start New Call."
            : "Microphone unavailable — check your device or try another browser."
        );
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Janet is currently offline. Please try again later.");
      setStatus("error");
    }
  }, [playAudio, startMic, addItem, router, teardown]);

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
