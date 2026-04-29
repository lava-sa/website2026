/**
 * Lava-SA — Update V.400 Premium short + long descriptions
 * Run: node scripts/update-v400-premium-content.mjs
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

const SLUG = "v400-premium";

const short_description = `<p>This is where vacuum sealing becomes <strong>entry-level industrial</strong> — built for the small business, production kitchen, or workshop that runs <strong>daily, demanding sessions</strong>.</p>
<p>The <strong>Lava V.400 Premium</strong> meets the workload with a <strong>stainless steel body</strong>, a <strong>triple seal</strong>, and the kind of steady power that doesn't flinch when you keep pressing it into service.</p>
<p>Serious work. Serious tool. Built to last.</p>`;

const description = `<h3>Built for the Volume of Real Work</h3>
<p>The V.400 Premium is engineered for <strong>back-to-back sessions</strong> — the kind of repetition that production kitchens, butcheries, packers, and growing commercial operators depend on. You keep pressing it into service, and it keeps responding with the same steady, controlled performance.</p>

<h3>The Triple-Seal Difference</h3>
<p>Watch a row of bags close with a <strong>clean, confident triple seal</strong>. The <strong>stainless steel body</strong> and <strong>professional pressure-gauge display</strong> bring the visual signal and the functional reality together — packages come out looking worthy of premium storage or premium sale.</p>

<h3>Brand Polish for Growing Businesses</h3>
<p>For a home-industry maker or a commercial kitchen scaling up, the V.400 Premium does something bigger than seal food: it <strong>upgrades perception</strong>. Vacuum-packed products suddenly look more refined, more intentional, more professional. That's how craft becomes <strong>brand value</strong> — and how customers start to see consistency, care, and seriousness before they've even opened the pack.</p>

<h3>Versatile Across Every Application</h3>
<p>Fresh produce, baked goods, marinades, jars, containers, even industrial parts — the V.400 Premium handles them all with the same composed seriousness. <strong>Adjustable controls</strong> let you dial in the right vacuum and seal time for any job, from delicate to demanding, without slowing the line.</p>

<p>This isn't a kitchen gadget. It's the tool that <strong>removes hesitation</strong> — the kind of machine that lets you focus on the work while it quietly handles the hard part with strength, steadiness, and control. A long-term commitment to quality.</p>`;

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
