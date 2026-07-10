import { motion } from "motion/react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function AICopilotSection() {
  const { t } = useLanguage();

  const capabilities = [t("ai.cap1"), t("ai.cap2"), t("ai.cap3"), t("ai.cap4"), t("ai.cap5")];

  return (
    <section
      id="ai"
      className="w-full py-24 md:py-32 px-6 bg-zinc-50 relative z-20 overflow-hidden font-sans border-b border-zinc-200"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        {/* Left: AI Conversation Interface */}
        <div className="w-full lg:w-1/2 relative h-[560px] flex items-center justify-center">
          {/* Glassmorphism Phone/UI Container */}
          <div className="relative w-full max-w-[420px] h-[520px] bg-white border border-zinc-250 shadow-xl rounded-[2.5rem] p-6 overflow-hidden flex flex-col">
            {/* Top Bar Fake UI */}
            <div className="flex items-center justify-between w-full pb-4 border-b border-zinc-150 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-200">
                  <Sparkles className="w-4 h-4 text-[#14a800]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-zinc-800 leading-tight">
                    {t("ai.badge")}
                  </span>
                  <span className="text-[10px] text-[#14a800] font-semibold uppercase tracking-wider">
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              </div>
            </div>

            {/* Chat Bubbles */}
            <div className="flex flex-col gap-6 w-full relative z-10">
              {/* User Message 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="self-end bg-zinc-50 border border-zinc-200 shadow-sm rounded-2xl rounded-tr-sm p-4 max-w-[85%] text-left"
              >
                <p className="text-[13px] text-zinc-700 leading-relaxed font-semibold">
                  {t("ai.chatUser1")}
                </p>
              </motion.div>

              {/* AI Response 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="self-start bg-green-50 border border-green-150 text-zinc-800 shadow-sm rounded-2xl rounded-tl-sm p-4 max-w-[90%] text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#14a800]" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                    BlueX AI Coach
                  </span>
                </div>
                <p className="text-[13px] text-zinc-700 leading-relaxed font-semibold">{t("ai.chatAi1")}</p>
              </motion.div>

              {/* User Message 2 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="self-end bg-zinc-50 border border-zinc-200 shadow-sm rounded-2xl rounded-tr-sm p-4 max-w-[85%] text-left"
              >
                <p className="text-[13px] text-zinc-700 leading-relaxed font-semibold">
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
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white border border-zinc-200 shadow-lg rounded-full px-5 py-3 flex items-center gap-3 w-max z-20"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14a800]"></span>
              </div>
              <span className="text-[13px] font-bold text-zinc-800">{t("ai.actionChip")}</span>
            </motion.div>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="w-full lg:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-zinc-200 shadow-md rounded-[2rem] p-8 md:p-10 lg:p-12 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs text-[#14a800] font-bold mb-8 uppercase tracking-wider font-sans">
              <Sparkles className="w-4 h-4" /> {t("ai.badge")}
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-tight mb-6">
              {t("ai.title")}{" "}
              <span className="text-[#14a800]">
                {t("ai.titleItalic")}
              </span>
            </h2>

            <p className="text-zinc-650 text-base md:text-lg mb-10 leading-relaxed font-semibold">
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
                  className="flex items-center gap-4 text-zinc-700 font-bold text-base md:text-lg"
                >
                  <div className="w-7 h-7 rounded-full bg-green-50 border border-green-150 flex items-center justify-center shrink-0 text-[#14a800]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{cap}</span>
                </motion.li>
              ))}
            </ul>

            <button className="inline-flex items-center gap-2 bg-[#14a800] hover:bg-[#108a00] text-white font-bold rounded-full px-6 py-3.5 transition-all shadow-sm hover:shadow-md duration-205 text-sm cursor-pointer font-sans">
              {t("ai.btn")} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
