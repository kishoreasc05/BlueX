import { motion } from "motion/react";
import { useLanguage } from "../hooks/use-language";
import photoAnalytics from "../assets/webp/search_real_1783445781613.webp";
import photoAi from "../assets/webp/ai matching.webp";
import photoPayments from "../assets/webp/escrow_real_1783445814196.webp";
import sectionBg from "../assets/webp/hero_professionals_group.webp";

export default function PlatformOverview() {
  const { t } = useLanguage();

  return (
    <section
      id="platform"
      className="w-full py-24 md:py-32 px-6 bg-zinc-950 bg-grid-dark relative z-30 shadow-2xl overflow-hidden font-body"
    >
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 md:opacity-35">
        <img
          src={sectionBg}
          alt="Marketplace Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-zinc-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header (Split Layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
              {t("overview.title")} <br />
              <span className="italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent drop-shadow-sm font-light">
                {t("overview.subtitle")}
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:w-1/2 md:max-w-md"
          >
            <p className="text-zinc-400 text-lg leading-relaxed">{t("overview.desc")}</p>
          </motion.div>
        </div>

        {/* Bento Box Grid (Cards using WebP images & Custom CSS Mockup) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Card 1: Find & Book Service Providers (Spans 2 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[2rem] md:col-span-2 md:row-span-2 bg-[#0d0a1b]/40 border border-white/5 shadow-2xl"
          >
            <img
              src={photoAnalytics}
              alt="Find & Book Service Providers"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/40 to-transparent z-[1]" />

            <div className="absolute bottom-0 left-0 p-8 text-white z-10 w-full">
              <h3 className="text-3xl font-display font-medium mb-2 tracking-tight">
                {t("overview.card1Title")}
              </h3>
              <p className="text-zinc-300 max-w-md leading-relaxed text-sm md:text-base">
                {t("overview.card1Desc")}
              </p>
            </div>
          </motion.div>

          {/* Card 2: AI Matchmaking (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-[2rem] md:col-span-1 md:row-span-1 bg-[#0d0a1b]/40 border border-white/5 shadow-2xl"
          >
            <img
              src={photoAi}
              alt="AI Matchmaking"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/60 to-transparent z-[1]" />

            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">
                {t("overview.card2Title")}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{t("overview.card2Desc")}</p>
            </div>
          </motion.div>

          {/* Card 3: Secure Escrow (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-[2rem] md:col-span-1 md:row-span-1 bg-[#0d0a1b]/40 border border-white/5 shadow-2xl"
          >
            <img
              src={photoPayments}
              alt="Secure Escrow Payments"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/60 to-transparent z-[1]" />

            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">
                {t("overview.card3Title")}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{t("overview.card3Desc")}</p>
            </div>
          </motion.div>

          {/* Card 4: Operations Dashboard Mockup (Spans 3 cols, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-[2rem] md:col-span-3 bg-zinc-900/50 border border-white/5 shadow-2xl p-8 flex flex-col lg:flex-row gap-8 items-center justify-between"
          >
            {/* Text details */}
            <div className="flex-1 text-left relative z-10">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                Platform Control
              </div>
              <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-3 tracking-tight">
                {t("overview.card4Title")}
              </h3>
              <p className="text-zinc-400 max-w-xl text-sm md:text-base leading-relaxed">
                {t("overview.card4Desc")}
              </p>
            </div>

            {/* CSS-based Live Admin Panel Mockup */}
            <div className="w-full lg:w-[480px] shrink-0 border border-white/10 bg-[#05030a]/90 rounded-2xl p-5 font-mono text-xs text-zinc-400 shadow-2xl relative overflow-hidden">
              {/* Header window control */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-zinc-500 ml-2">bluex-ops-panel.ch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    Live System
                  </span>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                    Marketplace Volume
                  </span>
                  <div className="text-sm font-bold text-white mt-1">CHF 248,510.80</div>
                  <span className="text-[9px] text-emerald-400 mt-0.5 block font-semibold">
                    +18.4% this week
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                    Stripe Split Flow
                  </span>
                  <div className="text-sm font-bold text-white mt-1">Direct Connect</div>
                  <span className="text-[9px] text-blue-400 mt-0.5 block font-semibold">
                    100% Compliant
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                    Active Handwerker
                  </span>
                  <div className="text-sm font-bold text-white mt-1">842 Pros</div>
                  <span className="text-[9px] text-zinc-500 mt-0.5 block">Vetted Swiss UID</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-500">
                    Vetting Queue
                  </span>
                  <div className="text-sm font-bold text-amber-400 mt-1">3 Pending</div>
                  <span className="text-[9px] text-zinc-500 mt-0.5 block">Compliance check</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
