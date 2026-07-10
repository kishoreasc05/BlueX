import { motion } from "motion/react";
import { useLanguage } from "../hooks/use-language";
import photoAnalytics from "../assets/webp/search_real_1783445781613.webp";
import photoAi from "../assets/webp/ai matching.webp";
import photoPayments from "../assets/webp/escrow_real_1783445814196.webp";

export default function PlatformOverview() {
  const { t } = useLanguage();

  return (
    <section
      id="platform"
      className="w-full py-24 md:py-32 px-6 bg-white relative z-30 border-b border-zinc-200 overflow-hidden font-sans"
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header (Split Layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-zinc-900 leading-tight font-bold">
              {t("overview.title")} <br />
              <span className="text-[#14a800]">{t("overview.subtitle")}</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:w-1/2 md:max-w-md text-left"
          >
            <p className="text-zinc-650 text-base md:text-lg leading-relaxed font-semibold">
              {t("overview.desc")}
            </p>
          </motion.div>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Card 1: Find & Book Service Providers (Spans 2 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 bg-white border border-zinc-200 shadow-sm hover:border-[#14a800] transition-all"
          >
            <img
              src={photoAnalytics}
              alt="Find & Book Service Providers"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* White Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent z-[1]" />

            <div className="absolute bottom-0 left-0 p-8 text-zinc-900 z-10 w-full text-left">
              <h3 className="text-2xl font-bold mb-2 tracking-tight">{t("overview.card1Title")}</h3>
              <p className="text-zinc-650 max-w-md leading-relaxed text-sm md:text-base font-semibold">
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
            className="group relative overflow-hidden rounded-2xl md:col-span-1 md:row-span-1 bg-white border border-zinc-200 shadow-sm hover:border-[#14a800] transition-all"
          >
            <img
              src={photoAi}
              alt="AI Matchmaking"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* White Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent z-[1]" />

            <div className="absolute bottom-0 left-0 p-6 text-zinc-900 z-10 w-full text-left">
              <h3 className="text-lg font-bold mb-1.5 tracking-tight">
                {t("overview.card2Title")}
              </h3>
              <p className="text-zinc-650 text-xs leading-relaxed font-semibold">
                {t("overview.card2Desc")}
              </p>
            </div>
          </motion.div>

          {/* Card 3: Secure Escrow (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl md:col-span-1 md:row-span-1 bg-white border border-zinc-200 shadow-sm hover:border-[#14a800] transition-all"
          >
            <img
              src={photoPayments}
              alt="Secure Escrow Payments"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* White Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent z-[1]" />

            <div className="absolute bottom-0 left-0 p-6 text-zinc-900 z-10 w-full text-left">
              <h3 className="text-lg font-bold mb-1.5 tracking-tight">
                {t("overview.card3Title")}
              </h3>
              <p className="text-zinc-650 text-xs leading-relaxed font-semibold">
                {t("overview.card3Desc")}
              </p>
            </div>
          </motion.div>

          {/* Card 4: Operations Dashboard Mockup (Spans 3 cols, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-2xl md:col-span-3 bg-zinc-50 border border-zinc-200 shadow-sm p-8 flex flex-col lg:flex-row gap-8 items-center justify-between"
          >
            {/* Text details */}
            <div className="flex-1 text-left relative z-10">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-[#14a800] text-xs font-semibold uppercase tracking-wider">
                Platform Control
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-3 tracking-tight">
                {t("overview.card4Title")}
              </h3>
              <p className="text-zinc-600 max-w-xl text-sm md:text-base leading-relaxed font-semibold">
                {t("overview.card4Desc")}
              </p>
            </div>

            {/* CSS-based Live Admin Panel Mockup */}
            <div className="w-full lg:w-[480px] shrink-0 border border-zinc-200 bg-white rounded-2xl p-5 font-mono text-xs text-zinc-500 shadow-lg relative overflow-hidden">
              {/* Header window control */}
              <div className="flex items-center justify-between border-b border-zinc-150 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#14a800]" />
                  <span className="text-[10px] text-zinc-400 ml-2">bluex-ops-panel.ch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#14a800] animate-ping" />
                  <span className="text-[10px] text-[#14a800] font-semibold uppercase tracking-wider">
                    Live System
                  </span>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Marketplace Volume
                  </span>
                  <div className="text-sm font-bold text-zinc-800 mt-1">CHF 248,510.80</div>
                  <span className="text-[9px] text-[#14a800] mt-0.5 block font-semibold">
                    +18.4% this week
                  </span>
                </div>
                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Stripe Split Flow
                  </span>
                  <div className="text-sm font-bold text-zinc-800 mt-1">Direct Connect</div>
                  <span className="text-[9px] text-[#14a800] mt-0.5 block font-semibold">
                    100% Compliant
                  </span>
                </div>
                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Active Handwerker
                  </span>
                  <div className="text-sm font-bold text-zinc-800 mt-1">842 Pros</div>
                  <span className="text-[9px] text-zinc-400 mt-0.5 block">Vetted Swiss UID</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-3">
                  <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                    Vetting Queue
                  </span>
                  <div className="text-sm font-bold text-amber-600 mt-1">3 Pending</div>
                  <span className="text-[9px] text-zinc-400 mt-0.5 block">Compliance check</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
