import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage, type Language } from "../hooks/use-language";

const languages: { code: Language; label: string }[] = [
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "it", label: "IT" },
  { code: "en", label: "EN" },
];

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: t("nav.services"), href: "#platform" },
    { name: t("nav.providers"), href: "#platform" },
    { name: t("nav.trust"), href: "#trust" },
    { name: t("nav.pricing"), href: "#pricing" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headerClasses = isScrolled
    ? "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-body py-3 bg-[#05030a] border-b border-white/5 shadow-md shadow-black/25"
    : "fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-body py-5 bg-[#05030a] border-b border-white/5 shadow-sm";

  return (
    <header className={headerClasses}>
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between px-6 md:px-12">
        {/* Left: Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight shrink-0"
        >
          <div className="flex items-center justify-center w-7 h-7 text-[#1A4BFF] shrink-0">
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
            BlueX<span className="text-zinc-500 font-normal text-sm">.ch</span>
          </span>
        </a>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navigation.map((nav) => (
            <a
              key={nav.name}
              href={nav.href}
              className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors px-2.5 py-1.5 whitespace-nowrap uppercase tracking-wider"
            >
              {nav.name}
            </a>
          ))}
        </div>

        {/* Right: CTAs & Language Switcher */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          {/* Desktop Language Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5 uppercase tracking-wider"
              aria-expanded={langOpen}
              aria-haspopup="true"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>{languages.find((l) => l.code === language)?.label || "DE"}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-32 rounded-xl bg-[#0d0a1b]/95 border border-white/10 backdrop-blur-xl shadow-2xl p-1.5 z-50 flex flex-col gap-0.5"
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
                          ? "bg-[#1A4BFF] text-white"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>
                        {lang.label === "DE"
                          ? "Deutsch"
                          : lang.label === "FR"
                            ? "Français"
                            : lang.label === "IT"
                              ? "Italiano"
                              : "English"}
                      </span>
                      <span className="text-[10px] opacity-60">{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="/signin"
            className="text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors mr-1 uppercase tracking-wider"
          >
            {t("nav.logIn")}
          </a>
          <a
            href="/signin?mode=signup&role=provider"
            className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-[#1A4BFF] hover:bg-blue-700 text-white text-[10px] font-bold transition-colors shadow-sm uppercase tracking-wider"
          >
            {t("nav.becomeProvider")}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#05030a] border-b border-white/5 shadow-lg absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
              {navigation.map((nav) => (
                <div
                  key={nav.name}
                  className="flex flex-col border-b border-white/5 last:border-0 py-1"
                >
                  <a
                    href={nav.href}
                    className="text-zinc-300 font-medium py-2 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {nav.name}
                  </a>
                </div>
              ))}

              <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-white/5">
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
                            ? "bg-[#1A4BFF] border-[#1A4BFF] text-white"
                            : "bg-white/5 border-white/5 text-zinc-400 hover:text-white"
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
                  className="text-center font-medium text-zinc-300 py-2.5 hover:text-white border border-white/10 rounded-xl bg-white/5"
                >
                  {t("nav.logIn")}
                </a>
                <a
                  href="/signin?mode=signup&role=provider"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-medium bg-[#1A4BFF] hover:bg-blue-700 text-white py-3 rounded-xl"
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
