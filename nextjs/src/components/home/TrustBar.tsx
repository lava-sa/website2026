import { Shield, Award, Globe, Truck, Wrench } from "lucide-react";

const badges = [
  {
    icon: Award,
    label: "Made in Germany",
    sub: "Since 1982 · Landig family",
  },
  {
    icon: Shield,
    label: "2-Year Warranty",
    sub: "On all vacuum machines",
  },
  {
    icon: Globe,
    label: "350,000+ Customers",
    sub: "Trusted worldwide",
  },
  {
    icon: Truck,
    label: "Free Delivery",
    sub: "On orders over R2,500",
  },
  {
    icon: Wrench,
    label: "Local SA Support",
    sub: "Johannesburg-based team",
  },
];

export default function TrustBar() {
  return (
    <div className="bg-primary border-y border-primary-dark">
      <div className="section-container">
        <ul className="flex flex-wrap items-stretch divide-x divide-white/10">
          {badges.map(({ icon: Icon, label, sub }) => (
            <li
              key={label}
              className="flex flex-1 min-w-[160px] items-center gap-3 px-6 py-5"
            >
              <Icon className="h-5 w-5 shrink-0 text-secondary" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-bold text-white leading-none">{label}</p>
                <p className="mt-0.5 text-[11px] text-white/55 leading-none">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
