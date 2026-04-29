/**
 * Lava-SA — Update V.500 Premium short + long descriptions
 * Run: node scripts/update-v500-premium-content.mjs
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

const SLUG = "v500-premium";

const short_description = `<p>This is the <strong>flagship of the V-series</strong> — built for the highest workload, the busiest production line, and the operators who cannot afford a machine that hesitates.</p>
<p>The <strong>Lava V.500 Premium</strong> brings <strong>industrial-grade power</strong>, a <strong>commercial-strength build</strong>, and steady performance that handles a full day's volume without flinching.</p>
<p>Built for the demands of the trade.</p>`;

const description = `<h3>Engineered for High-Volume Operations</h3>
<p>The V.500 Premium is built for the busiest operators — commercial kitchens, butcheries, food producers, and packers running <strong>full daily volumes</strong>. It handles the workload with the kind of unshakeable rhythm you only get from a machine engineered for <strong>continuous professional use</strong>.</p>

<h3>Industrial Build, German Engineering</h3>
<p>From the <strong>stainless steel body</strong> to the <strong>professional pressure-gauge display</strong>, every detail signals a serious tool. Each seal closes deep and certain — the kind of finish you'd expect from a machine designed to outlast the business that bought it.</p>

<h3>The Edge That Sets Your Brand Apart</h3>
<p>For operators scaling into serious commercial production, the V.500 Premium does more than seal — it <strong>signals the level of your operation</strong>. Customers see a pristine, professional pack and read <strong>care, consistency, and quality</strong> before tasting a thing. That's how craft turns into competitive advantage.</p>

<h3>Smooth Power, Day After Day</h3>
<p>Daily use feels effortless. The V.500 responds with a <strong>purposeful hum</strong>, handling delicate produce, dense portions, jars, containers, and bulk packaging with the same composed performance. <strong>Adjustable controls</strong> let you dial in the right vacuum and seal time for every job, from light to demanding.</p>

<p>This isn't a piece of kitchen equipment. It's the <strong>operational backbone</strong> of a serious business — a tool that respects your time, your output, and your reputation. <strong>Built once. Trusted for years.</strong></p>`;

const { data: existing, error: findErr } = await supabase
  .from("products")
  .select("id, name, short_description, description")
  .eq("slug", SLUG)
  .single();

if (findErr) {
  console.error("Find error:", findErr.message);
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
