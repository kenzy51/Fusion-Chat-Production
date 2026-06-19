export function FeaturesGrid() {
  return (
    <section className="bg-[#09090b] py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Feature: AI Voice */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col justify-between hover:border-[#d4ff33]/50 transition-all">
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">Neural Voice Agents</h3>
            <p className="text-zinc-400 text-lg max-w-md">
              Human-grade AI receptionists that handle booking, rescheduling, and patient FAQs with 98% accuracy.
            </p>
          </div>
          <div className="mt-8 bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs text-[#d4ff33]">
            {`> Initializing Jessica AI...`} <br />
            {`> Status: Active`} <br />
            {`> Average Latency: 320ms`}
          </div>
        </div>

        {/* Small Feature: Conversion */}
        <div className="bg-[#d4ff33] rounded-3xl p-10 flex flex-col justify-between">
          <h3 className="text-3xl font-bold text-black leading-tight">85% Speed to Lead.</h3>
          <p className="text-black/70 font-medium">
            We engage medical leads in under 30 seconds, 24/7.
          </p>
        </div>

        {/* Medium Feature: Automation */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-[#d4ff33]/50 transition-all">
          <h3 className="text-2xl font-bold text-white mb-2">CRM Synchronization</h3>
          <p className="text-zinc-400">Deep integration with NexHealth, Curve, and Open Dental.</p>
        </div>

        <div className="md:col-span-2 bg-zinc-900 border border-white/10 rounded-3xl p-10 flex items-center justify-between">
           <div className="space-y-2">
             <h3 className="text-2xl font-bold text-white">NYC Regional Dominance</h3>
             <p className="text-zinc-400">Localized SEO & Geo-targeted acquisition.</p>
           </div>
           <div className="text-4xl font-bold text-white">01</div>
        </div>
      </div>
    </section>
  );
}