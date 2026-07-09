import { motion } from "motion/react";
import { Search, UserCheck, CalendarCheck, MessageSquare, ShieldCheck, Star } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function WorkflowAutomation() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
      color: "bg-blue-50/15 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/20 dark:border-blue-500/40",
    },
    {
      icon: UserCheck,
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
      color: "bg-indigo-50/15 dark:bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500/20 dark:border-indigo-500/40",
    },
    {
      icon: CalendarCheck,
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
      color: "bg-violet-50/15 dark:bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
      border: "border-violet-500/20 dark:border-violet-500/40",
    },
    {
      icon: MessageSquare,
      title: t("howItWorks.step4Title"),
      description: t("howItWorks.step4Desc"),
      color: "bg-cyan-50/15 dark:bg-cyan-500/10",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/20 dark:border-cyan-500/40",
    },
    {
      icon: ShieldCheck,
      title: t("howItWorks.step5Title"),
      description: t("howItWorks.step5Desc"),
      color: "bg-emerald-50/15 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20 dark:border-emerald-500/40",
    },
    {
      icon: Star,
      title: t("howItWorks.step6Title"),
      description: t("howItWorks.step6Desc"),
      color: "bg-amber-50/15 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20 dark:border-amber-500/40",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full py-32 md:py-48 px-6 bg-[#050505] relative z-20 overflow-hidden font-sans"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.15),transparent_100%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-32"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
              {t("howItWorks.badge")}
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
            {t("howItWorks.title")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-medium italic">
              {t("howItWorks.titleItalic")}
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
            {t("howItWorks.desc")}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col items-start text-left p-8 rounded-2xl border ${step.border} bg-zinc-900/40 backdrop-blur-xl hover:bg-zinc-900/60 transition-all duration-300 group`}
            >
              {/* Step number */}
              <div className="absolute top-4 right-5 text-[11px] font-bold text-zinc-600 tracking-widest font-mono">
                0{idx + 1}
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
