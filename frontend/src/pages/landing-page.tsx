import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";

import { ThreatCategoriesSection } from "@/components/landing/threat-categories-section";
import { WhyQRGuardSection } from "@/components/landing/why-qrguard-section";
import { MarketingShell } from "@/components/layout/marketing-shell";

export function LandingPage() {
  return (
    <MarketingShell>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ThreatCategoriesSection />
      <WhyQRGuardSection />
      <FAQSection />
      <CTASection />
    </MarketingShell>
  );
}
