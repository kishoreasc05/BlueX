import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navigation = [
  { name: "Platform", href: "#platform" },
  { name: "AI Copilot", href: "#ai" },
  { name: "Workflows", href: "#workflow" },
  { name: "Security", href: "#security" },
  { name: "Customers", href: "#stories" },
  { name: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses =
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out font-body py-4 md:py-6";

  let innerClasses =
    "flex items-center justify-between transition-all duration-300 mx-auto max-w-[1100px] bg-background/80 backdrop-blur-xl border border-border shadow-lg rounded-full px-6 py-2 ";
  if (isScrolled) {
    innerClasses += "shadow-xl bg-background/95";
  }

  return (
    <header className={navClasses}>
      <div className={innerClasses}>
        {/* Left: Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-foreground font-semibold text-xl tracking-tight shrink-0"
        >
          ✦ BlueX
        </a>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 relative">
          {navigation.map((nav) => (
            <a
              key={nav.name}
              href={nav.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-black/5 px-4 py-2 rounded-full transition-all flex items-center"
            >
              {nav.name}
            </a>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <a
            href="/signin"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-4 py-2"
          >
            Sign In
          </a>
          <a
            href="/demo"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            Book a Demo
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
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
            className="lg:hidden bg-background border-b border-border shadow-lg absolute top-full left-0 w-full overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
              {navigation.map((nav) => (
                <div
                  key={nav.name}
                  className="flex flex-col border-b border-border/50 last:border-0 py-2"
                >
                  <a
                    href={nav.href}
                    className="text-foreground font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {nav.name}
                  </a>
                </div>
              ))}

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
                <a
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-medium text-foreground py-2 border border-border rounded-lg"
                >
                  Sign In
                </a>
                <a
                  href="/demo"
                  onClick={() => setMobileOpen(false)}
                  className="text-center font-medium bg-primary text-primary-foreground py-3 rounded-lg"
                >
                  Book a Demo
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
