/**
 * Lava-SA — Update V.300 Black short + long descriptions
 * Run: node scripts/update-v300-black-content.mjs
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

const SLUG = "v300-black";

const short_description = `<p>Step into <strong>serious work</strong> — the kind where your food, your harvest, and your craft are treated with the respect they deserve.</p>
<p>The <strong>Lava V.300 Black</strong> brings that quiet surge of confidence: <strong>powerful, precise, and beautifully made</strong>. Owners call it <em>"top quality,"</em> <em>"indispensable,"</em> and a tool <em>"for life."</em></p>
<p>Effort in. Pride out. Every single seal.</p>`;

const description = `<h3>Sealing as a Statement of Care</h3>
<p>Watch the package draw tight, flatten neatly, and finish with a <strong>confident professional seal</strong>. The V.300 Black turns the moment into something almost ceremonial — the machine hums with controlled strength, the <strong>manometer</strong> keeps the process honest, and the result looks worthy of a premium kitchen, a hunter's larder, or a small brand built on care.</p>

<h3>Where Trust Becomes Emotional</h3>
<p>For hunters and anglers, the V.300 Black is the machine you trust with your harvest. Owners describe it as <em>"very high quality,"</em> <em>"the best I've had so far,"</em> and <em>"the best vacuum sealer ever"</em> — the kind of language that only comes from years of reliable performance protecting food that matters.</p>

<h3>Brand Polish for Home Producers</h3>
<p>For biltong-makers, butchers, and small food businesses, vacuum-packed products suddenly look <strong>sharper, more professional, and more valuable</strong>. That premium presentation changes how your brand is perceived before a customer has even tasted what you made — it says you care about the details.</p>

<h3>Built for Serious Repeat Work</h3>
<p>Daily use feels smooth and assured: <em>"works perfectly,"</em> <em>"excellent workmanship,"</em> and <em>"quality that really is worth the money."</em> Whether you're sealing <strong>moist foods</strong>, <strong>soft foods</strong>, or <strong>larger bags</strong>, the V.300 Black feels dependable in the hand, controlled on the table, and <strong>steady under pressure</strong>.</p>

<p>This isn't just a kitchen appliance. It becomes part of the rhythm of your home, workshop, or business — <strong>a quiet, capable partner that protects effort and preserves flavor</strong>. The kind of rare tool that earns the words <em>"purchase for life."</em></p>`;

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
