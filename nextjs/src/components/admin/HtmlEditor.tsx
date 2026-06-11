"use client";

import { useRef } from "react";
import { Bold, Italic, List, Link2, Heading3, Pilcrow } from "lucide-react";

type HtmlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  /** basic = bold/italic only; full = headings, lists, links */
  mode?: "basic" | "full";
  rows?: number;
  placeholder?: string;
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  value: string,
  onChange: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.substring(start, end) || "text";
  const next =
    value.substring(0, start) + before + selected + after + value.substring(end);
  onChange(next);
  requestAnimationFrame(() => {
    textarea.focus();
    const cursor = start + before.length + selected.length;
    textarea.setSelectionRange(cursor, cursor);
  });
}

export default function HtmlEditor({
  value,
  onChange,
  mode = "full",
  rows = 6,
  placeholder,
}: HtmlEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(before: string, after: string) {
    if (!ref.current) return;
    wrapSelection(ref.current, before, after, value, onChange);
  }

  const btn =
    "inline-flex items-center gap-1 border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700 hover:border-primary hover:text-primary transition-colors";

  return (
    <div className="border border-gray-200">
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <button type="button" className={btn} onClick={() => apply("<strong>", "</strong>")} title="Bold">
          <Bold className="h-3.5 w-3.5" /> Bold
        </button>
        <button type="button" className={btn} onClick={() => apply("<em>", "</em>")} title="Italic">
          <Italic className="h-3.5 w-3.5" /> Italic
        </button>
        {mode === "full" && (
          <>
            <button type="button" className={btn} onClick={() => apply("<p>", "</p>")} title="Paragraph">
              <Pilcrow className="h-3.5 w-3.5" /> Para
            </button>
            <button type="button" className={btn} onClick={() => apply("<h3>", "</h3>")} title="Heading">
              <Heading3 className="h-3.5 w-3.5" /> H3
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => apply("<ul>\n<li>", "</li>\n</ul>")}
              title="Bullet list"
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => apply('<a href="https://">', "</a>")}
              title="Link"
            >
              <Link2 className="h-3.5 w-3.5" /> Link
            </button>
          </>
        )}
        <button type="button" className={btn} onClick={() => apply("<br />", "")} title="Line break">
          BR
        </button>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm focus:outline-none resize-y min-h-[80px]"
      />
      {value && (
        <div className="border-t border-gray-100 bg-gray-50/80 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1">Preview</p>
          <div
            className="prose prose-sm max-w-none text-gray-700 [&>p]:mb-2"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  );
}
