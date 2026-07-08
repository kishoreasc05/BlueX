import { motion } from "motion/react";
import { Search, Activity, Briefcase } from "lucide-react";

const features = [
  {
    title: "Client Booking Portal",
    description:
      "Homeowners and businesses describe projects in plain language, search verified local experts, book instantly, and pay securely via escrow.",
    icon: Search,
    color: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/20",
  },
  {
    title: "Provider Business Hub",
    description:
      "Service professionals receive bookings, manage calendars, track earnings, bid on public tenders, and optimize pricing with the AI Coach.",
    icon: Briefcase,
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/20",
  },
  {
    title: "Operations Dashboard",
    description:
      "Internal administrators oversee marketplace health, monitor provider compliance, audit bookings, configure automation agents, and resolve issues.",
    icon: Activity,
    color: "from-purple-500 to-fuchsia-500",
    shadow: "shadow-purple-500/20",
  },
];

export default function UnifiedWorkspace() {
  return (
    <section
      id="platform-tools"
      className="w-full py-32 md:py-48 px-6 bg-[#050505] relative z-20 overflow-hidden border-t border-white/5"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
              Platform Tools
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
            One platform.
            <br />
            <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Three portals.
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-[700px] mx-auto leading-relaxed">
            BlueX brings together a client booking portal, a provider business hub, and an
            operations dashboard — seamlessly connected.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative flex flex-col p-10 rounded-[2.5rem] bg-zinc-900/40 bg-grid-dark border border-white/10 backdrop-blur-xl hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-500"
            >
              {/* Hover Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none`}
              />

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-zinc-900 border border-white/10 mb-8 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg ${feature.shadow}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 rounded-2xl`}
                />
                <feature.icon className="w-8 h-8 text-white relative z-10" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
