/**
 * Lava-SA — Update V.100 Premium X short + long descriptions
 * Run: node scripts/update-v100-content.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.local
const env = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();

const supabase = createClient(
  get("NEXT_PUBLIC_SUPABASE_URL"),
  get("SUPABASE_SERVICE_ROLE_KEY")
);

const SLUG = "v100-premium-x";

const short_description =
  "Turn your fresh harvest — venison, fish, or homegrown produce — into restaurant-worthy packages that stay fresh for months. The Lava V.100 Premium X is built to last a lifetime, with a powerful pump and double seal that hunters, anglers, and home chefs trust to protect their best work. One purchase. Years of use. Zero compromise.";

const description = `<h3>Built for the Hunt and the Haul</h3>
<p>Feel the satisfying click as the <strong>double seal</strong> locks in — and pull out an airtight pack that stays fresh for months. Hunters and anglers know the difference: a <strong>proper vacuum</strong> that protects prized game meat from leaks and spoilage, every single time.</p>

<h3>Professional-Grade Power</h3>
<p>The V.100 Premium X delivers up to <strong>−0.94 bar vacuum</strong> through a heavy-duty pump backed by a <strong>lifetime warranty</strong>. It handles up to <strong>1,000 seals</strong> without breaking stride — the kind of workhorse small businesses and serious home kitchens rely on.</p>

<h3>Made for Your Craft</h3>
<p>Whether you're portioning wild game, prepping for <strong>sous-vide</strong>, or packaging fillets for the freezer, the <strong>bar display</strong> and <strong>adjustable controls</strong> put you fully in command. The build feels solid in your hands — exactly what a tool you'll use for years should feel like.</p>

<h3>A Purchase That Lasts</h3>
<p>Owners say it best: <em>"Top quality. You can tell the difference from cheaper products."</em> Many return to Lava after a decade with their previous model — that's the kind of trust this machine earns through every seal.</p>

<p>With the <strong>Lava V.100 Premium X</strong>, you're not just sealing food. You're protecting <strong>the stories behind every catch, every harvest, and every meal</strong>.</p>`;

// Find product first
const { data: existing, error: findErr } = await supabase
  .from("products")
  .select("id, name, slug, short_description, description")
  .eq("slug", SLUG)
  .single();

if (findErr) {
  console.error("Find error:", findErr.message);
  process.exit(1);
}

console.log(`Found: ${existing.name} (${existing.id})`);
console.log(`Old short_description (${existing.short_description?.length ?? 0} chars):\n${existing.short_description}\n`);
console.log(`Old description length: ${existing.description?.length ?? 0} chars\n`);

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

console.log("✅ Updated V.100 Premium X");
console.log(`New short_description (${short_description.length} chars):\n${short_description}\n`);
console.log(`New description length: ${description.length} chars`);
