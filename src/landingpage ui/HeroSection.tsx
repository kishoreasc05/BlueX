import { motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, ShieldCheck, Lock, MessageSquare, Star, ArrowRight } from "lucide-react";
import { useLanguage } from "../hooks/use-language";
import heroBg from "../assets/webp/hero section bg.webp";

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Zurich, Switzerland");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/signin",
      search: { mode: "signup", role: "client" },
    });
  };

  return (
    <main className="relative min-h-[780px] lg:min-h-[720px] w-full flex flex-col justify-between overflow-hidden bg-[#05030a] font-body text-white">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover object-right scale-[0.85] translate-x-[3%] -translate-y-[3%] origin-right opacity-30 md:opacity-40"
          style={{
            maskImage: "linear-gradient(to right, transparent 20%, black 55%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 20%, black 55%)",
          }}
        />
      </div>

      {/* Global Background Gradient Fades to blend the image edges */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Left fade: blends the left edge of the image into background */}
        <div className="absolute inset-y-0 left-0 w-[50%] lg:w-[55%] bg-gradient-to-r from-[#05030a] via-[#05030a]/90 to-transparent" />
        {/* Bottom fade: blends the very bottom of the hero section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#05030a] via-[#05030a]/40 to-transparent" />

        {/* Subtle dark overlay on mobile to keep text legible */}
        <div className="absolute inset-0 bg-[#05030a]/75 lg:hidden" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex-grow flex items-center w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-28 lg:pt-36 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left lg:pt-6">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] leading-[1.15] tracking-tight text-white mb-6 font-light"
            >
              {t("hero.title1")} <br />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                {t("hero.title2")}
              </span>{" "}
              <br />
              <span className="text-[#1A4BFF] font-bold">{t("hero.title3")}</span> <br />
              <span className="text-zinc-300 font-medium italic">{t("hero.title4")}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 font-medium text-base md:text-lg max-w-[480px] leading-relaxed mb-8"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* Search Card Form (Glassmorphic) */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-[560px] bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 flex flex-col md:flex-row items-end gap-3.5"
            >
              <div className="flex-1 w-full text-left">
                <label className="text-xs font-bold text-zinc-400 mb-1.5 block uppercase tracking-wider">
                  {t("hero.searchLabel")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("hero.searchPlaceholder")}
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#1A4BFF] focus:border-transparent transition-all"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 w-full text-left">
                <label className="text-xs font-bold text-zinc-400 mb-1.5 block uppercase tracking-wider">
                  {t("hero.locationLabel")}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("hero.locationPlaceholder")}
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#1A4BFF] focus:border-transparent transition-all"
                  />
                  <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto h-11 px-6 rounded-xl bg-[#1A4BFF] hover:bg-blue-700 text-white font-bold text-sm transition-colors flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/10 cursor-pointer"
              >
                {t("hero.findButton")}
              </button>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-row items-center gap-4 w-full"
            >
              <Link
                to="/signin"
                search={{ mode: "signup", role: "client" }}
                className="h-11 px-6 rounded-full bg-[#1A4BFF] hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/15"
              >
                <span>{t("hero.bookBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/signin"
                search={{ mode: "signup", role: "provider" }}
                className="h-11 px-6 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold flex items-center justify-center transition-colors"
              >
                {t("hero.becomeBtn")}
              </Link>
            </motion.div>
          </div>

          {/* Right Column (Empty to let background professionals be visible) */}
          <div className="hidden lg:col-span-5 xl:col-span-6 lg:block" />
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 mb-8 mt-auto">
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-5 md:py-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t("hero.feature1Title")}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{t("hero.feature1Desc")}</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t("hero.feature2Title")}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{t("hero.feature2Desc")}</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t("hero.feature3Title")}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{t("hero.feature3Desc")}</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t("hero.feature4Title")}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{t("hero.feature4Desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
