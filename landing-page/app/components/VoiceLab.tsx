"use client";
import { useState } from "react";

export function VoiceLab() {
  return (
    <section className="bg-[#09090b] py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: The Value Prop */}
        <div className="space-y-8">
          <h2 className="text-[#d4ff33] font-mono text-sm tracking-widest uppercase">
            Identity & Trust
          </h2>
          <h3 className="text-5xl font-bold text-white leading-tight">
            Your Practice. <br />
            <span className="text-[#d4ff33]">Your Voice.</span>
          </h3>
          <p className="text-xl text-zinc-400 font-light leading-relaxed">
            Don&apos;t let your practice sound like a template. Fusion AI integrates
            directly with ElevenLabs to clone your top receptionist or your own
            voice with 99% emotional accuracy.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white">
              <div className="w-5 h-5 rounded-full bg-[#d4ff33]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#d4ff33]" />
              </div>
              Instant 1-minute voice cloning
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="w-5 h-5 rounded-full bg-[#d4ff33]/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#d4ff33]" />
              </div>
              Cross-language support for diverse NYC patients
            </li>
          </ul>
        </div>

        {/* Right Side: The "Upload" UI Mockup */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d4ff33]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <span className="text-white font-bold">Voice Integration</span>
              <span className="bg-[#d4ff33] text-black text-[10px] px-2 py-1 rounded font-bold">
                ACTIVE
              </span>
            </div>

            {/* The Drop Zone Mockup */}
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-[#d4ff33]/50 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">↑</span>
              </div>
              <p className="text-white font-medium">Upload Voice Sample</p>
              <p className="text-zinc-500 text-sm mt-1">
                MP3, WAV, or M4A (Min. 60 seconds)
              </p>
            </div>

            {/* ElevenLabs Branding Integration */}
            <div className="flex items-center justify-center gap-3 pt-4 opacity-50">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">
                Powered by
              </span>
              <span className="text-white font-bold tracking-tighter italic text-lg">
                ElevenLabs
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
