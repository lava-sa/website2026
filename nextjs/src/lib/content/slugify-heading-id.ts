/** Stable URL-safe id from a heading title — e.g. "Food Lasts 3–5× Longer" → "food-lasts-3-5-longer" */
export function slugifyHeadingId(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[×]/g, "x")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
