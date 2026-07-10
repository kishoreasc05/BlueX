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
      className="w-full py-28 md:py-36 px-6 bg-[#090d16] relative z-20 font-sans border-t border-white/5"
      id="pricing"
    >
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative animate-fade-in"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="w-4 h-4 text-[#3b82f6]" />
              <span className="text-xs font-bold tracking-widest uppercase text-[#3b82f6] font-sans">
                {t("pricing.badge")}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-6">
              {t("pricing.title")} <br className="hidden md:block" />
              <span className="text-[#3b82f6] block mt-1 font-bold">{t("pricing.desc")}</span>
            </h2>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col p-10 rounded-[2.5rem] transition-all duration-300 ${
                plan.primary
                  ? "bg-[#030712] border-2 border-[#2563eb] shadow-2xl md:-translate-y-4 md:scale-105 z-10 shadow-blue-950/20"
                  : "bg-[#030712] border border-white/10 hover:border-zinc-700 shadow-sm z-0"
              }`}
            >
              {plan.primary && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#2563eb] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 border border-[#3b82f6]">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular
                </div>
              )}

              <div className="relative z-10 mb-8 text-left">
                <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed h-10 font-semibold">
                  {plan.desc}
                </p>
              </div>

              <div className="relative z-10 mb-10 flex items-baseline gap-1 justify-start">
                <span className="text-6xl font-display font-medium tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="text-zinc-500 font-bold">{plan.period}</span>
              </div>

              <ul className="relative z-10 flex flex-col gap-5 mb-10 flex-1 text-left">
                {plan.features.map((feature, fIdx) => (
                  <li
                    key={fIdx}
                    className="flex items-start gap-3 text-sm text-zinc-300 font-semibold"
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                        plan.primary
                          ? "bg-blue-500/10 text-[#3b82f6] border-blue-500/20"
                          : "bg-white/5 text-zinc-400 border-white/10"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.href}
                search={{ mode: "signup", role: plan.role }}
                className={`relative z-10 w-full h-14 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center text-sm cursor-pointer ${
                  plan.primary
                    ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-sm shadow-blue-900/20"
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
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
