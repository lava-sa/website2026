import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — LAVA Vacuum Sealers South Africa | Lava South Africa",
  description:
    "Everything you need to know about LAVA vacuum sealers — buying, using, maintaining and troubleshooting. Answers from people who use these machines every day.",
};

const faqs = [
  {
    category: "Buying & Choosing",
    questions: [
      {
        q: "Which LAVA machine should I buy?",
        a: "For most South African home users — hunters, fishermen, home cooks, families — the V.300® Premium X is the right choice. It handles every domestic application with a 42 cm sealing width, Liquid Stop, pressure control and a jar attachment. If you process large quantities of game or run a small butchery, consider the V.333® Chrome or V.400® Premium. Contact Anneke at anneke@lava-sa.co.za if you're unsure — she'll give you an honest recommendation.",
        link: ["/products/vacuum-machines", "View all machines →"],
      },
      {
        q: "What's the difference between the V.100, V.300 and V.400?",
        a: "The V.100 is the entry-level domestic machine — full LAVA quality at a lower price point, with a 30 cm sealing width. The V.300 is the most popular — wider seal (42 cm), more features including Liquid Stop and pressure control, handles everything a serious home user needs. The V.400 and above are commercial-grade with wider sealing bars, higher-rated pumps and continuous-use ratings for butcheries and production environments.",
        link: null,
      },
      {
        q: "Is a LAVA machine worth the price?",
        a: "The best way to think about it is total cost over time. A budget sealer at R700 typically lasts 1–3 years. A LAVA V.300 at R4,500 typically lasts 15–20+ years. Over 10 years, the LAVA costs less per year — and in the meantime, you're not losing food to failed seals or buying replacement machines. If you use it regularly, a LAVA pays for itself in reduced food waste within the first 1–2 years.",
        link: ["/blog/best-vacuum-sealer-south-africa-2026", "Read our honest buying guide →"],
      },
      {
        q: "Do LAVA machines work with any vacuum bags?",
        a: "LAVA external sealers require embossed (textured/ribbed) vacuum bags. The channel pattern is essential — it allows the pump to draw air from the entire bag. Smooth bags block the channels and cannot be used with external sealers. LAVA bags are BPA-free, freezer-safe to -40°C, microwave-safe and can be used for sous vide cooking (boilable).",
        link: ["/vacuum-packaging/bags-guide", "Our bags guide →"],
      },
    ],
  },
  {
    category: "Using Your Machine",
    questions: [
      {
        q: "Why is my vacuum seal not holding properly?",
        a: "The most common causes are: (1) Moisture on the bag opening — pat dry before sealing. (2) Worn sealing strip — replace if seals are inconsistent. (3) Using smooth bags instead of embossed bags. (4) Food or grease on the seal area — wipe clean. (5) The bag is not flat against the sealing strip — pull taut before closing the lid.",
        link: ["/products/spare-parts", "Shop spare parts →"],
      },
      {
        q: "Can I vacuum seal liquids and marinades?",
        a: "Yes — with the Liquid Stop function enabled. All LAVA V.300+ machines have Liquid Stop, which detects moisture entering the vacuum hose and stops the pump before damage occurs. For very liquid items like soups or stocks, pre-freeze flat first (1–2 hours in a container), then vacuum seal the frozen block.",
        link: null,
      },
      {
        q: "How do I vacuum seal in jars and containers?",
        a: "The LAVA jar attachment and hose connects to the container lid and draws a vacuum. The machine seals the container without using a bag. This works with LAVA acrylic containers, standard mason jars with wide-mouth lids, and wine bottles with the stopper attachment. Any V.300 or above includes jar attachment capability.",
        link: ["/products/containers-lids", "Shop containers →"],
      },
      {
        q: "Can I vacuum seal bread and soft items without crushing them?",
        a: "Yes — use the pressure control dial on the V.300+ machines to reduce the vacuum level. Start at about 50% vacuum, which removes enough oxygen for preservation without compressing delicate items. For bread, freeze it lightly first (30 minutes) to firm up the structure before sealing.",
        link: null,
      },
      {
        q: "How long can I run the machine continuously?",
        a: "Domestic machines (V.100, V.300) are designed for household use — typically 15–20 consecutive seals before allowing a 10-minute rest. Commercial machines (V.333, V.400, V.500) are rated for extended continuous use. If you're processing a large game animal or running a production session, the V.400+ is the right tool.",
        link: null,
      },
    ],
  },
  {
    category: "Food & Storage",
    questions: [
      {
        q: "How long does vacuum sealed meat last in the freezer?",
        a: "Beef, lamb and venison: 2–3 years. Chicken: 18 months–2 years. Fish (snoek, yellowtail): 12–15 months. Compare this to 3–6 months for standard freezer packaging. The key difference is the elimination of air contact, which prevents both freezer burn and oxidation of fats.",
        link: ["/vacuum-packaging/shelf-life-chart", "Full shelf life chart →"],
      },
      {
        q: "Can I vacuum seal game meat (venison) directly after the hunt?",
        a: "Not immediately. The carcass needs to hang and cool to 0–4°C first — usually 24–48 hours. Sealing warm meat traps gases and heat, resulting in poor-quality vacuum and accelerated spoilage. Once the meat is properly cooled and processed, LAVA bags handle venison excellently for 2–3 years in the freezer.",
        link: ["/blog/vacuum-sealing-game-meat-south-africa", "Hunter's game meat guide →"],
      },
      {
        q: "Can I vacuum seal biltong?",
        a: "Yes, with some important distinctions. Very dry biltong can be sealed at room temperature — it will keep 4–6 months at room temperature and 2 years frozen. Wet or soft biltong must be refrigerated even after vacuum sealing — the moisture means mould can still develop without refrigeration. Never seal biltong with visible mould.",
        link: ["/applications/biltong", "Biltong application guide →"],
      },
      {
        q: "Can vacuum sealed food go off?",
        a: "Yes — vacuum sealing slows but doesn't stop all spoilage. Anaerobic bacteria (like C. botulinum) can grow in sealed environments at room temperature. Always refrigerate or freeze raw proteins, even when sealed. Start with fresh food for best results — vacuum sealing extends shelf life, it doesn't reverse deterioration.",
        link: null,
      },
    ],
  },
  {
    category: "Maintenance & Troubleshooting",
    questions: [
      {
        q: "When should I replace the sealing strip?",
        a: "Replace the sealing strip when: seals are inconsistent or incomplete; you can see visible indentations or uneven wear; seals regularly fail under pressure; or the strip has become brittle or discoloured. With regular home use, sealing strips typically last 3–5 years. LAVA sealing strips are available from Lava-SA — order the one that matches your model.",
        link: ["/products/spare-parts", "Shop sealing strips →"],
      },
      {
        q: "The machine is not pulling full vacuum — what's wrong?",
        a: "Check in this order: (1) Are you using embossed bags? (2) Is the bag fully flat in the lid with no folds near the seal? (3) Is the lid seal/gasket clean and undamaged? (4) Has liquid entered the machine? (5) Is the vacuum seal set (gasket) worn? If the problem persists after checking all these, contact Anneke — it may be a pump service issue covered under warranty.",
        link: null,
      },
      {
        q: "Liquid got into my machine — what do I do?",
        a: "Stop using the machine immediately. Remove and clean the liquid trap lid (the removable compartment that catches moisture before the pump). Dry it thoroughly. Check if liquid reached the pump — if the machine makes unusual sounds or doesn't reach full vacuum afterwards, contact us. This is why Liquid Stop is essential for fish, marinated meat and wet foods.",
        link: ["/products/spare-parts", "Liquid trap lids →"],
      },
      {
        q: "How do I clean my LAVA machine?",
        a: "Wipe the inside of the lid and the sealing area with a damp cloth after each use. Remove and clean the liquid trap lid regularly (rinse under water, dry thoroughly). The exterior can be wiped with a damp cloth and mild detergent. Do not submerge any part of the machine in water. Do not use abrasive cleaners on the stainless steel lid.",
        link: null,
      },
    ],
  },
  {
    category: "Orders & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Gauteng: 1–2 business days. Major centres (Cape Town, Durban, PE): 2–3 business days. Outlying areas: 3–5 business days. Remote/farm addresses: 5–7 business days. Orders placed on weekdays before 15:00 are typically dispatched the same day.",
        link: ["/help/delivery", "Full delivery information →"],
      },
      {
        q: "Do you deliver to farm addresses?",
        a: "Yes — to most farm addresses. Remote deliveries may require collection from the nearest depot in some cases. Contact us before ordering if your address is very remote and we'll advise the best approach.",
        link: null,
      },
      {
        q: "Can I return a machine if I change my mind?",
        a: "Yes — within 30 days of delivery, if the machine is unused and in its original packaging. A 10% restocking fee applies plus return courier costs. Contact Anneke first for authorisation before returning anything.",
        link: ["/help/returns", "Full returns policy →"],
      },
    ],
  },
];

export default function FAQPage() {
  const allQA = faqs.flatMap((section) => section.questions.map(({ q, a }) => ({ q, a })));
  const faqLd = faqSchema(allQA);

  return (
    <main className="py-16">
      <JsonLd data={faqLd} />
      <div className="section-container max-w-3xl">

        <div className="mb-12">
          <p className="overline mb-3">Shopping Help</p>
          <h1 className="text-4xl font-black text-primary">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-copy-muted leading-relaxed">
            Answers from people who use these machines every day. If you don&apos;t find
            what you&apos;re looking for — just ask Anneke directly.
          </p>
        </div>

        {/* Jump links */}
        <nav className="flex flex-wrap gap-2 mb-12">
          {faqs.map((section) => (
            <a
              key={section.category}
              href={`#${section.category.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 border border-border text-copy-muted hover:border-primary hover:text-primary transition-colors"
            >
              {section.category}
            </a>
          ))}
        </nav>

        {faqs.map((section) => (
          <section
            key={section.category}
            id={section.category.toLowerCase().replace(/[^a-z]+/g, "-")}
            className="mb-12 scroll-mt-32"
          >
            <h2 className="text-xl font-black text-primary mb-6 pb-3 border-b-2 border-primary">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.questions.map(({ q, a, link }) => (
                <details key={q} className="group border border-border">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                    <span className="font-bold text-primary text-sm leading-snug">{q}</span>
                    <span className="text-secondary font-black text-xl shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1 border-t border-border">
                    <p className="text-sm text-copy leading-relaxed">{a}</p>
                    {link && (
                      <Link href={link[0]} className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors mt-3">
                        {link[1]} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* Still not answered */}
        <div className="mt-8 bg-primary text-white p-8">
          <h2 className="text-xl font-bold mb-2">Still Have a Question?</h2>
          <p className="text-white/70 text-sm mb-6">
            Anneke and Wilco have been selling and using LAVA machines since 2007. If the
            answer isn&apos;t here, it&apos;s in their heads — and they&apos;re happy to share it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="tel:+27721605556" className="flex items-center gap-3 border border-white/20 px-4 py-3 hover:border-white transition-colors">
              <Phone className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">+27 72 160 5556</p>
                <p className="text-xs text-white/60">Mon–Fri 09:00–17:00</p>
              </div>
            </a>
            <a href="mailto:anneke@lava-sa.co.za" className="flex items-center gap-3 border border-white/20 px-4 py-3 hover:border-white transition-colors">
              <Mail className="h-5 w-5 text-secondary shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">anneke@lava-sa.co.za</p>
                <p className="text-xs text-white/60">Reply within 1 business day</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
          {[
            ["Delivery & Shipping", "/help/delivery"],
            ["Returns & Exchanges", "/help/returns"],
            ["2-Year Warranty", "/help/warranty"],
            ["Contact Us", "/contact"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="text-xs font-bold text-copy-muted hover:text-primary transition-colors underline">
              {label}
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
