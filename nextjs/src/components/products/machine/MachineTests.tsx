import { FileText, ExternalLink, Star } from "lucide-react";
import type { MachineTestReport } from "@/lib/machine-content";

interface MachineTestsProps {
  tests: MachineTestReport[];
  heading?: string;
}

export default function MachineTests({
  tests,
  heading = "Tested by the Experts",
}: MachineTestsProps) {
  if (tests.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-border">
      <div className="section-container">
        <div className="max-w-3xl mb-12">
          <p className="overline mb-3">Independent verdicts</p>
          <h2 className="text-3xl sm:text-4xl font-black text-primary leading-tight mb-4">
            {heading}
          </h2>
          <p className="text-copy leading-relaxed">
            German hunting, angling and consumer magazines have put Lava machines through
            independent testing for over a decade. Excerpts translated from the original reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {tests.map((test) => (
            <article
              key={test.publication + test.date}
              className="border-2 border-border bg-surface p-6 flex flex-col"
            >
              <header className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-black text-primary leading-tight mb-1">
                    {test.publication}
                  </h3>
                  {test.date && (
                    <p className="text-[11px] uppercase tracking-wider font-bold text-copy-muted">
                      {test.date}
                    </p>
                  )}
                </div>
                {test.score && (
                  <div className="inline-flex items-center gap-1.5 bg-secondary/15 px-3 py-1.5 shrink-0">
                    <Star className="h-3.5 w-3.5 text-secondary fill-secondary" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                      {test.score}
                    </span>
                  </div>
                )}
              </header>

              <blockquote className="border-l-2 border-secondary pl-4 mb-5 flex-1">
                <p className="text-sm text-copy italic leading-relaxed">
                  &ldquo;{test.keyQuote}&rdquo;
                </p>
                <footer className="text-[10px] uppercase tracking-wider text-copy-muted mt-2 font-bold">
                  Translated from German
                </footer>
              </blockquote>

              <a
                href={test.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                View original report
                <ExternalLink className="h-3 w-3" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
