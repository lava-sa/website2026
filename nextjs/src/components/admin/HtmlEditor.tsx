"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List, Link2, Heading3, Pilcrow, Type, Code2 } from "lucide-react";

type HtmlEditorProps = {
  value: string;
  onChange: (value: string) => void;
  /** basic = bold/italic only; full = headings, lists, links */
  mode?: "basic" | "full";
  rows?: number;
  placeholder?: string;
};

type EditorView = "visual" | "html";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [editorView, setEditorView] = useState<EditorView>("visual");

  function setVisualHtml(html: string) {
    if (visualRef.current) visualRef.current.innerHTML = html;
  }

  // Sync visual pane when value loads from outside (not while Anneke is typing)
  useEffect(() => {
    if (editorView !== "visual" || !visualRef.current) return;
    if (document.activeElement === visualRef.current) return;
    if (visualRef.current.innerHTML !== value) setVisualHtml(value);
  }, [value, editorView]);

  function switchView(next: EditorView) {
    if (next === editorView) return;
    if (next === "visual") {
      setEditorView(next);
      requestAnimationFrame(() => setVisualHtml(value));
      return;
    }
    if (visualRef.current) onChange(visualRef.current.innerHTML);
    setEditorView(next);
  }

  function syncVisual() {
    if (visualRef.current) onChange(visualRef.current.innerHTML);
  }

  function applyHtml(before: string, after: string) {
    if (!textareaRef.current) return;
    wrapSelection(textareaRef.current, before, after, value, onChange);
  }

  function applyVisual(command: string, commandValue?: string) {
    visualRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncVisual();
  }

  function applyBold() {
    if (editorView === "html") applyHtml("<strong>", "</strong>");
    else applyVisual("bold");
  }

  function applyItalic() {
    if (editorView === "html") applyHtml("<em>", "</em>");
    else applyVisual("italic");
  }

  function applyParagraph() {
    if (editorView === "html") applyHtml("<p>", "</p>");
    else applyVisual("formatBlock", "p");
  }

  function applyHeading() {
    if (editorView === "html") applyHtml("<h3>", "</h3>");
    else applyVisual("formatBlock", "h3");
  }

  function applyList() {
    if (editorView === "html") applyHtml("<ul>\n<li>", "</li>\n</ul>");
    else applyVisual("insertUnorderedList");
  }

  function applyLink() {
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    if (editorView === "html") applyHtml(`<a href="${url}">`, "</a>");
    else applyVisual("createLink", url);
  }

  function applyLineBreak() {
    if (editorView === "html") applyHtml("<br />", "");
    else applyVisual("insertLineBreak");
  }

  const btn =
    "inline-flex items-center gap-1 border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700 hover:border-primary hover:text-primary transition-colors";

  const toggleBtn = (active: boolean) =>
    `inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold transition-colors ${
      active
        ? "bg-primary text-white"
        : "bg-white text-gray-600 hover:text-primary border border-gray-200"
    }`;

  const minH = Math.max(80, rows * 24);

  return (
    <div className="border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1">
          <button type="button" className={btn} onClick={applyBold} title="Bold">
            <Bold className="h-3.5 w-3.5" /> Bold
          </button>
          <button type="button" className={btn} onClick={applyItalic} title="Italic">
            <Italic className="h-3.5 w-3.5" /> Italic
          </button>
          {mode === "full" && (
            <>
              <button type="button" className={btn} onClick={applyParagraph} title="Paragraph">
                <Pilcrow className="h-3.5 w-3.5" /> Para
              </button>
              <button type="button" className={btn} onClick={applyHeading} title="Heading">
                <Heading3 className="h-3.5 w-3.5" /> H3
              </button>
              <button type="button" className={btn} onClick={applyList} title="Bullet list">
                <List className="h-3.5 w-3.5" /> List
              </button>
              <button type="button" className={btn} onClick={applyLink} title="Link">
                <Link2 className="h-3.5 w-3.5" /> Link
              </button>
            </>
          )}
          <button type="button" className={btn} onClick={applyLineBreak} title="Line break">
            BR
          </button>
        </div>

        <div className="inline-flex rounded border border-gray-200 overflow-hidden shrink-0">
          <button
            type="button"
            className={toggleBtn(editorView === "visual")}
            onClick={() => switchView("visual")}
            title="Edit formatted text — no HTML tags"
          >
            <Type className="h-3.5 w-3.5" /> Normal
          </button>
          <button
            type="button"
            className={toggleBtn(editorView === "html")}
            onClick={() => switchView("html")}
            title="Edit raw HTML"
          >
            <Code2 className="h-3.5 w-3.5" /> HTML
          </button>
        </div>
      </div>

      {editorView === "visual" ? (
        <div
          ref={visualRef}
          contentEditable
          suppressContentEditableWarning
          onInput={syncVisual}
          onBlur={syncVisual}
          data-placeholder={placeholder}
          className="html-editor-visual w-full px-3 py-2.5 text-sm focus:outline-none prose prose-sm max-w-none text-gray-800 [&>p]:mb-2 [&>h3]:font-bold [&>h3]:text-primary empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
          style={{ minHeight: minH }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-sm font-mono focus:outline-none resize-y"
          style={{ minHeight: minH }}
        />
      )}

      {editorView === "html" && value && (
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
