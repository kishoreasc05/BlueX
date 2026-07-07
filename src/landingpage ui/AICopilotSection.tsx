import { motion } from "motion/react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import aiBg from "../assets/webp/ai_section_bg_1783280902370.webp";

const capabilities = [
  "Smart matches connecting client requirements with verified Swiss professionals",
  "AI Business Coach providing pricing recommendations based on local market rates",
  "Automated public tender matching and draft bid proposals",
  "Smart assistant to help draft customer responses and quotes",
  "Marketplace insights and performance analytics for business growth",
];

export default function AICopilotSection() {
  return (
    <section
      id="ai"
      className="w-full py-24 md:py-32 px-6 bg-slate-50 relative z-20 overflow-hidden"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={aiBg}
          alt="Background"
          className="w-full h-full object-cover object-center opacity-100"
        />
        {/* Lighter overlay to let the image show through, but fade at top/bottom for smooth transitions */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/20 to-white/90" />
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        {/* Left: AI Conversation Interface (Glassmorphism Container) */}
        <div className="w-full lg:w-1/2 relative h-[600px] flex items-center justify-center">
          {/* Decorative Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[80px]" />

          {/* Glassmorphism Phone/UI Container */}
          <div className="relative w-full max-w-[420px] h-[540px] bg-white/60 backdrop-blur-2xl border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] rounded-[2.5rem] p-6 overflow-hidden flex flex-col">
            {/* Top Bar Fake UI */}
            <div className="flex items-center justify-between w-full pb-4 border-b border-slate-200/60 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 leading-tight">
                    BlueX Copilot
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">
                    Online
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              </div>
            </div>

            {/* Chat Bubbles */}
            <div className="flex flex-col gap-6 w-full relative z-10">
              {/* User Message 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="self-end bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tr-sm p-4 max-w-[85%]"
              >
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  What's the average hourly rate for a certified electrician in Zurich right now?
                </p>
              </motion.div>

              {/* AI Response 1 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="self-start bg-zinc-900 text-white shadow-2xl rounded-2xl rounded-tl-sm p-4 max-w-[90%] relative group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
                    BlueX AI Coach
                  </span>
                </div>
                <p className="text-[14px] text-zinc-200 leading-relaxed">
                  In Zurich, it ranges from <span className="font-semibold text-white bg-white/10 px-1 rounded">CHF 120-145/hr</span>. Given your 5-star rating and safety certifications, I recommend pricing at CHF 135/hr to stay highly competitive.
                </p>

                {/* Subtle glow behind AI bubble */}
                <div className="absolute -inset-2 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </motion.div>

              {/* User Message 2 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
                className="self-end bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tr-sm p-4 max-w-[85%]"
              >
                <p className="text-[14px] text-slate-700 leading-relaxed">
                  Sounds good, apply that rate and check for any new public electrical tenders.
                </p>
              </motion.div>
            </div>

            {/* Action Chip */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200, damping: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] rounded-full px-5 py-3 flex items-center gap-3 w-max z-20"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-[14px] font-semibold text-slate-800">
                Rate applied & tenders matched
              </span>
            </motion.div>
          </div>
        </div>

        {/* Right: Explanation */}
        <div className="w-full lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-[2.5rem] p-8 md:p-10 lg:p-12 relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent font-semibold mb-8">
              <Sparkles className="w-4 h-4" /> BlueX Copilot
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-[1.1] mb-6 drop-shadow-sm">
              Your intelligent partner for{" "}
              <span className="italic text-accent relative inline-block">
                business growth.
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-accent/30"
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

            <p className="text-slate-800 text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-medium drop-shadow-sm">
              Supercharge your trades business with an AI Coach that optimizes your pricing, automates quotes, and drafts bids for local public tenders.
            </p>

            <ul className="space-y-5 mb-10">
              {capabilities.map((cap, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center gap-4 text-slate-800 font-semibold text-lg drop-shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  {cap}
                </motion.li>
              ))}
            </ul>

            <button className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-full px-6 py-3 transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-xl hover:-translate-y-0.5 duration-200">
              See AI in action <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
