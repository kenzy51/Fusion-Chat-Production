/* eslint-disable react/no-unescaped-entities */
export function LiveProcess() {
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
          <p className="text-zinc-500">[18:40:02] Lead detected: New Patient Inquiry (Tribeca)</p>
          <p className="text-[#d4ff33]">[18:40:05] Fusion AI initiating NightLase protocol...</p>
          <p className="text-white">[18:40:12] User: "How much does it cost?"</p>
          <p className="text-blue-400">[18:40:13] AI: "Evaluation is $49. No needles, no downtime."</p>
          <p className="text-[#d4ff33]">[18:41:02] SUCCESS: Appointment booked for March 20th.</p>
          <span className="inline-block w-2 h-4 bg-[#d4ff33] animate-pulse align-middle ml-1" />
        </div>
      </div>
    </section>
  );
}