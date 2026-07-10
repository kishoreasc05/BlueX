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
      color: "bg-emerald-50",
      iconColor: "text-emerald-700",
      border: "border-zinc-200 hover:border-emerald-500/20 shadow-md bg-white",
    },
    {
      icon: UserCheck,
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
      color: "bg-teal-50",
      iconColor: "text-teal-700",
      border: "border-zinc-200 hover:border-teal-500/20 shadow-md bg-white",
    },
    {
      icon: CalendarCheck,
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
      color: "bg-cyan-50",
      iconColor: "text-cyan-700",
      border: "border-zinc-200 hover:border-cyan-500/20 shadow-md bg-white",
    },
    {
      icon: MessageSquare,
      title: t("howItWorks.step4Title"),
      description: t("howItWorks.step4Desc"),
      color: "bg-emerald-50",
      iconColor: "text-emerald-700",
      border: "border-zinc-200 hover:border-emerald-500/20 shadow-md bg-white",
    },
    {
      icon: ShieldCheck,
      title: t("howItWorks.step5Title"),
      description: t("howItWorks.step5Desc"),
      color: "bg-teal-50",
      iconColor: "text-teal-700",
      border: "border-zinc-200 hover:border-teal-500/20 shadow-md bg-white",
    },
    {
      icon: Star,
      title: t("howItWorks.step6Title"),
      description: t("howItWorks.step6Desc"),
      color: "bg-amber-50",
      iconColor: "text-amber-700",
      border: "border-zinc-200 hover:border-amber-500/20 shadow-md bg-white",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full py-32 md:py-48 px-6 bg-white relative z-20 overflow-hidden font-sans border-t border-zinc-200/50"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.05),transparent_100%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-32"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-emerald-55 border border-emerald-200 shadow-sm">
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-700">
              {t("howItWorks.badge")}
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-zinc-900 leading-[1.1] mb-6 font-light">
            {t("howItWorks.title")}{" "}
            <span className="text-emerald-600 font-medium italic">
              {t("howItWorks.titleItalic")}
            </span>
          </h2>
          <p className="text-zinc-600 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
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
              className={`relative flex flex-col items-start text-left p-8 rounded-2xl border transition-all duration-300 group ${step.border}`}
            >
              {/* Step number */}
              <div className="absolute top-4 right-5 text-[11px] font-bold text-zinc-400 tracking-widest font-mono">
                0{idx + 1}
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
              </div>

              <h3 className="text-xl font-semibold text-zinc-800 mb-3">{step.title}</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
