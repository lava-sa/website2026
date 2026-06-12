/** Plain-language AI / GEO fields stored in product.specs */

export type ProductAiInput = {
  name: string;
  slug?: string;
  short_description?: string | null;
  categorySlug?: string;
  specs?: Record<string, unknown>;
  tags?: string[];
  industries?: string[];
};

export type ProductAiDiscoverability = {
  ai_summary: string;
  ai_search_terms: string;
  ai_use_cases: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function modelCode(name: string): string | null {
  const m = name.match(/V\.?\s*(\d+)/i);
  return m ? `V.${m[1]}` : null;
}

function sealWidthCm(specs?: Record<string, unknown>): string | null {
  const raw = String(specs?.seal_width ?? "").trim();
  const mm = raw.match(/(\d+)\s*mm/i);
  if (mm) return `${Math.round(Number(mm[1]) / 10)} cm`;
  const cm = raw.match(/(\d+(?:\.\d+)?)\s*cm/i);
  if (cm) return `${cm[1]} cm`;
  return null;
}

function bagSizeHint(name: string): string | null {
  const dims = name.match(/(\d+)\s*[×x]\s*(\d+)\s*cm/i);
  if (dims) return `${dims[1]}×${dims[2]} cm`;
  const roll = name.match(/(\d+)\s*cm\s*(?:wide|width|roll)/i);
  if (roll) return `${roll[1]} cm roll`;
  return null;
}

function summaryFromShort(name: string, short: string, categorySlug: string): string {
  const plain = stripHtml(short);
  if (plain.length >= 40) {
    const sentence = plain.match(/^[^.!?]+[.!?]/)?.[0]?.trim() ?? plain;
    return sentence.length > 220 ? `${sentence.slice(0, 217).trim()}…` : sentence;
  }

  const model = modelCode(name);

  switch (categorySlug) {
    case "vacuum-machines":
      return model
        ? `The ${name} is a German-engineered LAVA vacuum sealer for serious food preservation in South Africa — ideal when you need reliable seals for game, fish, meal prep and sous vide.`
        : `${name} is a LAVA vacuum sealer distributed in South Africa with German build quality, local warranty support and nationwide delivery.`;
    case "vacuum-bags":
      return `${name} is an embossed-channel vacuum bag compatible with LAVA and other channel-type sealers — built for freezer storage, bulk portioning and sous vide in South African kitchens.`;
    case "vacuum-rolls":
      return `${name} lets you cut custom-length embossed vacuum bags — practical for hunters, anglers and households that seal many portions in one session.`;
    case "sous-vide":
      return `${name} brings precision low-temperature cooking to home or small commercial kitchens — pair with LAVA vacuum bags for consistent results.`;
    default:
      return `${name} from Lava-SA — German LAVA quality with nationwide courier delivery and local support since 2007.`;
  }
}

function machineUseCases(name: string, specs?: Record<string, unknown>): string[] {
  const model = modelCode(name);
  const width = sealWidthCm(specs);
  const widthNote = width ? ` Fits bags and rolls up to ${width} wide.` : "";
  const n = model ? Number(model.replace("V.", "")) : 300;

  if (n <= 100) {
    return [
      `Home kitchen & beginners — Compact ${name} for weekly meal prep, leftovers and small-batch sealing.${widthNote}`,
      `Hunting & fishing weekends — Portion game and fish after a trip without needing a commercial machine.${widthNote}`,
      `Biltong & dry goods — Seal finished biltong portions and pantry items to extend shelf life.${widthNote}`,
    ];
  }
  if (n <= 300) {
    return [
      `Serious home cooks & hunters — The ${name} handles game, bulk meat specials and weekly meal prep.${widthNote}`,
      `Load-shedding food security — Vacuum-seal bulk buys so fridges and freezers survive power outages better.${widthNote}`,
      `Sous vide & marinating — Seal portions for water-bath cooking and fast vacuum marinating.${widthNote}`,
    ];
  }
  if (n <= 333) {
    return [
      `Game processing — Seal large cuts and high volumes after a hunt with consistent German vacuum performance.${widthNote}`,
      `Butchery & deli workflows — Extend display life, reduce shrinkage and improve hygiene on primals and portions.${widthNote}`,
      `Catering & meal prep — Reliable all-day sealing for batch cooks and small food businesses.${widthNote}`,
    ];
  }
  return [
    `Commercial kitchens & butcheries — ${name} is built for continuous sealing through busy production days.${widthNote}`,
    `Food production & catering — Portion, seal and store at scale with a wide sealing bar.${widthNote}`,
    `Retail & deli operations — Professional presentation and longer shelf life on vacuum-packed cuts.${widthNote}`,
  ];
}

function categoryUseCases(name: string, categorySlug: string): string[] {
  const size = bagSizeHint(name);

  switch (categorySlug) {
    case "vacuum-bags":
      return [
        `Freezer & long storage — ${size ? `${size} ` : ""}Embossed bags draw air reliably for months in the freezer.`,
        `Sous vide cooking — Strong welds hold up in heated water baths for fish, meat and vegetables.`,
        `Bulk portioning — Seal meal-prep, game and bulk-buy meat in single-use portions.`,
      ];
    case "vacuum-rolls":
      return [
        `Custom bag lengths — Cut only what you need for odd-sized cuts and reduce plastic waste.`,
        `Game & bulk processing — Ideal when sealing dozens of portions after a hunt or butcher session.`,
        `Embossed channel texture — Works with all LAVA channel-type vacuum sealers sold in South Africa.`,
      ];
    case "containers-lids":
    case "glass-containers":
    case "stainless-containers":
      return [
        `Marinating under vacuum — Draw flavour into meat and fish faster than conventional soaking.`,
        `Fridge & pantry storage — Reusable rigid containers you can see inside without opening the seal.`,
        `Beyond bags — Preserve salads, leftovers and liquids that do not suit flat vacuum bags.`,
      ];
    case "acrylic-lids":
      return [
        `Universal bowl sealing — Seal pots, pans and bowls with a flat rim using your LAVA hose attachment.`,
        `Multiple diameters — Match the lid size to jars, bowls and storage containers in your kitchen.`,
        `Easy Pump compatible — Works with LAVA machines and the rechargeable Easy Pump.`,
      ];
    case "glass-jar-sealer":
      return [
        `Dry goods & preserves — Vacuum-seal coffee, spices, nuts, jams and pickles in twist-off jars.`,
        `Flexible jar shapes — Fits round, oval, square or conical jars up to the rated opening size.`,
        `Pantry organisation — Keep dry ingredients fresher longer without single-use bags.`,
      ];
    case "sous-vide":
      return [
        `Precision home cooking — Hold exact temperatures for steak, fish, game and vegetables.`,
        `Pairs with LAVA bags — Seal portions first, then cook evenly in a water bath.`,
        `Consistent results — Repeat the same doneness every time for entertaining or meal prep.`,
      ];
    case "spare-parts":
      return [
        `Extend machine life — Replace wear items before vacuum performance drops.`,
        `Genuine LAVA parts — Correct seals and components for your specific machine model.`,
        `Ship from SA stock — Order from the local distributor without overseas delays.`,
      ];
    case "butchery-accessories":
      return [
        `Professional butchery — Cutting, display and processing tools for daily commercial use.`,
        `Hygiene & workflow — Boards and knives built for meat handling alongside vacuum sealing.`,
        `Game & beef processing — Cut, portion and seal in one efficient workflow.`,
      ];
    case "special-offers":
      return [
        `Bundle value — Machine, bags or accessories combined at a package price.`,
        `Starter kits — Everything needed to begin vacuum sealing in one order.`,
        `Limited availability — Check stock; specials change with seasonal offers.`,
      ];
    default:
      return [
        `South African homes — ${name} from the authorised LAVA distributor with nationwide delivery.`,
        `Food preservation — Pair with LAVA vacuum sealing for longer shelf life and less waste.`,
        `Local support — Johannesburg-based team, warranty help and spare parts availability.`,
      ];
  }
}

function searchTerms(name: string, categorySlug: string, specs?: Record<string, unknown>): string {
  const model = modelCode(name);
  const width = sealWidthCm(specs);
  const size = bagSizeHint(name);
  const base = name.replace(/^LAVA\s+/i, "").trim();

  const terms: string[] = [name, "LAVA South Africa", "Lava-SA"];

  switch (categorySlug) {
    case "vacuum-machines":
      terms.push(
        "vacuum sealer South Africa",
        "German vacuum sealer",
        model ? `LAVA ${model}` : "LAVA vacuum machine",
        "game meat vacuum sealer",
        "biltong vacuum sealer",
        "sous vide vacuum sealer"
      );
      if (width) terms.push(`${width} vacuum sealer`);
      break;
    case "vacuum-bags":
      terms.push(
        "LAVA vacuum bags",
        "embossed vacuum bags South Africa",
        "sous vide bags",
        "freezer vacuum bags"
      );
      if (size) terms.push(`vacuum bags ${size}`);
      break;
    case "vacuum-rolls":
      terms.push(
        "LAVA vacuum rolls",
        "embossed vacuum roll",
        "vacuum bag roll South Africa",
        "custom vacuum bags"
      );
      if (size) terms.push(`vacuum roll ${size}`);
      break;
    case "sous-vide":
      terms.push("sous vide South Africa", "immersion circulator", "precision cooking");
      break;
    case "containers-lids":
    case "glass-containers":
    case "stainless-containers":
      terms.push("LAVA vacuum containers", "vacuum marinating container", "vacuum storage containers");
      break;
    case "acrylic-lids":
      terms.push("LAVA acrylic lids", "vacuum bowl sealer", "universal vacuum lid");
      break;
    case "glass-jar-sealer":
      terms.push("vacuum jar sealer", "LAVA jar attachment", "vacuum seal jars");
      break;
    case "spare-parts":
      terms.push("LAVA spare parts", "vacuum sealer seal strip", "genuine LAVA parts");
      break;
    case "butchery-accessories":
      terms.push("butchery equipment South Africa", "butcher knives", "meat processing tools");
      break;
    default:
      terms.push(base, "vacuum packaging South Africa");
  }

  return [...new Set(terms.map((t) => t.trim()).filter(Boolean))].join(", ");
}

/** Generate AI discoverability copy from product name, category and description. */
export function generateProductAiDiscoverability(input: ProductAiInput): ProductAiDiscoverability {
  const categorySlug = input.categorySlug ?? "";
  const specs = input.specs ?? {};
  const short = input.short_description ?? "";

  const ai_summary = summaryFromShort(input.name, short, categorySlug);

  const useCaseLines =
    categorySlug === "vacuum-machines"
      ? machineUseCases(input.name, specs)
      : categoryUseCases(input.name, categorySlug);

  const ai_use_cases = useCaseLines.join("\n");
  const ai_search_terms = searchTerms(input.name, categorySlug, specs);

  return { ai_summary, ai_search_terms, ai_use_cases };
}

/** Read stored AI fields or generate fallbacks when blank. */
export function resolveProductAiDiscoverability(
  product: ProductAiInput & { specs?: Record<string, unknown> }
): ProductAiDiscoverability {
  const stored = product.specs ?? {};
  const generated = generateProductAiDiscoverability({
    name: product.name,
    slug: product.slug,
    short_description: product.short_description,
    categorySlug: product.categorySlug,
    specs: stored,
    tags: product.tags,
    industries: product.industries,
  });

  return {
    ai_summary: String(stored.ai_summary ?? "").trim() || generated.ai_summary,
    ai_search_terms: String(stored.ai_search_terms ?? "").trim() || generated.ai_search_terms,
    ai_use_cases: String(stored.ai_use_cases ?? "").trim() || generated.ai_use_cases,
  };
}
