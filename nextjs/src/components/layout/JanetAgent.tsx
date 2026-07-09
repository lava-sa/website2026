"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, MessageCircle, Mic, MicOff, Loader2 } from "lucide-react";
import { GoogleGenAI, Modality, EndSensitivity } from "@google/genai";
import type { Session } from "@google/genai";
import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/cart-context";
import { buildJanetKnowledgePromptBlock } from "@/lib/janet-knowledge";
import {
  formatJanetPageContextForPrompt,
  getJanetPageContext,
  type JanetPageContext,
} from "@/lib/janet-page-context";
import { ANNEKE_PHONE, MAIN_PHONE } from "@/lib/contact";
import { JANET_LIVE_MODEL } from "@/lib/janet-live-model";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Prompts
// ─────────────────────────────────────────────────────────────────────────────
type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

const MACHINE_SPECS = [
  { name: "V.100 Premium", slug: "v100-premium", price: 6495, suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "No", bestFor: "Budget home use (limited stock — discontinued model)" },
  { name: "V.100 Premium X", slug: "v100-premium-x", price: 11000, suction: "35 ltr/min", maxVacuum: "-0.94 bar", width: "340 mm", seal: "Double", auto: "No", bestFor: "Occasional home use" },
  { name: "V.300 Premium X", slug: "v300-premium-x", price: 13500, suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "Yes", bestFor: "Regular home / hunting" },
  { name: "V.300 Black", slug: "v300-black", price: 14200, suction: "35 ltr/min", maxVacuum: "-0.80 bar", width: "300 mm", seal: "Double", auto: "Yes", bestFor: "Style-conscious users" },
  { name: "V.300 White", slug: "v300-white", price: 14200, suction: "35 ltr/min", maxVacuum: "-0.96 bar", width: "340 mm", seal: "Double", auto: "Yes", bestFor: "Maximum vacuum power" },
  { name: "V.400 Premium", slug: "v400-premium", price: 29890, suction: "35 ltr/min", maxVacuum: "-0.92 bar", width: "450 mm", seal: "Triple", auto: "Yes", bestFor: "Restaurant / butchery" },
  { name: "V.500 Premium 72cm", slug: "v500-premium", price: 41210, suction: "110 ltr/min", maxVacuum: "-0.92 bar", width: "750 mm", seal: "Triple", auto: "Yes", bestFor: "High-volume commercial" },
  { name: "V.500 Premium XXL", slug: "v500-premium-xxl", price: 68280, suction: "110 ltr/min", maxVacuum: "-0.92 bar", width: "1200 mm", seal: "Triple", auto: "Yes", bestFor: "Carcases & industrial" },
];

/** Opening line — mention the product they're viewing when we know it. */
function getJanetOpeningFocus(ctx: JanetPageContext | null): string {
  if (ctx?.type === "product") {
    const n = ctx.name;
    if (/v\.?100/i.test(n) || ctx.slug.includes("v100")) {
      return "any V.100 vacuum sealing machine information you need to help with your purchasing decision";
    }
    return `the ${n} and our LAVA vacuum sealing range`;
  }
  return "LAVA vacuum sealing machines, bags, rolls, and accessories";
}

function formatLeadIndustry(lead: { companyName?: string; industry?: string }): string | undefined {
  const parts = [lead.companyName?.trim(), lead.industry?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" — ") : undefined;
}

function isVacuumMachineCartItem(item: { slug: string; name: string }): boolean {
  const slug = item.slug.toLowerCase();
  if (/^v\d{3}|^v100|^v300|^v400|^v500/.test(slug)) return true;
  const name = item.name.toLowerCase();
  return (
    (name.includes("vacuum") || name.includes("premium")) &&
    !name.includes("bag") &&
    !name.includes("roll")
  );
}

function buildSystemPrompt(urlPath: string, pageContext: string, structuredContext: string) {
  const openingFocus = getJanetOpeningFocus(getJanetPageContext());

  return `
You are Janet — LAVA South Africa's friendly, knowledgeable voice support agent for premium German vacuum sealing. You help visitors like a real in-store expert: answer honestly, use the page you're on, and guide purchases without pressure.

═══ OPENING (speak first — do not wait for the visitor) ═══
Step 1 — Introduce yourself, then ask their first name only:
"Hi — I'm Janet, LAVA's friendly support agent. I'm here to answer your questions and supply you with ${openingFocus}. May I ask who I'm speaking with?"

Step 2 — The moment they give their first name, call capture_contact with firstName, then respond warmly:
"Hi [FirstName] — lovely to chat with you." (Use their first name naturally throughout — never overdo it.)

NAME RULE (non-negotiable): You MUST learn their first name within your first two turns. If they jump straight in with a question before giving a name, answer it briefly, then say "By the way, may I ask who I'm speaking with?" before continuing. Do not go deeper into the conversation without a name.

Do NOT ask for surname, phone, email, company, or industry at the start. Help them first.

LANGUAGE: English by default. Afrikaans or Zulu only if they ask.

═══ DURING THE CONVERSATION ═══
- Answer questions thoroughly before pitching. Keep turns to 1–3 sentences — like a phone call.
- Use structured page context and screen text below — never guess product names or prices.
- Never downgrade: if they're on a V.300 or V.400 page, help with THAT machine unless they ask for cheaper options.
- Compare machines with real prices when asked; be honest about trade-offs.
- PRICES: number first, then "Rand" (11000 → "eleven thousand Rand").

PAGE AWARENESS
${structuredContext}

Screen text (supplementary):
---
${pageContext}
---

${buildJanetKnowledgePromptBlock()}

MACHINE CATALOG (slug = productId in add_to_cart)
${JSON.stringify(MACHINE_SPECS, null, 2)}

SALES & add_to_cart (April-style — decisive)
- Chat first; don't rush the sale.
- When they're ready, ask if they'd like to add it to their cart.
- CRITICAL: If they say "yes", "yes please", "add it", or "add to cart" — STOP TALKING and call add_to_cart immediately. Do not only say you will do it.
- After the tool succeeds, say clearly: "Fantastic — I've placed the [product] in your cart. Click the cart at the top right when you're ready to checkout."
- Use their first name naturally when it fits.

WEBSITE TOOLS — you MUST call these; speaking alone does not change the site or cart.
- add_to_cart: call the instant they agree — never say "I've added it" without calling this first.
- navigate_to: call when showing a product page or section on another URL — never say "I'll take you there" without calling this.
- scroll_to_section: products, specs, sizes, reviews, faq, compare, contact, top, bottom
- Paths: /products/vacuum-machines, /products/bags-rolls, /products/vacuum-bags, /products/vacuum-rolls, /products/<slug>, /contact
- After scroll/navigate: brief "Done — …"

capture_contact — call the moment you learn each field (send only what you just heard):
- firstName (right after they introduce themselves)
- lastName, phone, email, companyName, industry (only in the NO-PURCHASE closing — see below)
- EMAIL over voice: after they say it, ALWAYS read it back to confirm spelling ("So that's j-o-h-n at gmail dot com — correct?"). Convert spoken "at" → @ and "dot" → . before calling capture_contact.

industry use-case values: home, home_industry, hunting, fishing, butchery, restaurant, retail

═══ END OF CONVERSATION — TWO PATHS (pick one) ═══

DECIDING WHICH PATH: If add_to_cart succeeded even ONCE this call — ANY product, whether a machine, bags, rolls, or an accessory — you are on PATH A. Never ask a buyer for their phone, surname, or email. Only use PATH B when the cart is still empty at the end of the call.

PATH A — They added ANY product to the cart (add_to_cart succeeded at least once):
- Do NOT ask for phone, surname, or email — checkout captures all of that.
- If they bought a vacuum MACHINE, offer consumables ONCE: "Would you like to add vacuum bags or rolls to go with your sealer?" If yes, ask which size they'd like, then call add_to_cart. Do NOT promise a specific size is available — if the tool says it's out of stock, tell them honestly and offer another size or navigate_to /products/bags-rolls so they can see what's in stock.
- Add each item ONE at a time and wait for the tool to confirm success before mentioning it. Never say something is in the cart unless add_to_cart returned success for it.
- Remind them once: "Click the cart at the top right when you're ready to checkout."
- Warm sign-off using their first name — say goodbye only ONCE.

PATH B — They did NOT purchase (cart is still empty — add_to_cart never succeeded):
- TRIGGER: the moment the conversation winds down — they say "thanks", "that's all", "goodbye", or clearly have no more questions — do NOT say goodbye yet. Start this closing first.
- Say: "Before you go, [FirstName] — may I take your phone number and email so we can send you the right information and follow up?"
- Collect in order, one question at a time (not a form dump): phone number → email address → surname → company name (if they have one) → what they mainly use vacuum sealing for (industry).
- Phone and email are the priority — if they only give you those two, that is a success.
- Call capture_contact after each answer. Read the email back to confirm spelling before capturing it.
- If they decline to share details, respect it gracefully and move to the goodbye.
- Close naturally: "Would you like Anneke to give you a call to follow up? She's brilliant at matching the right machine." Office: ${MAIN_PHONE.display}. Anneke: ${ANNEKE_PHONE.display}.
- If they prefer a form: navigate_to /contact.

Payment questions: yes — PayFast accepts Visa and Mastercard; EFT also available at checkout.

STYLE: Warm, professional, human. Never invent bag nicknames — use centimetre sizes only.
- Pronounce the brand "LAVA" (LAH-vah). Refer to a machine by its model, e.g. "the V.300 Premium X" — do NOT put "Lava" in front of the model name each time.
- NEVER read the cart contents or quantities aloud — the customer can see their cart on screen. After an add, confirm only the single item you just added, then stop.
- ONE thing at a time: say your piece, then STOP and let the customer reply. Never chain a confirmation, an upsell, and a goodbye into one long turn.
- HONESTY: only state an item is added if add_to_cart returned success. If a tool failed or an item is out of stock, say so plainly — never pretend.
- After you say goodbye, STOP. Do not add more, re-list the cart, or start a new topic.
  `;
}

function buildSessionOpenTrigger(urlPath: string, structuredContext: string): string {
  const focus = getJanetOpeningFocus(getJanetPageContext());
  return `SYSTEM: A visitor just connected on ${urlPath}.
${structuredContext}

Speak first NOW. Follow the OPENING script exactly:
1) Introduce yourself as Janet, LAVA's friendly support agent, ready to help with ${focus}.
2) Ask: "May I ask who I'm speaking with?"
3) When they reply with their first name, call capture_contact with firstName, then greet them: "Hi [name] — lovely to chat with you."
Do not ask for anything else yet — start helping with their questions.`;
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

  // 3) product grids / listing pages
  if (/(product|machines|catalog|range|grid|listing)/.test(q)) {
    const grid =
      document.getElementById("home-range") ||
      document.getElementById("commercial-range") ||
      document.querySelector("[data-janet-section='products']") ||
      document.querySelector("[data-janet-listing-item]")?.closest("section") ||
      document.querySelector("main .grid");
    if (grid) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
  }
  if (/(compare|comparison)/.test(q)) {
    const compare =
      document.getElementById("compare-domestic") || document.getElementById("compare-commercial");
    if (compare) {
      compare.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
  }
  if (/(spec|technical|feature)/.test(q)) {
    const specs = document.getElementById("specs") || document.querySelector("[id*='spec']");
    if (specs) {
      specs.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
  }
  if (/(size|bag|roll)/.test(q)) {
    const sizes = document.getElementById("sizes") || document.querySelector("[id*='size']");
    if (sizes) {
      sizes.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
  }

  // 4) common intents → coarse scroll
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

type JanetApiProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  sku: string | null;
  image: string | null;
  canAddToCart: boolean;
};

async function fetchJanetProduct(slug?: string, q?: string): Promise<JanetApiProduct | null> {
  const params = slug
    ? `slug=${encodeURIComponent(slug)}`
    : q
      ? `q=${encodeURIComponent(q)}`
      : "";
  if (!params) return null;
  try {
    const res = await fetch(`/api/janet-product?${params}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { product?: JanetApiProduct };
    return data.product ?? null;
  } catch {
    return null;
  }
}

function findListingMatch(
  products: { id: string; slug: string; name: string; price: number; canAddToCart: boolean }[],
  args: { productId?: string; productName?: string }
) {
  const slug = args.productId?.trim().toLowerCase();
  const nameQ = args.productName?.trim().toLowerCase();
  if (slug) {
    const bySlug = products.find((p) => p.slug === slug);
    if (bySlug) return bySlug;
  }
  if (nameQ) {
    const exact = products.find((p) => p.name.toLowerCase() === nameQ);
    if (exact) return exact;
    const partial = products.find((p) => p.name.toLowerCase().includes(nameQ));
    if (partial) return partial;
    const reverse = products.find((p) => nameQ.includes(p.name.toLowerCase()));
    if (reverse) return reverse;
  }
  return null;
}

/** Resolve cart line item — explicit slug/name wins over current page context. */
async function resolveCartProductAsync(args: {
  productId?: string;
  productName?: string;
  price?: number | string;
}): Promise<{ item?: Omit<CartItem, "quantity">; blocked?: string; error?: string }> {
  const pageCtx = getJanetPageContext();
  const requestedSlug = args.productId?.trim().toLowerCase();

  if (requestedSlug) {
    const api = await fetchJanetProduct(requestedSlug);
    if (api) {
      if (!api.canAddToCart) {
        return { blocked: `${api.name} is on-order only — offer WhatsApp or a callback.` };
      }
      return {
        item: {
          id: api.id,
          slug: api.slug,
          name: args.productName?.trim() || api.name,
          price: api.price,
          sku: api.sku,
          image: api.image,
        },
      };
    }
  }

  if (pageCtx?.type === "product") {
    const pageProduct = pageCtx;
    if (!pageProduct.canAddToCart) {
      return { blocked: "This product is on-order only — offer WhatsApp or a phone callback instead." };
    }
    return {
      item: {
        id: pageProduct.id,
        slug: pageProduct.slug,
        name: args.productName?.trim() || pageProduct.name,
        price: pageProduct.price,
        sku: pageProduct.sku,
        image: pageProduct.image,
      },
    };
  }

  if (pageCtx?.type === "listing") {
    const match = findListingMatch(pageCtx.products, args);
    if (match) {
      if (!match.canAddToCart) {
        return { blocked: `${match.name} is on-order only — offer WhatsApp or a callback.` };
      }
      const api = await fetchJanetProduct(match.slug);
      return {
        item: {
          id: match.id,
          slug: match.slug,
          name: match.name,
          price: match.price,
          sku: api?.sku ?? null,
          image: api?.image ?? null,
        },
      };
    }
  }

  if (args.productName?.trim()) {
    const api = await fetchJanetProduct(undefined, args.productName.trim());
    if (api) {
      if (!api.canAddToCart) {
        return { blocked: `${api.name} is on-order only — offer WhatsApp or a callback.` };
      }
      return {
        item: {
          id: api.id,
          slug: api.slug,
          name: api.name,
          price: api.price,
          sku: api.sku,
          image: api.image,
        },
      };
    }
  }

  return {
    error: "Could not find that product — confirm the name with the visitor or navigate to the product page first.",
  };
}

function pageContextUpdateText(path: string): string {
  const structured = formatJanetPageContextForPrompt(getJanetPageContext(), path);
  const scraped = scrapePageContext();
  return `SYSTEM: The visitor is now on ${path}.\n\n${structured}\n\nVisible text:\n${scraped}`;
}

/** Wait for client navigation + Janet context bridge, then push fresh page state. */
async function notifyJanetAfterNavigation(session: Session, path: string): Promise<void> {
  const deadline = Date.now() + 4500;
  while (Date.now() < deadline) {
    if (typeof window !== "undefined" && window.location.pathname === path) {
      const hasProduct = !!document.querySelector("[data-janet-product]");
      const hasListing = document.querySelectorAll("[data-janet-listing-item]").length > 0;
      const ctx = getJanetPageContext();
      if (hasProduct || hasListing || ctx) break;
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  try {
    // turnComplete:false — feed the new page into Janet's context WITHOUT forcing
    // her to speak. She already acknowledges a navigation via the tool response;
    // a second "respond now" here made her narrate (and mis-narrate) the page.
    session.sendClientContent({
      turns: [{ role: "user", parts: [{ text: pageContextUpdateText(path) }] }],
      turnComplete: false,
    });
  } catch {}
}

/** Gemini Live streams transcription in small chunks — merge into one line per speaker turn. */
function appendTranscriptChunk(lines: string[], prefix: string, chunk: string): void {
  if (!chunk) return;
  const last = lines[lines.length - 1];
  if (last?.startsWith(prefix)) {
    lines[lines.length - 1] = last + chunk;
  } else {
    lines.push(prefix + chunk.trimStart());
  }
}

function appendToolTranscriptLine(lines: string[], name: string, detail?: string): void {
  const line = detail ? `[Tool] ${name}(${detail})` : `[Tool] ${name}`;
  lines.push(line);
}

// ─────────────────────────────────────────────────────────────────────────────
// Janet Agent Component
// ─────────────────────────────────────────────────────────────────────────────
export const JanetAgent = () => {
  const router                  = useRouter();
  const pathname                = usePathname();
  const [isOpen, setIsOpen]     = useState(false);
  const [installPromptVisible, setInstallPromptVisible] = useState(false);
  const [status, setStatus]     = useState<SessionStatus>("idle");
  const [isMuted, setIsMuted]   = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { addItem, openDrawer } = useCart(); // LAVA Tool access

  // Telemetry & State
  const transcriptRef = useRef<string[]>([]); // source of truth for saving (avoids stale state)
  const startedAtRef = useRef("");
  const sessionIdRef = useRef("");
  const cartAddedRef = useRef(false);
  const machineAddedRef = useRef(false);
  const savedRef = useRef(false); // guards against double-save (End Call + onclose)
  const leadRef = useRef<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    companyName?: string;
    industry?: string;
  }>({});
  const [inputDeviceLabel, setInputDeviceLabel] = useState("Not detected yet");
  const [outputDeviceLabel, setOutputDeviceLabel] = useState("System default");

  const sessionRef   = useRef<Session | null>(null);
  const janetPathRef = useRef<string | null>(null);
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

  // Move Janet above the PWA install banner when it is visible
  useEffect(() => {
    const onInstallPrompt = (e: Event) => {
      const detail = (e as CustomEvent<{ visible?: boolean }>).detail;
      setInstallPromptVisible(Boolean(detail?.visible));
    };
    window.addEventListener("lava-install-prompt", onInstallPrompt);
    return () => window.removeEventListener("lava-install-prompt", onInstallPrompt);
  }, []);

  // Keep Janet aware when the visitor navigates manually during an active call
  useEffect(() => {
    if (status !== "active" || !sessionRef.current) {
      if (status === "idle" || status === "ended" || status === "error") {
        janetPathRef.current = null;
      }
      return;
    }
    if (janetPathRef.current === null) {
      janetPathRef.current = pathname;
      return;
    }
    if (janetPathRef.current === pathname) return;
    janetPathRef.current = pathname;
    const session = sessionRef.current;
    void notifyJanetAfterNavigation(session, pathname);
  }, [pathname, status]);

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
      // Let final transcription chunks arrive before persisting
      await new Promise((r) => setTimeout(r, 1200));
      try {
        const transcript = transcriptRef.current.join("\n").trim();
        await fetch("/api/janet-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            pageUrl: window.location.pathname,
            transcript: transcript || null,
            durationSeconds: Math.round((Date.now() - new Date(startedAtRef.current).getTime()) / 1000),
            startedAt: startedAtRef.current,
            firstName: leadRef.current.firstName,
            lastName: leadRef.current.lastName,
            phone: leadRef.current.phone,
            email: leadRef.current.email,
            industry: formatLeadIndustry(leadRef.current),
            cartAdded: cartAddedRef.current,
            machineAdded: machineAddedRef.current,
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
    const stream = await navigator.mediaDevices.getUserMedia({
      // Echo cancellation is ESSENTIAL: without it, Janet's own voice from the
      // speakers is captured by the mic and sent back as "user speech", so she
      // answers herself in a loop and talks over the caller (the "stuck record").
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    });
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
      const probe = await navigator.mediaDevices.getUserMedia({
      // Echo cancellation is ESSENTIAL: without it, Janet's own voice from the
      // speakers is captured by the mic and sent back as "user speech", so she
      // answers herself in a loop and talks over the caller (the "stuck record").
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: false,
    });
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
    machineAddedRef.current = false;
    savedRef.current = false;
    leadRef.current = {};
    startedAtRef.current = new Date().toISOString();

    const currentUrlPath = window.location.pathname;
    const pageContext = scrapePageContext();
    const structuredContext = formatJanetPageContextForPrompt(getJanetPageContext(), currentUrlPath);

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
        model: model ?? JANET_LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: buildSystemPrompt(currentUrlPath, pageContext, structuredContext),
          outputAudioTranscription: {}, // To save transcript
          inputAudioTranscription: {}, 
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Aoede" }, // Aoede = Janet (Female)
            },
          },
          // Callers pause to think — don't let Janet jump in on a short silence.
          // silenceDurationMs = how long a pause must be before she treats the turn
          // as finished (trade-off: higher = more patient but slower to reply).
          // 2500ms lets the caller pause mid-sentence to think without being cut off.
          // prefixPaddingMs requires a bit of sustained speech before she yields, so a
          // stray "um" or breath doesn't count as the caller starting a new turn.
          realtimeInputConfig: {
            automaticActivityDetection: {
              endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
              silenceDurationMs: 2500,
              prefixPaddingMs: 400,
            },
          },
          tools: [{
            functionDeclarations: [
              {
                name: "add_to_cart",
                description:
                  "CRITICAL: Call the EXACT moment the visitor agrees to buy or says add to cart. Do not speak instead of calling this. Use the real product slug as productId. Price is optional — the site resolves it.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    productId: { type: "STRING", description: "Website product slug (e.g. v100-premium-x)" },
                    productName: { type: "STRING", description: "Full product name" },
                    price: { type: "NUMBER", description: "Numeric price in Rand (optional)" },
                    quantity: { type: "NUMBER", description: "How many to add (default 1, max 10)" },
                  },
                  required: ["productId"],
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
                  "Save contact details the moment you hear them. Call after each answer — send only fields just learned.",
                parameters: {
                  type: "OBJECT",
                  properties: {
                    firstName: { type: "STRING", description: "First name — capture immediately when they introduce themselves" },
                    lastName: { type: "STRING", description: "Surname (end of call, no purchase only)" },
                    phone: { type: "STRING", description: "Phone number (end of call, no purchase only)" },
                    email: { type: "STRING", description: "Email address, normalised (spoken 'at'→@, 'dot'→.) and confirmed back to the visitor (end of call, no purchase only)" },
                    companyName: { type: "STRING", description: "Business or company name, if they have one" },
                    industry: {
                      type: "STRING",
                      description:
                        "Main use-case: home, home_industry, hunting, fishing, butchery, restaurant, retail",
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

            // Transcripts — merge streaming chunks (one line per speaker turn)
            const aiText = msg.serverContent?.outputTranscription?.text;
            if (aiText) {
              appendTranscriptChunk(transcriptRef.current, "Janet: ", aiText);
            }
            const userText = msg.serverContent?.inputTranscription?.text;
            if (userText) {
              appendTranscriptChunk(transcriptRef.current, "Customer: ", userText);
            }

            // TOOL CALL HANDLING
            const toolCall = msg.toolCall;
            if (toolCall) {
              void (async () => {
                const live = sessionRef.current;
                if (!live) return;

                const responses = await Promise.all(
                  toolCall.functionCalls.map(async (call) => {
                if (call.name === "add_to_cart") {
                  const args = call.args as {
                    productId?: string;
                    productName?: string;
                    price?: number | string;
                    quantity?: number;
                  };
                  console.log("[Janet] add_to_cart", args);
                  appendToolTranscriptLine(
                    transcriptRef.current,
                    "add_to_cart",
                    args.productId || args.productName
                  );
                  const qty = Math.max(1, Math.min(10, Number(args.quantity) || 1));
                  const { item, blocked, error } = await resolveCartProductAsync(args);
                  if (blocked || error || !item) {
                    return {
                      id: call.id,
                      name: call.name,
                      response: {
                        result: {
                          success: false,
                          message: `NOT added — ${blocked || error} IMPORTANT: do NOT tell the customer it was added. Say honestly that it's currently unavailable/out of stock and offer a different size or to check back later.`,
                        },
                      },
                    };
                  }
                  for (let i = 0; i < qty; i++) addItem(item);
                  cartAddedRef.current = true;
                  if (isVacuumMachineCartItem(item)) machineAddedRef.current = true;
                  setTimeout(() => openDrawer("add"), 300);
                  const qtyLabel = qty > 1 ? `${qty} × ` : "";
                  const isMachine = isVacuumMachineCartItem(item);
                  return {
                    id: call.id,
                    name: call.name,
                    response: {
                      result: {
                        success: true,
                        message: isMachine
                          ? `Added ${qtyLabel}${item.name} to cart. Confirm warmly using their first name. This is a PURCHASE — follow PATH A: before goodbye, naturally offer embossed vacuum bags or rolls. Do NOT ask for phone, surname, or email — checkout captures those.`
                          : `Added ${qtyLabel}${item.name} to cart. Confirm warmly and ask if they need anything else. This is a PURCHASE — follow PATH A: do NOT ask for phone, surname, or email. Remind them to click the cart top-right to checkout.`,
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
                    companyName?: string;
                    industry?: string;
                  };
                  if (args.firstName) leadRef.current.firstName = args.firstName.trim();
                  if (args.lastName) leadRef.current.lastName = args.lastName.trim();
                  if (args.phone) leadRef.current.phone = args.phone.trim();
                  if (args.email) leadRef.current.email = args.email.trim().toLowerCase();
                  if (args.companyName) leadRef.current.companyName = args.companyName.trim();
                  if (args.industry) leadRef.current.industry = args.industry.trim();
                  appendToolTranscriptLine(
                    transcriptRef.current,
                    "capture_contact",
                    args.firstName || args.phone || args.email || args.industry
                  );
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
                  console.log("[Janet] navigate_to", path);
                  appendToolTranscriptLine(transcriptRef.current, "navigate_to", path);
                  let ok = false;
                  if (path) {
                    try {
                      router.push(path);
                      ok = true;
                      // Claim the path NOW so the pathname useEffect sees no change and
                      // does not fire a SECOND page-context push (cause of double narration).
                      janetPathRef.current = path;
                      const liveSession = sessionRef.current;
                      if (liveSession) {
                        void notifyJanetAfterNavigation(liveSession, path);
                      }
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
                  appendToolTranscriptLine(
                    transcriptRef.current,
                    "scroll_to_section",
                    String(args.target || "")
                  );
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
                  })
                );

                try {
                  live.sendToolResponse({ functionResponses: responses });
                } catch (err) {
                  console.error("Tool response failed:", err);
                }
              })();
            }
          },
          onerror: (err) => {
            console.error("Janet session error:", err);
            setErrorMsg("Connection dropped. Please try again.");
            setStatus("error");
          },
          onclose: (e) => {
            // Google closes with a reason when it rejects the session (e.g. retired model,
            // code 1008 "model not found"). Surface it instead of a silent "Call Ended".
            const reason = (e as CloseEvent | undefined)?.reason?.trim();
            if (reason) {
              console.error("Janet session closed by server:", (e as CloseEvent).code, reason);
              setErrorMsg(`Voice service ended the call: ${reason.slice(0, 140)}`);
              setStatus("error");
            } else {
              setStatus("ended");
            }
            void teardown(true); // ensure the session is logged even if the socket closes on its own
          },
        },
      });

      sessionRef.current = session;
      janetPathRef.current = currentUrlPath;
      setStatus("active");

      // Trigger Janet to greet
      setTimeout(() => {
        if (sessionRef.current) {
          try {
            sessionRef.current.sendClientContent({
              turns: [{
                role: "user",
                parts: [{ text: buildSessionOpenTrigger(currentUrlPath, structuredContext) }],
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
  }, [playAudio, startMic, addItem, openDrawer, router, teardown]);

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
  const janetBottomClass =
    installPromptVisible && !isOpen ? "bottom-[9.5rem] sm:bottom-4" : "bottom-4";

  return (
    <div
      className={`fixed right-4 z-[1200] flex flex-col items-end gap-3 font-sans transition-[bottom] duration-300 ${janetBottomClass}`}
    >
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
