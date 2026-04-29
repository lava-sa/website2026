/**
 * Lava-SA — Update V.500 Premium XXL short + long descriptions
 * Run: node scripts/update-v500-xxl-content.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const supabase = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("SUPABASE_SERVICE_ROLE_KEY")
);

// Try the obvious slug first; if not found, list candidates so we can correct.
const PRIMARY_SLUG = "v500-premium-xxl";

const short_description = `<p>This is the <strong>upper limit of the V-series</strong> — built for operators working at <strong>scale</strong>, with extra-wide sealing capacity for the largest products and the heaviest daily volumes.</p>
<p>The <strong>Lava V.500 Premium XXL</strong> brings <strong>industrial-grade power</strong>, an <strong>extra-large work surface</strong>, and the calm confidence of a machine engineered to handle whatever you put on it.</p>
<p>The biggest jobs. The same composed control.</p>`;

const description = `<h3>Built for the Largest Volumes</h3>
<p>The V.500 Premium XXL is designed for serious scale — operators handling <strong>full-day production volumes</strong>, oversized cuts, large-format packs, and the kind of throughput that smaller machines simply can't keep up with. The <strong>extra-wide sealing surface</strong> takes everything in stride.</p>

<h3>Industrial Build, German Engineering</h3>
<p>From the <strong>stainless steel body</strong> to the <strong>professional pressure-gauge display</strong>, every element of the XXL is built to outlast the business that bought it. Each seal closes <strong>deep, wide, and resolute</strong> — the kind of finish you'd put your reputation on.</p>

<h3>The Mark of a Serious Operation</h3>
<p>For commercial kitchens, food producers, and packers operating at scale, the V.500 Premium XXL doesn't just seal — it <strong>signals the level of your operation</strong>. Large-format packs come out crisp, professional, and consistent. Customers read <strong>care, scale, and capability</strong> before tasting a thing.</p>

<h3>Smooth Power Under the Heaviest Load</h3>
<p>Daily use feels effortless even at full tilt. The XXL responds with a <strong>purposeful industrial hum</strong>, handling delicate produce, dense portions, oversized cuts, jars, containers, and bulk packaging with the same composed performance. <strong>Adjustable controls</strong> let you dial in the right vacuum and seal time for every job, from light to the most demanding.</p>

<p>This is the <strong>operational backbone</strong> of a business built for scale — a tool that respects your time, your output, and your reputation, no matter how big the day. <strong>Built once. Trusted for years.</strong></p>`;

let { data: existing } = await supabase
  .from("products")
  .select("id, name, slug, short_description, description")
  .eq("slug", PRIMARY_SLUG)
  .maybeSingle();

if (!existing) {
  console.log(`Slug "${PRIMARY_SLUG}" not found. Searching candidates…`);
  const { data: matches } = await supabase
    .from("products")
    .select("id, name, slug")
    .or("slug.ilike.%xxl%,name.ilike.%xxl%");
  console.log("Candidates:", matches);
  process.exit(1);
}

const { error: updErr } = await supabase
  .from("products")
  .update({
    short_description,
    description,
    updated_at: new Date().toISOString(),
  })
  .eq("id", existing.id);

if (updErr) {
  console.error("Update error:", updErr.message);
  process.exit(1);
}

console.log(`✅ ${existing.name}`);
console.log(`   short: ${short_description.length} chars · long: ${description.length} chars`);
