import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Basic QR Decoding", standard: true, qrguard: true },
  { feature: "AI Threat Analysis", standard: false, qrguard: true },
  { feature: "Real-Time Risk Scoring", standard: false, qrguard: true },
  { feature: "Malicious URL Detection", standard: false, qrguard: true },
  { feature: "UPI Scam Prevention", standard: false, qrguard: true },
  { feature: "AI-Generated Reports", standard: false, qrguard: true },
  { feature: "Community Threat Intel", standard: false, qrguard: true },
  { feature: "Security Recommendations", standard: false, qrguard: true },
];

export function WhyQRGuardSection() {
  return (
    <section className="px-6 py-24 bg-slate-950/20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Comparison</h2>
          <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">Why QRGuard AI?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Standard scanners only read content. QRGuard AI understands the intent behind every pixel.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50 backdrop-blur-sm shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-white">Security Feature</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Standard Scanner</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-400">QRGuard AI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisons.map((item) => (
                <tr key={item.feature} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm text-slate-300">{item.feature}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {item.standard ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <X className="h-5 w-5 text-rose-500/50" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {item.qrguard ? (
                        <Check className="h-5 w-5 text-cyan-400 shadow-cyan-500/50" />
                      ) : (
                        <X className="h-5 w-5 text-rose-500/50" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
