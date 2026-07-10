import { motion } from "motion/react";
import { Search, Activity, Briefcase } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function UnifiedWorkspace() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("workspace.portal1Title"),
      description: t("workspace.portal1Desc"),
      icon: Search,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/5",
    },
    {
      title: t("workspace.portal2Title"),
      description: t("workspace.portal2Desc"),
      icon: Briefcase,
      color: "from-teal-500 to-cyan-500",
      shadow: "shadow-teal-500/5",
    },
    {
      title: t("workspace.portal3Title"),
      description: t("workspace.portal3Desc"),
      icon: Activity,
      color: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-600/5",
    },
  ];

  return (
    <section
      id="platform-tools"
      className="w-full py-28 md:py-36 px-6 bg-white relative z-20 overflow-hidden border-t border-zinc-200 font-sans"
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-green-50 border border-green-200">
            <span className="text-xs font-bold tracking-widest uppercase text-[#14a800]">
              {t("workspace.badge")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-tight mb-6">
            {t("workspace.title")}{" "}
            <span className="text-[#14a800] block mt-1.5 font-bold">
              {t("workspace.titleItalic")}
            </span>
          </h2>
          <p className="text-zinc-650 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-semibold">
            {t("workspace.desc")}
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative flex flex-col p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-[#14a800] hover:shadow-md transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-50 border border-green-100 mb-8 relative z-10 group-hover:scale-105 transition-transform duration-300 shadow-sm text-[#14a800]">
                <feature.icon className="w-7 h-7 stroke-[1.75] relative z-10" />
              </div>

              <div className="relative z-10 text-left">
                <h3 className="text-xl font-bold text-zinc-800 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed text-sm font-semibold">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
