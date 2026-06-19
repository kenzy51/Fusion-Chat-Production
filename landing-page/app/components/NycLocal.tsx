export function CreativeEdge() {
  return (
    <section className="bg-[#09090b] py-24 px-6 border-y border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-bold text-white">Aesthetic.</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Software alone doesn&apos;t book patients—trust does. We provide on-site
            cinematic production in NYC
          </p>
          <p className="text-[#d4ff33] font-medium">
            Included in every Fusion partnership.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="h-64 bg-zinc-800 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all">
            <img
              src="/clinic-1.jpg"
              alt="Clinical B-Roll"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-64 bg-zinc-800 rounded-2xl mt-8 overflow-hidden grayscale hover:grayscale-0 transition-all">
            <img
              src="/clinic-2.jpg"
              alt="Cinematic Lighting"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
