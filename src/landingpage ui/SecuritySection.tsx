import { motion } from "motion/react";
import { ShieldCheck, Lock, FileKey2, Building, History, Cloud, Fingerprint, Network } from "lucide-react";

export default function SecuritySection() {
  return (
    <section id="security" className="w-full py-32 md:py-48 px-6 bg-[#030303] relative z-20 overflow-hidden font-sans">
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
                 <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300">Enterprise Security</span>
               </div>
               <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
                  Bank-grade <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 italic">security.</span>
               </h2>
               <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                  Your data is your most valuable asset. BlueX is engineered from the ground up to protect it with military-grade encryption and rigorous compliance standards.
               </p>
             </motion.div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             
             {/* Large Card: SOC 2 */}
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
                   <h3 className="text-3xl font-semibold text-white mb-4">SOC 2 Type II Certified</h3>
                   <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
                      Independently audited and certified for security, availability, and confidentiality. We maintain the highest standards of data protection.
                   </p>
                </div>
             </motion.div>

             {/* Small Card: Encryption */}
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
                <h3 className="text-xl font-semibold text-white mb-2">E2E Encryption</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                   AES-256 encryption at rest and TLS 1.3 in transit.
                </p>
             </motion.div>

             {/* Small Card: RBAC */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/30 transition-colors"
             >
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-16 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                   <Fingerprint className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Advanced RBAC</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                   Granular permissions and custom roles for every user.
                </p>
             </motion.div>

             {/* Small Card: Cloud Infrastructure */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors"
             >
                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-16 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                   <Cloud className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Cloud Infrastructure</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                   Deployed on hardened AWS infrastructure with multi-tenant isolation.
                </p>
             </motion.div>

             {/* Small Card: Audit Logs */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900/50 bg-grid-dark backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-rose-500/30 transition-colors"
             >
                <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-16 border border-rose-500/20 group-hover:scale-110 transition-transform">
                   <History className="w-7 h-7 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Immutable Logs</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                   Comprehensive tracking and auditing of every platform action.
                </p>
             </motion.div>

          </div>
       </div>
    </section>
  )
}
