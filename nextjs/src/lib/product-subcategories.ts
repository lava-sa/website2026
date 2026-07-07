/**
 * Sub-category configuration for the admin product editor.
 *
 * The public site has no `parent_id` hierarchy in the DB — sub-category pages
 * (e.g. Butchery → Scales, Hanging Systems) filter products by `tags`.
 * This module maps each top-level category slug to the sub-categories a product
 * can belong to, and provides helpers to read/write the relevant tags WITHOUT
 * clobbering unrelated descriptive/search tags (e.g. "100kg", "set").
 */

export type SubCategoryOption = {
  /** Human label shown in admin */
  label: string;
  /** The canonical tag written when this sub-category is selected */
  primaryTag: string;
  /**
   * All tags that place a product on this sub-category page.
   * Used to (a) detect current membership and (b) strip on save so a product
   * can be cleanly removed from a sub-category.
   */
  tags: string[];
};

/** Keyed by top-level category slug. */
export const SUBCATEGORY_GROUPS: Record<string, SubCategoryOption[]> = {
  "butchery-accessories": [
    { label: "Machinery", primaryTag: "machinery", tags: ["machinery", "mincer", "sausage-filler"] },
    { label: "Cutting & Display Boards", primaryTag: "cutting-board", tags: ["cutting-board", "display-board", "salmon-board", "boards"] },
    { label: "Knives", primaryTag: "knife", tags: ["knife", "knife-set"] },
    { label: "Hanging Systems", primaryTag: "hanging", tags: ["hanging"] },
    { label: "Protective Gear", primaryTag: "protective", tags: ["protective"] },
    { label: "Scales", primaryTag: "scale", tags: ["scale"] },
    { label: "Tools", primaryTag: "tools", tags: ["tools"] },
  ],
  "containers-lids": [
    { label: "Acrylic Containers", primaryTag: "acrylic", tags: ["acrylic"] },
    { label: "Stainless Steel Containers", primaryTag: "stainless-steel", tags: ["stainless-steel"] },
    { label: "Acrylic Lids", primaryTag: "lid", tags: ["lid"] },
    { label: "Glass Jar Sealer", primaryTag: "jar-sealer", tags: ["jar-sealer"] },
  ],
  "spare-parts": [
    { label: "Sealing Strips", primaryTag: "sealing-strip", tags: ["sealing-strip"] },
    { label: "Liquid Trap Lids", primaryTag: "liquid-trap", tags: ["liquid-trap"] },
    { label: "Vacuum Seals", primaryTag: "vacuum-seals", tags: ["vacuum-seals"] },
  ],
  "sous-vide": [
    { label: "Circulators", primaryTag: "circulator", tags: ["circulator"] },
    { label: "Complete Sets", primaryTag: "complete-set", tags: ["complete-set"] },
  ],
};

export function getSubCategoryOptions(categorySlug: string | null | undefined): SubCategoryOption[] {
  if (!categorySlug) return [];
  return SUBCATEGORY_GROUPS[categorySlug] ?? [];
}

/** Which sub-categories (by primaryTag) a product currently belongs to. */
export function getSelectedSubCategoryTags(
  existingTags: string[] | null | undefined,
  categorySlug: string | null | undefined
): string[] {
  const options = getSubCategoryOptions(categorySlug);
  const tags = existingTags ?? [];
  return options
    .filter((opt) => opt.tags.some((t) => tags.includes(t)))
    .map((opt) => opt.primaryTag);
}

/**
 * Merge selected sub-categories back into the full tags array:
 * - strips every tag managed by this category's sub-categories
 * - re-adds the canonical tag for each selected sub-category
 * - preserves all unrelated tags (sizes, "set", search terms, etc.)
 */
export function applySubCategorySelection(
  existingTags: string[] | null | undefined,
  categorySlug: string | null | undefined,
  selectedPrimaryTags: string[]
): string[] {
  const options = getSubCategoryOptions(categorySlug);
  if (options.length === 0) return existingTags ?? [];

  const managed = new Set(options.flatMap((opt) => opt.tags));
  const preserved = (existingTags ?? []).filter((t) => !managed.has(t));
  const additions = options
    .filter((opt) => selectedPrimaryTags.includes(opt.primaryTag))
    .map((opt) => opt.primaryTag);

  return Array.from(new Set([...preserved, ...additions]));
}
