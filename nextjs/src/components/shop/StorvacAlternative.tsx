import { storvacUrlForSize } from "@/lib/storvac";

type Props = {
  width?: number | null;
  length?: number | null;
  name?: string | null;
  variant?: "card" | "cta";
};

export default function StorvacAlternative({ width, length, name, variant = "card" }: Props) {
  const match = storvacUrlForSize(width, length, name);
  if (!match) return null;

  if (variant === "card") {
    return (
      <a href={match.url} target="_blank" rel="noopener noreferrer"
        className="relative z-20 flex items-center justify-between gap-2 border border-border bg-white px-3 py-2 transition-colors hover:border-primary/40 hover:bg-surface">
        <span className="min-w-0">
          <span className="block text-[9px] font-bold uppercase tracking-wider text-copy-muted">Out of stock · value range</span>
          <span className="block truncate text-[12px] font-bold text-primary">Get this size at StorVac</span>
        </span>
        <span className="shrink-0 text-primary" aria-hidden>→</span>
      </a>
    );
  }
  return (
    <a href={match.url} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 border border-secondary/40 bg-gold-light/50 px-4 py-3 transition-colors hover:bg-gold-light">
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-copy-muted">Out of stock — need it now?</span>
        <span className="block text-sm font-bold text-primary">This {match.label} size is in stock on our value range at StorVac</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary">Shop <span aria-hidden>→</span></span>
    </a>
  );
}
