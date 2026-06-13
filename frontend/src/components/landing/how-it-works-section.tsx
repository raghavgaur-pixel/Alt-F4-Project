import {
  Upload,
  Code2,
  Search,
  Activity,
  FileSearch
} from "lucide-react";

const steps = [
  {
    title: "Upload QR Code",
    description: "Upload a QR image from your desktop, mobile gallery, or scan directly using our interface.",
    icon: Upload
  },
  {
    title: "Decode Payload",
    description: "Our engine instantly extracts the encoded data, whether it's a URL, UPI ID, or raw text.",
    icon: Code2
  },
  {
    title: "Analyze Threats",
    description: "Multiple security layers check for phishing, malware, and social engineering patterns.",
    icon: Search
  },
  {
    title: "Calculate Risk Score",
    description: "Receive a comprehensive risk assessment based on AI analysis and community data.",
    icon: Activity
  },
  {
    title: "Generate AI Report",
    description: "Get a detailed breakdown of findings with clear, actionable security recommendations.",
    icon: FileSearch
  }
];

export function HowItWorksSection() {
  return (
    <section className="px-6 py-24 bg-slate-950/30">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Workflow</h2>
          <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">How it works</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            A seamless, automated process to ensure every QR code you encounter is safe.
          </p>
        </div>

        <div className="relative mt-20">
          {/* Timeline Connector (Desktop) */}
          <div className="absolute top-8 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent lg:block"></div>

          <div className="grid gap-8 lg:grid-cols-5">
            {steps.map((step, index) => (
              <div key={step.title} className="relative group">
                <div className="flex flex-col items-center text-center">
                  {/* Step Number & Icon */}
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-400/20 bg-slate-950 text-cyan-400 shadow-neon transition-transform group-hover:scale-110">
                      <step.icon className="h-7 w-7" />
                    </div>
                    <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">
                      {index + 1}
                    </div>
                  </div>

                  <h4 className="mb-3 text-lg font-bold text-white">{step.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
