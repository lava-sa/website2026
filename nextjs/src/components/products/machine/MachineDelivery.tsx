import { Box, Check } from "lucide-react";

interface MachineDeliveryProps {
  items: string[];
}

export default function MachineDelivery({ items }: MachineDeliveryProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-surface border-b border-border">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-1">
            <div className="inline-flex items-center justify-center h-14 w-14 bg-primary/10 mb-6">
              <Box className="h-7 w-7 text-primary" />
            </div>
            <p className="overline mb-3">In the box</p>
            <h2 className="text-3xl font-black text-primary leading-tight mb-4">
              What&apos;s Included
            </h2>
            <p className="text-sm text-copy-muted leading-relaxed">
              Everything you need to start vacuum sealing the day your delivery arrives.
              No extras to buy.
            </p>
          </div>

          <div className="lg:col-span-2">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 bg-white border border-border p-8">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-sm text-copy">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
