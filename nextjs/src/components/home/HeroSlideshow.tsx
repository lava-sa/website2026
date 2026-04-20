"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Slide Data ────────────────────────────────────────────────────────────────
const slides = [
  {
    id: 1,
    image: "/images/headers/lava-sa-vacuum-sealers-header-pick-001.jpg",
    tag: "German Engineering · Since 2007",
    headline: "The Gold Standard of",
    headlineAccent: "Vacuum Sealing.",
    body: "From our factory in Germany to your kitchen in South Africa. Hospital-grade vacuum technology trusted by 350,000+ experts worldwide.",
    cta: { label: "Shop Machines", href: "/products/vacuum-machines" },
    ctaSecondary: { label: "Why Choose Lava?", href: "/why-choose-lava" },
  },
  {
    id: 2,
    image: "/images/homepage/lava-precision-durability.webp",
    tag: "Hunters · Chefs · Butchers",
    headline: "Seal it once.",
    headlineAccent: "Keep it for years.",
    body: "The V.300 creates a near-perfect vacuum — keeping meat, fish, and produce fresh for up to 5× longer than traditional methods.",
    cta: { label: "Shop Machines", href: "/products/vacuum-machines" },
    ctaSecondary: { label: "For Hunters & Game", href: "/applications/hunter-game" },
  },
  {
    id: 3,
    image: "/images/homepage/lava-german-quality.webp",
    tag: "Fresh Food · Less Waste",
    headline: "Fresh Food,",
    headlineAccent: "Longer.",
    body: "Cut household food waste by up to 80%. Lock in flavour, texture, and nutrients — with no chemicals and no compromise.",
    cta: { label: "Shop Machines", href: "/products/vacuum-machines" },
    ctaSecondary: { label: "Home Kitchen", href: "/applications/kitchen" },
  },
  {
    id: 4,
    image: "/images/headers/lava-sa-vacuum-sealers-header-pick-004.jpg",
    tag: "Hunters & Game Farmers",
    headline: "Protect Your Hunt.",
    headlineAccent: "Preserve Your Harvest.",
    body: "Vacuum seal game meat for up to 3 years without freezer burn. Trusted by South Africa's 350,000 registered hunters.",
    cta: { label: "For Hunters & Game", href: "/applications/hunter-game" },
    ctaSecondary: { label: "Shop Machines", href: "/products/vacuum-machines" },
  },
  {
    id: 5,
    image: "/images/headers/lava-sa-vacuum-sealers-header-pick-012.webp",
    tag: "Huntex 2026 · Hall 4, Stand 465",
    headline: "See Us at",
    headlineAccent: "Huntex 2026.",
    body: "24–27 April 2026. Visit us at Hall 4, Stand 465 — live demos, expert advice, and show-only specials you won't find online.",
    cta: { label: "Get Directions", href: "/contact" },
    ctaSecondary: { label: "Shop Online", href: "/products/vacuum-machines" },
  },
];

const SLIDE_DURATION = 6000; // ms

// ── Component ─────────────────────────────────────────────────────────────────
const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goTo = useCallback(
    (index: number) => {
      if (transitioning || index === current) return;
      setTransitioning(true);
      setProgress(0);
      setCurrent(index);
      setTimeout(() => setTransitioning(false), 700);
    },
    [transitioning, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo]);

  // ── Auto-advance ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    autoTimer.current = setTimeout(next, SLIDE_DURATION);
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [paused, next, current]);

  // ── Progress bar ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100));
    }, 40);
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [current, paused]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-primary"
      style={{ height: "calc(100svh - 0px)", minHeight: "560px", maxHeight: "900px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Background Images ─────────────────────────────────────────────── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === current ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== current}
        >
          <Image
            src={s.image}
            alt=""
            fill
            className="object-cover object-center"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/55 to-primary/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── Slide Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full section-container flex flex-col justify-center pb-32 pt-8">
        {/* Key forces React to re-animate text on slide change */}
        <div className="max-w-2xl" key={current}>
          {/* Tag pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both">
            <span className="h-2 w-2 rounded-full bg-secondary shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {slide.tag}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-[family-name:var(--font-montserrat)] text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.08] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-600 delay-75 fill-mode-both"
          >
            {slide.headline}{" "}
            <span className="text-secondary">{slide.headlineAccent}</span>
          </h1>

          {/* Body */}
          <p className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-600 delay-150 fill-mode-both">
            {slide.body}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200 fill-mode-both">
            <Link
              href={slide.cta.href}
              className="btn-primary py-4 px-8 text-base group"
            >
              {slide.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href={slide.ctaSecondary.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white border border-white/30 rounded hover:bg-white/10 hover:border-white/50 transition-all duration-200"
            >
              {slide.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Prev / Next Arrows ───────────────────────────────────────────── */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── Bottom Bar: Trust pills + Dots + Counter ─────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Trust pills — desktop only */}
        <div className="section-container hidden lg:flex items-center gap-3 mb-5">
          {["2-Year Warranty", "Free Shipping over R2,500", "German Engineering"].map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
              <span className="text-white/75 text-xs font-semibold tracking-wide">{t}</span>
            </div>
          ))}
        </div>

        {/* Dots + progress + counter */}
        <div className="section-container flex items-center gap-3 pb-7">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "relative h-[3px] rounded-full overflow-hidden transition-all duration-300 focus-visible:outline-none",
                i === current ? "w-14 bg-white/25" : "w-7 bg-white/25 hover:bg-white/40"
              )}
            >
              {i === current && (
                <div
                  className="absolute inset-y-0 left-0 bg-secondary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}

          <span className="ml-auto text-white/40 text-[11px] font-bold tabular-nums tracking-wider">
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSlideshow;
