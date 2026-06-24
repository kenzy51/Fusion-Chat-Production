export function Comparison() {
  const points = [
    { label: "Pipeline Latency", fusion: "Sub-100ms API", traditional: "6-12 Hour Delay" },
    { label: "Availability Window", fusion: "24/7/365 Continuous", traditional: "Business Hours Only" },
    { label: "Lead Qualification", fusion: "Autonomous Screening", traditional: "Manual Contact Forms" },
    { label: "Data Architecture", fusion: "Automated System Sync", traditional: "Manual CRM Data Entry" },
  ];

  return (
    <section className="bg-[#09090b] py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Fusion Chat vs. The Status Quo</h2>
        <div className="w-full space-y-4">
          {points.map((p, i) => (
            <div key={i} className="grid grid-cols-3 py-6 border-b border-white/5 items-center">
              <span className="text-zinc-500 font-medium text-sm md:text-base">{p.label}</span>
              <span className="text-[#d4ff33] font-bold text-center text-sm md:text-base">{p.fusion}</span>
              <span className="text-zinc-700 text-center line-through decoration-zinc-800 text-sm md:text-base">{p.traditional}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}