import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../hooks/use-language";
import {
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  UserCheck,
  Calendar,
  CheckCircle,
  Shield,
  CreditCard,
  BarChart2,
  Check,
  ArrowRight,
  Tv
} from "lucide-react";

export default function CategoriesAndProcess() {
  const { t } = useLanguage();
  const [slideIndex, setSlideIndex] = useState(0);

  const categories = [
    {
      icon: Wrench,
      name: t("categories.plumbing") || "Plumbing",
      desc: t("landingNew.categoriesList.plumbingDesc") || "Fix leaks, installs & more",
      jobs: t("landingNew.categoriesList.plumbingJobs") || "1,250+ jobs"
    },
    {
      icon: Zap,
      name: t("categories.electrical") || "Electrical",
      desc: t("landingNew.categoriesList.electricalDesc") || "Wiring, repairs & installs",
      jobs: t("landingNew.categoriesList.electricalJobs") || "1,180+ jobs"
    },
    {
      icon: Paintbrush,
      name: t("categories.painting") || "Painting",
      desc: t("landingNew.categoriesList.paintingDesc") || "Interior & exterior painting",
      jobs: t("landingNew.categoriesList.paintingJobs") || "980+ jobs"
    },
    {
      icon: Hammer,
      name: t("categories.carpentry") || "Carpentry",
      desc: t("landingNew.categoriesList.carpentryDesc") || "Woodwork & furniture",
      jobs: t("landingNew.categoriesList.carpentryJobs") || "860+ jobs"
    },
    {
      icon: Sparkles,
      name: t("categories.cleaning") || "Cleaning",
      desc: t("landingNew.categoriesList.cleaningDesc") || "Home & office cleaning",
      jobs: t("landingNew.categoriesList.cleaningJobs") || "1,540+ jobs"
    },
    {
      icon: Tv,
      name: t("landingNew.categoriesList.applianceRepair") || "Appliance Repair",
      desc: t("landingNew.categoriesList.applianceRepairDesc") || "Repair & maintenance",
      jobs: t("landingNew.categoriesList.applianceRepairJobs") || "670+ jobs"
    }
  ];

  const steps = [
    {
      number: "1",
      icon: Search,
      title: t("landingNew.steps.search") || "Search",
      desc: t("landingNew.steps.searchDesc") || "Tell us what you need done in just a few clicks."
    },
    {
      number: "2",
      icon: UserCheck,
      title: t("landingNew.steps.choose") || "Choose",
      desc: t("landingNew.steps.chooseDesc") || "Compare profiles, reviews and prices. Pick the best fit."
    },
    {
      number: "3",
      icon: Calendar,
      title: t("landingNew.steps.book") || "Book",
      desc: t("landingNew.steps.bookDesc") || "Schedule a time that works for you."
    },
    {
      number: "4",
      icon: CheckCircle,
      title: t("landingNew.steps.done") || "Done",
      desc: t("landingNew.steps.doneDesc") || "Relax while the job gets done right."
    }
  ];

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % (categories.length - 3));
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + (categories.length - 3)) % (categories.length - 3));
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 font-sans relative z-20 overflow-hidden text-center">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center">
        
        {/* Popular Categories Heading */}
        <span className="text-[#14a800] text-[11px] font-bold uppercase tracking-[0.2em] mb-2 leading-none">
          {t("landingNew.categoriesList.popularCategoriesBadge") || "POPULAR CATEGORIES"}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 leading-tight mb-2 tracking-tight">
          {t("landingNew.categoriesList.popularCategoriesTitle") || "Find the Right Professional for Any Job"}
        </h2>
        <p className="text-zinc-500 text-xs font-semibold mb-8 max-w-[420px] leading-relaxed">
          {t("landingNew.categoriesList.popularCategoriesDesc") || "From home repairs to everyday tasks, we've got you covered."}
        </p>

        {/* Categories Grid (Mobile Only - 3x2 Layout like Fiverr mobile screenshot) */}
        <div className="grid grid-cols-2 gap-4 w-full md:hidden mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="bg-white border border-zinc-950 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group relative overflow-hidden"
              >
                {/* Top Green Accent Line on Hover */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#14a800] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-[#14a800] mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-zinc-800 tracking-tight block">
                  {cat.name}
                </span>
                
                {/* Job Count Badge */}
                <span className="text-[9px] text-[#14a800] font-black bg-[#f4fbf4] border border-green-100 px-2 py-0.5 rounded-lg mt-2 block">
                  {cat.jobs}
                </span>
              </div>
            );
          })}
        </div>

        {/* Categories Slider (Desktop Only) */}
        <div className="relative w-full hidden md:flex items-center mb-8">
          {/* Arrow Left */}
          <button
            onClick={prevSlide}
            className="absolute left-[-20px] z-10 w-10 h-10 rounded-full border border-zinc-200 bg-white hover:border-[#14a800] text-zinc-650 hover:text-[#14a800] flex items-center justify-center shadow-md transition-colors cursor-pointer hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel Mask */}
          <div className="w-full overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-500 ease-out w-full"
              style={{ transform: `translateX(-${slideIndex * (100 / 3.1)}%)` }}
            >
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.name}
                    className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(16.666%-17px)] bg-white border border-zinc-950 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group relative overflow-hidden"
                  >
                    {/* Top Green Accent Line on Hover */}
                    <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#14a800] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-[#14a800] mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-zinc-800 tracking-tight block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold block mt-1 leading-snug">
                      {cat.desc}
                    </span>
                    
                    {/* Job Count Badge */}
                    <span className="text-[9px] text-[#14a800] font-black bg-[#f4fbf4] border border-green-100 px-2 py-0.5 rounded-lg mt-3 block">
                      {cat.jobs}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrow Right */}
          <button
            onClick={nextSlide}
            className="absolute right-[-20px] z-10 w-10 h-10 rounded-full border border-zinc-200 bg-white hover:border-[#14a800] text-zinc-650 hover:text-[#14a800] flex items-center justify-center shadow-md transition-colors cursor-pointer hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Explore Categories Button */}
        <a
          href="/signin"
          className="h-10 px-6 rounded-full border border-zinc-200 hover:border-[#14a800] bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer mb-16"
        >
          <span>{t("landingNew.categoriesList.exploreCategories") || "Explore All Categories"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#14a800]" />
        </a>

        {/* How It Works Container */}
        <div className="w-full bg-[#030712] border border-white/5 rounded-3xl p-8 text-left mb-16 shadow-2xl relative overflow-hidden text-white">
          <span className="text-[#22c55e] text-[10px] font-bold uppercase tracking-wider mb-2 block text-center sm:text-left">
            {t("landingNew.categoriesList.howItWorksBadge") || "HOW IT WORKS"}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-10 text-center sm:text-left">
            {t("landingNew.categoriesList.howItWorksTitle") || "Get Your Job Done in 4 Simple Steps"}
          </h2>

          <div className="relative flex flex-col sm:flex-row justify-between items-start gap-8 sm:gap-4 w-full">
            {/* Horizontal dotted connector line */}
            <div className="absolute top-8 left-12 right-12 border-t border-dashed border-white/10 z-0 hidden sm:block" />
            
            {/* Vertical dotted connector line */}
            <div className="absolute top-10 bottom-10 left-8 border-l border-dashed border-white/10 z-0 block sm:hidden" />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0 relative z-10 sm:w-1/4 text-left sm:text-center"
                >
                  {/* Icon Bubble with badge */}
                  <div className="relative shrink-0 sm:mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-[#22c55e] hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    {/* Number Badge */}
                    <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#14a800] text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm border border-[#030712]">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Description */}
                  <div className="flex flex-col sm:items-center">
                    <span className="text-sm font-extrabold text-white block">
                      {step.title}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed sm:max-w-[130px] font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Be Your Own Boss Card */}
        <div className="w-full bg-[#030712] border border-white/5 rounded-3xl p-8 relative overflow-hidden text-white flex flex-col shadow-2xl items-start text-left z-10">
          {/* Background overlay Cap Image */}
          <img
            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&h=600&q=80"
            alt="Provider"
            className="absolute right-0 bottom-0 h-[105%] hidden lg:block object-cover opacity-90 select-none pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start mb-8 relative z-10">
            {/* Left Box (Title & Button) */}
            <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-8">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight mb-3">
                {t("landingNew.providerBanner.title1") || "Earn on Your Skills."} <br />
                <span className="text-[#22c55e]">{t("landingNew.providerBanner.title2") || "Be Your Own Boss."}</span>
              </h2>
              <p className="text-zinc-400 text-xs font-semibold leading-relaxed mb-6 max-w-[360px]">
                {t("landingNew.providerBanner.desc") || "Join thousands of verified professionals earning on their terms. Work when you want, where you want."}
              </p>
              
              <a
                href="/signin?role=provider"
                className="h-11 px-6 rounded-xl bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-green-900/20"
              >
                <span>{t("landingNew.providerBanner.btnText") || "Become a Provider"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right Box (Benefits Grid) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="flex flex-col items-start text-left">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22c55e] mb-3 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white leading-snug">
                  {t("landingNew.providerBanner.feat1Title") || "Grow Your Business"}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-normal font-medium">
                  {t("landingNew.providerBanner.feat1Desc") || "Get more customers and build your reputation."}
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="flex flex-col items-start text-left">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22c55e] mb-3 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white leading-snug">
                  {t("landingNew.providerBanner.feat2Title") || "Flexible Schedule"}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-normal font-medium">
                  {t("landingNew.providerBanner.feat2Desc") || "Work on your own time and choose jobs you like."}
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="flex flex-col items-start text-left">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22c55e] mb-3 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white leading-snug">
                  {t("landingNew.providerBanner.feat3Title") || "Secure Payments"}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-normal font-medium">
                  {t("landingNew.providerBanner.feat3Desc") || "Get paid safely and on time, every time."}
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="flex flex-col items-start text-left">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22c55e] mb-3 shrink-0">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-extrabold text-white leading-snug">
                  {t("landingNew.providerBanner.feat4Title") || "More Earnings"}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-normal font-medium">
                  {t("landingNew.providerBanner.feat4Desc") || "Set your own rates and increase your income."}
                </p>
              </div>
            </div>
            
            {/* Blank gap to keep space for overlapping absolute image */}
            <div className="hidden lg:block lg:col-span-2" />
          </div>

          {/* Bottom Banner Strip */}
          <div className="w-full bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-800 relative z-10 mt-4">
            {/* Left avatars stack */}
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1.5 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Provider"
                  className="w-6 h-6 rounded-full border border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Provider"
                  className="w-6 h-6 rounded-full border border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40&q=80"
                  alt="Provider"
                  className="w-6 h-6 rounded-full border border-white object-cover"
                />
              </div>
              <span className="text-[10px] text-zinc-550 font-bold tracking-tight text-left">
                {t("landingNew.providerBanner.joinText") || "Join 8,000+ professionals already growing with BlueX.ch"}
              </span>
            </div>

            {/* Right list checks */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-extrabold text-zinc-700">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#14a800] stroke-[3]" />
                <span>{t("landingNew.providerBanner.check1") || "Free to Join"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#14a800] stroke-[3]" />
                <span>{t("landingNew.providerBanner.check2") || "No Monthly Fees"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#14a800] stroke-[3]" />
                <span>{t("landingNew.providerBanner.check3") || "100% Secure"}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
