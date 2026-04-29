/**
 * Lava-SA — Update V.100 + V.300 Premium X short + long descriptions
 * Run: node scripts/update-v100-v300-content.mjs
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

const updates = [
  {
    slug: "v100-premium-x",
    short_description: `<p>Turn your fresh harvest — <strong>venison, fish, or homegrown produce</strong> — into <strong>restaurant-worthy packages</strong> that stay fresh for months.</p>
<p>The <strong>Lava V.100 Premium X</strong> is built to last a lifetime, with a <strong>powerful pump</strong> and <strong>double seal</strong> that hunters, anglers, and home chefs trust to protect their best work.</p>
<p>One purchase. Years of use. Zero compromise.</p>`,
    description: `<h3>Built for the Hunt and the Haul</h3>
<p>Feel the satisfying click as the <strong>double seal</strong> locks in — and pull out an airtight pack that stays fresh for months. Hunters and anglers know the difference: a <strong>proper vacuum</strong> that protects prized game meat from leaks and spoilage, every single time.</p>

<h3>Professional-Grade Power</h3>
<p>The V.100 Premium X delivers up to <strong>−0.94 bar vacuum</strong> through a heavy-duty pump backed by a <strong>lifetime warranty</strong>. It handles up to <strong>1,000 seals</strong> without breaking stride — the kind of workhorse small businesses and serious home kitchens rely on.</p>

<h3>Made for Your Craft</h3>
<p>Whether you're portioning wild game, prepping for <strong>sous-vide</strong>, or packaging fillets for the freezer, the <strong>bar display</strong> and <strong>adjustable controls</strong> put you fully in command. The build feels solid in your hands — exactly what a tool you'll use for years should feel like.</p>

<h3>A Purchase That Lasts</h3>
<p>Owners say it best: <em>"Top quality. You can tell the difference from cheaper products."</em> Many return to Lava after a decade with their previous model — that's the kind of trust this machine earns through every seal.</p>

<p>With the <strong>Lava V.100 Premium X</strong>, you're not just sealing food. You're protecting <strong>the stories behind every catch, every harvest, and every meal</strong>.</p>`,
  },
  {
    slug: "v300-premium-x",
    short_description: `<p>Turn <strong>wild game, fresh fish, or market produce</strong> into flawless, professional-grade packages that stay fresh for months.</p>
<p>The <strong>Lava V.300 Premium X</strong> is the workhorse hunters, anglers, butchers, and home producers reach for — a <strong>weighty, powerful machine</strong> that owners describe as <em>"very well built, very powerful and very efficient."</em></p>
<p>Built once. Trusted for life.</p>`,
    description: `<h3>Pro-Grade Sealing, Every Single Time</h3>
<p>Feel the satisfying click as the <strong>double weld seam</strong> locks in — and pull out a vacuum-sealed package of venison or salmon that stays pristine and shielded from freezer burn for months. The <strong>pressure gauge</strong> keeps a steady watch so every seal is spot-on. Owners say it best: <em>"This vacuum packer is doing exactly what it is designed for with great efficiency and ease."</em></p>

<h3>Brand-Building Quality for Home Producers</h3>
<p>For biltong-makers, butchers, and small-batch food businesses, the V.300 Premium X turns your products into <strong>shelf-ready, customer-pulling premium</strong>. Vacuum packs come out crystal-clear, airtight, and unmistakably professional — the kind that converts curiosity into sales. As one owner puts it: <em>"I can feel the difference to any other vacuum sealer — in weight, sound and user-friendliness."</em></p>

<h3>Built to Be the One You Keep</h3>
<p>The <strong>turbo pump</strong> pulls a <strong>strong −0.94 bar vacuum</strong> with a smooth, quiet rhythm. <strong>Automatic mode</strong> with adjustable controls makes daily use effortless, whether you're prepping <strong>sous-vide</strong>, <strong>dry-aged cuts</strong>, or batch-sealing the season's catch. The robust build is exactly what you'd expect from a tool that lasts.</p>

<h3>The Workhorse, Built for Life</h3>
<p>This is a <strong>professional machine</strong> rated for <strong>1,000 seals</strong> and backed by a <strong>lifetime pump warranty</strong>. Long-time owners come back to Lava year after year — <em>"Above expectation. Exactly what I was looking for."</em></p>

<p>With the <strong>Lava V.300 Premium X</strong>, you're not just sealing food. You're <strong>safeguarding every venison haunch, every fish fillet, and every family feast</strong> — one flawless pack at a time.</p>`,
  },
];

for (const u of updates) {
  const { data: existing, error: findErr } = await supabase
    .from("products")
    .select("id, name, short_description, description")
    .eq("slug", u.slug)
    .single();

  if (findErr) {
    console.error(`✗ ${u.slug}:`, findErr.message);
    continue;
  }

  const { error: updErr } = await supabase
    .from("products")
    .update({
      short_description: u.short_description,
      description: u.description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (updErr) {
    console.error(`✗ ${existing.name}:`, updErr.message);
    continue;
  }

  console.log(`✅ ${existing.name}`);
  console.log(`   short: ${u.short_description.length} chars · long: ${u.description.length} chars`);
}
