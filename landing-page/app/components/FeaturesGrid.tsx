export function FeaturesGrid() {
  return (
    <section className="bg-[#09090b] py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large Feature: Multi-Tenant AI Chat Engine */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col justify-between hover:border-[#d4ff33]/50 transition-all">
          <div>
            <h3 className="text-3xl font-bold text-white mb-4">Autonomous Chat Concierges</h3>
            <p className="text-zinc-400 text-lg max-w-xl">
              High-performance, embeddable multi-tenant text agents that qualify traffic, handle client onboarding, and handle complex reservation intents with human-grade precision.
            </p>
          </div>
          <div className="mt-8 bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-xs text-[#d4ff33]">
            {`> Injecting script target token...`} <br />
            {`> Tenant Status: Authenticated [tenant_id: fusion-chat-prod]`} <br />
            {`> Global API Gateway Latency: 95ms`}
          </div>
        </div>

        {/* Small Feature: Conversion Optimization */}
        <div className="bg-[#d4ff33] rounded-3xl p-10 flex flex-col justify-between">
          <h3 className="text-3xl font-bold text-black leading-tight">Instant Speed-to-Lead.</h3>
          <p className="text-black/70 font-medium">
            We target web traffic drop-offs in under 100 milliseconds, ensuring zero client leakage 24/7/365.
          </p>
        </div>

        {/* Medium Feature: Automation & Orchestration Pipeline */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-[#d4ff33]/50 transition-all">
          <h3 className="text-2xl font-bold text-white mb-2">Calendar Orchestration</h3>
          <p className="text-zinc-400">Native bi-directional availability checks linking straight into Cal.com, Calendly, and enterprise databases.</p>
        </div>

        {/* Medium Feature: System Multi-Tenancy Architecture */}
        <div className="md:col-span-2 bg-zinc-900 border border-white/10 rounded-3xl p-10 flex items-center justify-between hover:border-[#d4ff33]/50 transition-all">
           <div className="space-y-2">
             <h3 className="text-2xl font-bold text-white">Isolated Tenant Architecture</h3>
             <p className="text-zinc-400">Centralized control panels to configure individual custom knowledge structures, chat styling themes, and lead parameters instantly.</p>
           </div>
           <div className="text-4xl font-bold text-white/20 font-mono">01</div>
        </div>
      </div>
    </section>
  );
}