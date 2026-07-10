import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, type Language } from "../hooks/use-language";

const languages: { code: Language; label: string }[] = [
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "es", label: "ES" },
  { code: "sq", label: "SQ" },
  { code: "sr", label: "SR" },
];

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  // Fallback translation map for the mobile "Join" button
  const joinTexts: Record<string, string> = {
    de: "Beitreten",
    fr: "Rejoindre",
    it: "Unisciti",
    pt: "Registrar",
    es: "Unirse",
    sq: "Bashkohu",
    sr: "Pridruži se",
    en: "Join",
  };
  const joinText = joinTexts[language] || "Join";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: t("nav.services"), href: "#platform" },
    { name: t("nav.providers"), href: "#platform" },
    { name: t("nav.trust"), href: "#trust-and-process" },
    { name: t("nav.pricing"), href: "#pricing" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headerClasses =
    isScrolled || mobileOpen
      ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-body py-3.5 bg-white border-b border-zinc-200 shadow-sm"
      : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-body py-5 bg-transparent border-b border-transparent shadow-none";

  return (
    <header className={headerClasses}>
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between px-6 md:px-12 relative">
        {/* Mobile toggle (Hamburger on Left) */}
        <button
          className={`lg:hidden p-2 transition-colors duration-300 relative z-10 ${
            isScrolled || mobileOpen
              ? "text-zinc-550 hover:text-zinc-900"
              : "text-white/90 hover:text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Center: Logo (centered on mobile, static on desktop) */}
        <a
          href="/"
          className={`flex items-center gap-2 font-extrabold text-2xl tracking-tight shrink-0 font-sans transition-colors duration-300 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 z-10 ${
            isScrolled || mobileOpen ? "text-[#0f172a]" : "text-white"
          }`}
        >
          <div className="flex items-center justify-center w-7 h-7 text-[#2563eb] shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M19 4L5 20M5 4L19 20"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="flex items-baseline">
            BlueX
            <span
              className={`transition-colors duration-300 ${
                isScrolled || mobileOpen ? "text-zinc-500" : "text-white/60"
              } font-normal text-sm`}
            >
              .ch
            </span>
          </span>
        </a>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          {navigation.map((nav) => (
            <a
              key={nav.name}
              href={nav.href}
              className={`text-[15px] font-semibold transition-colors duration-300 px-2 py-1 whitespace-nowrap font-sans ${
                isScrolled || mobileOpen
                  ? "text-zinc-700 hover:text-[#2563eb]"
                  : "text-white/90 hover:text-blue-400"
              }`}
            >
              {nav.name}
            </a>
          ))}
        </div>

        {/* Right side: Mobile Join Button / Desktop CTAs */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0 relative z-10">
          {/* Mobile Join Button (looks like Fiverr Join button) */}
          <a
            href="/signin?role=client&mode=signup"
            className={`lg:hidden px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
              isScrolled || mobileOpen
                ? "bg-zinc-950 border-zinc-950 text-white hover:bg-zinc-900"
                : "bg-white/10 border-white/30 text-white hover:bg-white/20"
            }`}
          >
            {joinText}
          </a>

          {/* Desktop: CTAs & Language Switcher */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            {/* Desktop Language Switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 px-2 py-1.5 rounded-lg font-sans ${
                  isScrolled || mobileOpen
                    ? "text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                aria-expanded={langOpen}
                aria-haspopup="true"
              >
                <Globe
                  className={`w-4 h-4 transition-colors duration-300 ${isScrolled || mobileOpen ? "text-zinc-500" : "text-white/80"}`}
                />
                <span>{languages.find((l) => l.code === language)?.label || "DE"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-all duration-300 ${isScrolled || mobileOpen ? "text-zinc-500" : "text-white/80"} ${langOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-zinc-200 shadow-xl p-1.5 z-50 flex flex-col gap-0.5"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                          language === lang.code
                            ? "bg-[#2563eb] text-white"
                            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                      >
                        <span>
                          {lang.code === "de"
                            ? "Deutsch"
                            : lang.code === "fr"
                              ? "Français"
                              : lang.code === "it"
                                ? "Italiano"
                                : lang.code === "en"
                                  ? "English"
                                  : lang.code === "pt"
                                    ? "Português"
                                    : lang.code === "es"
                                      ? "Español"
                                      : lang.code === "sq"
                                        ? "Shqip"
                                        : "Srpski"}
                        </span>
                        <span
                          className={`text-[10px] ${language === lang.code ? "text-white/80" : "text-zinc-400"}`}
                        >
                          {lang.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/signin"
              className={`text-[15px] font-semibold transition-colors duration-300 font-sans ${
                isScrolled || mobileOpen
                  ? "text-zinc-700 hover:text-[#2563eb]"
                  : "text-white/90 hover:text-blue-400"
              }`}
            >
              {t("nav.logIn")}
            </a>
            <a
              href="/signin?mode=signup&role=provider"
              className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[14px] font-bold transition-colors font-sans"
            >
              {t("nav.becomeProvider")}
            </a>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-zinc-200 shadow-lg absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {navigation.map((nav) => (
                <div
                  key={nav.name}
                  className="flex flex-col border-b border-zinc-150 last:border-0 py-1"
                >
                  <a
                    href={nav.href}
                    className="text-zinc-700 font-medium py-2 hover:text-[#2563eb]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {nav.name}
                  </a>
                </div>
              ))}

              <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-zinc-150">
                {/* Mobile Language Selector */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-zinc-500 px-1 uppercase tracking-wider">
                    Language / Sprache / Langue
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                        }}
                        className={`text-xs font-bold py-2 rounded-xl border transition-all ${
                          language === lang.code
                            ? "bg-[#2563eb] border-[#2563eb] text-white"
                            : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-medium text-zinc-700 py-2.5 hover:text-zinc-950 border border-zinc-200 rounded-xl bg-zinc-50"
                >
                  {t("nav.logIn")}
                </a>
                <a
                  href="/signin?mode=signup&role=provider"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-medium bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-xl"
                >
                  {t("nav.becomeProvider")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
