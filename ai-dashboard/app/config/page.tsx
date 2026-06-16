/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  Save,
  RefreshCw,
  Database,
  Terminal,
  MessageSquareQuote,
  MessageCircle,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

export default function BotConfigPage() {
  const [knowledge, setKnowledge] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const BASE_URL = "http://localhost:3003";

  useEffect(() => {
    const loadBotConfig = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${BASE_URL}/tenant/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const tenantData = await res.json();
          const config = tenantData.chatConfig || {};

          setKnowledge(config.knowledgeBase || "");
          setChatPrompt(config.chatPrompt || "");
          setGreeting(config.greeting || "");
        }
      } catch (err) {
        console.error("Sync failed:", err);
      }
    };
    loadBotConfig();
  }, [BASE_URL]);

  const handleUpdate = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("access_token");

    const promise = fetch(`${BASE_URL}/tenant/update-config`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chatConfig: {
          knowledgeBase: knowledge,
          chatPrompt: chatPrompt,
          greeting: greeting,
        },
      }),
    });

    toast.promise(promise, {
      loading: "Updating Neural Configuration...",
      success: "Neural Config Re-Calibrated.",
      error: "Sync Failed.",
    });

    try {
      await promise;
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 bg-black text-white min-h-screen selection:bg-[#d4ff33] selection:text-black">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Neural Architecture
          </h1>
          <p className="text-zinc-500 mt-1 text-sm font-medium italic">
            Logic stacking for multi-tenant web agents.
          </p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isSaving}
          className="w-full sm:w-auto bg-[#d4ff33] text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#c2eb2f] active:scale-[0.98] transition-all duration-200 shadow-[0_0_30px_rgba(212,255,51,0.15)] disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Syncing Engine..." : "Push Architecture"}
        </button>
      </div>

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PRIMARY AI LOGIC PROMPTS (8 COLS) */}
        <div className="lg:col-span-8 space-y-8">
          <ConfigCard
            icon={<Database size={16} />}
            title="Data Core (Knowledge Base)"
          >
            <textarea
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-zinc-300 font-mono text-xs leading-relaxed outline-none focus:border-[#d4ff33]/30 focus:bg-black/60 transition-all duration-300 h-[320px] resize-y"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              placeholder="Inject custom company knowledge base data structure arrays here..."
            />
          </ConfigCard>

          <ConfigCard
            icon={<MessageCircle size={16} />}
            title="System Prompt (Chat Persona)"
          >
            <textarea
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-zinc-300 font-mono text-xs leading-relaxed outline-none focus:border-[#d4ff33]/30 focus:bg-black/60 transition-all duration-300 h-[320px] resize-y"
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              placeholder="Inject explicit core behavioral instructions, constraints, and tone mappings..."
            />
          </ConfigCard>
        </div>

        {/* RIGHT COLUMN: GREETINGS & TELEMETRY CONTROLS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          <ConfigCard
            icon={<MessageSquareQuote size={16} />}
            title="Initial Greeting"
          >
            <textarea
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-zinc-300 font-mono text-xs leading-relaxed outline-none focus:border-[#d4ff33]/30 focus:bg-black/60 transition-all duration-300 h-28 resize-none"
              placeholder="Enter the automated website welcome message..."
            />
          </ConfigCard>

          {/* TELEMETRY READOUTS */}
          <ConfigCard icon={<Activity size={16} />} title="Neural Environment">
            <div className="space-y-1.5 pt-1">
              <StatusItem label="CORE ENGINE" value="Llama-3.1-8B-Instant" />
              <StatusItem label="CACHE LAYER" value="Redis In-Memory" />
              <StatusItem label="DATA ISOLATION" value="Stateless Tenancy Guard" />
              <StatusItem label="SECURITY" value="AES-256 Encrypted Token" />

              {/* LATENCY MATRIX GRAPHIC */}
              <div className="mt-5 p-5 bg-white/[0.01] rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] text-zinc-500 uppercase font-black tracking-[0.2em]">
                    Cache Hit Latency
                  </span>
                  <span className="text-xs text-[#d4ff33] font-mono font-bold">
                    &lt; 2ms
                  </span>
                </div>
                <div className="flex gap-1 h-10 items-end">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#d4ff33] rounded-full opacity-25 animate-pulse"
                      style={{
                        height: `${30 + Math.random() * 70}%`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ConfigCard>

          {/* ENGINE VERSION SIGNATURE */}
          <div className="p-5 bg-zinc-950 border border-white/5 rounded-[24px] flex items-center justify-center gap-3">
            <Terminal size={16} className="text-zinc-600" />
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em]">
              Fusion Chat Engine v1.0.0
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function ConfigCard({ icon, title, children }: any) {
  return (
    <div className="bg-zinc-900/20 border border-white/5 rounded-[32px] p-6 md:p-8 backdrop-blur-xl hover:border-white/10 transition-all duration-500 focus-within:border-[#d4ff33]/20">
      <div className="flex items-center gap-3 mb-4 text-zinc-400">
        <span className="text-[#d4ff33]">{icon}</span>
        <h3 className="font-black uppercase tracking-[0.2em] text-[10px]">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function StatusItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.02] last:border-0">
      <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">
        {label}
      </span>
      <span className="text-[11px] text-zinc-300 font-mono font-bold tracking-tight">
        {value}
      </span>
    </div>
  );
}