import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  Bug,
  CreditCard,
  Fingerprint,
  MessageSquareWarning
} from "lucide-react";

const threats = [
  {
    title: "Phishing",
    description: "Malicious URLs disguised as legitimate login pages to steal your credentials.",
    icon: Globe
  },
  {
    title: "Malware",
    description: "Direct links to malicious APKs or files that can infect your device upon download.",
    icon: Bug
  },
  {
    title: "Payment Fraud",
    description: "Fake UPI or payment QRs that trick users into sending money to attackers.",
    icon: CreditCard
  },
  {
    title: "Fake Login Pages",
    description: "Sophisticated brand impersonation targeting banks and social media platforms.",
    icon: Fingerprint
  },
  {
    title: "Social Engineering",
    description: "Deceptive QR codes used in physical or digital scams to manipulate user behavior.",
    icon: MessageSquareWarning
  }
];

export function ThreatCategoriesSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-400">Protection</h2>
          <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">What QRGuard AI protects against</h3>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Our specialized detection engines are trained to identify a wide range of QR-based threats before they cause harm.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {threats.map((threat) => (
            <Card key={threat.title} className="glass-card border-white/5 transition-all hover:bg-white/5">
              <CardHeader className="pb-4">
                <threat.icon className="h-8 w-8 text-rose-400" />
                <CardTitle className="mt-4 text-lg text-white">{threat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-400">{threat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
