import { motion } from "motion/react";
import { ArrowRight, Quote, TrendingUp, Activity, ShieldCheck } from "lucide-react";

const stories = [
  {
    org: "Sarah M., Zurich (Homeowner)",
    problem: "Had a sudden pipe leak on a Sunday evening. Couldn't get any local plumber to answer.",
    solution: "Used BlueX Emergency Booking. A certified plumber accepted the job in 8 minutes and arrived within the hour.",
    metric: "8 min",
    metricLabel: "Emergency match time",
    icon: TrendingUp,
    color: "from-blue-50 to-indigo-50",
    textColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    org: "M. Keller Electrical (Provider)",
    problem: "Spent too many hours writing quotes, managing invoices, and chasing clients manually.",
    solution: "Migrated to BlueX. The AI Business Coach now automates quote creation and optimized our pricing model.",
    metric: "+32%",
    metricLabel: "Weekly revenue increase",
    icon: Activity,
    color: "from-emerald-50 to-teal-50",
    textColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    org: "David K., Geneva (Homeowner)",
    problem: "Wanted to paint his apartment but was worried about unlicensed or uncertified contractors.",
    solution: "Searched on BlueX, verified provider qualifications in the Trust Center, and paid securely via escrow.",
    metric: "100%",
    metricLabel: "Vetted & insured trades",
    icon: ShieldCheck,
    color: "from-violet-50 to-purple-50",
    textColor: "text-violet-600",
    iconBg: "bg-violet-100",
  },
];

export default function CustomerStories() {
  return (
    <section
      id="stories"
      className="w-full py-32 md:py-48 px-6 bg-white relative z-20 font-sans border-t border-slate-100 overflow-hidden"
    >
      {/* Colorful Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-100/50 blur-[120px] rounded-[100%] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/50 blur-[100px] rounded-[100%] pointer-events-none" />
        <div className="absolute top-[40%] left-[60%] w-[500px] h-[500px] bg-purple-100/40 blur-[100px] rounded-[100%] pointer-events-none" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 relative"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
            <Quote className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-600">
              Reviews & Feedback
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-slate-900 leading-[1.1] mb-6 font-light">
            Trusted by homeowners <br className="hidden md:block" />
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">
              & trades across Switzerland.
            </span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-[700px] mx-auto leading-relaxed">
            Discover how clients find reliable help and how providers grow their businesses on BlueX.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={story.org}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative flex flex-col p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Card Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none`}
              />

              <Quote className="absolute top-8 right-8 w-16 h-16 text-slate-100 rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-6 font-display tracking-tight">
                    {story.org}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        The Challenge
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">{story.problem}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        The Solution
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed">{story.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border border-slate-200 shadow-sm ${story.iconBg} ${story.textColor}`}
                    >
                      <story.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div
                        className={`text-4xl font-display font-medium tracking-tight mb-1 ${story.textColor}`}
                      >
                        {story.metric}
                      </div>
                      <div className="text-sm font-medium text-slate-500">{story.metricLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <a
            href="/signin"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-md group"
          >
            Read all reviews{" "}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
