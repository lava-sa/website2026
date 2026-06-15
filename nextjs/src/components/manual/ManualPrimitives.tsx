import type { ManualCallout, ManualStep } from "@/content/v300-manual-en";
import ManualImage from "@/components/manual/ManualImage";
import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react";

export function ManualPage({
  children,
  className = "",
  dark = false,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <article
      className={`manual-page relative mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-2xl shadow-primary/10 print:shadow-none print:max-w-none ${
        dark ? "bg-primary text-white" : "bg-white text-copy"
      } ${className}`}
    >
      {children}
    </article>
  );
}

export function ManualPageHeader({
  section,
  title,
  subtitle,
}: {
  section: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b-4 border-primary px-8 pt-8 pb-5">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-secondary mb-2">{section}</p>
      <h2 className="font-heading text-2xl font-black text-primary leading-tight">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-copy-muted leading-relaxed">{subtitle}</p> : null}
    </header>
  );
}

export function ManualBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-8 py-6 space-y-4 text-[13px] leading-relaxed ${className}`}>{children}</div>;
}

export function ManualSteps({ steps }: { steps: ManualStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step) => (
        <li key={step.n} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-primary text-white text-xs font-black">
            {step.n}
          </span>
          <span className="pt-0.5">{step.text}</span>
        </li>
      ))}
    </ol>
  );
}

export function ManualBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-secondary" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    border: "border-secondary/40",
    bg: "bg-secondary/10",
    label: "Tip",
    labelColor: "text-secondary",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-500/40",
    bg: "bg-amber-50",
    label: "Caution",
    labelColor: "text-amber-800",
  },
  danger: {
    icon: ShieldAlert,
    border: "border-red-500/40",
    bg: "bg-red-50",
    label: "Warning",
    labelColor: "text-red-800",
  },
  note: {
    icon: Info,
    border: "border-primary/25",
    bg: "bg-surface",
    label: "Note",
    labelColor: "text-primary",
  },
} as const;

export function ManualCalloutBox({ callout }: { callout: ManualCallout }) {
  const style = CALLOUT_STYLES[callout.type];
  const Icon = style.icon;
  return (
    <aside className={`border-l-4 ${style.border} ${style.bg} px-4 py-3`}>
      <p className={`text-[10px] font-black uppercase tracking-widest ${style.labelColor} mb-1 flex items-center gap-1.5`}>
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {callout.title ?? style.label}
      </p>
      <p className="text-[12px] leading-relaxed">{callout.text}</p>
    </aside>
  );
}

export function ManualFigure({
  src,
  alt,
  caption,
  numberedParts,
}: {
  src: string;
  alt: string;
  caption: string;
  numberedParts?: { n: number; label: string }[];
}) {
  return (
    <figure className="space-y-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-surface">
        <ManualImage src={src} alt={alt} />
      </div>
      <figcaption className="text-[11px] text-copy-muted leading-snug">{caption}</figcaption>
      {numberedParts ? (
        <ol className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 text-[11px]">
          {numberedParts.map((part) => (
            <li key={part.n} className="flex gap-2">
              <span className="font-black text-primary">{part.n}.</span>
              <span>{part.label}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </figure>
  );
}

export function ManualPageFooter({ page, dark = false }: { page: number; dark?: boolean }) {
  return (
    <footer
      className={`absolute bottom-0 left-0 right-0 flex items-center justify-between border-t px-8 py-3 text-[9px] uppercase tracking-widest ${
        dark ? "border-white/15 text-white/50" : "border-border text-copy-muted"
      }`}
    >
      <span>Lava-SA · V.300 Series Manual</span>
      <span>{page}</span>
    </footer>
  );
}
