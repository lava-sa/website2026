"use client";

import type {
  BenefitBlockId,
  BenefitImageChoice,
  MachineBenefitBlockConfig,
  MachineBenefitsConfig,
} from "@/lib/machine-benefits";
import {
  BENEFIT_BLOCK_ORDER,
  DEFAULT_MACHINE_BENEFITS,
  machineBenefitImagePath,
} from "@/lib/machine-benefits";

const BLOCK_LABELS: Record<BenefitBlockId, string> = {
  welding: "1 — Welding at the Touch of a Button",
  double_seal: "2 — Double Sealing",
  containers: "3 — Containers & Jars",
  variety: "4 — Limitless Variety",
  germany: "5 — Made in Germany / Quality",
};

const IMAGE_OPTIONS: { value: BenefitImageChoice; label: string }[] = [
  { value: "primary", label: "Primary product image" },
  { value: "001", label: "image-001.webp" },
  { value: "002", label: "image-002.webp" },
  { value: "003", label: "image-003.webp" },
  { value: "004", label: "image-004.webp" },
];

const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";
const inputCls =
  "w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors";

type Props = {
  value: MachineBenefitsConfig;
  productSlug: string;
  primaryImageUrl?: string | null;
  onChange: (value: MachineBenefitsConfig) => void;
};

export default function MachineBenefitsEditor({
  value,
  productSlug,
  primaryImageUrl,
  onChange,
}: Props) {
  function updateBlock(id: BenefitBlockId, patch: Partial<MachineBenefitBlockConfig>) {
    onChange({
      ...value,
      [id]: { ...value[id], ...patch },
    });
  }

  function resetBlock(id: BenefitBlockId) {
    onChange({ ...value, [id]: { ...DEFAULT_MACHINE_BENEFITS[id] } });
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-gray-500 leading-relaxed">
        Five benefit sections on the product page — unique text per machine. Upload{" "}
        <code className="text-[10px]">image-001.webp</code> …{" "}
        <code className="text-[10px]">image-004.webp</code> to{" "}
        <code className="text-[10px]">public/images/products/machines/{productSlug}/</code>
      </p>

      {BENEFIT_BLOCK_ORDER.map((id) => {
        const block = value[id];
        const previewPath =
          id === "welding" || block.imageChoice === "primary"
            ? primaryImageUrl || "(primary image)"
            : machineBenefitImagePath(productSlug, block.imageChoice);

        return (
          <div key={id} className="border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900">{BLOCK_LABELS[id]}</h3>
              <button
                type="button"
                onClick={() => resetBlock(id)}
                className="text-[10px] font-bold text-gray-500 hover:text-primary"
              >
                Reset to default
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Overline (gold label)</label>
                <input
                  type="text"
                  value={block.overline}
                  onChange={(e) => updateBlock(id, { overline: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Image</label>
                {id === "welding" ? (
                  <p className="text-sm text-gray-600 py-2.5 px-3 border border-gray-100 bg-gray-50">
                    Always uses the <strong>primary product image</strong>
                  </p>
                ) : (
                  <select
                    value={block.imageChoice}
                    onChange={(e) =>
                      updateBlock(id, { imageChoice: e.target.value as BenefitImageChoice })
                    }
                    className={inputCls}
                  >
                    {IMAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {id !== "welding" && (
                  <p className="text-[10px] text-gray-400 mt-1 truncate" title={String(previewPath)}>
                    Path: {previewPath}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>Heading</label>
              <input
                type="text"
                value={block.title}
                onChange={(e) => updateBlock(id, { title: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Paragraph 1</label>
              <textarea
                value={block.paragraph1}
                onChange={(e) => updateBlock(id, { paragraph1: e.target.value })}
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div>
              <label className={labelCls}>Paragraph 2 (optional)</label>
              <textarea
                value={block.paragraph2}
                onChange={(e) => updateBlock(id, { paragraph2: e.target.value })}
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>

            {id === "containers" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Link URL</label>
                  <input
                    type="text"
                    value={block.linkHref ?? ""}
                    onChange={(e) => updateBlock(id, { linkHref: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Link label</label>
                  <input
                    type="text"
                    value={block.linkLabel ?? ""}
                    onChange={(e) => updateBlock(id, { linkLabel: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {id === "germany" && (
              <>
                <div>
                  <label className={labelCls}>Customer quote</label>
                  <textarea
                    value={block.quote ?? ""}
                    onChange={(e) => updateBlock(id, { quote: e.target.value })}
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelCls}>Quote attribution</label>
                  <input
                    type="text"
                    value={block.quoteAttribution ?? ""}
                    onChange={(e) => updateBlock(id, { quoteAttribution: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
