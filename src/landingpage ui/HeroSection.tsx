import { motion, useScroll, useTransform } from "motion/react";
import { Play } from "lucide-react";
import heroBg from "../assets/webp/hero bg.webp";
import dashboardUi from "../assets/webp/dashboard ui.webp";
import { useIsMobile } from "@/hooks/use-mobile";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();
  const rotateX = useTransform(scrollY, [0, 600], [50, 0]);
  const translateY = useTransform(scrollY, [0, 600], [100, 0]);
  const translateZ = useTransform(scrollY, [0, 600], [-300, 0]);
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);

  return (
    <main className="relative z-10 flex flex-col items-center w-full flex-1 overflow-hidden font-body">
      {/* Background Image for Text Section */}
      <div className="absolute top-0 left-0 w-full h-[800px] z-0 pointer-events-none">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-slate-950/60" />
        {/* Fade out to background color at the bottom only */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full pt-24 md:pt-36 px-6">
        {/* 1. Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm text-white font-body mb-6 shadow-sm"
        >
          AI-Native Business Operating System ✨
        </motion.div>

        {/* 2. Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-display text-5xl md:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight text-white max-w-2xl drop-shadow-sm"
        >
          Run your business. <br className="hidden md:block" />{" "}
          <span className="italic text-white drop-shadow-md">Intelligently.</span>
        </motion.h1>

        {/* 3. Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-center text-base md:text-lg text-slate-200 max-w-[650px] leading-relaxed font-medium drop-shadow-sm"
        >
          BlueX unifies projects, workflows, contracts, documents, approvals, payments, and
          AI-powered automation into one intelligent workspace.
        </motion.p>

        {/* 4. CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 flex items-center gap-3"
        >
          <button className="h-11 px-6 rounded-full bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors shadow-lg shadow-black/10">
            Explore Platform
          </button>
          <button className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg">
            <Play className="h-4 w-4 fill-white text-white ml-0.5" />
          </button>
        </motion.div>

        {/* 5. Dashboard Preview (3D Scroll Effect) */}
        <div
          style={{ perspective: "2000px" }}
          className="mt-10 w-full max-w-5xl flex justify-center"
        >
          <motion.div
            style={
              isMobile
                ? undefined
                : {
                    rotateX,
                    translateY,
                    translateZ,
                    transformStyle: "preserve-3d",
                  }
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <div
              className="rounded-2xl overflow-hidden p-3 md:p-4 w-full"
              style={{
                background: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "var(--shadow-dashboard)",
              }}
            >
              {/* Dashboard Image */}
              <div className="bg-background rounded-xl overflow-hidden border border-border flex flex-col w-full shadow-sm">
                <img
                  src={dashboardUi}
                  alt="BlueX Dashboard UI"
                  className="w-full h-auto object-cover object-top"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
