import { motion } from "motion/react";
import { FolderKanban, Workflow, FileSignature, ChevronRight, ChevronDown, Check, Search, Calendar, Clock, Info, X } from "lucide-react";

export default function EnterpriseModules() {
  return (
    <section className="w-full py-24 md:py-32 px-6 bg-slate-50 relative z-20 overflow-hidden font-sans">
      
      {/* Vibrant Animated Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <motion.div 
           animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-300/30 blur-[120px] mix-blend-multiply" 
         />
         <motion.div 
           animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-violet-300/30 blur-[120px] mix-blend-multiply" 
         />
         <motion.div 
           animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
           transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-emerald-300/20 blur-[120px] mix-blend-multiply" 
         />
      </div>

      <div className="max-w-[1300px] mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-8 relative z-10">
        
        {/* Left Side: Typography and Action Cards */}
        <div className="w-full lg:w-[45%] flex flex-col items-start text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl lg:text-[5rem] leading-[1.05] tracking-tight font-light mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium">Accelerate</span><br/>
            <span className="text-slate-800">business operations.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg md:text-xl max-w-[480px] leading-relaxed mb-10"
          >
            BlueX provides a unified workspace for managing projects, contracts, documents, and workflows—eliminating silos and automating repetitive tasks natively.
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
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                <FolderKanban className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-slate-900 font-semibold text-sm">Projects & Jobs</h4>
                <p className="text-slate-500 text-xs">End-to-end lifecycle</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex-1 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl p-4 flex items-center gap-4 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                <FileSignature className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="text-slate-900 font-semibold text-sm">Smart Contracts</h4>
                <p className="text-slate-500 text-xs">Secure digital agreements</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: UI Component Collage */}
        <div className="w-full lg:w-[55%] relative min-h-[600px] flex items-center justify-center">
          
          <div className="relative w-full max-w-[700px] aspect-[4/3]">
            
            {/* Mockup 1: Tree View / Search (Left) */}
            <motion.div 
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="absolute left-0 top-[5%] w-[320px] bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-white flex flex-col overflow-hidden z-20"
            >
              <div className="p-4 border-b border-slate-100">
                <div className="w-full h-9 bg-slate-50 border border-slate-200 rounded flex items-center px-3 gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Search workflows...</span>
                </div>
              </div>
              <div className="p-2 flex flex-col text-sm text-slate-700">
                <div className="flex items-center gap-2 px-2 py-2.5 bg-slate-50/50 rounded">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-white rounded-full" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                  <span className="font-medium">Client Onboarding</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-2.5 ml-6 hover:bg-slate-50 rounded">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span>Verify KYC Documents</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-2.5 ml-6 hover:bg-slate-50 rounded">
                  <div className="w-4 h-4 border border-slate-300 rounded-sm" />
                  <span>Setup Billing Profile</span>
                </div>
                
                <div className="flex items-center gap-2 px-2 py-2.5 hover:bg-slate-50 rounded mt-1">
                  <div className="w-4 h-4 border border-slate-300 rounded-sm" />
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span>Q3 Marketing Campaign</span>
                </div>
                
                <div className="flex items-center gap-2 px-2 py-2.5 hover:bg-slate-50 rounded mt-1">
                  <div className="w-4 h-4 border border-slate-300 rounded-sm" />
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span>Annual Vendor Renewals</span>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-blue-500 rounded-full flex items-center px-0.5">
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm ml-auto" />
                  </div>
                  <span className="text-slate-600">Show only active</span>
                </div>
                <span className="text-blue-600 font-semibold cursor-pointer">CLEAR</span>
              </div>
            </motion.div>

            {/* Mockup 2: Tabs / Stats (Top Right) */}
            <motion.div 
              initial={{ opacity: 0, x: -20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute right-0 top-0 w-[340px] bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-white p-5 flex flex-col gap-4 z-10"
            >
              <div className="flex items-center gap-6 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-1.5 relative">
                  <span className="text-sm font-semibold text-blue-600">Contracts</span>
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">124</span>
                  <div className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-blue-600" />
                </div>
                <div className="flex items-center gap-1.5 relative">
                  <span className="text-sm font-medium text-slate-700">Pending</span>
                  <div className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full ml-1">12</span>
                </div>
                <span className="text-sm font-medium text-slate-700 ml-auto">Drafts</span>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50/50 rounded-full px-3 py-1.5 cursor-pointer">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-medium text-emerald-700">Active Status</span>
                    <ChevronDown className="w-3 h-3 text-emerald-600" />
                  </div>
                  <Info className="w-4 h-4 text-slate-400" />
                </div>
                <button className="text-xs font-semibold text-blue-600 border border-blue-200 rounded px-4 py-1.5 hover:bg-blue-50 transition-colors">
                  View all
                </button>
              </div>
            </motion.div>

            {/* Mockup 3: Form (Middle Right) */}
            <motion.div 
              initial={{ opacity: 0, x: -20, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute right-0 top-[40%] w-[340px] bg-white/90 backdrop-blur-xl rounded-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-white p-5 flex flex-col gap-5 z-30"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">Contract Name</label>
                  <input type="text" placeholder="Enter a name" className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm outline-none placeholder:text-slate-300 bg-white/50" />
                </div>
                <div className="w-24">
                  <label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">Signatories</label>
                  <div className="relative">
                    <input type="text" defaultValue="2" className="w-full border border-slate-200 rounded-md pl-3 pr-8 py-1.5 text-sm outline-none bg-white/50" />
                    <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center">
                      <ChevronDown className="w-3 h-3 text-slate-400 rotate-180" />
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-5 bg-blue-500 rounded-full flex items-center px-0.5">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto" />
                </div>
                <span className="text-sm text-slate-700">Require E-Signature</span>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[11px] font-semibold text-slate-700 mb-1.5 block">Expiration Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input type="text" placeholder="Select Date" className="w-full border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-sm outline-none placeholder:text-slate-300 bg-white/50" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mockup 4: Toast (Bottom Right) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute right-0 bottom-0 w-[340px] bg-emerald-50/90 backdrop-blur-md border-l-4 border-emerald-500 rounded shadow-lg flex items-center px-4 py-3 z-40 border-y border-r border-emerald-100"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center mr-3 shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-emerald-900 text-sm font-medium">Contract sent for signing!</span>
              <button className="text-[11px] font-bold text-blue-600 ml-auto mr-4 tracking-wider hover:underline">VIEW</button>
              <X className="w-4 h-4 text-emerald-700 cursor-pointer" />
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
