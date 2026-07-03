import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  REVIEW_SECTIONS,
  type ReviewCatalog,
  type ReviewSectionId,
  reviewsHref,
  sectionReviewCount,
} from "@/lib/reviews/navigation";

type Props = {
  catalog: ReviewCatalog;
  activeSection: ReviewSectionId;
  activeProduct?: string;
};

function NavLink({
  href,
  active,
  children,
  count,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase py-3 px-1 transition-colors whitespace-nowrap",
        active ? "text-secondary" : "text-white hover:text-secondary"
      )}
    >
      {children}
      {count != null && count > 0 && (
        <span className={cn("text-[9px] font-bold", active ? "text-white/80" : "text-white/50")}>
          ({count})
        </span>
      )}
    </Link>
  );
}

function MachineDropdown({
  activeSection,
  activeProduct,
  catalog,
}: {
  activeSection: ReviewSectionId;
  activeProduct?: string;
  catalog: ReviewCatalog;
}) {
  const machines = catalog.bySection.get("vacuum-machines") ?? [];
  const isActive = activeSection === "vacuum-machines";

  if (machines.length === 0) {
    return (
      <NavLink href={reviewsHref("vacuum-machines")} active={isActive} count={0}>
        Vacuum Machines
      </NavLink>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={reviewsHref("vacuum-machines", machines[0]?.slug)}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.12em] uppercase py-3 transition-colors",
          isActive ? "text-secondary" : "text-white hover:text-secondary"
        )}
      >
        Vacuum Machines
        <ChevronDown className="h-2.5 w-2.5 opacity-50 group-hover:rotate-180 transition-transform" />
      </Link>
      <div className="absolute top-full left-0 w-72 bg-white shadow-2xl border border-border/80 z-50 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200">
        <ul className="py-2">
          {machines.map((machine) => (
            <li key={machine.slug}>
              <Link
                href={reviewsHref("vacuum-machines", machine.slug)}
                className={cn(
                  "block px-5 py-2.5 text-[13px] font-medium transition-colors",
                  activeProduct === machine.slug
                    ? "bg-secondary/10 text-secondary font-bold"
                    : "text-copy hover:text-secondary hover:bg-gray-50/80"
                )}
              >
                {machine.label}
                <span className="text-copy-muted text-xs ml-2">({machine.reviewCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CategoryDropdown({
  sectionId,
  label,
  activeSection,
  activeProduct,
  catalog,
}: {
  sectionId: ReviewSectionId;
  label: string;
  activeSection: ReviewSectionId;
  activeProduct?: string;
  catalog: ReviewCatalog;
}) {
  const products = catalog.bySection.get(sectionId) ?? [];
  const isActive = activeSection === sectionId;

  if (products.length === 0) return null;

  if (products.length === 1) {
    return (
      <NavLink
        href={reviewsHref(sectionId, products[0].slug)}
        active={isActive}
        count={sectionReviewCount(catalog, sectionId)}
      >
        {label}
      </NavLink>
    );
  }

  return (
    <div className="relative group">
      <Link
        href={reviewsHref(sectionId, products[0]?.slug)}
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.12em] uppercase py-3 transition-colors",
          isActive ? "text-secondary" : "text-white hover:text-secondary"
        )}
      >
        {label}
        <ChevronDown className="h-2.5 w-2.5 opacity-50 group-hover:rotate-180 transition-transform" />
      </Link>
      <div className="absolute top-full left-0 w-80 bg-white shadow-2xl border border-border/80 z-50 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 max-h-80 overflow-y-auto">
        <ul className="py-2">
          {products.map((product) => (
            <li key={product.slug}>
              <Link
                href={reviewsHref(sectionId, product.slug)}
                className={cn(
                  "block px-5 py-2.5 text-[13px] font-medium transition-colors",
                  activeProduct === product.slug
                    ? "bg-secondary/10 text-secondary font-bold"
                    : "text-copy hover:text-secondary hover:bg-gray-50/80"
                )}
              >
                {product.label}
                <span className="text-copy-muted text-xs ml-2">({product.reviewCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ReviewsCategoryNav({ catalog, activeSection, activeProduct }: Props) {
  return (
    <nav className="bg-on-dark-subtle text-white border-b border-white/10" aria-label="Review categories">
      <div className="section-container">
        <div className="hidden lg:flex items-center justify-between gap-2 overflow-x-auto">
          {REVIEW_SECTIONS.map((section, index) => {
            const count = sectionReviewCount(catalog, section.id);
            if (section.id !== "general" && section.id !== "videos" && count === 0) return null;

            return (
              <div key={section.id} className="flex items-center gap-2 shrink-0">
                {index > 0 && section.id !== "general" && (
                  <span className="text-white/15 hidden xl:inline">|</span>
                )}
                {section.id === "vacuum-machines" ? (
                  <MachineDropdown
                    activeSection={activeSection}
                    activeProduct={activeProduct}
                    catalog={catalog}
                  />
                ) : section.id === "bags-rolls" || section.id === "containers-lids" ? (
                  <CategoryDropdown
                    sectionId={section.id}
                    label={section.label}
                    activeSection={activeSection}
                    activeProduct={activeProduct}
                    catalog={catalog}
                  />
                ) : (
                  <NavLink href={reviewsHref(section.id)} active={activeSection === section.id} count={count}>
                    {section.label}
                  </NavLink>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: horizontal scroll tabs */}
        <div className="lg:hidden flex gap-1 overflow-x-auto py-2 -mx-1 px-1">
          {REVIEW_SECTIONS.map((section) => {
            const count = sectionReviewCount(catalog, section.id);
            if (section.id !== "general" && section.id !== "videos" && count === 0) return null;
            const firstProduct =
              section.id === "vacuum-machines" ||
              section.id === "bags-rolls" ||
              section.id === "containers-lids"
                ? catalog.bySection.get(section.id)?.[0]?.slug
                : undefined;

            return (
              <Link
                key={section.id}
                href={reviewsHref(section.id, firstProduct)}
                className={cn(
                  "shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-2 border transition-colors",
                  activeSection === section.id
                    ? "bg-secondary text-white border-secondary"
                    : "bg-white/10 text-white border-white/20"
                )}
              >
                {section.label}
                {count > 0 ? ` (${count})` : ""}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
