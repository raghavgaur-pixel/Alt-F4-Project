import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Threat-focused QR analysis",
    description: "Decode QR payloads and score them for phishing risk, malware delivery, suspicious redirects, and payment fraud."
  },
  {
    title: "User history and audit trail",
    description: "Every authenticated scan is recorded with severity, explanation, and related threat findings for quick investigation."
  },
  {
    title: "Community intelligence",
    description: "Track recent malicious QR reports and category-level statistics to spot emerging abuse patterns."
  }
];

export function FeaturesSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold text-white">Purpose-built for QR threat defense</h2>
          <p className="mt-3 text-slate-300">
            The platform is API-first and built to expand into live threat intel, mobile scanning, and production AI classification.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

