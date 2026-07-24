import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/landingpage ui/Navbar";
import HeroSection from "@/landingpage ui/HeroSection";
import CategoriesAndProcess from "@/landingpage ui/CategoriesAndProcess";
import VideoSection from "@/landingpage ui/VideoSection";
import AppShowcaseAndFooter from "@/landingpage ui/AppShowcaseAndFooter";
import PricingPreview from "../landingpage ui/PricingPreview";
import FinalCTA from "../landingpage ui/FinalCTA";
import Footer from "../landingpage ui/Footer";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background overflow-x-hidden relative font-body text-foreground">
      {/* Content Container */}
      <div className="relative z-10 flex flex-col w-full h-full pb-0">
        <Navbar />
        <HeroSection />
        <CategoriesAndProcess />
        <VideoSection />
        <AppShowcaseAndFooter />
        <PricingPreview />
        <FinalCTA />
      </div>
      <Footer />
    </div>
  );
}
