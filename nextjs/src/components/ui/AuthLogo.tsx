import Image from "next/image";
import Link from "next/link";

type AuthLogoProps = {
  /** `light` = petrol logo on white/surface · `dark` = white logo on petrol */
  variant?: "light" | "dark";
  href?: string;
  className?: string;
};

/**
 * Lava-SA logo for login / gate screens — keeps branding consistent.
 */
export default function AuthLogo({
  variant = "light",
  href,
  className = "",
}: AuthLogoProps) {
  const src =
    variant === "dark"
      ? "/images/logo/lava-sa-logo-white.webp"
      : "/images/logo/lava-sa-logo-petrol.webp";

  const img = (
    <Image
      src={src}
      alt="Lava-SA"
      width={200}
      height={56}
      className={`h-14 w-auto object-contain mx-auto ${className}`.trim()}
      priority
    />
  );

  return (
    <div className="text-center mb-8">
      {href ? (
        <Link href={href} className="inline-block">
          {img}
        </Link>
      ) : (
        img
      )}
    </div>
  );
}
