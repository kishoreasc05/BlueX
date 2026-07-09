import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="w-full relative bg-[#05030a] text-white overflow-hidden py-32 md:py-48 z-20 font-sans border-t border-white/5">
      {/* Background Dashboard & Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Blue Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(79,70,229,0.08),transparent_100%)] z-10" />
        <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-[100%] z-10" />

        {/* Faded Dashboard Graphic */}
        <div className="relative w-[1200px] h-[500px] rounded-t-[2.5rem] border-t border-white/10 border-x opacity-40 z-0 bg-zinc-900/30 shadow-2xl backdrop-blur-3xl overflow-hidden translate-y-32">
          <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-transparent to-transparent z-20" />

          {/* Dashboard Header Mock */}
          <div className="h-14 border-b border-white/10 flex items-center px-8 gap-2.5 bg-white/5">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-450" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-450" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-455" />
          </div>
          {/* Dashboard Content Mock */}
          <div className="flex h-full">
            <div className="w-64 border-r border-white/10 p-8 flex flex-col gap-6 bg-white/5">
              <div className="h-5 w-24 bg-white/10 rounded-full" />
              <div className="h-5 w-32 bg-white/10 rounded-full" />
              <div className="h-5 w-20 bg-white/10 rounded-full" />
            </div>
            <div className="flex-1 p-10 flex flex-col gap-8 bg-white/5">
              <div className="h-10 w-64 bg-white/10 rounded-xl" />
              <div className="flex gap-8">
                <div className="h-40 w-full bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl" />
                <div className="h-40 w-full bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl" />
              </div>
              <div className="h-64 w-full bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-[800px] mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[0.95] mb-8 text-white font-light"
        >
          {t("cta.title1")}{" "}
          <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            {t("cta.title2")}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-400 mb-12 max-w-[600px] mx-auto leading-relaxed"
        >
          {t("cta.desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="/signin?mode=signup&role=client"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-[#1A4BFF] hover:bg-blue-700 text-white font-medium transition-all duration-300 shadow-lg shadow-blue-600/20 group text-sm cursor-pointer"
          >
            {t("cta.btnClient")}{" "}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/signin?mode=signup&role=provider"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-white/5 text-white font-medium hover:bg-white/10 transition-colors shadow-2xl border border-white/15 text-sm cursor-pointer"
          >
            {t("cta.btnProvider")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
