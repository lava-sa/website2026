"use client";

import { useState, useRef, useEffect } from "react";
import {
  Star, Send, CheckCircle, MessageSquare, Video,
  Upload, StopCircle, Circle, RotateCcw, Loader2,
} from "lucide-react";
import Link from "next/link";

const MACHINES = [
  "V.100® Premium X",
  "V.300® Premium X",
  "V.300® Black",
  "V.400® Premium",
  "Other / Older model",
];

// ── Star rating picker ────────────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="transition-transform hover:scale-110"
        >
          <Star className="h-8 w-8 transition-colors"
            fill={(hover || value) >= n ? "var(--color-secondary)" : "none"}
            stroke={(hover || value) >= n ? "var(--color-secondary)" : "var(--color-border)"}
          />
        </button>
      ))}
      {(hover || value) > 0 && (
        <span className="ml-2 text-sm font-bold text-secondary">{labels[hover || value]}</span>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WRITTEN REVIEW FORM
// ═══════════════════════════════════════════════════════════════════════════════
function WrittenReviewForm() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", city: "", machine: MACHINES[1], rating: 0, headline: "", review: "", permission: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus]  = useState<"idle" | "sending" | "done">("idle");

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => { setForm((p) => ({ ...p, [field]: e.target.value })); setErrors((p) => ({ ...p, [field]: "" })); };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())   e.name    = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (form.rating === 0)   e.rating  = "Please select a rating";
    if (!form.headline.trim()) e.headline = "Required";
    if (!form.review.trim() || form.review.trim().length < 20) e.review = "Please write at least 20 characters";
    if (!form.permission)    e.permission = "Please confirm you agree";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "done" : "idle");
    if (!res.ok) setErrors({ review: "Something went wrong. Please try again." });
  }

  if (status === "done") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-12 text-center">
        <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-primary mb-3">Baie dankie, {form.name.split(" ")[0]}!</h2>
        <p className="text-copy-muted leading-relaxed max-w-md mx-auto mb-6">
          Your review has been received. Anneke will read it personally and once approved it will
          appear on the website within 1–2 business days.
        </p>
        <Link href="/products/vacuum-machines"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors">
          Browse our machines →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wide">
          Overall Rating <span className="text-red-500">*</span>
        </label>
        <StarRating value={form.rating}
          onChange={(n) => { setForm((p) => ({ ...p, rating: n })); setErrors((p) => ({ ...p, rating: "" })); }} />
        {errors.rating && <p className="text-xs text-red-600 mt-1">{errors.rating}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.name} onChange={set("name")} placeholder="Johan van der Merwe"
            className={`w-full border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-border bg-white"}`} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input type="email" value={form.email} onChange={set("email")} placeholder="your@email.co.za"
            className={`w-full border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors ${errors.email ? "border-red-400 bg-red-50" : "border-border bg-white"}`} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          <p className="text-[10px] text-copy-muted mt-1">Not published. Used only to verify your review.</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
          Which machine do you own?
        </label>
        <select value={form.machine} onChange={set("machine")}
          className="w-full border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors">
          {MACHINES.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            Company Name <span className="text-copy-muted font-normal normal-case tracking-normal">— optional</span>
          </label>
          <input type="text" value={form.company} onChange={set("company")}
            placeholder="e.g. Bosveld Biltong Co."
            className="w-full border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            City / Town <span className="text-copy-muted font-normal normal-case tracking-normal">— optional</span>
          </label>
          <input type="text" value={form.city} onChange={set("city")}
            placeholder="e.g. Pretoria"
            className="w-full border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
          Review Headline <span className="text-red-500">*</span>
        </label>
        <input type="text" value={form.headline} onChange={set("headline")}
          placeholder="e.g. Best investment I've ever made for my butchery"
          className={`w-full border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors ${errors.headline ? "border-red-400 bg-red-50" : "border-border bg-white"}`} />
        {errors.headline && <p className="text-xs text-red-600 mt-1">{errors.headline}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea value={form.review} onChange={set("review")} rows={6}
          placeholder="Tell us about your experience — what you use it for, how it performs, and why you'd recommend it to other South Africans."
          className={`w-full border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none ${errors.review ? "border-red-400 bg-red-50" : "border-border bg-white"}`} />
        {errors.review && <p className="text-xs text-red-600 mt-1">{errors.review}</p>}
        <p className="text-[10px] text-copy-muted mt-1">{form.review.length} characters (minimum 20)</p>
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.permission}
            onChange={(e) => { setForm((p) => ({ ...p, permission: e.target.checked })); setErrors((p) => ({ ...p, permission: "" })); }}
            className="mt-0.5 h-4 w-4 accent-primary" />
          <span className="text-sm text-copy leading-relaxed">
            I confirm this review is genuine and I give Lava South Africa permission to publish it on their website.
          </span>
        </label>
        {errors.permission && <p className="text-xs text-red-600 mt-1 ml-7">{errors.permission}</p>}
      </div>

      <button type="submit" disabled={status === "sending"}
        className="btn-primary flex items-center gap-2 px-10 py-4 disabled:opacity-60">
        {status === "sending" ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
        ) : (
          <><Send className="h-4 w-4" /> Submit My Review</>
        )}
      </button>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO TESTIMONIAL RECORDER
// ═══════════════════════════════════════════════════════════════════════════════
function VideoReviewForm() {
  const [mode, setMode]       = useState<"idle" | "recording" | "preview" | "uploading" | "done" | "error">("idle");
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob]       = useState<Blob | null>(null);
  const [name, setName]       = useState("");
  const [product, setProduct] = useState("");
  const [permission, setPermission] = useState(false);

  const videoRef    = useRef<HTMLVideoElement>(null);
  const previewRef  = useRef<HTMLVideoElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const MAX_SECONDS = 90;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    try {
      const isMobile = window.innerWidth < 768;
      const videoConstraints = isMobile
        ? { facingMode: "user", aspectRatio: { ideal: 9 / 16 } }
        : { facingMode: "user" };
      const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }

      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: mimeType });
        setBlob(videoBlob);
        if (previewRef.current) previewRef.current.src = URL.createObjectURL(videoBlob);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };
      recorder.start(100);
      recorderRef.current = recorder;
      setSeconds(0);
      setMode("recording");
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) { stopRecording(); return MAX_SECONDS; }
          return s + 1;
        });
      }, 1000);
    } catch {
      alert("Could not access camera. Please allow camera permission and try again.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
    setMode("preview");
  };

  const retake = () => { setBlob(null); setSeconds(0); setMode("idle"); };

  const handleUpload = async () => {
    if (!blob || !name || !permission) return;
    setMode("uploading");
    try {
      const ext = blob.type.includes("mp4") ? "mp4" : "webm";
      const formData = new FormData();
      formData.append("video", blob, `testimonial-${Date.now()}.${ext}`);
      formData.append("name", name);
      formData.append("product", product);
      const res = await fetch("/api/reviews/video", { method: "POST", body: formData });
      setMode(res.ok ? "done" : "error");
    } catch { setMode("error"); }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct  = Math.round((seconds / MAX_SECONDS) * 100);

  if (mode === "done") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-12 text-center">
        <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-primary mb-3">Amazing, {name.split(" ")[0]}!</h2>
        <p className="text-copy-muted leading-relaxed max-w-md mx-auto mb-6">
          Your video story has been submitted. Anneke will watch it and once approved it will appear
          in our video gallery. It means the world to us — baie dankie!
        </p>
        <Link href="/products/vacuum-machines"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors">
          Browse our machines →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {mode === "idle" && (
        <div className="bg-primary/5 border-l-4 border-secondary p-5">
          <p className="text-sm font-bold text-primary mb-3">Tips for a great 30–60 second story:</p>
          <ul className="space-y-1.5 text-sm text-copy-muted">
            {[
              "Hold your phone vertically (portrait) — your face will fill the frame",
              "Face a window or light source — avoid backlighting",
              "Tell us: what you use LAVA for + your favourite feature",
              "Be yourself — natural and honest is always best",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-secondary shrink-0 font-bold">✓</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative bg-black aspect-[9/16] sm:aspect-video overflow-hidden rounded-none">
        <video ref={videoRef} muted playsInline
          className={`w-full h-full object-cover ${mode === "recording" ? "block" : "hidden"}`} />
        <video ref={previewRef} controls
          className={`w-full h-full object-cover ${mode === "preview" || mode === "uploading" ? "block" : "hidden"}`} />
        {mode === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/40">
            <Video className="h-14 w-14" />
            <p className="text-sm">Camera preview will appear here</p>
          </div>
        )}
        {mode === "recording" && (
          <>
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-3 py-1.5">
              <span className="h-2 w-2 bg-white rounded-full animate-pulse" />
              REC {fmt(seconds)} / {fmt(MAX_SECONDS)}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div className="h-full bg-secondary transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          </>
        )}
        {mode === "preview" && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5">
            Preview — happy with it?
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {mode === "idle" && (
          <button onClick={startRecording}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-4 hover:bg-red-700 transition-colors">
            <Circle className="h-4 w-4 fill-white" /> Start Recording
          </button>
        )}
        {mode === "recording" && (
          <button onClick={stopRecording}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 hover:bg-primary-dark transition-colors">
            <StopCircle className="h-4 w-4" /> Stop &amp; Preview
          </button>
        )}
        {(mode === "preview" || mode === "uploading") && (
          <button onClick={retake} disabled={mode === "uploading"}
            className="flex items-center justify-center gap-2 border border-border px-6 py-4 text-sm font-bold text-primary hover:border-primary transition-colors disabled:opacity-40">
            <RotateCcw className="h-4 w-4" /> Retake
          </button>
        )}
      </div>

      {(mode === "preview" || mode === "uploading" || mode === "error") && (
        <div className="space-y-5 border-t border-border pt-6">
          <p className="text-sm font-bold text-primary">Almost done — tell us who you are:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-copy mb-1.5">
                Your name <span className="text-red-500">*</span>
              </label>
              <input required type="text" placeholder="e.g. Riël Aucamp"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-copy mb-1.5">
                Your LAVA machine
              </label>
              <select value={product} onChange={(e) => setProduct(e.target.value)}
                className="w-full border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors">
                <option value="">Select…</option>
                {MACHINES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={permission} onChange={(e) => setPermission(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary" />
            <span className="text-sm text-copy leading-relaxed">
              I give Lava-SA permission to publish this video on their website and social media.
            </span>
          </label>

          {mode === "error" && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">
              Upload failed. Please try again or WhatsApp Anneke at +27 72 160 5556.
            </p>
          )}

          <button onClick={handleUpload} disabled={!name || !permission || mode === "uploading"}
            className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-bold py-4 text-base hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {mode === "uploading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading your story…</>
            ) : (
              <><Upload className="h-4 w-4" /> Submit My Video Story</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB WRAPPER  — receives initial tab from server, no useSearchParams needed
// ═══════════════════════════════════════════════════════════════════════════════
export default function ReviewFormClient({ initialTab }: { initialTab: "write" | "video" }) {
  const [tab, setTab] = useState<"write" | "video">(initialTab);

  return (
    <>
      <div className="flex border-b border-border mb-8 -mx-8 sm:-mx-10 px-8 sm:px-10">
        <button onClick={() => setTab("write")}
          aria-pressed={tab === "write"}
          className={`flex items-center gap-2 px-1 pb-4 mr-8 text-sm font-bold border-b-2 transition-colors ${
            tab === "write" ? "border-primary text-primary" : "border-transparent text-copy-muted hover:text-primary"
          }`}>
          <MessageSquare className="h-4 w-4" />
          Write a Review
        </button>
        <button onClick={() => setTab("video")}
          aria-pressed={tab === "video"}
          className={`flex items-center gap-2 px-1 pb-4 text-sm font-bold border-b-2 transition-colors ${
            tab === "video" ? "border-secondary text-secondary" : "border-transparent text-copy-muted hover:text-secondary"
          }`}>
          <Video className="h-4 w-4" />
          Record Your Story
          <span className="ml-1 bg-secondary text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5">
            New
          </span>
        </button>
      </div>

      {tab === "write" ? <WrittenReviewForm /> : <VideoReviewForm />}
    </>
  );
}
