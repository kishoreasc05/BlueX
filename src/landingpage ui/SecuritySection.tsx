import { motion } from "motion/react";
import { ShieldCheck, BadgeCheck, Fingerprint, Lock, PhoneCall, Star } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function SecuritySection() {
  const { t } = useLanguage();

  return (
    <section
      id="trust"
      className="w-full py-32 md:py-48 px-6 bg-[#030303] relative z-20 overflow-hidden font-sans"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(16,185,129,0.05),transparent_100%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
                {t("security.badge")}
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.2] mb-6 font-light py-1">
              {t("security.title")}{" "}
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic py-1.5 inline-block">
                {t("security.titleItalic")}
              </span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">{t("security.desc")}</p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card: Verified Providers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <ShieldCheck className="w-72 h-72 text-emerald-500" />
            </div>

            {/* Swiss Vetted Badge */}
            <div className="absolute top-6 right-6 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              {t("security.badgeUid")}
            </div>

            <div className="relative z-10 w-full h-full flex flex-col justify-end min-h-[250px]">
              <h3 className="text-3xl font-semibold text-white mb-4">{t("security.card1Title")}</h3>
              <p className="text-zinc-400 max-w-xl text-lg leading-relaxed">
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
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
          >
            {/* Stripe Badge */}
            <div className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold uppercase tracking-wider">
              {t("security.badgeStripe")}
            </div>

            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Lock className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("security.card2Title")}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("security.card2Desc")}</p>
          </motion.div>

          {/* Small Card: Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors"
          >
            {/* Swiss Flag Badge */}
            <div className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
              {t("security.badgeSwiss")}
            </div>

            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <BadgeCheck className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("security.card3Title")}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("security.card3Desc")}</p>
          </motion.div>

          {/* Small Card: Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("security.card4Title")}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("security.card4Desc")}</p>
          </motion.div>

          {/* Small Card: 24/7 Emergency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-rose-500/30 transition-colors"
          >
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t("security.card5Title")}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{t("security.card5Desc")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
