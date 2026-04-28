import Image from "next/image";
import Link from "next/link";

const companies = [
  {
    name: "Crous Broers",
    category: "Livestock Farm",
    logo: "/images/partners/crous-broers.webp",
    href: "https://www.crousbroers.co.za/",
    tooltip: "Premium livestock farming operation trusting LAVA for professional meat preservation.",
  },
  {
    name: "Crown Game Breeders",
    category: "Game Farm",
    logo: "/images/partners/crown-game-breeders.png",
    href: "https://www.crowngamebreeders.co.za/",
    tooltip: "Elite game breeders choosing LAVA for professional venison vacuum sealing.",
  },
  {
    name: "Ivory Macadamias",
    category: "Food & Beverage",
    logo: "/images/partners/ivory-macadamias-food-and-beverage-company.webp",
    href: "https://www.ivorymacs.co.za/",
    tooltip: "South Africa's premier macadamia producer using LAVA for extended product freshness.",
  },
  {
    name: "Kitchen Frontiers",
    category: "Cabinet & Countertop",
    logo: "/images/partners/kitchen-frontiers-logo.webp",
    href: "https://www.kitchenfrontiers.co.za/",
    tooltip: "Trusted kitchen specialists recommending LAVA vacuum sealers to their clients.",
  },
  {
    name: "SA Game Breeders",
    category: "Game Breeders Association",
    logo: "/images/partners/sa-game-breeders.webp", // TODO: add logo file
    href: "https://www.sagamebreeders.com/",
    tooltip: "South Africa's leading game breeders association — LAVA preferred for game meat preservation.",
  },
  {
    name: "Open Africa Hunting",
    category: "Hunting & Safaris",
    logo: "/images/partners/open-africa-hunting.jpg",
    href: "tel:+27749373333",
    tooltip: "Renowned safari outfitter relying on LAVA to preserve premium trophy game meat in the field.",
  },
  {
    name: "The Test Kitchen Fledgelings",
    category: "Restaurant",
    logo: "/images/partners/test-kitchen-fledgelings.webp", // TODO: add logo file
    href: "https://www.ttkfledgelings.co.za/home/",
    tooltip: "Award-winning South African restaurant choosing LAVA for precision food preparation.",
  },
];

const IndustryLeadersSection = () => {
  return (
    <section className="industry-leaders bg-white py-24">
      <div className="section-container">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="industry-leaders__header mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Trusted Partners
            </span>
            <span className="h-px w-8 bg-secondary" />
          </div>
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Lava-SA Vacuum Sealing Machines.<br />
            <span className="text-primary">Trusted by Industry Leaders</span>
          </h2>
          <p className="mt-5 mx-auto max-w-2xl text-base leading-relaxed text-copy">
            Quality speaks for itself. These{" "}
            <strong className="font-semibold text-primary">respected South African businesses</strong>{" "}
            have chosen Lava vacuum Sealing Machines and Bags for their operations, recognizing our
            commitment to{" "}
            <strong className="font-semibold text-primary">food preservation and storage excellence</strong>.
          </p>
        </div>

        {/* ── Logo grid — 2 rows of 4 ─────────────────────────────── */}
        <div className="industry-leaders__grid grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {companies.map((company) => (
            <Link
              key={company.name}
              href={company.href}
              target={company.href.startsWith("tel:") ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="industry-leaders__card group relative flex flex-col items-center justify-center gap-4 bg-white px-6 py-10 text-center transition-all hover:bg-primary-wash hover:z-10"
            >
              {/* Tooltip */}
              <div className="industry-leaders__tooltip pointer-events-none absolute bottom-full left-1/2 mb-3 w-52 -translate-x-1/2 bg-primary px-3 py-2.5 text-[11px] leading-snug text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-20">
                {company.tooltip}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-primary" />
              </div>

              <div className="industry-leaders__logo relative h-28 w-full max-w-[220px]">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain transition-all duration-300 grayscale group-hover:grayscale-0"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-primary leading-snug">{company.name}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-copy-muted">
                  {company.category}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default IndustryLeadersSection;
