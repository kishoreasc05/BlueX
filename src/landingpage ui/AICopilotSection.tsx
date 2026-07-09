import { motion } from "motion/react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../hooks/use-language";
import aiBg from "../assets/webp/ai_section_bg_1783280902370.webp";

export default function AICopilotSection() {
  const { t } = useLanguage();

  const capabilities = [t("ai.cap1"), t("ai.cap2"), t("ai.cap3"), t("ai.cap4"), t("ai.cap5")];

  return (
    <section
      id="ai"
      className="w-full py-24 md:py-32 px-6 bg-[#05030a] relative z-20 overflow-hidden font-body"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={aiBg}
          alt="Background"
          className="w-full h-full object-cover object-center opacity-10"
        />
        {/* Dark overlay to let the image show through, but fade at top/bottom for smooth transitions */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05030a] via-transparent to-[#05030a]" />
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        {/* Left: AI Conversation Interface (Glassmorphism Container) */}
        <div className="w-full lg:w-1/2 relative h-[600px] flex items-center justify-center">
          {/* Decorative Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[80px]" />

          {/* Glassmorphism Phone/UI Container */}
          <div className="relative w-full max-w-[420px] h-[540px] bg-zinc-900/40 backdrop-blur-2xl border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] rounded-[2.5rem] p-6 overflow-hidden flex flex-col">
            {/* Top Bar Fake UI */}
            <div className="flex items-center justify-between w-full pb-4 border-b border-white/5 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-tight">
                    {t("ai.badge")}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Chat Bubbles */}
            <div className="flex flex-col gap-6 w-full relative z-10">
              {/* User Message 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="self-end bg-white/5 border border-white/10 shadow-sm rounded-2xl rounded-tr-sm p-4 max-w-[85%]"
              >
                <p className="text-[13px] text-zinc-300 leading-relaxed font-medium">
                  {t("ai.chatUser1")}
                </p>
              </motion.div>

              {/* AI Response 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="self-start bg-indigo-950/40 border border-indigo-500/20 text-white shadow-2xl rounded-2xl rounded-tl-sm p-4 max-w-[90%] relative group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                    BlueX AI Coach
                  </span>
                </div>
                <p className="text-[13px] text-zinc-200 leading-relaxed">{t("ai.chatAi1")}</p>

                {/* Subtle glow behind AI bubble */}
                <div className="absolute -inset-2 bg-indigo-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>

              {/* User Message 2 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="self-end bg-white/5 border border-white/10 shadow-sm rounded-2xl rounded-tr-sm p-4 max-w-[85%]"
              >
                <p className="text-[13px] text-zinc-300 leading-relaxed font-medium">
                  {t("ai.chatUser2")}
                </p>
              </motion.div>
            </div>

            {/* Action Chip */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#09090b]/90 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] rounded-full px-5 py-3 flex items-center gap-3 w-max z-20"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-[13px] font-semibold text-white">{t("ai.actionChip")}</span>
            </motion.div>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="w-full lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 shadow-2xl rounded-[2.5rem] p-8 md:p-10 lg:p-12 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs text-indigo-400 font-semibold mb-8 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> {t("ai.badge")}
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] mb-6 drop-shadow-sm font-light">
              {t("ai.title")}{" "}
              <span className="italic text-indigo-400 relative inline-block font-semibold">
                {t("ai.titleItalic")}
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-indigo-400/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                  />
                </svg>
              </span>
            </h2>

            <p className="text-zinc-400 text-base md:text-lg mb-10 leading-relaxed max-w-lg font-medium drop-shadow-sm">
              {t("ai.desc")}
            </p>

            <ul className="space-y-5 mb-10">
              {capabilities.map((cap, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center gap-4 text-zinc-300 font-semibold text-base md:text-lg drop-shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-md text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{cap}</span>
                </motion.li>
              ))}
            </ul>

            <button className="inline-flex items-center gap-2 bg-[#1A4BFF] hover:bg-blue-700 text-white font-medium rounded-full px-6 py-3.5 transition-all shadow-[0_10px_20px_-10px_rgba(26,75,255,0.5)] hover:shadow-xl hover:-translate-y-0.5 duration-200 text-sm cursor-pointer">
              {t("ai.btn")} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
