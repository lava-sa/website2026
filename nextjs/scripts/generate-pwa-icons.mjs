/**
 * Generate PWA icons from the square LAVA favicon (petrol bg + white "la.va" mark).
 * Source: public/images/logo/lava-favicon.png
 * Output: public/icons/*
 *
 * Run: node scripts/generate-pwa-icons.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "public/images/logo/lava-favicon.png");
const OUT = join(ROOT, "public/icons");

// Brand petrol = hsl(192, 84%, 15%) ≈ rgb(6, 58, 70)
const PETROL = { r: 6, g: 58, b: 70, alpha: 1 };

async function main() {
  await mkdir(OUT, { recursive: true });

  const meta = await sharp(SRC).metadata();
  console.log(`Source favicon: ${meta.width}x${meta.height} ${meta.format}`);

  // Standard "any" icons — favicon already has a petrol background, so a flat
  // resize keeps the mark edge-to-edge (matches the browser favicon look).
  for (const size of [192, 512]) {
    await sharp(SRC)
      .resize(size, size, { fit: "cover", kernel: "lanczos3" })
      .png()
      .toFile(join(OUT, `icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
  }

  // Maskable icon — Android masks to circle/squircle, so the mark must sit inside
  // the ~80% safe zone. Composite the mark at 62% on a full-bleed petrol square.
  const MASKABLE = 512;
  const inner = Math.round(MASKABLE * 0.62);
  const markBuffer = await sharp(SRC)
    .resize(inner, inner, { fit: "contain", background: PETROL, kernel: "lanczos3" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: MASKABLE, height: MASKABLE, channels: 4, background: PETROL },
  })
    .composite([{ input: markBuffer, gravity: "center" }])
    .png()
    .toFile(join(OUT, `icon-maskable-512.png`));
  console.log(`✓ icon-maskable-512.png`);

  // Apple touch icon — iOS rounds corners itself; keep the mark full-bleed at 180.
  await sharp(SRC)
    .resize(180, 180, { fit: "cover", kernel: "lanczos3" })
    .flatten({ background: PETROL })
    .png()
    .toFile(join(OUT, `apple-touch-icon.png`));
  console.log(`✓ apple-touch-icon.png`);

  console.log("\nAll PWA icons written to public/icons/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
