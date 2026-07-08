import { motion } from "motion/react";
import {
  Zap,
  Droplet,
  Sparkles,
  Leaf,
  Paintbrush,
  Hammer,
  Truck,
  Heart,
  Shield,
  CreditCard,
  MessageSquare,
  Bot,
  PawPrint,
} from "lucide-react";

const serviceCategories = [
  { icon: Sparkles, name: "Cleaning", color: "text-sky-500", bg: "bg-sky-500/10" },
  { icon: Droplet, name: "Plumbing", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Zap, name: "Electrical", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Truck, name: "Moving", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Leaf, name: "Gardening", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Paintbrush, name: "Painting", color: "text-violet-500", bg: "bg-violet-500/10" },
  { icon: Hammer, name: "Carpentry", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Heart, name: "Childcare", color: "text-pink-500", bg: "bg-pink-500/10" },
  { icon: PawPrint, name: "Pet Care", color: "text-teal-500", bg: "bg-teal-500/10" },
];

const platformHighlights = [
  {
    icon: Shield,
    title: "Trust Center",
    desc: "View provider IDs, certifications, and insurance in one transparent profile.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: CreditCard,
    title: "Secure Escrow",
    desc: "Pay safely — funds release only when you confirm the job is done.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    desc: "Communicate in real time with your provider before, during, and after the job.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Bot,
    title: "AI Business Coach",
    desc: "Providers get AI-driven pricing, tender matching, and growth insights.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

export default function IntegrationsSection() {
  return (
    <section className="w-full py-16 md:py-24 px-6 bg-slate-50 relative z-20 overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-light text-slate-900 tracking-tight mb-6">
            Every service,{" "}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">
              one platform.
            </span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
            BlueX covers all the trades you need, with the tools and trust that
            make every job a great experience.
          </p>
        </motion.div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-4 mb-20 w-full">
          {serviceCategories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${cat.bg} border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}
              >
                <cat.icon className={`w-7 h-7 ${cat.color}`} />
              </div>
              <span className="text-xs font-medium text-slate-600 text-center">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Platform Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {platformHighlights.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
