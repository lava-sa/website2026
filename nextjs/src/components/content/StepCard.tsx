type Props = {
  id: string;
  step?: number;
  title: string;
  description: string;
};

/** Numbered step in a how-to article — <h3> per step. */
export default function StepCard({ id, step, title, description }: Props) {
  return (
    <article id={id} className="step-card flex gap-4 border border-border bg-surface p-4">
      {step !== undefined && (
        <div
          className="h-8 w-8 shrink-0 bg-primary text-white flex items-center justify-center text-sm font-black"
          aria-hidden
        >
          {step}
        </div>
      )}
      <div>
        <h3 className="font-bold text-primary mb-1 text-sm sm:text-base">{title}</h3>
        <p className="text-sm text-copy leading-relaxed">{description}</p>
      </div>
    </article>
  );
}
