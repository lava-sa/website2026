import type { LucideIcon } from "lucide-react";

type Props = {
  /** URL-safe id for anchors / analytics — e.g. "food-lasts-longer" */
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  stat?: string;
  statLabel?: string;
  /** BEM-style hook for styling variants */
  variant?: string;
};

/**
 * Semantic feature/benefit card — title is always an <h3> inside an <article>.
 * Use a descriptive `id` (like Bricks "season-card-p3") for structure and deep links.
 */
export default function FeatureCard({
  id,
  title,
  description,
  icon: Icon,
  stat,
  statLabel,
  variant = "default",
}: Props) {
  return (
    <article
      id={id}
      className={`feature-card feature-card--${variant} border border-border bg-surface p-5`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 bg-primary/10 flex items-center justify-center shrink-0" aria-hidden>
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-primary leading-snug text-base">{title}</h3>
          {stat && (
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black text-secondary">{stat}</span>
              {statLabel && (
                <span className="text-[10px] text-copy-muted font-medium">{statLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-copy leading-relaxed">{description}</p>
    </article>
  );
}
