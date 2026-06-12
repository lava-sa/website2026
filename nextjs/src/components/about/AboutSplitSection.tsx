import Image from "next/image";
import type { CmsSplitSection } from "@/lib/content/site-pages-types";

type Props = {
  section: CmsSplitSection;
  children?: React.ReactNode;
  accent?: "bottom-right" | "top-left";
};

export default function AboutSplitSection({ section, children, accent }: Props) {
  const imageLeft = section.imageSide !== "right";

  const imageBlock = section.image?.src ? (
    <div className={`group relative mx-auto w-full max-w-md lg:max-w-none ${imageLeft ? "order-2 lg:order-1" : ""}`}>
      <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
        <Image
          src={section.image.src}
          alt={section.image.alt}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        {(section.image.captionTitle || section.image.captionLocation) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-6">
            {section.image.captionLocation && (
              <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">
                {section.image.captionLocation}
              </p>
            )}
            {section.image.captionTitle && (
              <p className="text-white font-bold text-lg">{section.image.captionTitle}</p>
            )}
            {section.image.captionSubtitle && (
              <p className="text-white/70 text-sm">{section.image.captionSubtitle}</p>
            )}
          </div>
        )}
      </div>
      {accent === "bottom-right" && (
        <div className="absolute -bottom-4 -right-4 bg-primary w-24 h-24 -z-10 hidden lg:block" />
      )}
      {accent === "top-left" && (
        <div className="absolute -top-4 -left-4 bg-secondary w-24 h-24 -z-10 hidden lg:block" />
      )}
    </div>
  ) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      {imageLeft && imageBlock}
      <div className={imageLeft ? "order-1 lg:order-2" : ""}>
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-secondary" />
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
            {section.overline}
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-primary leading-tight">{section.heading}</h2>
        {children}
      </div>
      {!imageLeft && imageBlock}
    </div>
  );
}
