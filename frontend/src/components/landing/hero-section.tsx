import { ShieldCheck, Radar, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  { icon: ShieldCheck, label: "Threat scoring for phishing, malware, and payment fraud" },
  { icon: ScanSearch, label: "URL, UPI, Wi-Fi, SMS, email, and crypto QR classification" },
  { icon: Radar, label: "AI explanations and community threat intelligence" }
];

export function HeroSection() {
  return (
    <section className="px-6 pb-20 pt-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            QR security analysis for users, fintech teams, and SOC workflows
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white">
            Scan QR codes before they scan your users.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            AEGIS QR detects risky payment requests, phishing destinations, malicious downloads, and social engineering patterns before a user taps through.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">Start Protecting Scans</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/reports">View Community Reports</Link>
            </Button>
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="grid gap-4 p-6">
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

