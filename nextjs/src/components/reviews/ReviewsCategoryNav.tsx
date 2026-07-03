import Link from "next/link";
import { cn } from "@/lib/utils";
import ReviewsNavDropdown from "@/components/reviews/ReviewsNavDropdown";
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
    <ReviewsNavDropdown
      label="Vacuum Machines"
      href={reviewsHref("vacuum-machines", machines[0]?.slug)}
      active={isActive}
      width="w-72"
      items={machines.map(({ slug, label, reviewCount }) => ({
        slug,
        label,
        reviewCount,
        href: reviewsHref("vacuum-machines", slug),
      }))}
      activeProduct={activeProduct}
    />
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
    <ReviewsNavDropdown
      label={label}
      href={reviewsHref(sectionId, products[0]?.slug)}
      active={isActive}
      width="w-80"
      items={products.map(({ slug, label, reviewCount }) => ({
        slug,
        label,
        reviewCount,
        href: reviewsHref(sectionId, slug),
      }))}
      activeProduct={activeProduct}
    />
  );
}

export default function ReviewsCategoryNav({ catalog, activeSection, activeProduct }: Props) {
  return (
    <nav
      className="relative z-[200] bg-on-dark-subtle text-white border-b border-white/10 overflow-visible"
      aria-label="Review categories"
    >
      <div className="section-container overflow-visible">
        <div className="hidden lg:flex items-center justify-between gap-2 overflow-visible">
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
