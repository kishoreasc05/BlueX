import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section className="w-full relative bg-white text-slate-900 overflow-hidden py-24 md:py-32 z-20 font-sans border-t border-slate-100">
      {/* Glow Blobs optimized for White Theme */}
      <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-green-200/40 blur-[100px] rounded-full z-10 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-200/30 blur-[110px] rounded-full z-10 pointer-events-none" />
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-emerald-200/30 blur-[100px] rounded-full z-10 pointer-events-none" />

      <div className="relative z-20 max-w-[800px] mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6 text-slate-900 font-bold"
        >
          {t("cta.title1")}{" "}
          <span className="text-[#14a800] block mt-1 font-bold">
            {t("cta.title2")}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-zinc-600 mb-12 max-w-[600px] mx-auto leading-relaxed font-medium"
        >
          {t("cta.desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/signin?mode=signup&role=client"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-[#14a800] hover:bg-[#129400] text-white font-bold transition-all duration-300 group text-sm cursor-pointer shadow-lg shadow-green-200/50"
          >
            {t("cta.btnClient")}{" "}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-white" />
          </a>
          <a
            href="/signin?mode=signup&role=provider"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200 text-sm cursor-pointer shadow-sm"
          >
            {t("cta.btnProvider")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
