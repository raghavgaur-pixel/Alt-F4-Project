import { Link } from "react-router-dom";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "What QR types can QRGuard AI analyze?",
    answer: "The current flow classifies common URL, payment, Wi-Fi, email, SMS, crypto, and text-based QR payloads before scoring their risk."
  },
  {
    question: "Does the platform replace secure payment verification?",
    answer: "No. It adds a fast pre-check so users can spot suspicious redirects, spoofed payment destinations, and social-engineering cues before taking action."
  },
  {
    question: "Can teams use community reports during investigations?",
    answer: "Yes. The community report feed helps highlight repeated abuse patterns and suspicious categories that deserve extra scrutiny."
  }
];

export function LandingPage() {
  return (
    <MarketingShell>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-semibold text-white">Frequently asked questions</h2>
            <p className="mt-3 text-slate-300">
              The platform is designed to reduce uncertainty around QR interactions without disrupting the existing scan workflow.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {faqs.map((item) => (
              <Card key={item.question}>
                <CardHeader>
                  <CardTitle className="text-base text-white">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-300">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="text-sm font-medium text-cyan-300">Ready to harden QR interactions?</div>
                <h2 className="mt-3 text-3xl font-semibold text-white">Give users a clearer decision point before they trust a scan.</h2>
                <p className="mt-3 text-slate-300">
                  Start with the existing dashboard workflow and review risk scoring, AI explanations, and community reporting in one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/register">Create an Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/reports">Explore Community Reports</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </MarketingShell>
  );
}
