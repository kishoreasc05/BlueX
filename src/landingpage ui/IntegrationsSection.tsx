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
    { icon: Sparkles, name: t("categories.cleaning"), color: "text-sky-400", bg: "bg-sky-500/10" },
    { icon: Droplet, name: t("categories.plumbing"), color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Zap, name: t("categories.electrical"), color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: Truck, name: t("categories.moving"), color: "text-rose-400", bg: "bg-rose-500/10" },
    {
      icon: Leaf,
      name: t("categories.gardening"),
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Paintbrush,
      name: t("categories.painting"),
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: Hammer,
      name: t("categories.carpentry"),
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    { icon: Heart, name: t("categories.childcare"), color: "text-pink-400", bg: "bg-pink-500/10" },
    { icon: PawPrint, name: t("categories.petCare"), color: "text-teal-400", bg: "bg-teal-500/10" },
  ];

  const platformHighlights = [
    {
      icon: Shield,
      title: t("categories.highlight1Title"),
      desc: t("categories.highlight1Desc"),
      color: "text-emerald-400 border border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    {
      icon: CreditCard,
      title: t("categories.highlight2Title"),
      desc: t("categories.highlight2Desc"),
      color: "text-blue-400 border border-blue-500/20",
      bg: "bg-blue-500/10",
    },
    {
      icon: MessageSquare,
      title: t("categories.highlight3Title"),
      desc: t("categories.highlight3Desc"),
      color: "text-indigo-400 border border-indigo-500/20",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Bot,
      title: t("categories.highlight4Title"),
      desc: t("categories.highlight4Desc"),
      color: "text-violet-400 border border-violet-500/20",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 px-6 bg-[#05030a] relative z-20 overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-light text-white tracking-tight mb-6 leading-none">
            {t("categories.title")}{" "}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">
              {t("categories.titleItalic")}
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
            {t("categories.desc")}
          </p>
        </motion.div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-4 mb-20 w-full">
          {serviceCategories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${cat.bg} border border-white/5 bg-zinc-900/40 flex items-center justify-center group-hover:scale-110 group-hover:border-white/15 transition-all duration-200 shadow-2xl`}
              >
                <cat.icon className={`w-7 h-7 ${cat.color}`} />
              </div>
              <span className="text-xs font-semibold text-zinc-400 text-center group-hover:text-white transition-colors">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-zinc-900/45 border border-white/5 rounded-2xl p-6 shadow-2xl hover:border-white/10 transition-all duration-300"
            >
              <div
                className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4 shrink-0`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white mb-1 font-display tracking-tight">
                {item.title}
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
