import { motion } from "motion/react";
import { ShieldCheck, BadgeCheck, Lock, PhoneCall, Star } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function SecuritySection() {
  const { t } = useLanguage();

  return (
    <section
      id="trust"
      className="w-full py-28 md:py-36 px-6 bg-white relative z-20 overflow-hidden font-sans border-t border-zinc-200"
    >
      <div className="max-w-[1200px] mx-auto relative z-10 text-left">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-green-50 border border-green-200">
              <ShieldCheck className="w-4 h-4 text-[#14a800]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#14a800]">
                {t("security.badge")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-tight mb-6">
              {t("security.title")}{" "}
              <span className="text-[#14a800] block mt-1.5 font-bold">
                {t("security.titleItalic")}
              </span>
            </h2>
            <p className="text-zinc-650 text-base md:text-lg leading-relaxed font-semibold">
              {t("security.desc")}
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card: Verified Providers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-zinc-50 border border-zinc-200 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-[#14a800] transition-colors"
          >
            {/* Swiss Vetted Badge */}
            <div className="absolute top-6 right-6 px-3.5 py-1 rounded-full bg-green-50 border border-green-250 text-[#14a800] text-xs font-bold uppercase tracking-wider">
              {t("security.badgeUid")}
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-end min-h-[220px] text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
                {t("security.card1Title")}
              </h3>
              <p className="text-zinc-600 text-sm md:text-base leading-relaxed font-semibold">
                {t("security.card1Desc")}
              </p>
            </div>
          </motion.div>

          {/* Small Card: Escrow Payments & Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-zinc-200 rounded-3xl p-8 relative overflow-hidden group hover:border-[#14a800] transition-colors text-left shadow-sm"
          >
            {/* Stripe Badge */}
            <div className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-[#14a800] text-[10px] font-bold uppercase tracking-wider">
              {t("security.badgeStripe")}
            </div>

            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100 group-hover:scale-105 transition-transform text-[#14a800]">
              <Lock className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800 mb-2">{t("security.card2Title")}</h3>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed font-semibold">
              {t("security.card2Desc")}
            </p>
          </motion.div>

          {/* Small Card: Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-zinc-200 rounded-3xl p-8 relative overflow-hidden group hover:border-[#14a800] transition-colors text-left shadow-sm"
          >
            {/* Swiss Flag Badge */}
            <div className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-[#14a800] text-[10px] font-bold uppercase tracking-wider">
              {t("security.badgeSwiss")}
            </div>

            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 border border-green-100 group-hover:scale-105 transition-transform text-[#14a800]">
              <BadgeCheck className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800 mb-2">{t("security.card3Title")}</h3>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed font-semibold">
              {t("security.card3Desc")}
            </p>
          </motion.div>

          {/* Small Card: Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-zinc-200 rounded-3xl p-8 relative overflow-hidden group hover:border-[#14a800] transition-colors text-left shadow-sm"
          >
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 border border-amber-100 group-hover:scale-105 transition-transform text-amber-500">
              <Star className="w-7 h-7 stroke-[1.75] fill-amber-50" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800 mb-2">{t("security.card4Title")}</h3>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed font-semibold">
              {t("security.card4Desc")}
            </p>
          </motion.div>

          {/* Small Card: 24/7 Emergency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-zinc-200 rounded-3xl p-8 relative overflow-hidden group hover:border-[#14a800] transition-colors text-left shadow-sm"
          >
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 border border-rose-100 group-hover:scale-105 transition-transform text-rose-500">
              <PhoneCall className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800 mb-2">{t("security.card5Title")}</h3>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed font-semibold">
              {t("security.card5Desc")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
