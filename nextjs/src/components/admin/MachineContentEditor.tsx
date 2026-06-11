"use client";

import { Plus, Trash2 } from "lucide-react";
import type { MachineContentForm } from "@/lib/machine-content-admin";

const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";
const inputCls =
  "w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors";

type Props = {
  value: MachineContentForm;
  onChange: (value: MachineContentForm) => void;
};

export default function MachineContentEditor({ value, onChange }: Props) {
  function patch(partial: Partial<MachineContentForm>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-gray-500 leading-relaxed">
        These fields power the machine product page sections: Functions, What&apos;s in the box,
        Video, Download Manual, and FAQ. Leave blank to hide a section on the storefront.
      </p>

      {/* Video */}
      <div className="border border-gray-100 p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Product Video</h3>
        <div>
          <label className={labelCls}>Video title</label>
          <input
            type="text"
            value={value.videoTitle}
            onChange={(e) => patch({ videoTitle: e.target.value })}
            placeholder="e.g. V.300 Premium X — vacuum sealing demo"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>YouTube or video URL</label>
          <input
            type="url"
            value={value.videoUrl}
            onChange={(e) => patch({ videoUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=... or embed URL"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Video description (optional)</label>
          <textarea
            value={value.videoDescription}
            onChange={(e) => patch({ videoDescription: e.target.value })}
            rows={2}
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {/* Manual */}
      <div className="border border-gray-100 p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Download Manual</h3>
        <div>
          <label className={labelCls}>Manual title</label>
          <input
            type="text"
            value={value.manualTitle}
            onChange={(e) => patch({ manualTitle: e.target.value })}
            placeholder="Instruction Manual (English)"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>PDF URL</label>
          <input
            type="url"
            value={value.manualUrl}
            onChange={(e) => patch({ manualUrl: e.target.value })}
            placeholder="/downloads/manuals/v300-premium-en.pdf"
            className={inputCls}
          />
          <p className="text-xs text-gray-400 mt-1">
            Upload PDF to Supabase storage or <code className="text-[10px]">public/downloads/</code>, then paste the URL.
          </p>
        </div>
        <div>
          <label className={labelCls}>Language</label>
          <select
            value={value.manualLanguage}
            onChange={(e) => patch({ manualLanguage: e.target.value })}
            className={inputCls}
          >
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Multi-language">Multi-language</option>
          </select>
        </div>
      </div>

      {/* Functions */}
      <div className="border border-gray-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Functions &amp; Features</h3>
          <button
            type="button"
            onClick={() =>
              patch({
                functions: [...value.functions, { title: "", description: "" }],
              })
            }
            className="inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {value.functions.map((fn, i) => (
          <div key={i} className="border border-gray-200 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-gray-400">Item {i + 1}</span>
              {value.functions.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    patch({ functions: value.functions.filter((_, idx) => idx !== i) })
                  }
                  className="text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={fn.title}
              onChange={(e) => {
                const functions = [...value.functions];
                functions[i] = { ...functions[i], title: e.target.value };
                patch({ functions });
              }}
              placeholder="Feature title"
              className={inputCls}
            />
            <textarea
              value={fn.description}
              onChange={(e) => {
                const functions = [...value.functions];
                functions[i] = { ...functions[i], description: e.target.value };
                patch({ functions });
              }}
              placeholder="Feature description"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        ))}
      </div>

      {/* Delivery */}
      <div className="border border-gray-100 p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">What&apos;s in the Box</h3>
        <textarea
          value={value.deliveryContents}
          onChange={(e) => patch({ deliveryContents: e.target.value })}
          rows={5}
          placeholder="One item per line&#10;V.300 Premium X vacuum sealer&#10;Vacuum hose&#10;Instruction manual"
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* FAQ */}
      <div className="border border-gray-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">FAQ</h3>
          <button
            type="button"
            onClick={() => patch({ faq: [...value.faq, { question: "", answer: "" }] })}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {value.faq.map((item, i) => (
          <div key={i} className="border border-gray-200 p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-gray-400">Q&amp;A {i + 1}</span>
              {value.faq.length > 1 && (
                <button
                  type="button"
                  onClick={() => patch({ faq: value.faq.filter((_, idx) => idx !== i) })}
                  className="text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={item.question}
              onChange={(e) => {
                const faq = [...value.faq];
                faq[i] = { ...faq[i], question: e.target.value };
                patch({ faq });
              }}
              placeholder="Question"
              className={inputCls}
            />
            <textarea
              value={item.answer}
              onChange={(e) => {
                const faq = [...value.faq];
                faq[i] = { ...faq[i], answer: e.target.value };
                patch({ faq });
              }}
              placeholder="Answer"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
        ))}
      </div>

      {/* Technical specs */}
      <div className="border border-gray-100 p-4 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">Technical Specifications Table</h3>
        <p className="text-xs text-gray-500">Shown in the Specifications section on the product page.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {value.techSpecs.map((spec, i) => (
            <div key={spec.key}>
              <label className={labelCls}>{spec.key.replace(/_/g, " ")}</label>
              <input
                type="text"
                value={spec.value}
                onChange={(e) => {
                  const techSpecs = [...value.techSpecs];
                  techSpecs[i] = { ...techSpecs[i], value: e.target.value };
                  patch({ techSpecs });
                }}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
