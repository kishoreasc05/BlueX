import { motion } from "motion/react";
import {
  Zap,
  Droplet,
  Sparkles,
  Leaf,
  Paintbrush,
  Hammer,
  Truck,
  Heart,
  Shield,
  CreditCard,
  MessageSquare,
  Bot,
  PawPrint,
} from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function IntegrationsSection() {
  const { t } = useLanguage();

  const serviceCategories = [
    { icon: Sparkles, name: t("categories.cleaning") },
    { icon: Droplet, name: t("categories.plumbing") },
    { icon: Zap, name: t("categories.electrical") },
    { icon: Truck, name: t("categories.moving") },
    { icon: Leaf, name: t("categories.gardening") },
    { icon: Paintbrush, name: t("categories.painting") },
    { icon: Hammer, name: t("categories.carpentry") },
    { icon: Heart, name: t("categories.childcare") },
    { icon: PawPrint, name: t("categories.petCare") },
  ];

  const platformHighlights = [
    {
      icon: Shield,
      title: t("categories.highlight1Title"),
      desc: t("categories.highlight1Desc"),
    },
    {
      icon: CreditCard,
      title: t("categories.highlight2Title"),
      desc: t("categories.highlight2Desc"),
    },
    {
      icon: MessageSquare,
      title: t("categories.highlight3Title"),
      desc: t("categories.highlight3Desc"),
    },
    {
      icon: Bot,
      title: t("categories.highlight4Title"),
      desc: t("categories.highlight4Desc"),
    },
  ];

  return (
    <section className="w-full py-20 md:py-28 px-6 bg-white relative z-20 font-sans border-b border-zinc-200">
      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left w-full mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
            {t("categories.title")} <span className="text-[#14a800]">{t("categories.titleItalic")}</span>
          </h2>
          <p className="text-zinc-600 text-base md:text-lg max-w-2xl leading-relaxed">
            {t("categories.desc")}
          </p>
        </motion.div>

        {/* Service Categories Grid (Adapting Upwork card style from screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-24 w-full">
          {serviceCategories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white border border-zinc-200 hover:border-[#14a800] rounded-2xl p-6 flex flex-col items-start justify-between min-h-[160px] text-left transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
            >
              <cat.icon className="w-9 h-9 text-[#14a800] stroke-[1.75]" />
              <span className="text-[17px] font-semibold text-zinc-800 group-hover:text-[#14a800] transition-colors mt-6 leading-tight">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Platform Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
          {platformHighlights.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 shadow-sm hover:border-[#14a800] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 text-[#14a800] flex items-center justify-center mb-4 shrink-0">
                <item.icon className="w-5 h-5 stroke-[2]" />
              </div>
              <h4 className="font-bold text-zinc-800 mb-2 tracking-tight">
                {item.title}
              </h4>
              <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
