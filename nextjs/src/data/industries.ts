export interface IndustryData {
  key: string;
  label: string;
  icon: string;
  href: string;
  description: string;
}

export const INDUSTRIES: Record<string, IndustryData> = {
  kitchen: {
    key: "kitchen",
    label: "Home Kitchen",
    icon: "/images/icons/industries/kitchen-outline-icon.png",
    href: "/applications/kitchen",
    description: "Preserve fresh produce, leftovers and meal prep",
  },
  hunting: {
    key: "hunting",
    label: "Hunters & Game",
    icon: "/images/icons/industries/hunting-and-fishing-Icon.png",
    href: "/applications/hunter-game",
    description: "Vacuum seal game meat straight from the field",
  },
  fishing: {
    key: "fishing",
    label: "Anglers & Fishing",
    icon: "/images/icons/industries/hunting-and-fishing-Icon.png",
    href: "/applications/angler-fishing",
    description: "Keep your catch fresh for longer",
  },
  catering: {
    key: "catering",
    label: "Catering & Restaurants",
    icon: "/images/icons/industries/catering-icon.png",
    href: "/applications/catering",
    description: "Professional food prep and portion control",
  },
  butchery: {
    key: "butchery",
    label: "Butchery",
    icon: "/images/icons/industries/food-production-icon.png",
    href: "/applications/butchery",
    description: "Extend shelf life of fresh cuts and portions",
  },
  biltong: {
    key: "biltong",
    label: "Biltong & Charcuterie",
    icon: "/images/icons/industries/food-production-icon.png",
    href: "/applications/biltong",
    description: "Cure and preserve biltong to perfection",
  },
  food_prod: {
    key: "food_prod",
    label: "Food Production",
    icon: "/images/icons/industries/food-production-icon.png",
    href: "/applications/food-production",
    description: "Industrial-scale food preservation",
  },
  outdoor: {
    key: "outdoor",
    label: "Outdoor & Camping",
    icon: "/images/icons/industries/outdoor-adventure-icon.png",
    href: "/applications/outdoor",
    description: "Light-weight preserved meals for the bush",
  },
  marine: {
    key: "marine",
    label: "Marine & Boating",
    icon: "/images/icons/industries/marine-applications-icon.png",
    href: "/applications/marine",
    description: "Keep provisions fresh on the water",
  },
  healthcare: {
    key: "healthcare",
    label: "Healthcare & Pharma",
    icon: "/images/icons/industries/healthcare-icon.png",
    href: "/applications/healthcare",
    description: "Sterile packaging for medical supplies",
  },
  industrial: {
    key: "industrial",
    label: "Industrial",
    icon: "/images/icons/industries/microchip-icon.png",
    href: "/applications/industrial",
    description: "Protect components and sensitive parts",
  },
};
