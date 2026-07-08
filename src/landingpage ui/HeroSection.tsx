import { motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  Lock,
  MessageSquare,
  Star,
  ArrowRight,
} from "lucide-react";
import heroBg from "../assets/hero section bg.png";

export default function HeroSection() {
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
    <main className="relative min-h-[740px] lg:min-h-[680px] w-full flex flex-col justify-between overflow-hidden bg-white font-body">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover object-right scale-[0.85] translate-x-[3%] -translate-y-[3%] origin-right"
        />
      </div>

      {/* Global Background Gradient Fades to blend the image edges */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {/* Left fade: blends the left edge of the image into white */}
        <div className="absolute inset-y-0 left-0 w-[50%] lg:w-[55%] bg-gradient-to-r from-white via-white/80 to-transparent" />
        {/* Bottom fade: blends the very bottom of the hero section */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent" />
        
        {/* Subtle white overlay on mobile to keep text legible */}
        <div className="absolute inset-0 bg-white/70 lg:hidden" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex-grow flex items-center w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-20 lg:pt-24 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          {/* Left Column (Content) */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-[#EBF2FF] px-4 py-1.5 text-xs md:text-sm font-semibold text-[#1A4BFF] mb-6 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#1A4BFF] shrink-0" />
              <span className="flex items-center gap-1.5">
                Switzerland's Premium Service Marketplace
                <span className="inline-flex items-center justify-center w-4 h-4 bg-[#FF0000] rounded-[2px] text-white select-none shrink-0" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>
                  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-white">
                    <rect x="4" y="2" width="2" height="6" />
                    <rect x="2" y="4" width="6" height="2" />
                  </svg>
                </span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.5rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-slate-900 mb-6"
            >
              Hire trusted <br />
              professionals. <br />
              <span className="text-[#1A4BFF]">Get things done.</span> <br />
              <span className="text-[#1A4BFF]">Instantly.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-500 font-medium text-base md:text-lg max-w-[460px] leading-relaxed mb-8"
            >
              Connect with verified local experts for any job — quickly, safely, and with confidence.
            </motion.p>

            {/* Search Card Form */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-[540px] bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-blue-900/5 p-4 flex flex-col md:flex-row items-end gap-3.5"
            >
              <div className="flex-1 w-full text-left">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  What service do you need?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Plumbing, Cleaning, Electrical"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A4BFF] focus:border-transparent transition-all"
                  />
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 w-full text-left">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Where?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Zurich, Switzerland"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A4BFF] focus:border-transparent transition-all"
                  />
                  <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto h-11 px-6 rounded-xl bg-[#1A4BFF] hover:bg-blue-700 text-white font-bold text-sm transition-colors flex items-center justify-center shrink-0"
              >
                Find Services
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
                className="h-11 px-6 rounded-full bg-[#1A4BFF] hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/10"
              >
                <span>Book a Service</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <Link
                to="/signin"
                search={{ mode: "signup", role: "provider" }}
                className="h-11 px-6 rounded-full border-2 border-[#1A4BFF] bg-white text-[#1A4BFF] hover:bg-blue-50/50 text-sm font-semibold flex items-center justify-center transition-colors"
              >
                Become a Provider
              </Link>
            </motion.div>
          </div>

          {/* Right Column (Empty to let background professionals be visible) */}
          <div className="hidden lg:col-span-6 xl:col-span-7 lg:block" />
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12 mb-6 mt-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 shadow-lg p-5 md:py-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1A4BFF] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Verified Professionals</h3>
              <p className="text-xs text-slate-500 mt-1">Background-checked experts you can trust.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Secure Payments</h3>
              <p className="text-xs text-slate-500 mt-1">Safe, encrypted payments for complete peace of mind.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Real-time Chat</h3>
              <p className="text-xs text-slate-500 mt-1">Connect instantly with providers anytime.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Satisfaction Guaranteed</h3>
              <p className="text-xs text-slate-500 mt-1">Quality service or we make it right.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
