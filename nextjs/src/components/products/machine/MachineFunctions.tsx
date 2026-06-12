import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { MachineFunctionItem } from "@/lib/machine-content";

interface MachineFunctionsProps {
  functions: MachineFunctionItem[];
  heading?: string;
}

export default function MachineFunctions({
  functions,
  heading = "Functions & Features",
}: MachineFunctionsProps) {
  if (functions.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <p className="overline mb-3">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-black text-primary leading-tight">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl">
          {functions.map((fn) => (
            <div key={fn.title} className="flex gap-4">
              <div className="shrink-0">
                <div className="h-8 w-8 bg-secondary/15 flex items-center justify-center">
                  <Check className="h-4 w-4 text-secondary" strokeWidth={3} />
                </div>
              </div>
              <div>
                <h3 className="font-black text-primary mb-2 leading-tight">
                  {fn.title}
                </h3>
                <p className="text-sm text-copy leading-relaxed">
                  {fn.description}
                </p>
                {fn.crossSellHref && fn.crossSellLabel && (
                  <Link
                    href={fn.crossSellHref}
                    className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary transition-colors mt-2"
                  >
                    {fn.crossSellLabel}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
