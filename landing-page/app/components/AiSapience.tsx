export function AISapience() {
  const capabilities = [
    {
      title: "Sentiment Analysis",
      desc: "Jessica detects patient frustration and auto-routes to your front desk.",
    },
    {
      title: "Real-time Sync",
      desc: "Instantly checks Google Calendar or NexHealth for open slots.",
    },
    {
      title: "Multi-Staged Follow-up",
      desc: "Automatically texts patients who drop off during the call.",
    },
  ];

  return (
    <section className="bg-[#09090b] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold text-white leading-tight mb-8">
              An AI that <span className="text-[#d4ff33]">actually</span>{" "}
              understands clinical context.
            </h2>
            <div className="space-y-8">
              {capabilities.map((cap, i) => (
                <div key={i} className="border-l-2 border-[#d4ff33]/30 pl-6">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {cap.title}
                  </h4>
                  <p className="text-zinc-400">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900/50 aspect-square rounded-3xl border border-white/5 flex items-center justify-center p-12">
            {/* Visual representation of the AI Node tree */}
            <div className="w-full h-full border border-[#d4ff33]/20 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2/3 h-2/3 border border-[#d4ff33]/40 rounded-full flex items-center justify-center">
                <div className="w-1/3 h-1/3 bg-[#d4ff33] rounded-full blur-2xl opacity-20" />
                <span className="text-[#d4ff33] font-mono font-bold tracking-tighter text-2xl">
                  JESSICA V2.5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
