import { useLanguage } from "../hooks/use-language";
import {
  Zap,
  Droplet,
  Sparkles,
  Leaf,
  Paintbrush,
  Hammer,
  Truck,
  Key,
  Home,
  HardHat,
} from "lucide-react";

export default function ServiceTicker() {
  const { t } = useLanguage();

  const categories = [
    { icon: Sparkles, name: t("categories.cleaning") },
    { icon: Droplet, name: t("categories.plumbing") },
    { icon: Zap, name: t("categories.electrical") },
    { icon: Truck, name: t("categories.moving") },
    { icon: Leaf, name: t("categories.gardening") },
    { icon: Paintbrush, name: t("categories.painting") },
    { icon: Hammer, name: t("categories.carpentry") },
    { icon: Key, name: t("categories.locksmith") },
    { icon: Home, name: t("categories.roofing") },
    { icon: HardHat, name: t("categories.masonry") },
  ];

  // Duplicate items to create a seamless infinite loop
  const tickerItems = [...categories, ...categories, ...categories];

  return (
    <section className="w-full bg-white py-5 md:py-6 border-y border-zinc-200 overflow-hidden relative z-20 select-none">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-marquee-loop {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-loop:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full overflow-hidden flex">
        <div className="animate-marquee-loop flex gap-12 md:gap-20 items-center">
          {tickerItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 md:gap-3 shrink-0 whitespace-nowrap"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-[#1A4BFF]" />
              </div>
              <span className="text-sm md:text-base font-extrabold text-[#1A4BFF] uppercase tracking-wider font-sans">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
