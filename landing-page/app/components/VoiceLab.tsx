/* eslint-disable react/no-unescaped-entities */
export function VoiceLab() {
  return (
    <section className="bg-[#09090b] pb-24 px-6">
      <div className="max-w-3xl mx-auto bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-white/5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-zinc-500 font-mono ml-4 uppercase tracking-widest">Live Engine Feed</span>
        </div>
        <div className="p-6 font-mono text-sm space-y-2">
          <p className="text-zinc-500">[13:31:02] Inbound script payload authenticated // tenant_id: fusion-prod</p>
          <p className="text-[#d4ff33]">[13:31:03] Fusion Chat initiating intent detection framework...</p>
          <p className="text-white">[13:31:04] Visitor: "I want to deploy the integration. Are there custom webhooks?"</p>
          <p className="text-blue-400">[13:31:04] Chatbot: "Yes. Bi-directional webhooks and native REST architecture endpoints are live."</p>
          <p className="text-[#d4ff33]">[13:31:05] SUCCESS: High-ticket lead qualified & calendar orchestration synced.</p>
          <span className="inline-block w-2 h-4 bg-[#d4ff33] animate-pulse align-middle ml-1" />
        </div>
      </div>
    </section>
  );
}