import { motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Lock,
  Star,
  ArrowRight,
  Calendar,
  Play,
  Headphones,
  CheckCircle,
  Wrench,
  Search,
} from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/signin",
      search: { mode: "signup", role: "client" },
    });
  };

  return (
    <main className="relative min-h-[980px] lg:min-h-[940px] w-full flex flex-col justify-between overflow-hidden bg-[#020617] font-sans text-white">
      {/* Background Video Container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-95 lg:opacity-85"
        >
          <source src="/hero_section_video_1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Global Background Gradient Fades to blend the video edges */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-black/15 lg:bg-black/30">
        {/* Left/Center overlay: ensures text readability on dark video (Desktop only) */}
        <div className="absolute inset-y-0 left-0 w-[55%] lg:w-[60%] bg-gradient-to-r from-black/85 via-black/55 to-transparent hidden lg:block" />
        {/* Bottom fade: blends the bottom of the hero section */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Mobile dark overlay: gradient to keep text readable while keeping the video/woman's face bright and clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-transparent lg:hidden" />
        {/* Corner overlay to hide the video watermark sparkle (Gemini logo) */}
        <div className="absolute bottom-[18%] right-[-20px] w-48 h-72 bg-[#020617] blur-3xl rounded-full opacity-95 pointer-events-none" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex-grow flex flex-col justify-start w-full max-w-[1600px] mx-auto px-4 md:px-5 pt-32 lg:pt-40 pb-28">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center mb-10">
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-8 w-full">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] tracking-tight text-white mb-6 font-extrabold text-center lg:text-left flex flex-col gap-2 w-full"
            >
              <span className="block">
                {t("hero.title1")} <span className="text-[#38bdf8]">{t("hero.title2")}</span>
              </span>
              <span className="block text-zinc-300 font-bold text-2xl sm:text-3xl md:text-[2.25rem] mt-1">
                {t("hero.title3")} {t("hero.title4")}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-300 font-medium text-base md:text-lg max-w-[490px] leading-relaxed mb-8 text-center lg:text-left mx-auto lg:mx-0"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-row items-center justify-center lg:justify-start gap-4 w-full"
            >
              <Link
                to="/signin"
                search={{ mode: "signup", role: "client" }}
                className="h-12 px-7 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-bold flex items-center gap-2 transition-colors font-sans shadow-lg shadow-blue-900/20"
              >
                <span>{t("hero.bookBtn")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#trust-and-process"
                className="h-12 px-7 rounded-full border border-white/30 bg-white/5 hover:bg-white/15 text-white text-sm font-bold flex items-center gap-2.5 transition-colors font-sans"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>{t("howItWorks.badge")}</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column (Floating Reviews Card) */}
          <div className="hidden lg:col-span-5 lg:flex justify-end relative h-full min-h-[300px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-950/60 border border-white/10 backdrop-blur-md rounded-2xl p-5 w-[250px] shadow-2xl flex flex-col items-start text-left"
            >
              {/* Overlapping Avatars */}
              <div className="flex items-center -space-x-2.5 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border border-zinc-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border border-zinc-900 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border border-zinc-900 object-cover"
                />
              </div>

              {/* Trusted Text */}
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Trusted by
              </span>

              {/* Number */}
              <span className="text-2xl text-[#38bdf8] font-black mt-0.5">10,000+</span>

              {/* Label */}
              <span className="text-xs text-white font-bold mb-3.5">Happy Customers</span>

              {/* Rating stars */}
              <div className="flex items-center gap-0.5 text-yellow-400 mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>

              {/* Score text */}
              <span className="text-[11px] text-zinc-350 font-semibold">4.8/5 (2.5k reviews)</span>
            </motion.div>
          </div>
        </div>

        {/* Glassmorphism Booking Bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full bg-zinc-950/45 border border-white/10 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-2xl mt-16 mb-4 z-[5]"
        >
          {/* Mobile Simplified Search Bar (Fiverr mobile layout style) */}
          <form
            onSubmit={handleSearch}
            className="md:hidden flex items-center bg-white rounded-2xl p-1.5 w-full shadow-inner border border-zinc-200"
          >
            <input
              type="text"
              placeholder={t("hero.searchPlaceholder") || "Search for any service..."}
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
              className="flex-grow pl-3 text-[14px] font-bold text-zinc-800 placeholder-zinc-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="w-11 h-11 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Desktop Full Booking Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-center w-full"
          >
            {/* Input 1: What service */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 flex items-center gap-4 w-full h-20 shadow-inner text-left">
              <Wrench className="w-6 h-6 text-[#3b82f6] shrink-0" />
              <div className="flex-grow flex flex-col min-w-0">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none mb-1">
                  {t("hero.searchLabel")}
                </label>
                <input
                  type="text"
                  placeholder={t("hero.searchPlaceholder")}
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  className="w-full text-[15px] font-bold text-zinc-800 placeholder-zinc-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Input 2: Where */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-4 flex items-center gap-4 w-full h-20 shadow-inner text-left">
              <MapPin className="w-6 h-6 text-[#3b82f6] shrink-0" />
              <div className="flex-grow flex flex-col min-w-0">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none mb-1">
                  {t("hero.locationLabel")}
                </label>
                <input
                  type="text"
                  placeholder={t("hero.locationPlaceholder")}
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full text-[15px] font-bold text-zinc-800 placeholder-zinc-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Input 3: When */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-4 flex items-center gap-4 w-full h-20 shadow-inner text-left">
              <Calendar className="w-6 h-6 text-[#3b82f6] shrink-0" />
              <div className="flex-grow flex flex-col min-w-0">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-none mb-1">
                  {t("hero.whenLabel")}
                </label>
                <input
                  type="text"
                  placeholder={t("hero.whenPlaceholder")}
                  value={dateQuery}
                  onChange={(e) => setDateQuery(e.target.value)}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!dateQuery) e.target.type = "text";
                  }}
                  className="w-full text-[15px] font-bold text-zinc-800 placeholder-zinc-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Find Button */}
            <div className="lg:col-span-2 w-full h-full flex items-center">
              <button
                type="submit"
                className="w-full h-20 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0 cursor-pointer text-base font-sans"
              >
                {t("hero.findButton")}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Bottom Trust Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-2 text-xs font-semibold text-white/90 z-10"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>{t("hero.feature1Title")}</span>
          </div>
          <div className="w-px h-3 bg-white/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>{t("hero.feature2Title")}</span>
          </div>
          <div className="w-px h-3 bg-white/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>{t("hero.feature4Title")}</span>
          </div>
          <div className="w-px h-3 bg-white/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>{t("hero.feature3Title")}</span>
          </div>
        </motion.div>
      </div>

      {/* Sharp transition to white background */}
      <div className="absolute bottom-0 left-0 right-0 h-10 md:h-12 bg-white z-[2]" />
    </main>
  );
}
