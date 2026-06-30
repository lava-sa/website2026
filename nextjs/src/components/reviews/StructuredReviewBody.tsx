import type { ReviewAnswer } from "@/lib/reviews/types";

type Props = {
  answers: ReviewAnswer[];
  className?: string;
  compact?: boolean;
};

/** Renders review Q&A — question in bold, answer below (matches form layout). */
export default function StructuredReviewBody({ answers, className = "", compact = false }: Props) {
  if (answers.length === 0) return null;

  return (
    <dl className={`${compact ? "space-y-3" : "space-y-4"} ${className}`}>
      {answers.map((item, idx) => (
        <div key={`${item.question}-${idx}`} className={compact ? "space-y-1" : "space-y-1.5"}>
          <dt className="text-sm font-bold text-primary leading-snug">{item.question}</dt>
          <dd className="text-sm text-copy leading-relaxed whitespace-pre-wrap">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
