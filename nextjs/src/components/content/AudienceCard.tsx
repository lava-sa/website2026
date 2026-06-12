import { CheckCircle } from "lucide-react";

type Props = {
  id: string;
  title: string;
  description: string;
};

/** "Who benefits" card — <h4> title inside <article> (nested under section <h2>). */
export default function AudienceCard({ id, title, description }: Props) {
  return (
    <article id={id} className="audience-card flex items-start gap-2 border border-border p-4">
      <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" aria-hidden />
      <div>
        <h4 className="font-bold text-primary text-sm leading-snug">{title}</h4>
        <p className="text-xs text-copy-muted mt-0.5 leading-relaxed">{description}</p>
      </div>
    </article>
  );
}
