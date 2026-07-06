import { motion } from "motion/react";
import photoAnalytics from "../assets/webp/photo_analytics_1783279630573.webp";
import photoAi from "../assets/webp/photo_ai_assistant_1783279639279.webp";
import photoProjects from "../assets/webp/photo_projects_1783279649064.webp";
import photoDocs from "../assets/webp/photo_documents_1783279659308.webp";
import photoPayments from "../assets/webp/photo_payments_1783279668786.webp";

export default function PlatformOverview() {
  return (
    <section id="platform" className="w-full py-24 md:py-32 px-6 bg-zinc-950 bg-grid-dark rounded-t-[2.5rem] md:rounded-t-[3.5rem] -mt-8 relative z-30 shadow-2xl">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header (Split Layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
              The complete <br/>
              <span className="italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">Business Operating System</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:w-1/2 md:max-w-md"
          >
            <p className="text-zinc-400 text-lg leading-relaxed">
              BlueX is an AI-native Business OS built to unify your projects, workflows, contracts, and payments into one intelligent, secure enterprise workspace.
            </p>
          </motion.div>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          
          {/* Card 1: Analytics & Workflows (Spans 2 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 bg-secondary/30"
          >
            <img src={photoAnalytics} alt="Analytics and workflows" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white z-10 w-full">
              <h3 className="text-3xl font-display font-medium mb-2">Unified Business Operations</h3>
              <p className="text-white/80 max-w-md">Streamline and orchestrate your entire organization's workflows across teams, clients, and contractors with deep analytical insights.</p>
            </div>
          </motion.div>

          {/* Card 2: AI Assistant (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-3xl md:col-span-1 md:row-span-1 bg-secondary/30"
          >
            <img src={photoAi} alt="AI Assistant" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2">AI-Native Automation</h3>
              <p className="text-white/70 text-sm">Automate repetitive tasks and summarize business content effortlessly.</p>
            </div>
          </motion.div>

          {/* Card 3: Projects (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl md:col-span-1 md:row-span-1 bg-secondary/30"
          >
            <img src={photoProjects} alt="Project Management" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2">Project Management</h3>
              <p className="text-white/70 text-sm">Manage complex initiatives and jobs with complete visibility.</p>
            </div>
          </motion.div>

          {/* Card 4: Documents (2 cols, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-1 bg-secondary/30"
          >
            <img src={photoDocs} alt="Contracts and Documents" className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-2xl font-semibold mb-2">Contracts & Documents</h3>
              <p className="text-white/80 text-sm max-w-[400px]">Secure, multi-tenant collaboration on living documents and legally binding agreements.</p>
            </div>
          </motion.div>

          {/* Card 5: Payments (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="group relative overflow-hidden rounded-3xl md:col-span-1 md:row-span-1 bg-secondary/30"
          >
            <img src={photoPayments} alt="Global Payments" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2">Global Payments</h3>
              <p className="text-white/70 text-sm">Seamless financial transactions and built-in global money movement.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
