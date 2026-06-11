import Link from "next/link";
import { Phone } from "lucide-react";
import { ANNEKE_PHONE, MAIN_PHONE } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Props = {
  /** inline = header bar; stacked = footer / help blocks */
  layout?: "inline" | "stacked";
  className?: string;
  linkClassName?: string;
  showIcon?: boolean;
  /** Show "(Anneke)" after her number */
  annekeLabel?: boolean;
};

export default function PhoneNumbers({
  layout = "stacked",
  className,
  linkClassName,
  showIcon = false,
  annekeLabel = true,
}: Props) {
  const items = [
    { phone: MAIN_PHONE, suffix: "" },
    { phone: ANNEKE_PHONE, suffix: annekeLabel ? " (Anneke)" : "" },
  ] as const;

  if (layout === "inline") {
    return (
      <div className={cn("flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5", className)}>
        {items.map(({ phone, suffix }, i) => (
          <span key={phone.tel} className="inline-flex items-center gap-1.5">
            {i > 0 && <span className="text-white/30 hidden sm:inline" aria-hidden>|</span>}
            <Link
              href={`tel:${phone.tel}`}
              className={cn(
                "inline-flex items-center gap-1 hover:text-secondary transition-colors",
                linkClassName
              )}
            >
              {showIcon && <Phone className="h-3 w-3 shrink-0" />}
              <span>{phone.displayLocal}{suffix}</span>
            </Link>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map(({ phone, suffix }) => (
        <Link
          key={phone.tel}
          href={`tel:${phone.tel}`}
          className={cn("inline-flex items-center gap-2 hover:text-secondary transition-colors", linkClassName)}
        >
          {showIcon && <Phone className="h-4 w-4 shrink-0" />}
          <span>{phone.displayLocal}{suffix}</span>
        </Link>
      ))}
    </div>
  );
}
