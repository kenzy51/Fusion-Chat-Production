export function ChatSapience() {
  const capabilities = [
    {
      title: "Intent & Sentiment Extraction",
      desc: "The system detects user friction or high-intent buying signals within text dialogue arrays and auto-tags leads inside your dashboard.",
    },
    {
      title: "Context-Aware State Memory",
      desc: "Maintains isolated structural context maps over deep conversational turns, ensuring flawless document data retrieval across complex threads.",
    },
    {
      title: "Multi-Channel Fallback Webhooks",
      desc: "Automatically triggers a localized background routine to log event snapshots and alert your system if a lead drops off before completing a booking.",
    },
  ];

  return (
    <section className="bg-[#09090b] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold text-white tracking-tighter leading-tight mb-8">
              An AI framework that <span className="text-[#d4ff33]">actually</span>{" "}
              understands business context.
            </h2>
            <div className="space-y-8">
              {capabilities.map((cap, i) => (
                <div key={i} className="border-l-2 border-[#d4ff33]/30 pl-6 hover:border-[#d4ff33] transition-colors group">
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#d4ff33] transition-colors">
                    {cap.title}
                  </h4>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900/50 aspect-square rounded-3xl border border-white/5 flex items-center justify-center p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4ff33]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Visual representation of the Multi-Tenant Neural Chat Node tree */}
            <div className="w-full h-full border border-[#d4ff33]/10 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-2/3 h-2/3 border border-[#d4ff33]/20 rounded-full flex items-center justify-center">
                <div className="w-1/3 h-1/3 bg-[#d4ff33] rounded-full blur-3xl opacity-10" />
                <span className="text-[#d4ff33] font-mono font-bold tracking-widest text-sm md:text-base">
                  FUSION_ENGINE_V4.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}