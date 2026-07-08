import { motion } from "motion/react";
import { Search, UserCheck, CalendarCheck, MessageSquare, ShieldCheck, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Filter",
    description:
      "Browse electricians, plumbers, cleaners and more. Filter by rating, location, and availability.",
    color: "bg-blue-500/20",
    iconColor: "text-blue-400",
    border: "border-blue-500/40",
  },
  {
    icon: UserCheck,
    title: "View Verified Profiles",
    description:
      "Compare certifications, reviews, and pricing. Every provider is ID-verified and fully insured.",
    color: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    border: "border-indigo-500/40",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Select a date and time that works for you. Bookings are confirmed in seconds.",
    color: "bg-violet-500/20",
    iconColor: "text-violet-400",
    border: "border-violet-500/40",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description:
      "Communicate directly with your provider through real-time chat before and during the job.",
    color: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    border: "border-cyan-500/40",
  },
  {
    icon: ShieldCheck,
    title: "Secure Escrow Payment",
    description:
      "Funds are held safely and only released to the provider once you approve the completed work.",
    color: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/40",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description:
      "Leave honest feedback to help the community and reward top-quality professionals.",
    color: "bg-amber-500/20",
    iconColor: "text-amber-400",
    border: "border-amber-500/40",
  },
];

export default function WorkflowAutomation() {
  return (
    <section
      id="how-it-works"
      className="w-full py-32 md:py-48 px-6 bg-[#050505] relative z-20 overflow-hidden font-sans"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(79,70,229,0.15),transparent_100%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 md:mb-32"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
              How It Works
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
            Book a professional{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 font-medium italic">
              in minutes.
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
            From discovery to payment, BlueX handles every step so you can focus on what matters.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col items-start text-left p-8 rounded-2xl border ${step.border} bg-zinc-900/40 backdrop-blur-xl hover:bg-zinc-900/60 transition-all duration-300 group`}
            >
              {/* Step number */}
              <div className="absolute top-4 right-5 text-[11px] font-bold text-zinc-600 tracking-widest">
                0{idx + 1}
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
