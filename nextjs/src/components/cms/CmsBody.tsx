/** Renders sanitized-ish CMS HTML (admin-only authors). */
export default function CmsBody({
  html,
  className = "prose prose-lg max-w-none text-copy",
}: {
  html: string;
  className?: string;
}) {
  if (!html?.trim()) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
