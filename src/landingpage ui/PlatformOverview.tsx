import { motion } from "motion/react";
import photoAnalytics from "../assets/search_real_1783445781613.png";
import photoAi from "../assets/ai matching.png";
import photoPayments from "../assets/escrow_real_1783445814196.png";
import sectionBg from "../assets/hero_professionals_group.png";

export default function PlatformOverview() {
  return (
    <section
      id="platform"
      className="w-full py-24 md:py-32 px-6 bg-zinc-950 bg-grid-dark relative z-30 shadow-2xl overflow-hidden font-body"
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
              <span className="italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent drop-shadow-sm font-light">
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

        {/* Bento Box Grid (3 Cards using 3 Key Images) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Card 1: Find & Book Service Providers (Spans 2 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[2rem] md:col-span-2 md:row-span-2 bg-[#0d0a1b]/40 border border-white/5 shadow-2xl"
          >
            <img
              src={photoAnalytics}
              alt="Find & Book Service Providers"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/40 to-transparent z-[1]" />
            
            <div className="absolute bottom-0 left-0 p-8 text-white z-10 w-full">
              <h3 className="text-3xl font-display font-medium mb-2 tracking-tight">
                Find & Book Service Providers
              </h3>
              <p className="text-zinc-300 max-w-md leading-relaxed text-sm md:text-base">
                Discover qualified electricians, plumbers, cleaners, and more. Compare profiles, read reviews, and book instantly.
              </p>
            </div>
          </motion.div>

          {/* Card 2: AI Matchmaking (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-[2rem] md:col-span-1 md:row-span-1 bg-[#0d0a1b]/40 border border-white/5 shadow-2xl"
          >
            <img
              src={photoAi}
              alt="AI Matchmaking"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/60 to-transparent z-[1]" />
            
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">AI Matchmaking</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Describe your project, and our AI matches you with the best available Swiss providers.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Secure Escrow (1 col, 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-[2rem] md:col-span-1 md:row-span-1 bg-[#0d0a1b]/40 border border-white/5 shadow-2xl"
          >
            <img
              src={photoPayments}
              alt="Secure Escrow Payments"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-[#05030a]/60 to-transparent z-[1]" />
            
            <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">Secure Escrow</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Funds are held safely and only released when the job is completed and approved.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
