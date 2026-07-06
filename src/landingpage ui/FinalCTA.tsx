import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="w-full relative bg-white text-slate-900 overflow-hidden py-32 md:py-48 z-20 font-sans border-t border-slate-100">
      {/* Background Dashboard & Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end justify-center">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Blue Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(79,70,229,0.1),transparent_100%)] z-10" />
        <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-[100%] z-10" />

        {/* Faded Dashboard Graphic */}
        <div className="relative w-[1200px] h-[500px] rounded-t-[2.5rem] border-t border-slate-200/60 border-x opacity-60 z-0 bg-white/50 shadow-2xl shadow-indigo-900/5 backdrop-blur-3xl overflow-hidden translate-y-32">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20" />

          {/* Dashboard Header Mock */}
          <div className="h-14 border-b border-slate-200/60 flex items-center px-8 gap-2.5 bg-white/40">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
          </div>
          {/* Dashboard Content Mock */}
          <div className="flex h-full">
            <div className="w-64 border-r border-slate-200/60 p-8 flex flex-col gap-6 bg-white/20">
              <div className="h-5 w-24 bg-slate-200 rounded-full" />
              <div className="h-5 w-32 bg-slate-200 rounded-full" />
              <div className="h-5 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="flex-1 p-10 flex flex-col gap-8 bg-white/10">
              <div className="h-10 w-64 bg-slate-200 rounded-xl" />
              <div className="flex gap-8">
                <div className="h-40 w-full bg-white border border-slate-200/60 rounded-2xl shadow-sm" />
                <div className="h-40 w-full bg-white border border-slate-200/60 rounded-2xl shadow-sm" />
              </div>
              <div className="h-64 w-full bg-white border border-slate-200/60 rounded-2xl shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-[800px] mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[0.95] mb-8 text-slate-900 font-light"
        >
          Ready to run your business{" "}
          <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            intelligently?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-500 mb-12 max-w-[600px] mx-auto leading-relaxed"
        >
          Join thousands of modern enterprises building their automated, AI-native workflows on
          BlueX OS today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <a
            href="/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 group"
          >
            Get started for free{" "}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-50 transition-colors shadow-sm border border-slate-200"
          >
            Contact Sales
          </a>
        </motion.div>
      </div>
    </section>
  );
}
