import { motion } from "motion/react";
import {
  ShieldCheck,
  Star,
  MapPin,
  Check,
  Quote,
  Building2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Search,
  UserCheck,
  CalendarCheck,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function EnterpriseModules() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
      color: "bg-green-50",
      iconColor: "text-[#14a800]",
      border: "border-zinc-200 hover:border-[#14a800] shadow-sm bg-white",
    },
    {
      icon: UserCheck,
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
      color: "bg-green-50",
      iconColor: "text-[#14a800]",
      border: "border-zinc-200 hover:border-[#14a800] shadow-sm bg-white",
    },
    {
      icon: CalendarCheck,
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
      color: "bg-green-50",
      iconColor: "text-[#14a800]",
      border: "border-zinc-200 hover:border-[#14a800] shadow-sm bg-white",
    },
    {
      icon: MessageSquare,
      title: t("howItWorks.step4Title"),
      description: t("howItWorks.step4Desc"),
      color: "bg-green-50",
      iconColor: "text-[#14a800]",
      border: "border-zinc-200 hover:border-[#14a800] shadow-sm bg-white",
    },
    {
      icon: ShieldCheck,
      title: t("howItWorks.step5Title"),
      description: t("howItWorks.step5Desc"),
      color: "bg-green-50",
      iconColor: "text-[#14a800]",
      border: "border-zinc-200 hover:border-[#14a800] shadow-sm bg-white",
    },
    {
      icon: Star,
      title: t("howItWorks.step6Title"),
      description: t("howItWorks.step6Desc"),
      color: "bg-green-50",
      iconColor: "text-[#14a800]",
      border: "border-zinc-200 hover:border-[#14a800] shadow-sm bg-white",
    },
  ];

  return (
    <section
      id="trust-and-process"
      className="w-full py-24 md:py-32 px-6 bg-zinc-50 relative z-20 overflow-hidden font-sans border-b border-zinc-200"
    >
      <div className="max-w-[1300px] mx-auto relative z-10">
        {/* Part 1: Hire with Absolute Trust */}
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12 mb-28">
          {/* Left Side: Typography and Action Cards */}
          <div className="w-full lg:w-[45%] flex flex-col items-start text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 text-zinc-900 font-bold leading-tight"
            >
              {t("trustProfile.title") && (
                <span className="text-zinc-900 block mb-1">
                  {t("trustProfile.title")}
                </span>
              )}
              <span className="text-[#14a800]">{t("trustProfile.titleItalic")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-zinc-650 text-base md:text-lg max-w-[480px] leading-relaxed mb-10 font-semibold"
            >
              {t("trustProfile.desc")}
            </motion.p>

            {/* Small Action Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]"
            >
              {/* Card 1 */}
              <div className="flex-1 bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0 border border-green-100 text-[#14a800]">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-zinc-800 font-bold text-sm">{t("trustProfile.card1Title")}</h4>
                  <p className="text-zinc-500 text-xs mt-0.5">{t("trustProfile.card1Desc")}</p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="flex-1 bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0 border border-green-100 text-[#14a800]">
                  <Lock className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-zinc-800 font-bold text-sm">{t("trustProfile.card2Title")}</h4>
                  <p className="text-zinc-500 text-xs mt-0.5">{t("trustProfile.card2Desc")}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Trust Cards Stack */}
          <div className="w-full lg:w-[55%] flex flex-col items-center justify-center mt-10 lg:mt-0">
            {/* Main Mockup: Verified Provider Profile Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full max-w-[380px] bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl relative z-20 flex flex-col hover:border-[#14a800] transition-all duration-300"
            >
              {/* Header: Photo & Title */}
              <div className="flex items-center gap-4 mb-5 text-left">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-green-600 to-[#14a800] flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm">
                  MK
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                      Marc Keller
                    </h3>
                    <span className="text-[10px] font-bold text-[#14a800] bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-[#14a800] fill-green-50" />
                      {t("trustProfile.badgeVerified")}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-semibold">Keller Plumbers &amp; Heating</p>
                  <div className="flex items-center gap-1 mt-1 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs font-semibold">
                      {t("trustProfile.mapPin") || "Zurich, ZH"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-2 border-b border-zinc-150 pb-4 mb-4 text-left">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <span className="text-sm font-bold text-zinc-900">4.9</span>
                <span className="text-xs text-zinc-500 font-semibold">
                  {t("trustProfile.ratingCount")}
                </span>
              </div>

              {/* Verifications Checklist */}
              <div className="flex flex-col gap-3.5 mb-6 text-left">
                {/* Item 1: UID */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0 mt-0.5 text-[#14a800]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block">
                      {t("trustProfile.checkUidTitle")}
                    </span>
                    <span className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-4 h-4 text-zinc-400" />
                      {t("trustProfile.checkUidVal")}
                    </span>
                  </div>
                </div>

                {/* Item 2: Insurance */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0 mt-0.5 text-[#14a800]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block">
                      {t("trustProfile.checkAxaTitle")}
                    </span>
                    <span className="text-sm font-semibold text-zinc-700 mt-0.5 block">
                      {t("trustProfile.checkAxaVal")}
                    </span>
                  </div>
                </div>

                {/* Item 3: Diploma */}
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shrink-0 mt-0.5 text-[#14a800]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block">
                      {t("trustProfile.checkDiplomaTitle")}
                    </span>
                    <span className="text-sm font-semibold text-zinc-700 mt-0.5 block">
                      {t("trustProfile.checkDiplomaVal")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Book Button CTA */}
              <button className="w-full h-12 rounded-xl bg-[#14a800] text-white font-bold text-sm hover:bg-[#108a00] transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm cursor-pointer">
                {t("trustProfile.btnBook")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Sub-cards Row stacked below the profile card */}
            <div className="w-full max-w-[380px] mt-6 flex flex-col gap-4">
              {/* AXA Protection Badge Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-[#14a800] text-white rounded-2xl px-4 py-3 shadow-md flex items-center gap-3 border border-green-500"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-green-100">
                    {t("trustProfile.axaBadge")}
                  </span>
                  <span className="text-sm font-bold">{t("trustProfile.axaCover")}</span>
                </div>
              </motion.div>

              {/* Customer Review Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white text-zinc-800 rounded-2xl p-4 shadow-lg border border-zinc-200 flex flex-col gap-2.5 text-left"
              >
                <div className="flex items-center justify-between">
                  <Quote className="w-6 h-6 text-[#14a800] opacity-60" />
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-650 leading-relaxed font-semibold">
                  {t("trustProfile.quote")}
                </p>
                <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-150">
                  <span className="text-[11px] font-bold text-zinc-500">Sarah M.</span>
                  <span className="text-[10px] font-bold text-[#14a800]">
                    {t("trustProfile.reviewerRole")}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-zinc-200/80 my-24 relative z-10" />

        {/* Part 2: How It Works */}
        <div className="w-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 shadow-sm">
              <span className="text-xs font-bold tracking-widest uppercase text-[#14a800]">
                {t("howItWorks.badge")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-tight mb-6">
              {t("howItWorks.title")}{" "}
              <span className="text-[#14a800] block mt-1 font-bold">
                {t("howItWorks.titleItalic")}
              </span>
            </h2>
            <p className="text-zinc-650 text-base md:text-lg max-w-[600px] mx-auto leading-relaxed font-semibold">
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
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color} mb-6 group-hover:scale-105 transition-transform duration-300`}
                >
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold text-zinc-800 mb-3">{step.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed font-semibold">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
