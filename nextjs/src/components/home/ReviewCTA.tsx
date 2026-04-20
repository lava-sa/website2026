"use client";

import Link from "next/link";
import { Star, Video, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ReviewCTA() {
  const [hovered, setHovered] = useState(0);

  return (
    <section className="relative overflow-hidden bg-primary py-20">

      {/* ── Decorative background elements ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large quote mark */}
        <span className="absolute -top-8 -left-4 font-heading text-[20rem] font-black leading-none text-white/[0.03] select-none">
          &ldquo;
        </span>
        <span className="absolute -bottom-16 -right-4 font-heading text-[20rem] font-black leading-none text-white/[0.03] select-none">
          &rdquo;
        </span>
        {/* Subtle grid lines */}
        <div className="absolute inset-0"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <div className="relative section-container flex justify-center">

        {/* ── Card ─────────────────────────────────────────────────── */}
        <div className="w-full max-w-[650px] bg-white shadow-2xl">

          {/* Gold top accent bar */}
          <div className="h-1.5 w-full bg-secondary" />

          <div className="px-8 py-10 sm:px-12">

            {/* Overline */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                Existing Lava Customers
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-heading text-3xl font-black text-primary leading-tight mb-4">
              Thank you for your<br />
              <span className="text-secondary">loyalty and friendship</span>
            </h2>

            {/* Body */}
            <p className="text-base text-copy leading-relaxed mb-2">
              You&apos;ve been part of the Lava family — whether you bought your first machine years ago
              or picked one up last month. Your trust means everything to us.
            </p>
            <p className="text-base text-copy leading-relaxed mb-8">
              Would you like to share your Lava story with the rest of the world?
              A written review or a short video — it takes 2 minutes and helps other South Africans
              make the right choice.
            </p>

            {/* Star display */}
            <div className="mb-8 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-7 w-7 transition-all duration-150 cursor-pointer ${
                    i <= hovered ? "fill-secondary text-secondary scale-110" : "fill-secondary/30 text-secondary/30"
                  }`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(0)}
                />
              ))}
              <span className="ml-2 text-xs text-copy-muted font-medium">
                {hovered ? ["", "Poor", "Fair", "Good", "Great", "Excellent!"][hovered] : "How would you rate your LAVA?"}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/submit-review"
                className="flex-1 flex items-center justify-center gap-2.5 bg-primary text-white font-bold py-4 text-sm hover:bg-primary-dark transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Write Your Review
              </Link>
              <Link
                href="/submit-review?tab=video"
                className="flex-1 flex items-center justify-center gap-2.5 bg-secondary text-white font-bold py-4 text-sm hover:bg-secondary/90 transition-colors"
              >
                <Video className="h-4 w-4" />
                Record Your Story
              </Link>
            </div>

            {/* Reassurance */}
            <p className="mt-4 text-center text-[11px] text-copy-muted">
              All reviews are moderated · Your details are never shared · Takes under 2 minutes
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
