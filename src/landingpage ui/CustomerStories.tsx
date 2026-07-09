import { motion } from "motion/react";
import { ArrowRight, Quote, TrendingUp, Activity, ShieldCheck } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function CustomerStories() {
  const { t } = useLanguage();

  const stories = [
    {
      org: t("stories.story1Org"),
      problem: t("stories.story1Problem"),
      solution: t("stories.story1Solution"),
      metric: t("stories.story1Metric"),
      metricLabel: t("stories.story1MetricLabel"),
      icon: TrendingUp,
      color: "from-blue-950/20 to-indigo-950/20",
      textColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      org: t("stories.story2Org"),
      problem: t("stories.story2Problem"),
      solution: t("stories.story2Solution"),
      metric: t("stories.story2Metric"),
      metricLabel: t("stories.story2MetricLabel"),
      icon: Activity,
      color: "from-emerald-950/20 to-teal-950/20",
      textColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      org: t("stories.story3Org"),
      problem: t("stories.story3Problem"),
      solution: t("stories.story3Solution"),
      metric: t("stories.story3Metric"),
      metricLabel: t("stories.story3MetricLabel"),
      icon: ShieldCheck,
      color: "from-violet-950/20 to-purple-950/20",
      textColor: "text-violet-400",
      iconBg: "bg-violet-500/10 border-violet-500/20",
    },
  ];

  return (
    <section
      id="stories"
      className="w-full py-32 md:py-48 px-6 bg-zinc-950 relative z-20 font-sans border-t border-white/5 overflow-hidden"
    >
      {/* Colorful Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-900/10 blur-[120px] rounded-[100%] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/10 blur-[100px] rounded-[100%] pointer-events-none" />
        <div className="absolute top-[40%] left-[60%] w-[500px] h-[500px] bg-purple-900/5 blur-[100px] rounded-[100%] pointer-events-none" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 relative"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-md">
            <Quote className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300 font-sans">
              {t("stories.badge")}
            </span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
            {t("stories.title")} <br className="hidden md:block" />
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">
              {t("stories.titleItalic")}
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-[700px] mx-auto leading-relaxed">
            {t("stories.desc")}
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
              className="group relative flex flex-col p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 shadow-2xl hover:border-white/10 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Card Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none`}
              />

              <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5 rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />

              <div className="relative z-10 flex flex-col h-full text-left">
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-6 font-display tracking-tight">
                    {story.org}
                  </h3>
                  <div className="space-y-6 font-sans">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A4BFF] mb-1.5">
                        {t("stories.challenge")}
                      </p>
                      <p className="text-zinc-300 text-sm leading-relaxed">{story.problem}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A4BFF] mb-1.5">
                        {t("stories.solution")}
                      </p>
                      <p className="text-zinc-300 text-sm leading-relaxed">{story.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-2xl bg-zinc-900/55 ${story.iconBg} ${story.textColor}`}
                    >
                      <story.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div
                        className={`text-4xl font-display font-medium tracking-tight mb-1 ${story.textColor}`}
                      >
                        {story.metric}
                      </div>
                      <div className="text-sm font-medium text-zinc-500 font-sans">
                        {story.metricLabel}
                      </div>
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
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-[#1A4BFF] hover:bg-blue-700 text-white font-medium transition-all duration-350 shadow-lg shadow-indigo-600/20 group text-sm cursor-pointer"
          >
            {t("stories.btn")}{" "}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
