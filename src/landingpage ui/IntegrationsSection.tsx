import { motion } from "motion/react";
import {
  Github,
  Slack,
  Triangle,
  Database,
  Cloud,
  Mail,
  CreditCard,
  LayoutDashboard,
  Box,
} from "lucide-react";

const integrations = [
  {
    id: 1,
    name: "Slack",
    icon: Slack,
    angle: 0,
    radius: 200,
    color: "text-rose-500",
    bg: "bg-rose-500",
    duration: 25,
  },
  {
    id: 2,
    name: "Salesforce",
    icon: Database,
    angle: 120,
    radius: 200,
    color: "text-blue-500",
    bg: "bg-blue-500",
    duration: 25,
  },
  {
    id: 3,
    name: "Google",
    icon: Mail,
    angle: 240,
    radius: 200,
    color: "text-emerald-500",
    bg: "bg-emerald-500",
    duration: 25,
  },

  {
    id: 4,
    name: "AWS",
    icon: Cloud,
    angle: 60,
    radius: 350,
    color: "text-amber-500",
    bg: "bg-amber-500",
    duration: 40,
  },
  {
    id: 5,
    name: "GitHub",
    icon: Github,
    angle: 180,
    radius: 350,
    color: "text-slate-700",
    bg: "bg-slate-700",
    duration: 40,
  },
  {
    id: 6,
    name: "Stripe",
    icon: CreditCard,
    angle: 300,
    radius: 350,
    color: "text-indigo-500",
    bg: "bg-indigo-500",
    duration: 40,
  },

  {
    id: 7,
    name: "HubSpot",
    icon: LayoutDashboard,
    angle: 25,
    radius: 500,
    color: "text-orange-500",
    bg: "bg-orange-500",
    duration: 60,
  },
  {
    id: 8,
    name: "Zapier",
    icon: Box,
    angle: 155,
    radius: 500,
    color: "text-orange-600",
    bg: "bg-orange-600",
    duration: 60,
  },
  {
    id: 9,
    name: "Azure",
    icon: Cloud,
    angle: 265,
    radius: 500,
    color: "text-cyan-500",
    bg: "bg-cyan-500",
    duration: 60,
  },
];

export default function IntegrationsSection() {
  return (
    <section className="w-full py-16 md:py-24 px-6 bg-slate-50 relative z-20 overflow-hidden font-sans">
      <div className="max-w-[1200px] mx-auto text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-40 mb-4 md:mb-8"
        >
          <h2 className="text-5xl md:text-7xl font-light text-slate-900 tracking-tight mb-6">
            Connects with{" "}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">
              everything.
            </span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-[600px] mx-auto leading-relaxed">
            BlueX integrates natively with your existing enterprise stack. Two-way sync, automated
            data mapping, and zero complex setup required.
          </p>
        </motion.div>

        {/* 3D Solar System Orbital Visual */}
        <div
          className="relative w-full max-w-[1000px] h-[250px] md:h-[400px] flex items-center justify-center scale-50 sm:scale-75 md:scale-[0.85] mt-0 mx-auto"
          style={{ perspective: "1200px" }}
        >
          {/* Tilted Orbital Plane */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: "rotateX(65deg)", transformStyle: "preserve-3d" }}
          >
            {/* Concentric Rings on the plane */}
            <div className="absolute w-[400px] h-[400px] rounded-full border border-slate-300 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]" />
            <div className="absolute w-[700px] h-[700px] rounded-full border-2 border-slate-200 border-dashed pointer-events-none" />
            <div className="absolute w-[1000px] h-[1000px] rounded-full border border-slate-200/60 pointer-events-none" />

            {/* Integration Satellite Nodes (Planets) */}
            {integrations.map((integration) => {
              return (
                <motion.div
                  key={integration.id}
                  initial={{ rotate: integration.angle }}
                  animate={{ rotate: integration.angle + 360 }}
                  transition={{ repeat: Infinity, duration: integration.duration, ease: "linear" }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center z-20"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute"
                    style={{
                      transform: `translateY(-${integration.radius}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Counter-rotate the 2D orbit, then counter-rotate the 3D tilt */}
                    <motion.div
                      initial={{ rotate: -integration.angle }}
                      animate={{ rotate: -(integration.angle + 360) }}
                      transition={{
                        repeat: Infinity,
                        duration: integration.duration,
                        ease: "linear",
                      }}
                      className="pointer-events-auto"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div style={{ transform: "rotateX(-65deg)" }}>
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-xl flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all cursor-pointer relative group">
                          {/* Planetary atmospheric glow */}
                          <div
                            className={`absolute inset-0 rounded-full ${integration.bg} opacity-20 blur-md group-hover:opacity-50 transition-opacity`}
                          />
                          <integration.icon
                            className={`w-6 h-6 md:w-7 md:h-7 ${integration.color} relative z-10`}
                          />

                          {/* Tooltip name */}
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap z-30 pointer-events-none">
                            {integration.name}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Central BlueX Hub (The Sun) - Upright and glowing */}
          <div className="absolute z-40 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-[0_0_80px_rgba(79,70,229,0.4)] flex items-center justify-center border border-indigo-100 relative group cursor-pointer hover:scale-105 transition-transform">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-inner relative z-10">
                <Triangle className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>

              {/* Sun rays / Corona */}
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity pointer-events-none" />

              {/* Glowing pulses */}
              <div className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping opacity-30 pointer-events-none" />
              <div
                className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20 pointer-events-none"
                style={{ animationDelay: "500ms" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
