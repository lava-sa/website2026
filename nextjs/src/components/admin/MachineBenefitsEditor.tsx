"use client";

import type {
  BenefitBlockId,
  GalleryImage,
  MachineBenefitBlockConfig,
  MachineBenefitsConfig,
} from "@/lib/machine-benefits";
import {
  BENEFIT_BLOCK_ORDER,
  DEFAULT_MACHINE_BENEFITS,
  OPTIONAL_BENEFIT_BLOCKS,
} from "@/lib/machine-benefits";
import BenefitImagePicker from "@/components/admin/BenefitImagePicker";

const BLOCK_LABELS: Record<BenefitBlockId, string> = {
  welding: "1 — Welding at the Touch of a Button",
  double_seal: "2 — Double Sealing",
  containers: "3 — Containers & Jars",
  variety: "4 — Limitless Variety",
  germany: "5 — Made in Germany / Quality",
};

const labelCls = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide";
const inputCls =
  "w-full border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors";

type Props = {
  value: MachineBenefitsConfig;
  productId: string;
  primaryImageUrl?: string | null;
  galleryImages: GalleryImage[];
  onChange: (value: MachineBenefitsConfig) => void;
};

export default function MachineBenefitsEditor({
  value,
  productId,
  primaryImageUrl,
  galleryImages,
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
        Benefit sections on the product page — unique text and images per machine.
        Images default to the product gallery; browse or upload to override.
        Sections 2, 3 and 4 can be disabled. Layout alternates left/right automatically.
      </p>

      {BENEFIT_BLOCK_ORDER.map((id) => {
        const block = value[id];
        const isOptional = OPTIONAL_BENEFIT_BLOCKS.includes(id);
        const isDisabled = isOptional && block.enabled === false;

        return (
          <div
            key={id}
            className={`border p-4 space-y-3 ${
              isDisabled ? "border-gray-100 bg-gray-50 opacity-60" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-gray-900">{BLOCK_LABELS[id]}</h3>
              <div className="flex items-center gap-3">
                {isOptional && (
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={block.enabled !== false}
                      onChange={(e) => updateBlock(id, { enabled: e.target.checked })}
                      className="h-4 w-4 accent-primary"
                    />
                    Enabled
                  </label>
                )}
                <button
                  type="button"
                  onClick={() => resetBlock(id)}
                  className="text-[10px] font-bold text-gray-500 hover:text-primary"
                >
                  Reset to default
                </button>
              </div>
            </div>

            {!isDisabled && (
              <>
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
                    <BenefitImagePicker
                      productId={productId}
                      blockId={id}
                      galleryImages={galleryImages}
                      primaryImageUrl={primaryImageUrl}
                      value={block.imageUrl}
                      onChange={(imageUrl) => updateBlock(id, { imageUrl })}
                      lockedToPrimary={id === "welding"}
                    />
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
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
