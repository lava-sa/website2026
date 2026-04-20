import Image from "next/image";
import Link from "next/link";
import { INDUSTRIES } from "@/data/industries";

interface Props {
  industryKeys: string[];
}

export default function IndustriesSection({ industryKeys }: Props) {
  if (!industryKeys?.length) return null;

  const items = industryKeys
    .map((key) => INDUSTRIES[key])
    .filter(Boolean);

  if (!items.length) return null;

  return (
    <section className="py-20 bg-surface">
      <div className="section-container">

        {/* Header */}
        <div className="mb-12 text-center">
          <p className="overline mb-3">Built for your world</p>
          <h2 className="text-3xl font-bold text-primary">
            Industries & Applications
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-copy-muted">
            This machine is trusted across a wide range of industries.
            Tap any category to explore specific use cases and accessories.
          </p>
        </div>

        {/* Icon grid — 4 per row, last row centred */}
        <div className="flex flex-wrap justify-center gap-4">
          {items.map((industry) => (
            <Link
              key={industry.key}
              href={industry.href}
              style={{ width: "calc(25% - 12px)", minWidth: "120px" }}
              className="group flex flex-col items-center gap-3 p-5 bg-white border border-border
                         hover:border-primary hover:shadow-md transition-all duration-200 text-center"
            >
              {/* Icon */}
              <div className="relative h-14 w-14 flex items-center justify-center">
                <Image
                  src={industry.icon}
                  alt={industry.label}
                  width={56}
                  height={56}
                  className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ filter: "invert(18%) sepia(60%) saturate(500%) hue-rotate(155deg) brightness(85%)" }}
                />
              </div>

              {/* Label */}
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-primary leading-tight">
                {industry.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
