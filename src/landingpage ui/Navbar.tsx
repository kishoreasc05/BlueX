import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navigation = [
  { name: "Services", href: "#platform" },
  { name: "AI Coach", href: "#ai" },
  { name: "For Providers", href: "#platform" },
  { name: "Trust & Security", href: "#trust" },
  { name: "Reviews", href: "#stories" },
  { name: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navigation.map((nav) => (
            <a
              key={nav.name}
              href={nav.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
            >
              {nav.name}
            </a>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          <a
            href="/signin"
            className="text-sm font-medium text-zinc-400 hover:text-white transition-colors mr-1"
          >
            Log In
          </a>
          <a
            href="/signin?mode=signup&role=provider"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#1A4BFF] hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Become a Provider
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
            <div className="px-6 py-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
              {navigation.map((nav) => (
                <div
                  key={nav.name}
                  className="flex flex-col border-b border-white/5 last:border-0 py-2"
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

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/5">
                <a
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-medium text-zinc-300 py-2 hover:text-white"
                >
                  Log In
                </a>
                <a
                  href="/signin?mode=signup&role=provider"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-medium bg-[#1A4BFF] hover:bg-blue-700 text-white py-3 rounded-full"
                >
                  Become a Provider
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
