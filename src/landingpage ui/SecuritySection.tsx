import { motion } from "motion/react";
import { ShieldCheck, BadgeCheck, Fingerprint, Lock, PhoneCall, Star } from "lucide-react";

export default function SecuritySection() {
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
                Trust & Safety
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
              Your safety is{" "}
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic">
                our priority.
              </span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
              Every provider on BlueX is vetted, certified, and fully insured. Your payments are
              protected and your data stays private.
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
            className="md:col-span-2 bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
          >
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <ShieldCheck className="w-72 h-72 text-emerald-500" />
            </div>
            <div className="relative z-10 w-full h-full flex flex-col justify-end min-h-[250px]">
              <h3 className="text-3xl font-semibold text-white mb-4">
                ID-Verified Swiss Professionals
              </h3>
              <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
                Every service provider undergoes identity verification, Swiss commercial registry
                (UID) validation, certification checks, and background screening before appearing on
                the platform.
              </p>
            </div>
          </motion.div>

          {/* Small Card: Escrow Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
          >
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-16 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Lock className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Escrow</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Funds are held safely and only released when you approve the completed job.
            </p>
          </motion.div>

          {/* Small Card: Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors"
          >
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-16 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <BadgeCheck className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Licensed &amp; Insured</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              All providers carry proof of Swiss trade licenses, registry validation, and
              professional liability insurance.
            </p>
          </motion.div>

          {/* Small Card: Ratings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-amber-500/30 transition-colors"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-16 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verified Reviews</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Reviews are only possible after a completed booking — no fake ratings.
            </p>
          </motion.div>

          {/* Small Card: 24/7 Emergency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-rose-500/30 transition-colors"
          >
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-16 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">24/7 Emergency</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Burst pipe at midnight? Our emergency network connects you to an available
              professional fast.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
