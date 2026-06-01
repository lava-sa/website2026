import { CheckCircle2 } from "lucide-react";
import type { ProductHighlight } from "@/lib/product-highlights";

export default function ProductHighlights({ items }: { items: ProductHighlight[] }) {
  if (!items.length) return null;

  return (
    <section id="highlights" className="py-20 bg-surface border-t border-border">
      <div className="section-container">
        <div className="mb-10 max-w-2xl">
          <p className="overline mb-2">Practical benefits</p>
          <h2 className="text-3xl font-bold text-primary">Key Uses &amp; Features</h2>
          <p className="mt-3 text-copy-muted text-sm leading-relaxed">
            What this product is for — at a glance. Customer reviews for this item will appear here
            once verified buyers share feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {items.map((item) => (
            <div
              key={item.title + item.description.slice(0, 24)}
              className="bg-white border border-border p-6 flex flex-col gap-3"
            >
              <CheckCircle2 className="h-6 w-6 text-secondary shrink-0" aria-hidden />
              <h3 className="text-base font-black text-primary leading-snug">{item.title}</h3>
              <p className="text-sm text-copy leading-relaxed flex-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
