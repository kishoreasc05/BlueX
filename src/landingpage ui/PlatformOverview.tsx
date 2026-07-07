import { motion } from "motion/react";
import photoAnalytics from "../assets/search_real_1783445781613.png";
import photoAi from "../assets/ai_coach_ui_1783444699367.png";
import photoProjects from "../assets/webp/photo_projects_1783279649064.webp";
import photoDocs from "../assets/trust_real_1783445803842.png";
import photoPayments from "../assets/escrow_real_1783445814196.png";
import sectionBg from "../assets/hero_professionals_group.png";

export default function PlatformOverview() {
  return (
    <section
      id="platform"
      className="w-full py-24 md:py-32 px-6 bg-zinc-950 bg-grid-dark relative z-30 shadow-2xl overflow-hidden"
    >
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 md:opacity-35">
        <img
          src={sectionBg}
          alt="Marketplace Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-zinc-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header (Split Layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
              The complete <br />
              <span className="italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">
                Service Marketplace
              </span>
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
              BlueX is Switzerland's leading AI-powered blue-collar marketplace, connecting you with verified professionals while giving providers the business tools to thrive.
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
            <img
              src={photoAnalytics}
              alt="Analytics and workflows"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white z-10 w-full">
              <h3 className="text-3xl font-display font-medium mb-2">
                Find & Book Service Providers
              </h3>
              <p className="text-white/80 max-w-md">
                Discover qualified electricians, plumbers, painters, and more. Compare profiles, read reviews, and book instantly.
              </p>
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
            <img
              src={photoAi}
              alt="AI Assistant"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2">AI Matchmaking</h3>
              <p className="text-white/70 text-sm">
                Describe your project, and our AI matches you with the best available Swiss providers.
              </p>
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
            <img
              src={photoProjects}
              alt="Project Management"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2">Manage Bookings</h3>
              <p className="text-white/70 text-sm">
                Track active jobs, communicate via live chat, and view provider progress.
              </p>
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
            <img
              src={photoDocs}
              alt="Contracts and Documents"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-2xl font-semibold mb-2">Verified Swiss Professionals</h3>
              <p className="text-white/80 text-sm max-w-[400px]">
                All providers undergo ID verification, certification checks, and are fully insured for your peace of mind.
              </p>
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
            <img
              src={photoPayments}
              alt="Global Payments"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2">Secure Escrow</h3>
              <p className="text-white/70 text-sm">
                Funds are held safely and only released when the job is completed and approved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
