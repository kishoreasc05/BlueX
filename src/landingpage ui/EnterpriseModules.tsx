import { motion } from "motion/react";
import {
  ShieldCheck,
  Star,
  MapPin,
  Check,
  Quote,
  Building2,
  Lock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function EnterpriseModules() {
  return (
    <section className="w-full py-24 md:py-32 px-6 bg-slate-50 relative z-20 overflow-hidden font-sans">
      {/* Vibrant Animated Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-300/20 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-300/20 blur-[120px] mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-emerald-300/15 blur-[120px] mix-blend-multiply"
        />
      </div>

      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-12 relative z-10">
        {/* Left Side: Typography and Action Cards */}
        <div className="w-full lg:w-[45%] flex flex-col items-start text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl lg:text-[5rem] leading-[1.05] tracking-tight font-light mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium">
              Hire with
            </span>
            <br />
            <span className="text-slate-800">absolute trust.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-[480px] leading-relaxed mb-10"
          >
            Every professional on BlueX is fully vetted. Browse transparent profiles showcasing identity verification, Swiss commercial registry credentials, insurance coverage, and verified customer reviews.
          </motion.p>

          {/* Small Action Cards at bottom left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]"
          >
            {/* Card 1 */}
            <div className="flex-1 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl p-4 flex items-center gap-4 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-slate-900 font-semibold text-sm">Trust Center</h4>
                <p className="text-slate-500 text-xs">100% verified credentials</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl p-4 flex items-center gap-4 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-slate-900 font-semibold text-sm">Swiss Insured</h4>
                <p className="text-slate-500 text-xs">Covered up to CHF 5,000,000</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Trust Cards Stack */}
        <div className="w-full lg:w-[55%] flex flex-col items-center justify-center mt-10 lg:mt-0">
          
          {/* Main Mockup: Verified Provider Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-[380px] bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] relative z-20 flex flex-col hover:shadow-xl transition-shadow"
          >
            {/* Header: Photo & Title */}
            <div className="flex items-center gap-4 mb-5 text-left">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold shrink-0 shadow-md shadow-indigo-600/10">
                MK
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Marc Keller</h3>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 fill-emerald-600/10" />
                    Swiss Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Keller Plumbers &amp; Heating</p>
                <div className="flex items-center gap-1 mt-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Zurich, ZH</span>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4 text-left">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-800">4.9</span>
              <span className="text-xs text-slate-400 font-medium">(142 reviews)</span>
            </div>

            {/* Verifications Checklist */}
            <div className="flex flex-col gap-3.5 mb-6 text-left">
              {/* Item 1: UID */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Commercial Registry</span>
                  <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    CHE-284.912.748 MWST
                  </span>
                </div>
              </div>

              {/* Item 2: Insurance */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">AXA Partner Insurance</span>
                  <span className="text-sm font-medium text-slate-700 mt-0.5 block">
                    Fully Insured (CHF 5,000,000 Cover)
                  </span>
                </div>
              </div>

              {/* Item 3: Diploma */}
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">Trade Qualifications</span>
                  <span className="text-sm font-medium text-slate-700 mt-0.5 block">
                    Federal VET Diploma (EFZ Plumber)
                  </span>
                </div>
              </div>
            </div>

            {/* Book Button CTA */}
            <button className="w-full h-12 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/10">
              Book Marc
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Sub-cards Row stacked below the profile card */}
          <div className="w-full max-w-[380px] mt-6 flex flex-col gap-4">
            {/* AXA Protection Badge Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-emerald-500 text-white rounded-2xl px-4 py-3 shadow-lg shadow-emerald-500/10 flex items-center gap-3 border border-emerald-400"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100 text-left">AXA Partner</span>
                <span className="text-sm font-bold text-left">CHF 5M Cover</span>
              </div>
            </motion.div>

            {/* Customer Review Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex flex-col gap-2.5 text-left"
            >
              <div className="flex items-center justify-between">
                <Quote className="w-6 h-6 text-indigo-400 opacity-60" />
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                "Marc repaired our plumbing on a Sunday evening. Fast, professional, and fully escrow protected."
              </p>
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400">Sarah M.</span>
                <span className="text-[10px] font-semibold text-indigo-400">Zurich Homeowner</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
