import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MarketingShell } from "@/components/layout/marketing-shell";

export function LandingPage() {
  return (
    <MarketingShell>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
    </MarketingShell>
  );
}

