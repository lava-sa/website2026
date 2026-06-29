import { Check, Circle } from "lucide-react";
import type { OrderTimelineStep } from "@/lib/order-status";

export default function OrderStatusTimeline({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const dotClass =
          step.state === "complete"
            ? "bg-emerald-500 text-white"
            : step.state === "current"
            ? "bg-secondary text-white"
            : "bg-surface border-2 border-border text-copy-muted";

        return (
          <li key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${dotClass}`}
              >
                {step.state === "complete" ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <Circle className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                )}
              </span>
              {!isLast && (
                <span
                  className={`w-0.5 flex-1 min-h-[2rem] ${
                    step.state === "complete" ? "bg-emerald-300" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
              <p
                className={`font-bold text-sm ${
                  step.state === "upcoming" ? "text-copy-muted" : "text-primary"
                }`}
              >
                {step.label}
                {step.state === "current" && (
                  <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-secondary">
                    Current
                  </span>
                )}
              </p>
              <p className="text-sm text-copy-muted mt-1 leading-relaxed">{step.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
