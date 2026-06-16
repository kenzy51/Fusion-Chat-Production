export function Comparison() {
  const points = [
    { label: "Response Time", fusion: "30 Seconds", traditional: "6-12 Hours" },
    { label: "Operating Hours", fusion: "24/7/365", traditional: "Mon-Fri (9-5)" },
    { label: "Cost Per Lead", fusion: "Predictable AI-Cost", traditional: "High Variable Labor" },
    { label: "Integration", fusion: "Native API / Webhooks", traditional: "Manual Data Entry" },
  ];

  return (
    <section className="bg-[#09090b] py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Fusion vs. The Status Quo</h2>
        <div className="w-full space-y-4">
          {points.map((p, i) => (
            <div key={i} className="grid grid-cols-3 py-6 border-b border-white/5 items-center">
              <span className="text-zinc-500 font-medium">{p.label}</span>
              <span className="text-[#d4ff33] font-bold text-center">{p.fusion}</span>
              <span className="text-zinc-700 text-center line-through decoration-zinc-600">{p.traditional}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}