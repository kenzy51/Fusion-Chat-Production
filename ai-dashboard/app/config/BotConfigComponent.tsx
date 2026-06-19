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
  Cpu,
  Sliders,
  Building2,
  Palette,
  Eye,
  Send,
  Bot,
} from "lucide-react";
import { toast } from "sonner";

// 🚀 ROBUST COOKIE EXTRACTOR: Grabs token from cookies, falls back to localStorage if cross-origin rules hide it
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const token = parts.pop()?.split(";").shift();
    if (token && token !== "null" && token !== "undefined") return token;
  }

  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem(name);
    if (localToken && localToken !== "null" && localToken !== "undefined")
      return localToken;
  }

  return null;
};

export default function BotConfigComponent({
  initialData,
}: {
  initialData: any;
}) {
  const [activeTab, setActiveTab] = useState<
    "prompting" | "account" | "customizer"
  >("prompting");

  // Multi-tenant baseline states
  const [tenantName, setTenantName] = useState(initialData?.name || "Fusion Space");
  const [tenantSlug, setTenantSlug] = useState(initialData?.slug || "");
  
  // Configuration Parameter Fields
  const config = initialData?.chatConfig || {};
  const [knowledge, setKnowledge] = useState(config.knowledgeBase || "");
  const [chatPrompt, setChatPrompt] = useState(config.chatPrompt || "");
  const [greeting, setGreeting] = useState(config.greeting || "");

  const [primaryColor, setPrimaryColor] = useState(config.primaryColor || "#d4ff33");
  const [backgroundColor, setBackgroundColor] = useState(config.backgroundColor || "#0a0a0a");
  const [textColor, setTextColor] = useState(config.textColor || "#ffffff");
  const [widgetTitle, setWidgetTitle] = useState(config.widgetTitle || "AI Assistant");

  const [previewMessages, setPreviewMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const BASE_URL = "http://localhost:3003";

  // 🎯 UN-GUARDED FETCH INFRASTRUCTURE: Runs on frame mounting to pull saved data parameters straight out of MongoDB
  useEffect(() => {
    const fetchActiveTenantData = async () => {
      let activeSlug = initialData?.slug;
      if (!activeSlug && typeof window !== "undefined") {
        const pathParts = window.location.pathname.split("/");
        activeSlug = pathParts[2] 
      }
      
      setTenantSlug(activeSlug);

      try {
        const res = await fetch(`${BASE_URL}/public-tenant/${activeSlug}/widget-config`);
        if (res.ok) {
          const remoteData = await res.json();
          
          setTenantName(remoteData.name || "Fusion Space");
          setWidgetTitle(remoteData.widgetTitle || "AI Assistant");
          setGreeting(remoteData.greeting || "Hello!");
          setPrimaryColor(remoteData.primaryColor || "#d4ff33");
          setBackgroundColor(remoteData.backgroundColor || "#0a0a0a");
          setTextColor(remoteData.textColor || "#ffffff");
          
          // Re-fetch the private knowledge and prompt fields directly if they are stored or bundled in public view
          if (remoteData.knowledgeBase) setKnowledge(remoteData.knowledgeBase);
          if (remoteData.chatPrompt) setChatPrompt(remoteData.chatPrompt);
          
          setPreviewMessages([
            { role: "assistant", content: remoteData.greeting || "Hello! Drop a message to test my live configurations." }
          ]);
        }
      } catch (err) {
        console.error("⚠️ Local infrastructure lookup missed, fallback engaged.", err);
      }
    };

    fetchActiveTenantData();
  }, [initialData, BASE_URL]);

  const handleSendPreviewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = { role: "user", content: inputMessage };
    setPreviewMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsBotTyping(true);

    try {
      const res = await fetch(`${BASE_URL}/public-tenant/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          slug: tenantSlug || "workspace",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPreviewMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setPreviewMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error communicating with local neural model node." },
        ]);
      }
    } catch (err) {
      setPreviewMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Pipeline failure connection broken." },
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    const token = getCookie("access_token");

    const promise = fetch(`${BASE_URL}/tenant/update-config`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slug: tenantSlug, 
        chatConfig: {
          knowledgeBase: knowledge,
          chatPrompt: chatPrompt,
          greeting: greeting,
          primaryColor,
          backgroundColor,
          textColor,
          widgetTitle,
        },
      }),
    });

    toast.promise(promise, {
      loading: "Synchronizing global branding parameters...",
      success: "Neural brand architecture updated successfully.",
      error: "Transmission framework error.",
    });

    try {
      await promise;
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const embedCodeSnippet = `<script>
  window.FusionAIChatConfig = { tenantSlug: "${tenantSlug || "workspace"}" };
</script>
<script src="${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/embed.js" async></script>`;

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 bg-black text-white min-h-screen selection:bg-[#d4ff33] selection:text-black">
      {/* HEADER SEGMENT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#d4ff33] text-[10px] font-black uppercase tracking-[0.3em] mb-1">
            <Cpu size={12} className="animate-pulse" /> infrastructure parameter node
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-zinc-100">
            {activeTab === "prompting" && "Neural Architecture"}
            {activeTab === "account" && "Workspace Profile"}
            {activeTab === "customizer" && "Visual Branding Customizer"}
          </h1>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isSaving}
          className="w-full md:w-auto bg-[#d4ff33] text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#c2eb2f] active:scale-[0.98] transition-all duration-300 disabled:opacity-40"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
          {isSaving ? "Syncing..." : "Push Architecture"}
        </button>
      </div>

      {/* NAVIGATION TABS CONTROL */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab("prompting")}
          className={`px-6 py-3 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all flex items-center gap-2.5 border ${
            activeTab === "prompting" ? "bg-[#d4ff33] text-black border-[#d4ff33]" : "bg-zinc-950 text-zinc-500 border-white/5 hover:text-zinc-200"
          }`}
        >
          <Sliders size={14} /> Neural Prompting Engine
        </button>
        <button
          onClick={() => setActiveTab("customizer")}
          className={`px-6 py-3 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all flex items-center gap-2.5 border ${
            activeTab === "customizer" ? "bg-[#d4ff33] text-black border-[#d4ff33]" : "bg-zinc-950 text-zinc-500 border-white/5 hover:text-zinc-200"
          }`}
        >
          <Palette size={14} /> Widget Customizer & Sandbox
        </button>
        <button
          onClick={() => setActiveTab("account")}
          className={`px-6 py-3 rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all flex items-center gap-2.5 border ${
            activeTab === "account" ? "bg-[#d4ff33] text-black border-[#d4ff33]" : "bg-zinc-950 text-zinc-500 border-white/5 hover:text-zinc-200"
          }`}
        >
          <Building2 size={14} /> Workspace Account Data
        </button>
      </div>

      {/* PROMPTING VIEW CONTAINER */}
      {activeTab === "prompting" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <ConfigCard icon={<Database size={14} />} title="System Knowledge Memory Array">
              <textarea
                className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl p-5 text-zinc-300 font-mono text-xs leading-relaxed outline-none focus:border-[#d4ff33]/20 focus:bg-zinc-950/80 transition-all duration-300 h-[340px] resize-y"
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                placeholder="Inject clean text documentation vectors here..."
              />
            </ConfigCard>

            <ConfigCard icon={<MessageCircle size={14} />} title="Core Persona Logic Constraints">
              <textarea
                className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl p-5 text-zinc-300 font-mono text-xs leading-relaxed outline-none focus:border-[#d4ff33]/20 focus:bg-zinc-950/80 transition-all duration-300 h-[340px] resize-y"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Designate behavioral instructions and strict constraints..."
              />
            </ConfigCard>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <ConfigCard icon={<MessageSquareQuote size={14} />} title="Initial Welcome Trigger Message">
              <textarea
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl p-5 text-zinc-300 font-mono text-xs leading-relaxed outline-none focus:border-[#d4ff33]/20 focus:bg-zinc-950/80 transition-all duration-300 h-28 resize-none"
                placeholder="Automated chat welcome script block..."
              />
            </ConfigCard>

            <ConfigCard icon={<Activity size={14} />} title="Node Cluster Architecture Runtime">
              <div className="space-y-1.5 pt-1">
                <StatusItem label="CORE ENGINE" value="Llama-3.1-8B-Instant" />
                <StatusItem label="VECTOR WEIGHTS" value="Dynamic Grow Embeddings" />
                <StatusItem label="CACHE FRAMEWORK" value="Redis In-Memory KeyStore" />
                <StatusItem label="DATA TENANCY" value="Stateless Tenant Separation" />
              </div>
            </ConfigCard>
          </div>
        </div>
      )}

      {/* 🎨 VISUAL BRANDING TAB */}
      {activeTab === "customizer" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <ConfigCard icon={<Palette size={14} />} title="Visual Design Modifiers">
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">Primary Accent Color (Launcher & Buttons)</label>
                  <div className="flex gap-3">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 border border-white/10 rounded-xl bg-transparent cursor-pointer" />
                    <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 bg-zinc-950 border border-white/5 rounded-xl px-4 text-xs font-mono text-zinc-200 uppercase outline-none focus:border-[#d4ff33]/30" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">Widget Window Base Layer Backing</label>
                  <div className="flex gap-3">
                    <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-12 h-12 border border-white/10 rounded-xl bg-transparent cursor-pointer" />
                    <input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="flex-1 bg-zinc-950 border border-white/5 rounded-xl px-4 text-xs font-mono text-zinc-200 uppercase outline-none focus:border-[#d4ff33]/30" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">Widget Message Text Color</label>
                  <div className="flex gap-3">
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-12 border border-white/10 rounded-xl bg-transparent cursor-pointer" />
                    <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 bg-zinc-950 border border-white/5 rounded-xl px-4 text-xs font-mono text-zinc-200 uppercase outline-none focus:border-[#d4ff33]/30" />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">Widget Banner Header Title</label>
                  <input type="text" value={widgetTitle} onChange={(e) => setWidgetTitle(e.target.value)} className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3.5 px-4 text-xs font-bold text-zinc-200 outline-none focus:border-[#d4ff33]/30" />
                </div>
              </div>
            </ConfigCard>

            <ConfigCard icon={<Terminal size={14} />} title="Deployment Integration Copy Block">
              <p className="text-xs text-zinc-500 mb-3 leading-relaxed">Paste this code snippet right into the bottom of your `body` layout container tag to serve this interface globally.</p>
              <div className="relative">
                <pre className="p-4 bg-zinc-950 rounded-xl text-[11px] font-mono text-zinc-400 overflow-x-auto border border-white/5 whitespace-pre-wrap select-all">
                  {embedCodeSnippet}
                </pre>
              </div>
            </ConfigCard>
          </div>

          {/* SANDBOX EXECUTOR VIEW */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[600px] border border-white/5 bg-zinc-950/20 rounded-[32px] p-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-4 left-6 flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest pointer-events-none"><Eye size={12} /> Sandbox Execution View</div>
            {isPreviewOpen && (
              <div style={{ backgroundColor: backgroundColor }} className="w-full max-w-[380px] h-[520px] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
                <div style={{ borderColor: `${primaryColor}20` }} className="p-4 border-b flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }} className="w-8 h-8 rounded-full flex items-center justify-center"><Bot size={16} /></div>
                    <div>
                      <h4 style={{ color: textColor }} className="text-xs font-black tracking-tight">{widgetTitle}</h4>
                      <span className="text-[9px] text-zinc-500 font-bold uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Agent Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs bg-black/20">
                  {previewMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div style={msg.role === "user" ? { backgroundColor: primaryColor, color: "#000000" } : { backgroundColor: "rgba(255,255,255,0.04)", color: textColor }} className="max-w-[80%] rounded-xl px-3.5 py-2.5 font-medium leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isBotTyping && <div className="flex justify-start"><div style={{ color: textColor }} className="bg-white/[0.04] rounded-xl px-4 py-3 font-mono text-[10px] tracking-widest opacity-40 animate-pulse">PROCESSING MATRIX...</div></div>}
                </div>

                <form onSubmit={handleSendPreviewMessage} className="p-3 border-t border-white/5 bg-white/[0.01] flex gap-2">
                  <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Ask agent parameters..." style={{ color: textColor }} className="flex-1 bg-zinc-950 border border-white/5 rounded-xl px-3 text-xs outline-none focus:border-white/10" />
                  <button type="submit" style={{ backgroundColor: primaryColor }} className="p-3 rounded-xl text-black hover:scale-105 active:scale-95 transition-transform"><Send size={12} /></button>
                </form>
              </div>
            )}
            <button onClick={() => setIsPreviewOpen(!isPreviewOpen)} style={{ backgroundColor: primaryColor }} className="absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-transform z-50"><Bot size={20} className="text-black" /></button>
          </div>
        </div>
      )}

      {/* ACCOUNT WRAPPER VIEW */}
      {activeTab === "account" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <ConfigCard icon={<Building2 size={14} />} title="Tenant Registry Overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <AccountField icon={<Building2 size={16} />} label="Registered Company Name" value={tenantName} />
              <AccountField icon={<Terminal size={16} />} label="Isolation Domain Slug Identifier" value={`/${tenantSlug || "unknown"}`} />
            </div>
          </ConfigCard>
        </div>
      )}
    </div>
  );
}

function ConfigCard({ icon, title, children }: any) { return <div className="bg-zinc-900/10 border border-white/5 rounded-[28px] p-6 lg:p-8 backdrop-blur-md hover:border-white/10 transition-all duration-300 focus-within:border-[#d4ff33]/20"><div className="flex items-center gap-2.5 mb-5 text-zinc-400"><span className="text-[#d4ff33]">{icon}</span><h3 className="font-black uppercase tracking-[0.22em] text-[10px] text-zinc-400">{title}</h3></div>{children}</div>; }
function StatusItem({ label, value }: { label: string; value: string }) { return <div className="flex justify-between items-center py-2.5 border-b border-white/[0.02] last:border-0"><span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">{label}</span><span className="text-[11px] text-zinc-300 font-mono font-medium tracking-tight">{value}</span></div>; }
function AccountField({ icon, label, value }: { icon: any; label: string; value: string }) { return <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-xl flex items-start gap-4"><div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg text-zinc-500">{icon}</div><div className="space-y-0.5"><span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block">{label}</span><span className="text-sm font-semibold text-zinc-200 block truncate">{value}</span></div></div>; }