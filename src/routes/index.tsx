import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/landingpage ui/Navbar";
import HeroSection from "@/landingpage ui/HeroSection";
import PlatformOverview from "@/landingpage ui/PlatformOverview";
import AICopilotSection from "@/landingpage ui/AICopilotSection";
import UnifiedWorkspace from "@/landingpage ui/UnifiedWorkspace";
import EnterpriseModules from "@/landingpage ui/EnterpriseModules";
import WorkflowAutomation from "@/landingpage ui/WorkflowAutomation";
import IntegrationsSection from "@/landingpage ui/IntegrationsSection";
import SecuritySection from "../landingpage ui/SecuritySection";
import CustomerStories from "../landingpage ui/CustomerStories";
import PricingPreview from "../landingpage ui/PricingPreview";
import FinalCTA from "../landingpage ui/FinalCTA";
import Footer from "../landingpage ui/Footer";
import ServiceTicker from "../landingpage ui/ServiceTicker";

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
        <ServiceTicker />
        <PlatformOverview />
        <AICopilotSection />
        <UnifiedWorkspace />
        <EnterpriseModules />
        <WorkflowAutomation />
        <IntegrationsSection />
        <SecuritySection />
        <CustomerStories />
        <PricingPreview />
        <FinalCTA />
      </div>
      <Footer />
    </div>
  );
}
