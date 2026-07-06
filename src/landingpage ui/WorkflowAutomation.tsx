import { motion } from "motion/react";
import { FileText, Sparkles, CheckCircle, Workflow, Play, Settings2, Plus } from "lucide-react";

export default function WorkflowAutomation() {
  return (
    <section id="workflow" className="w-full py-32 md:py-48 px-6 bg-[#050505] relative z-20 overflow-hidden font-sans">
       {/* Background */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.15),transparent_100%)] pointer-events-none" />

       <div className="max-w-[1200px] mx-auto text-center relative z-10">
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-20 md:mb-32"
         >
           <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
             Flawless <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-medium italic">automation.</span>
           </h2>
           <p className="text-zinc-400 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
             Design processes once, run them infinitely. Watch work flow perfectly from start to finish with AI-driven routing.
           </p>
         </motion.div>

         {/* Sleek Workflow Builder Mockup */}
         <motion.div 
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative w-full max-w-[1000px] mx-auto h-[550px] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_80px_-20px_rgba(79,70,229,0.3)] overflow-hidden flex flex-col text-left"
         >
           {/* Mockup Header */}
           <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center px-6 justify-between shrink-0">
             <div className="flex items-center gap-3">
               <div className="w-7 h-7 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                 <Workflow className="w-4 h-4 text-indigo-400" />
               </div>
               <div>
                 <h3 className="text-sm font-medium text-white leading-tight">Invoice Processing</h3>
                 <p className="text-[10px] text-zinc-500">Edited 2 mins ago</p>
               </div>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="hidden md:flex items-center gap-2 mr-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs text-zinc-400 font-medium">Active</span>
               </div>
               <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-white hover:bg-white/10 transition-colors">
                 <Settings2 className="w-3.5 h-3.5" />
                 Settings
               </button>
               <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-xs text-white font-medium transition-colors shadow-lg shadow-indigo-500/20">
                 <Play className="w-3.5 h-3.5 fill-current" />
                 Run Test
               </button>
             </div>
           </div>

           {/* Mockup Canvas */}
           <div className="relative flex-1 w-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] overflow-hidden">
              
              {/* Connecting SVG Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(96,165,250,0.4)" />
                    <stop offset="100%" stopColor="rgba(129,140,248,0.8)" />
                  </linearGradient>
                  <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(129,140,248,0.8)" />
                    <stop offset="100%" stopColor="rgba(52,211,153,0.4)" />
                  </linearGradient>
                </defs>
                
                {/* Curve 1 (Trigger to AI) */}
                <path d="M 280 180 C 350 180, 400 280, 480 280" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 280 180 C 350 180, 400 280, 480 280" fill="none" stroke="url(#lineGrad1)" strokeWidth="2" className="animate-[dash_3s_linear_infinite]" strokeDasharray="100 1000" strokeDashoffset="1000" />
                
                {/* Curve 2 (AI to Action) */}
                <path d="M 720 280 C 780 280, 800 180, 880 180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 720 280 C 780 280, 800 180, 880 180" fill="none" stroke="url(#lineGrad2)" strokeWidth="2" className="animate-[dash_3s_linear_infinite]" strokeDasharray="100 1000" strokeDashoffset="600" />
                
                <style>{`
                  @keyframes dash {
                    to {
                      stroke-dashoffset: 0;
                    }
                  }
                `}</style>
              </svg>

              {/* Node 1: Trigger */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute top-[140px] left-[40px] md:left-[80px] w-[200px] bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl shadow-xl"
              >
                <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/[0.02] rounded-t-xl">
                  <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">Trigger</span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-white font-medium mb-1">New Invoice</div>
                  <div className="text-xs text-zinc-500">When a PDF is uploaded</div>
                </div>
                {/* Output Port */}
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center shadow-md z-10">
                   <div className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
                </div>
              </motion.div>

              {/* Node 2: AI Action */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute top-[210px] left-[50%] -translate-x-1/2 w-[240px] bg-indigo-950/40 backdrop-blur-xl border border-indigo-500/40 rounded-xl shadow-[0_0_30px_rgba(99,102,241,0.15)]"
              >
                {/* Input Port */}
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-indigo-500/50 rounded-full flex items-center justify-center shadow-md z-10">
                   <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />
                </div>
                
                <div className="p-3 border-b border-indigo-500/20 flex items-center justify-between bg-indigo-500/10 rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="w-6 h-6 rounded bg-indigo-500/30 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                    </div>
                    <span className="text-xs font-semibold text-indigo-200">AI Action</span>
                  </div>
                </div>
                <div className="p-4 relative z-10">
                  <div className="text-sm text-white font-medium mb-2">Extract Line Items</div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 bg-black/20 rounded p-1.5 border border-white/5">
                       <CheckCircle className="w-3 h-3 text-emerald-400" />
                       <span className="text-[10px] text-zinc-400">Match against PO</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/20 rounded p-1.5 border border-white/5">
                       <CheckCircle className="w-3 h-3 text-emerald-400" />
                       <span className="text-[10px] text-zinc-400">Validate amounts</span>
                    </div>
                  </div>
                </div>

                {/* Output Port */}
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-indigo-500/50 rounded-full flex items-center justify-center shadow-md z-10">
                   <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />
                </div>
              </motion.div>

              {/* Node 3: Condition/Action */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="absolute top-[140px] right-[40px] md:right-[80px] w-[200px] bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl shadow-xl"
              >
                {/* Input Port */}
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center shadow-md z-10">
                   <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />
                </div>
                <div className="p-3 border-b border-white/5 flex items-center gap-2 bg-white/[0.02] rounded-t-xl">
                  <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-300">Action</span>
                </div>
                <div className="p-4">
                  <div className="text-sm text-white font-medium mb-1">Auto-Approve</div>
                  <div className="text-xs text-zinc-500">Route to ERP for payment</div>
                </div>
              </motion.div>
              
              {/* Floating Add Button */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="absolute bottom-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg backdrop-blur-md"
              >
                <Plus className="w-5 h-5 text-white" />
              </motion.div>

           </div>
         </motion.div>

       </div>
    </section>
  );
}
