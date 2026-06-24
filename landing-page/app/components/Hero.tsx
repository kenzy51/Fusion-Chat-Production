export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-[#09090b] flex items-center overflow-hidden pt-20">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 grayscale"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-transparent to-[#09090b] z-10" />
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-20">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#d4ff33]" />
            <span className="text-[#d4ff33] font-mono tracking-[0.3em] uppercase text-[10px] md:text-xs">
              Conversational Intelligence // Seamless Storefront Integration
            </span>
          </div>
          
          <h1 className="text-6xl lg:text-[100px] font-bold text-white tracking-tighter leading-[0.85] mb-10">
            Autonomous Chats.
            <br />
            <span className="text-[#d4ff33]">Zero Friction.</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-zinc-300 font-light leading-relaxed max-w-2xl mb-12">
            The ultimate client acquisition engine for premium practices. 
            We deploy <span className="text-white font-medium">self-managing AI concierges</span> that qualify 
            traffic, overcome friction, and book high-ticket consultations 24/7.
          </p>

          <div className="flex flex-wrap gap-5">
            <a href="https://calendly.com/kanatnazarov/30min" target="_blank" rel="noopener noreferrer">
              <button className="bg-[#d4ff33] text-black px-10 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(212,255,51,0.4)] transition-all cursor-pointer transform hover:scale-105 active:scale-95">
                Initialize System
              </button>
            </a>
            <button className="bg-white/5 border border-white/10 text-zinc-300 px-10 py-5 rounded-full font-medium text-lg hover:bg-white/10 transition-all backdrop-blur-md border-white/20 hover:text-white">
              See How It Works
            </button>
          </div>
          
          {/* System Status / Conversion Badge */}
          <div className="mt-16 flex flex-wrap items-center gap-8 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff33] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff33]"></span>
              </span>
              System Status: Optimal
            </div>
            <div className="hidden md:block h-3 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="text-white">24/7</span> Automated Qualification
            </div>
            <div className="hidden md:block h-3 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="text-white">Sub-100ms</span> Pipeline Latency
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}