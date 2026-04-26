#!/usr/bin/env node
/**
 * Batch-crop images to the same frame as the storefront (870×670, cover, centre).
 * Use when you have a folder of originals (e.g. exports from Woo) and want new files
 * for upload to Supabase or public/, without re-exporting from a design tool.
 *
 * Usage:
 *   node scripts/crop-product-catalog-images.mjs <inputDir> <outputDir>
 *
 * Example:
 *   node scripts/crop-product-catalog-images.mjs ./raw-product-photos ./public/images/products-cropped
 *
 * Output: same filenames as input; format WebP quality 90. Skips non-image files.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 870;
const H = 670;

const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".tif", ".tiff", ".avif"]);

async function main() {
  const [inputDir, outputDir] = process.argv.slice(2);
  if (!inputDir || !outputDir) {
    console.error("Usage: node scripts/crop-product-catalog-images.mjs <inputDir> <outputDir>");
    process.exit(1);
  }

  const inAbs = path.resolve(inputDir);
  const outAbs = path.resolve(outputDir);
  await fs.mkdir(outAbs, { recursive: true });

  const entries = await fs.readdir(inAbs, { withFileTypes: true });
  let n = 0;
  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!exts.has(ext)) continue;

    const base = path.basename(ent.name, ext);
    const dest = path.join(outAbs, `${base}.webp`);
    const srcPath = path.join(inAbs, ent.name);

    await sharp(srcPath)
      .resize(W, H, { fit: "cover", position: "centre" })
      .webp({ quality: 90 })
      .toFile(dest);

    n += 1;
    console.log("Wrote", path.relative(process.cwd(), dest));
  }

  console.log(`Done. ${n} image(s) → ${outAbs}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
