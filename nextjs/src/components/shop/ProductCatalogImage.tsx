import type { ReactNode } from "react";
import Image from "next/image";

/** Target frame for catalogue cards (matches rectangular product shots; squares crop top/bottom). */
export const PRODUCT_CATALOG_IMAGE_WIDTH = 870;
export const PRODUCT_CATALOG_IMAGE_HEIGHT = 670;

type Props = {
  src: string;
  alt: string;
  title?: string;
  /** Same breakpoints as ProductCard grid */
  sizes?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Fixed aspect ratio image area for product grids. Uses cover + center so 800×800 assets
 * are cropped to 870×670 without letterboxing; wider shots fill the frame the same way.
 */
export default function ProductCatalogImage({
  src,
  alt,
  title,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
  children,
}: Props) {
  return (
    <div
      className={`relative aspect-[870/670] w-full overflow-hidden bg-[#F2F2F2] ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        title={title}
        fill
        sizes={sizes}
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
      {children}
    </div>
  );
}
