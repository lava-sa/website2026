import type { AboutPageContent } from "@/lib/content/site-pages-types";

/** Full About page structure — editable in /admin/pages/about/edit */
export const DEFAULT_ABOUT_PAGE: AboutPageContent = {
  heroImage: {
    src: "/images/homepage/lava-sa-vacuum-sealers-header-pick-001.jpg",
    alt: "LAVA South Africa — German vacuum sealers",
  },
  origin: {
    id: "origin",
    overline: "The Origin",
    heading: "A family obsessed with keeping food perfect.",
    imageSide: "left",
    image: {
      src: "/images/about/landig-family.webp",
      alt: "The Landig family — founders of LAVA vacuum sealers, Bad Saulgau Germany",
      captionLocation: "Bad Saulgau, Germany",
      captionTitle: "The Landig Family",
      captionSubtitle: "Two generations. One relentless pursuit of quality.",
    },
    quote: {
      text:
        "For two generations, we, the Landig family, have been passionately running our family business in Bad Saulgau, Upper Swabia. What began over 44 years ago as a small specialist operation has evolved into a global leader in vacuum sealing technology.",
      attribution: "— Klaus Landig, Founder",
    },
    bodyHtml: `<p>In a small workshop in Baden-Württemberg, Klaus Landig had a simple ambition: build a vacuum sealer that would never let a customer down. Every component chosen for longevity. Every seal tested to exhaustion. Every machine shipped only when it was truly ready.</p>
<p>That philosophy has never changed. Today, the second generation of the Landig family continues the tradition — designing machines in the same town, with the same obsession, for a world that finally understands what great food preservation looks like.</p>`,
  },
  timeline: {
    overline: "The Journey",
    heading: "From Germany to your kitchen.",
    items: [
      {
        year: "1982",
        event:
          "Klaus Landig founds LAVA in Bad Saulgau, Upper Swabia. The first vacuum sealer rolls off the production line.",
      },
      {
        year: "1990s",
        event:
          "LAVA expands across Europe. The V.300 becomes the best-selling home vacuum sealer in Germany.",
      },
      {
        year: "2000s",
        event:
          "The commercial V.400 and V.500 range launches. Restaurants, butcheries and food producers across Europe adopt LAVA.",
      },
      {
        year: "2007",
        event:
          "Wilco Uys establishes Lava-SA — the exclusive distributor for the continent. The first shipment lands in Johannesburg.",
        highlight: true,
        highlightLabel: "Lava-SA Founded",
      },
      {
        year: "2010s",
        event:
          "South Africa's hunting and outdoor community discovers LAVA. Word spreads camp to camp, farm to farm.",
      },
      {
        year: "2024+",
        event:
          "A new digital platform launches, bringing the full LAVA range directly to South African homes, butcheries, restaurants and hunting lodges — anywhere in the country.",
      },
    ],
  },
  saFounders: {
    id: "sa-founders",
    overline: "South Africa",
    heading: "Bringing German precision to South African homes.",
    imageSide: "right",
    image: {
      src: "/images/about/lava-directors-001.webp",
      alt: "Wilco Uys and Anneke Hofmeyr — Lava-SA",
      captionLocation: "Bryanston, Johannesburg",
      captionTitle: "Wilco Uys & Anneke Hofmeyr",
      captionSubtitle: "Owner & Manager · Lava-SA est. 2007",
    },
    bodyHtml: `<p>In 2007, Wilco Uys recognised something the rest of the country had yet to discover: South African hunters, farmers, butchers and home cooks deserved access to the world's finest vacuum sealing technology — not cheap imitations, but the real thing, direct from the factory in Germany.</p>
<p>Lava-SA was born. Wilco leads the business with a commitment to integrity and a product he believes in completely. Anneke Hofmeyr manages day-to-day operations and customer service — and when you call, it's Anneke who answers. Personally.</p>
<p>Based in Bryanston, Johannesburg, but serving every corner of South Africa — from the Karoo to the Cape, from the Limpopo bush to the KZN coast.</p>`,
  },
  pillars: {
    overline: "Our Pursuit",
    heading: "What drives every machine we sell.",
    subtitle: "Four principles. Decided in 1982. Never compromised since.",
    items: [
      {
        icon: "award",
        title: "German Precision",
        body: "Every machine is designed and manufactured in Bad Saulgau, Baden-Württemberg — the heartland of German precision engineering. No compromises, no shortcuts.",
      },
      {
        icon: "shield",
        title: "Built to Last",
        body: "A 2-year factory warranty on every machine. Components selected for decades of use, not years. We believe the most sustainable product is one you never have to replace.",
      },
      {
        icon: "wrench",
        title: "Spare Parts. Always.",
        body: "Unlike other brands that make machines disposable, LAVA keeps spare parts available indefinitely. Your machine can be serviced and repaired — not thrown away.",
      },
      {
        icon: "leaf",
        title: "Good for the Planet",
        body: "Vacuum sealing cuts food waste dramatically. Less spoilage means less land, water and energy wasted. Every seal is a small act of environmental responsibility.",
      },
    ],
  },
  quality: {
    id: "quality",
    overline: "The Machine",
    heading: "Every component is a decision, not an afterthought.",
    imageSide: "left",
    image: {
      src: "/images/products/machines/v300-premium-x/lava-vacuum-sealer-v300-premium-x.webp",
      alt: "LAVA V.300 Premium X vacuum sealer — current German-engineered model",
    },
    bodyHtml: `<p>Walk into the LAVA factory in Bad Saulgau and you'll find engineers who have worked on these machines for decades. The pump housings are measured in microns. The sealing strips are tested for 50,000 cycles before a specification is finalised. The stainless steel surfaces are chosen for their resistance to acids, fat and high-pressure cleaning.</p>
<p>This is why a LAVA machine feels different the moment you pick it up. The weight. The precision of the lid mechanism. The silence of the pump at work. These are not accidents — they are deliberate, fought-for design decisions made by people who genuinely care about the outcome.</p>`,
    features: [
      "Stainless steel sealing bars",
      "Double & triple seal strips",
      "2-year factory warranty",
      "50,000+ seal cycle tested",
      "Spare parts always available",
      "ISO-certified production",
    ],
  },
  sustainability: {
    id: "sustainability",
    overline: "Responsibility",
    heading: "Every seal is an act of environmental responsibility.",
    imageSide: "right",
    image: {
      src: "/images/homepage/lava-reforestation.webp",
      alt: "LAVA — committed to sustainability and reducing food waste",
    },
    bodyHtml: `<p>South Africans throw away an estimated <strong>10 million tonnes of food every year</strong>. Most of it spoils before it's eaten. Vacuum sealing extends shelf life by 3–5 times — meaning the same haul from your hunting weekend, the same bulk buy from the butchery, lasts dramatically longer.</p>
<p>At LAVA we also believe a sustainable product is one that doesn't need to be replaced. Our machines are designed and warranted for decades of use. Our embossed bags are washable and reusable. Our spare parts programme means your machine can be repaired, not replaced.</p>
<p>Less waste. Less replacement. Less impact. That's the LAVA commitment to the planet.</p>`,
    impactStats: [
      { value: "5×", label: "Longer shelf life" },
      { value: "70%", label: "Less food waste" },
      { value: "∞", label: "Spare parts stocked" },
    ],
  },
  service: {
    overline: "Service & Contact",
    heading: "We're here. Always.",
    subtitle:
      "When you call Lava-SA, Anneke Hofmeyr answers — the person who manages every order and personally backs every machine we sell.",
  },
  finalCta: {
    overline: "Ready to experience it?",
    headingHtml: "44 years in the making.<br />Delivered to your door.",
    subtitle:
      "Browse the full range of LAVA vacuum sealers, bags and accessories — with flat-rate courier delivery across South Africa (R190 excl. VAT in Gauteng, R250 elsewhere).",
    primaryLabel: "Shop Vacuum Machines",
    primaryHref: "/products/vacuum-machines",
    secondaryLabel: "Get in Touch",
    secondaryHref: "/contact",
  },
};
