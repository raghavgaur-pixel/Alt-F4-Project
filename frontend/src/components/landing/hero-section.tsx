import { ShieldCheck, Radar, ScanSearch, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  { icon: ShieldCheck, label: "Threat scoring for phishing, malware, and payment fraud" },
  { icon: ScanSearch, label: "URL, UPI, Wi-Fi, SMS, email, and crypto QR classification" },
  { icon: Radar, label: "AI explanations and community threat intelligence" }
];

const trustIndicators = [
  "AI Threat Analysis",
  "UPI Scam Detection",
  "QR Phishing Detection",
  "Community Threat Intelligence"
];

export function HeroSection() {
  return (
    <section className="px-6 pb-20 pt-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              QR security analysis for users, fintech teams, and SOC workflows
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                AEGIS QR
              </h1>
              <p className="max-w-2xl text-xl font-semibold leading-relaxed text-cyan-400 md:text-2xl mt-4">
                Next-Generation AI Security for QR Codes
              </p>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl mt-4">
                Detect phishing links, fake payment requests, malicious redirects, and suspicious QR content before you interact with them.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-cyan-500/20">
                <Link to="/register">Start Protecting Scans</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-semibold">
                <Link to="/reports">View Community Reports</Link>
              </Button>
            </div>
          </div>
          <Card className="glass-card overflow-hidden border-cyan-400/10 bg-slate-950/50">
            <CardContent className="grid gap-4 p-8">
              {highlights.map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <item.icon className="mt-1 h-6 w-6 text-cyan-400" />
                  <p className="text-slate-300">{item.label}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm leading-relaxed text-rose-200">
                <span className="font-bold">Proactive Alert:</span> This QR code appears suspicious because it routes to a fake payment portal and pre-fills a transfer amount.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Row */}
        <div className="mt-20 flex flex-wrap justify-center gap-8 border-y border-white/5 py-10 md:gap-16">
          {trustIndicators.map((indicator) => (
            <div key={indicator} className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-cyan-500" />
              {indicator}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
