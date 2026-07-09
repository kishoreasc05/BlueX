import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "../hooks/use-language";

export default function PricingPreview() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("pricing.clientPlan"),
      desc: t("pricing.clientDesc"),
      price: t("pricing.clientPrice"),
      period: "",
      features: [
        t("pricing.clientFeat1"),
        t("pricing.clientFeat2"),
        t("pricing.clientFeat3"),
        t("pricing.clientFeat4"),
      ],
      button: t("pricing.ctaClient"),
      href: "/signin" as const,
      role: "client" as const,
      primary: false,
    },
    {
      name: t("pricing.proPlan"),
      desc: t("pricing.proDesc"),
      price: t("pricing.proPrice"),
      period: t("pricing.proPricePeriod"),
      features: [
        t("pricing.proFeat1"),
        t("pricing.proFeat2"),
        t("pricing.proFeat3"),
        t("pricing.proFeat4"),
      ],
      button: t("pricing.ctaPro"),
      href: "/signin" as const,
      role: "provider" as const,
      primary: true,
    },
    {
      name: t("pricing.teamPlan"),
      desc: t("pricing.teamDesc"),
      price: t("pricing.teamPrice"),
      period: t("pricing.teamPricePeriod"),
      features: [
        t("pricing.teamFeat1"),
        t("pricing.teamFeat2"),
        t("pricing.teamFeat3"),
        t("pricing.teamFeat4"),
      ],
      button: t("pricing.ctaTeam"),
      href: "/signin" as const,
      role: "client" as const,
      primary: false,
    },
  ];

  return (
    <section
      className="w-full py-32 md:py-48 px-6 bg-[#030303] relative z-20 font-sans border-t border-white/5"
      id="pricing"
    >
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(79,70,229,0.1),transparent_100%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold tracking-widest uppercase text-zinc-300">
                {t("pricing.badge")}
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tight text-white leading-[1.1] mb-6 font-light">
              {t("pricing.title")}{" "}
              <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 italic">
                {t("pricing.desc")}
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col p-10 rounded-[2.5rem] transition-all duration-300 backdrop-blur-xl ${
                plan.primary
                  ? "bg-zinc-900/80 bg-grid-dark border border-indigo-500/30 shadow-[0_0_80px_-15px_rgba(79,70,229,0.3)] md:-translate-y-4 md:scale-105 z-10"
                  : "bg-zinc-900/40 bg-grid-dark border border-white/10 hover:bg-zinc-900/60 hover:border-white/20 z-0"
              }`}
            >
              {plan.primary && (
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-[2.5rem] pointer-events-none" />
              )}

              {plan.primary && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1A4BFF] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 border border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <div className="relative z-10 mb-8">
                <h3 className="text-2xl font-semibold text-white mb-3">{plan.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed h-10">{plan.desc}</p>
              </div>

              <div className="relative z-10 mb-10 flex items-baseline gap-1">
                <span className="text-6xl font-display font-medium tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="text-zinc-500 font-medium">{plan.period}</span>
              </div>

              <ul className="relative z-10 flex flex-col gap-5 mb-10 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm text-zinc-300">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.primary ? "bg-[#1A4BFF]/20 text-[#1A4BFF]" : "bg-white/10 text-white"}`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                search={{ mode: "signup", role: plan.role }}
                className={`relative z-10 w-full h-14 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center text-sm cursor-pointer ${
                  plan.primary
                    ? "bg-[#1A4BFF] text-white hover:bg-blue-700 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {plan.button}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
