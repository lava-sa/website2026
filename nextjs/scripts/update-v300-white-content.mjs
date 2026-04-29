/**
 * Lava-SA — Update V.300 White short + long descriptions
 * Run: node scripts/update-v300-white-content.mjs
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

const SLUG = "v300-white";

const short_description = `<p>Bring <strong>calm, premium confidence</strong> to every seal — the kind that makes hunters smile over perfectly preserved venison, anglers trust the catch, and home producers see their products instantly look sharper.</p>
<p>The <strong>Lava V.300 White</strong> is built for people who care deeply about quality, designed to protect <strong>effort, memory, and craft</strong> with the kind of performance owners call <em>"top quality"</em> and <em>"indispensable."</em></p>
<p>Quiet. Capable. A purchase for life.</p>`;

const description = `<h3>The Satisfaction of a Perfect Seal</h3>
<p>Watch a package pull down tight and finish with a <strong>clean, decisive seal</strong>. The Lava V.300 White makes that moment feel almost ceremonial — air leaves, the pack flattens, and the result looks restaurant-perfect, ready for the freezer, the pantry, or the next stage of prep. Owners describe it as <em>"powerful, easy to use, and beautifully made"</em> — and the experience proves it.</p>

<h3>Trusted for the Hunt and the Catch</h3>
<p>For hunters, anglers, and anyone working with fresh meat or moist food, the V.300 White earns a special kind of trust. It's the machine you reach for when the harvest matters and <strong>freezer burn isn't an option</strong>. Reviews echo the same theme: <em>"excellent vacuum result"</em> and <em>"quality and workmanship are superb."</em></p>

<h3>Brand-Building Polish for Home Producers</h3>
<p>For biltong-makers, butchers, and small-batch food businesses, vacuum-packed products simply <strong>look premium</strong>. The V.300 White turns everyday packing into <strong>brand-building presentation</strong> — the kind of polish that quietly tells customers <em>"top quality"</em> before they've even opened the pack.</p>

<h3>Calm, Capable, Dependable</h3>
<p>The <strong>pressure regulation</strong>, <strong>professional display</strong>, and steady performance give you control over delicate berries, wet marinades, game meat, jars, and containers — whatever the day calls for. Flexible without feeling complicated. Dependable without breaking stride.</p>

<p>This isn't a gadget. It's the kind of machine that becomes part of the rhythm of your kitchen and your craft — <strong>protecting what you caught, what you made, and what you want to keep at its best</strong>.</p>`;

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
