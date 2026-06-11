import Image from "next/image";
import Link from "next/link";
import { Zap, Layers, Package, Sparkles, Award, ArrowRight } from "lucide-react";
import type { BenefitBlockId, MachineBenefitsConfig } from "@/lib/machine-benefits";
import {
  getGalleryUrls,
  getVisibleBenefitBlocks,
  parseMachineBenefitsFromSpecs,
  resolveBenefitImageUrl,
} from "@/lib/machine-benefits";

const BLOCK_META: Record<
  BenefitBlockId,
  {
    icon: typeof Zap;
    dark: boolean;
    imageAlt: string;
  }
> = {
  welding: { icon: Zap, dark: false, imageAlt: "Welding at the touch of a button" },
  double_seal: { icon: Layers, dark: false, imageAlt: "Double sealing with LAVA vacuum machines" },
  containers: { icon: Package, dark: false, imageAlt: "Vacuum sealing containers and jars" },
  variety: { icon: Sparkles, dark: false, imageAlt: "Limitless variety with LAVA vacuum sealing" },
  germany: { icon: Award, dark: true, imageAlt: "LAVA vacuum sealers — made in Germany" },
};

function BenefitImage({
  src,
  alt,
  className = "",
  dark = false,
}: {
  src: string;
  alt: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden ${
        dark ? "ring-1 ring-white/20" : "bg-primary-wash"
      } ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}

function BenefitText({
  blockId,
  block,
}: {
  blockId: BenefitBlockId;
  block: MachineBenefitsConfig[BenefitBlockId];
}) {
  const { icon: Icon, dark } = BLOCK_META[blockId];

  return (
    <div>
      <div
        className={`inline-flex items-center justify-center h-14 w-14 mb-6 ${
          dark ? "bg-white/10" : "bg-primary/10"
        }`}
      >
        <Icon className={`h-7 w-7 ${dark ? "text-white" : "text-primary"}`} />
      </div>
      {block.overline && (
        <p
          className={
            dark
              ? "text-[11px] font-bold uppercase tracking-widest text-secondary mb-3"
              : "overline mb-3"
          }
        >
          {block.overline}
        </p>
      )}
      <h2
        className={`text-3xl sm:text-4xl font-black mb-5 leading-tight ${
          dark ? "" : "text-primary"
        }`}
      >
        {block.title}
      </h2>
      {block.paragraph1 && (
        <p className={`leading-relaxed mb-4 ${dark ? "text-white/80" : "text-copy"}`}>
          {block.paragraph1}
        </p>
      )}
      {block.paragraph2 && (
        <p className={`leading-relaxed ${dark ? "text-white/80 mb-8" : "text-copy"}`}>
          {block.paragraph2}
        </p>
      )}
      {blockId === "containers" && block.linkHref && block.linkLabel && (
        <Link
          href={block.linkHref}
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
        >
          {block.linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
      {blockId === "germany" && block.quote && (
        <blockquote className="border-l-2 border-secondary pl-6 mt-2">
          <p className="text-white/90 italic leading-relaxed mb-3">
            &ldquo;{block.quote}&rdquo;
          </p>
          {block.quoteAttribution && (
            <footer className="text-xs font-bold uppercase tracking-wider text-secondary">
              {block.quoteAttribution}
            </footer>
          )}
        </blockquote>
      )}
    </div>
  );
}

/**
 * Per-machine benefit callouts on vacuum-machine product pages.
 * Visible blocks only — image left/right alternates by visible index (not block id).
 */
export default function MachineBenefitsShowcase({
  primaryImageUrl,
  machineName,
  specs,
  galleryImageUrls,
}: {
  primaryImageUrl?: string | null;
  machineName?: string;
  specs?: Record<string, unknown> | null;
  galleryImageUrls?: string[];
}) {
  const benefits = parseMachineBenefitsFromSpecs(specs ?? undefined);
  const galleryUrls = galleryImageUrls ?? [];
  const visibleBlocks = getVisibleBenefitBlocks(benefits);

  return (
    <section className="bg-white">
      {visibleBlocks.map((blockId, visibleIndex) => {
        const block = benefits[blockId];
        const meta = BLOCK_META[blockId];
        const imageSrc = resolveBenefitImageUrl(
          blockId,
          block,
          galleryUrls,
          primaryImageUrl
        );
        const imageAlt =
          blockId === "welding" && machineName
            ? `${machineName} vacuum sealer`
            : meta.imageAlt;

        /** Alternating layout: even = text left / image right, odd = image left / text right */
        const imageLeft = visibleIndex % 2 === 1;
        const isSurface = visibleIndex % 2 === 1 && !meta.dark;
        const wrapperCls = meta.dark
          ? "bg-primary text-white border-b border-border"
          : isSurface
            ? "bg-surface border-b border-border"
            : visibleIndex === 0
              ? "border-y border-border"
              : "border-b border-border";

        return (
          <div key={blockId} className={wrapperCls}>
            <div className="section-container py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {imageLeft ? (
                  <>
                    <BenefitImage
                      src={imageSrc}
                      alt={imageAlt}
                      dark={meta.dark}
                      className="order-2 lg:order-1"
                    />
                    <div className="order-1 lg:order-2">
                      <BenefitText blockId={blockId} block={block} />
                    </div>
                  </>
                ) : (
                  <>
                    <BenefitText blockId={blockId} block={block} />
                    <BenefitImage src={imageSrc} alt={imageAlt} dark={meta.dark} />
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
