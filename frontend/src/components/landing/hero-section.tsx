import { ShieldCheck, Radar, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  { icon: ShieldCheck, label: "Threat scoring for phishing, malware, and payment fraud" },
  { icon: ScanSearch, label: "URL, UPI, Wi-Fi, SMS, email, and crypto QR classification" },
  { icon: Radar, label: "AI explanations and community threat intelligence" }
];

const heroStats = [
  { label: "QR formats classified", value: "8+" },
  { label: "Threat lenses applied", value: "6" },
  { label: "Community-informed review", value: "24/7" }
];

export function HeroSection() {
  return (
    <section className="px-6 pb-20 pt-12 md:pb-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            QR security analysis for users, fintech teams, and SOC workflows
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            Scan QR codes before they scan your users.
          </h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            QRGuard AI detects risky payment requests, phishing destinations, malicious downloads, and social engineering patterns before a user taps through.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">Start Protecting Scans</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/reports">View Community Reports</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-slate-950/35 p-4">
                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="grid gap-4 p-6">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="text-sm font-medium text-cyan-200">Live analysis posture</div>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <div className="text-3xl font-semibold text-white">87/100</div>
                  <p className="mt-1 text-sm text-slate-300">Example risk score for a fake payment collection QR.</p>
                </div>
                <div className="rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-200">
                  High risk
                </div>
              </div>
            </div>
            {highlights.map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-border bg-slate-950/40 p-4">
                <item.icon className="mt-1 h-5 w-5 text-cyan-300" />
                <p className="text-sm text-slate-300">{item.label}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
              Example alert: This QR code appears suspicious because it routes to a fake payment portal and pre-fills a transfer amount.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
