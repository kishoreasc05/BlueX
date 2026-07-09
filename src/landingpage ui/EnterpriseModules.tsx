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
} from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function EnterpriseModules() {
  const { t } = useLanguage();

  return (
    <section className="w-full py-24 md:py-32 px-6 bg-zinc-950 relative z-20 overflow-hidden font-sans">
      {/* Vibrant Animated Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-900/10 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-emerald-900/5 blur-[120px]"
        />
      </div>

      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-12 relative z-10">
        {/* Left Side: Typography and Action Cards */}
        <div className="w-full lg:w-[45%] flex flex-col items-start text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl lg:text-[5rem] leading-[1.05] tracking-tight font-light mb-6 text-white"
          >
            {t("trustProfile.title") && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-medium mr-3">
                {t("trustProfile.title")}
              </span>
            )}
            <br />
            <span className="font-light italic text-zinc-300">{t("trustProfile.titleItalic")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl max-w-[480px] leading-relaxed mb-10"
          >
            {t("trustProfile.desc")}
          </motion.p>

          {/* Small Action Cards at bottom left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]"
          >
            {/* Card 1 */}
            <div className="flex-1 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-zinc-900/60 hover:border-white/10 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{t("trustProfile.card1Title")}</h4>
                <p className="text-zinc-450 text-xs">{t("trustProfile.card1Desc")}</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-zinc-900/60 hover:border-white/10 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{t("trustProfile.card2Title")}</h4>
                <p className="text-zinc-450 text-xs">{t("trustProfile.card2Desc")}</p>
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
            className="w-full max-w-[380px] bg-zinc-900/65 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative z-20 flex flex-col hover:border-white/20 transition-all duration-300"
          >
            {/* Header: Photo & Title */}
            <div className="flex items-center gap-4 mb-5 text-left">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold shrink-0 shadow-md shadow-indigo-600/10">
                MK
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-display tracking-tight">
                    Marc Keller
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 fill-emerald-400/10" />
                    {t("trustProfile.badgeVerified")}
                  </span>
                </div>
                <p className="text-xs text-zinc-450 font-medium">Keller Plumbers &amp; Heating</p>
                <div className="flex items-center gap-1 mt-1 text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium">
                    {t("trustProfile.mapPin") || "Zurich, ZH"}
                  </span>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4 text-left">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-450 fill-amber-450" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">4.9</span>
              <span className="text-xs text-zinc-500 font-medium font-sans">
                {t("trustProfile.ratingCount")}
              </span>
            </div>

            {/* Verifications Checklist */}
            <div className="flex flex-col gap-3.5 mb-6 text-left">
              {/* Item 1: UID */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide block">
                    {t("trustProfile.checkUidTitle")}
                  </span>
                  <span className="text-sm font-medium text-zinc-300 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-4 h-4 text-zinc-500" />
                    {t("trustProfile.checkUidVal")}
                  </span>
                </div>
              </div>

              {/* Item 2: Insurance */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide block">
                    {t("trustProfile.checkAxaTitle")}
                  </span>
                  <span className="text-sm font-medium text-zinc-300 mt-0.5 block">
                    {t("trustProfile.checkAxaVal")}
                  </span>
                </div>
              </div>

              {/* Item 3: Diploma */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide block">
                    {t("trustProfile.checkDiplomaTitle")}
                  </span>
                  <span className="text-sm font-medium text-zinc-300 mt-0.5 block">
                    {t("trustProfile.checkDiplomaVal")}
                  </span>
                </div>
              </div>
            </div>

            {/* Book Button CTA */}
            <button className="w-full h-12 rounded-xl bg-[#1A4BFF] text-white font-semibold text-sm hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 cursor-pointer">
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
              className="bg-emerald-600/90 text-white rounded-2xl px-4 py-3 shadow-lg shadow-emerald-950/20 flex items-center gap-3 border border-emerald-500 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100 text-left">
                  {t("trustProfile.axaBadge")}
                </span>
                <span className="text-sm font-bold text-left">{t("trustProfile.axaCover")}</span>
              </div>
            </motion.div>

            {/* Customer Review Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-zinc-900/60 text-white rounded-2xl p-4 shadow-2xl border border-white/5 backdrop-blur-xl flex flex-col gap-2.5 text-left"
            >
              <div className="flex items-center justify-between">
                <Quote className="w-6 h-6 text-indigo-400 opacity-60" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-450 fill-amber-450" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                {t("trustProfile.quote")}
              </p>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold text-zinc-400">Sarah M.</span>
                <span className="text-[10px] font-semibold text-indigo-400">
                  {t("trustProfile.reviewerRole")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
