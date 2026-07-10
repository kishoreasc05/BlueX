import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../hooks/use-language";
import {
  Users,
  ClipboardCheck,
  Smile,
  ShieldCheck,
  Headphones,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Bell,
  MessageSquare,
  Calendar,
  CreditCard,
  Search,
  Wrench,
  Zap,
  Sparkles,
  Paintbrush
} from "lucide-react";

export default function AppShowcaseAndFooter() {
  const { t } = useLanguage();
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [emailInput, setEmailInput] = useState("");

  const stats = [
    {
      icon: Users,
      num: t("landingNew.stats.stat1Num") || "10,000+",
      title: t("landingNew.stats.stat1Title") || "Verified Professionals",
      desc: t("landingNew.stats.stat1Desc") || "Across Switzerland"
    },
    {
      icon: ClipboardCheck,
      num: t("landingNew.stats.stat2Num") || "25,000+",
      title: t("landingNew.stats.stat2Title") || "Jobs Completed",
      desc: t("landingNew.stats.stat2Desc") || "Successfully Done"
    },
    {
      icon: Star,
      num: t("landingNew.stats.stat3Num") || "4.8/5",
      title: t("landingNew.stats.stat3Title") || "Customer Rating",
      desc: t("landingNew.stats.stat3Desc") || "Based on 2.5k+ reviews"
    },
    {
      icon: ShieldCheck,
      num: t("landingNew.stats.stat4Num") || "100%",
      title: t("landingNew.stats.stat4Title") || "Secure Payments",
      desc: t("landingNew.stats.stat4Desc") || "Protected by Escrow"
    },
    {
      icon: Headphones,
      num: t("landingNew.stats.stat5Num") || "24/7",
      title: t("landingNew.stats.stat5Title") || "Customer Support",
      desc: t("landingNew.stats.stat5Desc") || "Always here to help"
    }
  ];

  const testimonials = [
    {
      name: "Thomas K.",
      city: t("landingNew.testimonials.city1") || "Zurich",
      quote: t("landingNew.testimonials.quote1") || "Found a plumber within minutes. He was professional, on time and fixed the issue perfectly. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=80&h=80&q=80"
    },
    {
      name: "Maria S.",
      city: t("landingNew.testimonials.city2") || "Bern",
      quote: t("landingNew.testimonials.quote2") || "The platform is super easy to use. I booked a cleaner for my apartment and she did an amazing job!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80"
    },
    {
      name: "Jean P.",
      city: t("landingNew.testimonials.city3") || "Lausanne",
      quote: t("landingNew.testimonials.quote3") || "Great experience! The electrician was very knowledgeable and finished the work quickly. Will use again.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
    }
  ];

  const benefits = [
    {
      icon: Calendar,
      title: t("landingNew.app.feat1Title") || "Easy Booking",
      desc: t("landingNew.app.feat1Desc") || "Book your service in just a few taps."
    },
    {
      icon: Bell,
      title: t("landingNew.app.feat2Title") || "Real-time Updates",
      desc: t("landingNew.app.feat2Desc") || "Get updates on your job status."
    },
    {
      icon: CreditCard,
      title: t("landingNew.app.feat3Title") || "Secure Payments",
      desc: t("landingNew.app.feat3Desc") || "Pay safely through our secure system."
    },
    {
      icon: MessageSquare,
      title: t("landingNew.app.feat4Title") || "Chat Instantly",
      desc: t("landingNew.app.feat4Desc") || "Message professionals directly."
    }
  ];

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for interest! Signed up email: ${emailInput}`);
    setEmailInput("");
  };

  return (
    <section className="w-full bg-[#f8fafc]/40 py-16 md:py-24 px-6 font-sans relative z-20 border-t border-zinc-150 overflow-hidden text-center">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        {/* Stats Title */}
        <span className="text-[#14a800] text-[11px] font-bold uppercase tracking-[0.2em] mb-2 leading-none">
          {t("landingNew.stats.title") || "TRUSTED BY THOUSANDS. PROVEN BY RESULTS."}
        </span>
        <p className="text-zinc-550 text-xs font-bold mb-10 text-center leading-none">
          {t("landingNew.testimonials.subtitle") || "Real people. Real jobs. Real reviews."}
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-20 text-left">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border border-zinc-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#14a800] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-zinc-900 leading-none">
                    {stat.num}
                  </span>
                  <span className="text-xs font-bold text-zinc-800 tracking-tight mt-1 leading-snug">
                    {stat.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-semibold mt-0.5 leading-none">
                    {stat.desc}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Customer Testimonials Carousel */}
        <div className="w-full flex flex-col items-center relative overflow-hidden mb-20">
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight text-center">
            {t("landingNew.testimonials.title") || "What Our Customers Say"}
          </h2>
          
          {/* Review Score */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex text-yellow-400 gap-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs text-zinc-600 font-extrabold">
              {t("landingNew.testimonials.reviewsCount") || "4.8/5 from 2,500+ reviews"}
            </span>
          </div>

          <div className="relative flex items-center w-full px-0 md:px-8">
            {/* Arrow Left */}
            <button
              onClick={prevTestimonial}
              className="absolute left-[-20px] md:left-0 z-10 w-10 h-10 rounded-full border border-zinc-200 bg-white hover:border-[#14a800] text-zinc-650 hover:text-[#14a800] flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Testimonials List */}
            <div className="w-full overflow-hidden py-1">
              <div
                className="flex gap-5 transition-transform duration-500 ease-out w-full"
                style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
              >
                {testimonials.map((test) => (
                  <div
                    key={test.name}
                    className="flex-shrink-0 w-full bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-sm text-left flex flex-col justify-between"
                  >
                    <div>
                      {/* Quote bubble mark */}
                      <span className="text-[#14a800] font-serif text-5xl leading-none block h-5">“</span>
                      <p className="text-zinc-700 text-sm font-semibold leading-relaxed mt-2 mb-6">
                        {test.quote}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 border-t border-zinc-100 pt-4 w-full">
                      <img
                        src={test.avatar}
                        alt={test.name}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-zinc-800 leading-none">
                          {test.name}
                        </span>
                        <span className="text-[10px] text-zinc-450 font-bold mt-1 leading-none">
                          {test.city}
                        </span>
                      </div>
                      
                      {/* Sub-stars */}
                      <div className="ml-auto flex text-yellow-400 gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow Right */}
            <button
              onClick={nextTestimonial}
              className="absolute right-[-20px] md:right-0 z-10 w-10 h-10 rounded-full border border-zinc-200 bg-white hover:border-[#14a800] text-zinc-650 hover:text-[#14a800] flex items-center justify-center shadow-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Testimonial slider indicators */}
          <div className="flex gap-1.5 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  testimonialIndex === i ? "bg-[#14a800] w-4" : "bg-zinc-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* The BlueX.ch App Showcase Section */}
        <div className="w-full bg-[#030712] border border-white/5 rounded-3xl p-8 md:p-12 text-left mb-24 flex flex-col lg:flex-row gap-12 items-center shadow-2xl relative overflow-hidden text-white">
          
          {/* Left: Coming Soon Graphic */}
          <div className="w-full lg:w-1/2 flex items-end justify-center shrink-0 relative min-h-[380px]">
            {/* Background glowing blob */}
            <div className="absolute bottom-0 w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0%,transparent_70%)] z-0" />
            
            {/* Stylish phone outline acting as a glass card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-[240px] h-[400px] bg-zinc-950/40 border border-white/10 backdrop-blur-md rounded-[2.8rem] p-4 shadow-2xl relative flex flex-col items-center justify-center overflow-hidden z-10 translate-y-12 lg:translate-y-16"
            >
              {/* Dynamic status pill bar inside phone */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4.5 bg-zinc-900 rounded-full z-20" />
              
              {/* Star sparkles decorations */}
              <div className="absolute top-12 left-8 text-[#22c55e]/30">
                <Star className="w-4 h-4 fill-current animate-pulse" />
              </div>
              <div className="absolute bottom-16 right-8 text-[#22c55e]/20">
                <Star className="w-5 h-5 fill-current animate-pulse [animation-delay:1s]" />
              </div>

              {/* Floating glass content */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl flex flex-col items-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300 w-11/12 text-center">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#22c55e] mb-1.5 block">
                  Mobile App
                </span>
                <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight leading-none">
                  {t("landingNew.app.comingSoon") || "Coming Soon"}
                </h3>
                <div className="w-8 h-0.5 bg-gradient-to-r from-[#22c55e] to-emerald-400 rounded-full mt-3.5" />
              </div>
            </motion.div>

            {/* Floating Info Tag 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-zinc-900/60 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-zinc-300 absolute top-16 left-2 sm:left-8 rotate-[-8deg] z-20 shadow-md flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
              <span>iOS & Android</span>
            </motion.div>

            {/* Floating Info Tag 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-zinc-900/60 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-bold text-zinc-300 absolute bottom-28 right-2 sm:right-8 rotate-[8deg] z-20 shadow-md"
            >
              Q3 2026
            </motion.div>
          </div>

          {/* Right: Copywriting & checklist */}
          <div className="flex flex-col flex-grow">
            <span className="text-[9px] font-black bg-[#14a800]/10 border border-[#14a800]/20 text-[#22c55e] px-2.5 py-0.5 rounded-lg mb-3 uppercase tracking-wider self-start leading-none">
              {t("landingNew.app.badge") || "NEW"}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              {t("landingNew.app.title1") || "The BlueX.ch App."} <br />
              <span className="text-[#22c55e]">{t("landingNew.app.title2") || "Jobs on the go, anytime!"}</span>
            </h2>
            <p className="text-zinc-400 text-xs font-semibold leading-relaxed mb-6 max-w-[450px]">
              {t("landingNew.app.desc") || "Book services, chat with professionals, track your jobs and make secure payments - all from your phone."}
            </p>

            {/* App stores download buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              {/* App store button */}
              <a
                href="#app-store"
                className="h-11 px-4 bg-black hover:bg-zinc-900 text-white rounded-lg flex items-center gap-2.5 transition-colors shadow-md border border-zinc-800"
              >
                {/* Apple logo svg */}
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.55 2.95-1.39z"/>
                </svg>
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[8px] text-zinc-400 font-bold uppercase">{t("landingNew.app.applePre") || "Download on the"}</span>
                  <span className="text-xs font-black mt-0.5">{t("landingNew.app.appleTitle") || "App Store"}</span>
                </div>
              </a>

              {/* Google Play button */}
              <a
                href="#google-play"
                className="h-11 px-4 bg-black hover:bg-zinc-900 text-white rounded-lg flex items-center gap-2.5 transition-colors shadow-md border border-zinc-800"
              >
                {/* Google Play logo svg */}
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.52 1.9c-.31.33-.49.85-.49 1.52v17.16c0 .67.18 1.19.49 1.52l.1.1 9.6-9.6v-.2l-9.6-9.6-.1.1zM18.82 11.23l-3.6-2.1-9.7 9.7 9.7 9.7 3.6-2.1c1.02-.6 1.02-1.6 0-2.2z"/>
                </svg>
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-[8px] text-zinc-400 font-bold uppercase">{t("landingNew.app.googlePre") || "GET IT ON"}</span>
                  <span className="text-xs font-black mt-0.5">{t("landingNew.app.googleTitle") || "Google Play"}</span>
                </div>
              </a>
            </div>

            {/* Benefits Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((ben) => {
                const Icon = ben.icon;
                return (
                  <div key={ben.title} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[#22c55e] shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-xs font-extrabold text-white leading-snug">
                        {ben.title}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed font-medium">
                        {ben.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Email Signup Footer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full bg-[#030712] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl z-10"
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10 text-left flex-grow">
            <div className="flex flex-col">
              <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                {t("landingNew.emailBanner.title") || "Ready to get your job done?"}
              </h3>
              <p className="text-xs text-zinc-400 font-semibold mt-1">
                {t("landingNew.emailBanner.desc") || "Join thousands of happy customers today."}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-3 relative z-10 w-full lg:w-auto shrink-0">
            <form onSubmit={handleSignup} className="flex bg-white rounded-xl overflow-hidden p-1 shadow-inner h-12 w-full max-w-[400px]">
              <input
                type="email"
                placeholder={t("landingNew.emailBanner.placeholder") || "Enter your email address"}
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="px-4 text-xs font-semibold text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none flex-grow min-w-0"
              />
              <button
                type="submit"
                className="bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold px-5 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <span>{t("landingNew.emailBanner.btnText") || "Get Started"}</span>
              </button>
            </form>
            
            {/* Small customer stack */}
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-1.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Customer"
                  className="w-5 h-5 rounded-full border border-[#030712] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Customer"
                  className="w-5 h-5 rounded-full border border-[#030712] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Customer"
                  className="w-5 h-5 rounded-full border border-[#030712] object-cover"
                />
              </div>
              <span className="text-[10px] text-zinc-400 font-bold tracking-tight">
                {t("landingNew.emailBanner.joinText") || "Join 8,000+ customers who trust BlueX.ch"}
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
