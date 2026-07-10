"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { MachineFaqItem } from "@/lib/machine-content";

interface MachineFAQProps {
  items: MachineFaqItem[];
  heading?: string;
  /** light = default surface; dark = primary green block (machine PDP mid-page) */
  variant?: "light" | "dark";
}

export default function MachineFAQ({
  items,
  heading = "Frequently Asked Questions",
  variant = "light",
}: MachineFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <section
      className={
        isDark
          ? "py-20 bg-primary border-b border-primary/80"
          : "py-20 bg-surface border-b border-border"
      }
    >
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div
              className={
                isDark
                  ? "inline-flex items-center justify-center h-14 w-14 bg-white/10 mb-6"
                  : "inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6"
              }
            >
              <HelpCircle className={`h-7 w-7 ${isDark ? "text-secondary" : "text-primary"}`} />
            </div>
            <p
              className={
                isDark
                  ? "text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-3"
                  : "overline mb-3"
              }
            >
              Common questions
            </p>
            <h2
              className={
                isDark
                  ? "text-3xl sm:text-4xl font-black text-white leading-tight"
                  : "text-3xl sm:text-4xl font-black text-primary leading-tight"
              }
            >
              {heading}
            </h2>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.question}
                  className="bg-white border border-border overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-surface transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-black text-primary leading-tight">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-secondary shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-border">
                      <p className="text-sm text-copy leading-relaxed pt-4">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
