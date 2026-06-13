const stats = [
  { label: "QR Codes Analyzed", value: "250K+" },
  { label: "Threats Detected", value: "12K+" },
  { label: "Detection Accuracy", value: "98%" },
  { label: "Community Reports", value: "5K+" }
];

export function StatsSection() {
  return (
    <section className="px-6 py-24 border-y border-white/5 bg-cyan-500/[0.02]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                {stat.value}
              </div>
              <div className="text-sm font-medium uppercase tracking-widest text-cyan-400/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
