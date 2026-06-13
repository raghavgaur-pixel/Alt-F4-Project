const steps = [
  "Upload a QR image from desktop or mobile.",
  "AEGIS QR decodes the payload and identifies the QR type.",
  "Analysis services score the risk and summarize threat signals.",
  "Users review the result, recommendations, and report malicious findings."
];

export function HowItWorksSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold text-white">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={step} className="glass-card rounded-2xl p-6">
              <div className="mb-3 text-sm font-semibold text-cyan-300">Step {index + 1}</div>
              <p className="text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

