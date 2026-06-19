/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-no-comment-textnodes */
// components/CaseStudy.tsx
"use client";

import React from "react";

export const CaseStudy = () => {
  return (
    <section className="relative py-24 bg-black border-t border-b border-neutral-900 overflow-hidden" id="enterprise-proof">
      {/* Neo-cyan grid line accent overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/[0.02] blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* UPPER PROTOCOL HEADER */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-cyan-400 font-mono tracking-[0.3em] uppercase text-xs font-bold mb-3">
            </p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase">
              TRT LOGISTICS <span className="text-neutral-700">//</span> ACTIVE INSTANCE
            </h2>
          </div>
          <div className="font-mono text-right text-xs text-neutral-500 tracking-widest hidden md:block">
            SYSTEM_STATUS: <span className="text-emerald-400 animate-pulse font-bold">OPERATIONAL</span> <br />
            TARGET_NODE: TRTLOGISTICS.COM
          </div>
        </div>

        {/* CORE TECH MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* ARCHITECTURE SUMMARY */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight font-light border-l-2 border-cyan-500 pl-4">
              Autonomous Multimodal Freight Intelligence
            </h3>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
              Fusion AI engineered and injected a deep-learning operational engine into the core digital infrastructure of TRT Logistics. This deployment coordinates infinite scaling corporate operations by unifying vocal communication channels and structured database knowledge graph systems.
            </p>

            {/* DUAL CORE SYSTEM AGENTS */}
            <div className="space-y-4 pt-4">
              
              {/* AGENT A: SARA VOICE NODE */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-900 group hover:border-cyan-500/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <h4 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
                      Vocal Core // SARA Agent
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 uppercase">Latency: &lt;720ms</span>
                </div>
                <p className="text-neutral-500 text-xs font-light leading-relaxed">
                  SARA operates the multi-line incoming/outgoing telecom switches autonomously. Capable of handling hundreds of concurrent telephonic freight negotiations, parsing live voice streams into text context arrays, and executing instant routing commands with absolute zero terminal delays.
                </p>
              </div>

              {/* AGENT B: RAG TEXT COMPUTE ENGINE */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-900 group hover:border-cyan-500/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <h4 className="text-sm font-mono font-bold uppercase text-white tracking-wider">
                      Neural Interface // Chat Vector-RAG
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-600 uppercase">Context Layer: Active</span>
                </div>
                <p className="text-neutral-500 text-xs font-light leading-relaxed">
                  The live digital text module processes incoming client tracking vectors through Retrieval-Augmented Generation (RAG). By embedding local customs paperwork, warehouse inventories, and vessel manifests into real-time semantic graphs, it guarantees hallucination-free, enterprise-safe client support.
                </p>
              </div>

            </div>
          </div>

          {/* TELEMETRY FEED / MOCK INTERACTION */}
          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-2xl bg-neutral-950/40 border border-neutral-900 p-6 shadow-2xl">
              
              {/* Visual Grid Accents inside console */}
              <div className="absolute top-0 right-0 p-3 font-mono text-[9px] text-neutral-700 uppercase tracking-widest pointer-events-none">
                MATRIX_v4.19
              </div>

              {/* LIVE VOICES STREAM VISUALIZATION */}
              <div className="mb-6">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">// SARA TELEPHONY FEED</div>
                <div className="h-10 flex items-center gap-1 bg-neutral-950 rounded-lg p-3 border border-neutral-900/60 overflow-hidden">
                  <div className="w-1 h-3 bg-cyan-500/40 rounded animate-pulse" />
                  <div className="w-1 h-6 bg-cyan-500/60 rounded" />
                  <div className="w-1 h-4 bg-cyan-500/40 rounded" />
                  <div className="w-1 h-8 bg-cyan-500 rounded animate-pulse" />
                  <div className="w-1 h-5 bg-cyan-500/80 rounded" />
                  <div className="w-1 h-2 bg-neutral-800 rounded" />
                  <div className="w-1 h-6 bg-cyan-500/50 rounded animate-pulse" />
                  <span className="text-[10px] font-mono text-cyan-400 ml-4 tracking-wider uppercase font-bold text-xs">SARA Streaming Live...</span>
                </div>
              </div>

              {/* LIVE CONSOLE INTERACTION LOG */}
              <div className="space-y-4 font-mono text-xs">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">// RAG KNOWLEDGE OVERLAYS</div>
                
                <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-900 text-neutral-400">
                  <span className="text-neutral-600 font-bold block text-[9px] uppercase tracking-wider mb-1">
                    System Input // User Text Node
                  </span>
                  "What is the warehouse customs priority code for maritime manifest #9910-A?"
                </div>

                <div className="p-3.5 rounded-lg bg-cyan-950/5 border border-cyan-900/20 text-neutral-200">
                  <span className="text-cyan-500 font-bold block text-[9px] uppercase tracking-wider mb-1">
                    Knowledge Graph Scan // Vector Match Found
                  </span>
                  "RAG system pulled context from embedded TRT document block: `TRT_NJ_CUSTOMS_SEC4`. Manifest #9910-A maps to priority code alpha-4."
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-4">
                  <div>
                    <span className="text-[9px] text-neutral-600 block uppercase font-bold tracking-widest">Voice Processing</span>
                    <span className="text-white text-xs font-mono font-bold">100% Autonomous</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-600 block uppercase font-bold tracking-widest">Data Matrix</span>
                    <span className="text-cyan-400 text-xs font-mono font-bold">RAG Augmented</span>
                  </div>
                </div>
                <a 
                  href="https://trtlogistics.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-all duration-300 flex items-center gap-2 px-4 py-2 bg-neutral-950 rounded-lg border border-neutral-900 hover:border-cyan-500/20 w-full sm:w-auto justify-center"
                >
                  Verify Live Node ↗
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};