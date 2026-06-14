import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BrainCircuit,
  ShieldAlert,
  Wallet,
  UserRoundCheck,
  Users,
  BarChart3
} from "lucide-react";

const features = [
  {
    title: "AI Threat Analysis",
    description: "Multi-layered neural networks analyze QR payloads for hidden malicious patterns and zero-day threats.",
    icon: BrainCircuit
  },
  {
    title: "AEGIS QR Detection",
    description: "Identify fraudulent QR codes designed to steal credentials or sensitive personal information.",
    icon: ShieldAlert
  },
  {
    title: "UPI Scam Detection",
    description: "Specialized detection for UPI and payment-related scams, protecting your financial transactions.",
    icon: Wallet
  },
  {
    title: "Brand Impersonation",
    description: "Detect QR codes that lead to sophisticated clones of trusted banking and corporate portals.",
    icon: UserRoundCheck
  },
  {
    title: "Community Intelligence",
    description: "Leverage global threat data from our community to stay ahead of emerging QR-based attacks.",
    icon: Users
  },
  {
    title: "Real-Time Risk Scoring",
    description: "Instant risk assessment for every scan, providing clear actionable security recommendations.",
    icon: BarChart3
  }
];

export function FeaturesSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Features</h2>
          <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">Purpose-built for QR threat defense</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Advanced security layers designed to protect every scan and transaction in your digital workflow.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="glass-card border-white/5 transition-all duration-300 hover:border-cyan-400/30 hover:shadow-cyan-500/5">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-400/10">
                  <feature.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
