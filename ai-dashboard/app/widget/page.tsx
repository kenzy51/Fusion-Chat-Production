/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Send, User, Phone, Mail, ArrowRight } from "lucide-react";

export default function StandalonePublicWidgetPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-screen h-screen bg-[#0a0a0a] text-zinc-500 font-mono text-xs tracking-widest flex items-center justify-center animate-pulse">
          INITIALIZING SECURE ENVIRONMENT...
        </div>
      }
    >
      <WidgetContent />
    </Suspense>
  );
}

// 🚀 CHAT TRANSCRIPT RICH LAYOUT PARSER
function FormattedMessage({ content, primaryColor }: { content: string; primaryColor: string }) {
  if (!content) return null;
  const lines = content.split("\n");
  const stripMarkdownTokens = (text: string) => text.replace(/\*\*/g, "").trim();

  return (
    <div className="space-y-3 text-sm md:text-base leading-relaxed tracking-wide">
      {lines.map((line, lineIdx) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <div key={lineIdx} className="h-2" />;

        if (trimmedLine.startsWith("**") && trimmedLine.endsWith("**")) {
          return (
            <h5 key={lineIdx} className="font-black text-white text-base md:text-lg tracking-tight mt-4 mb-1 block first:mt-0">
              {stripMarkdownTokens(trimmedLine)}
            </h5>
          );
        }

        if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*") || trimmedLine.startsWith("•")) {
          const cleanListText = stripMarkdownTokens(trimmedLine.replace(/^[-*•]\s*/, ""));
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-1 my-1">
              <span style={{ color: primaryColor }} className="text-base font-bold mt-0.5 leading-none">•</span>
              <span className="flex-1 font-medium">{cleanListText}</span>
            </div>
          );
        }

        if (trimmedLine.includes("**")) {
          const blocks = trimmedLine.split(/\*\*([\s\S]*?)\*\*/g);
          return (
            <p key={lineIdx} className="font-medium">
              {blocks.map((block, bIdx) => (
                <span key={bIdx} className={bIdx % 2 === 1 ? "font-bold text-white font-black" : ""}>
                  {block}
                </span>
              ))}
            </p>
          );
        }

        return <p key={lineIdx} className="font-medium">{trimmedLine}</p>;
      })}
    </div>
  );
}

function WidgetContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const BASE_URL = "https://fusion-chat-production.onrender.com";

  const [config, setConfig] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  
  // 🚀 LEAD GATEWAY MANAGEMENT FLAGS
  const [showFormGate, setShowFormGate] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;

    // Pull or track session tokens directly from persistent storage
    let currentConversationId = localStorage.getItem(`fusion_conv_${slug}`);
    if (!currentConversationId) {
      currentConversationId = crypto.randomUUID();
      localStorage.setItem(`fusion_conv_${slug}`, currentConversationId);
    }

    fetch(`${BASE_URL}/public-tenant/${slug}/widget-config`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setMessages([
          {
            role: "assistant",
            content: data.greeting || "Hello! How can I assist you today?",
          },
        ]);

        // Evaluate whether the visual lead input card overlay should trigger on-screen
        const savedGateStatus = localStorage.getItem(`fusion_gate_passed_${slug}`);
        if (data.leadFormPolicy && data.leadFormPolicy !== 'disabled' && !savedGateStatus) {
          setShowFormGate(true);
        }
      })
      .catch((err) => console.error("Widget layout configuration failure:", err));
  }, [slug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  // Handles execution when the customer completes or skips the entrance gateway parameters
  const handleFormSubmit = async (e?: React.FormEvent, isSkipped: boolean = false) => {
    if (e) e.preventDefault();
    if (!slug) return;

    const conversationId = localStorage.getItem(`fusion_conv_${slug}`);
    setIsSubmittingForm(true);

    const payload = isSkipped ? {} : { fullName, phone, email };

    try {
      await fetch(`${BASE_URL}/public-tenant/initialize-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug: slug,
          conversationId,
          formData: isSkipped ? undefined : payload
        })
      });

      localStorage.setItem(`fusion_gate_passed_${slug}`, "true");
      setShowFormGate(false);
    } catch (err) {
      console.error("Failed to commit lead context state layer data:", err);
      // Failsafe bypass to protect continuous interaction
      setShowFormGate(false);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !slug) return;

    const conversationId = localStorage.getItem(`fusion_conv_${slug}`);
    const userMsg = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsBotTyping(true);

    try {
      const res = await fetch(`${BASE_URL}/public-tenant/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: inputMessage, 
          slug,
          conversationId,
          history: messages
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      }
    } catch (err) {
      console.error("Message processing pipeline error:", err);
    } finally {
      setIsBotTyping(false);
    }
  };

  if (!config) {
    return (
      <div className="w-screen h-screen bg-[#0a0a0a] text-zinc-500 font-mono text-xs tracking-widest flex items-center justify-center animate-pulse">
        CONNECTING CHAT MATRIX LAYER...
      </div>
    );
  }

  const primaryColor = config.primaryColor || "#d4ff33";

  return (
    <div
      style={{ backgroundColor: config.backgroundColor || "#0a0a0a" }}
      className="w-screen h-screen flex flex-col overflow-hidden font-sans antialiased relative"
    >
      {/* 🔒 STRUCTURAL FORM GATE LAYER OVERLAY */}
      {showFormGate && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-6 transition-all duration-500 animate-fade-in">
          <div className="w-full max-w-[400px] bg-zinc-900/90 border border-white/5 p-6 rounded-[2.5rem] shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }} className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bot size={22} />
              </div>
              <h3 className="text-xl font-black tracking-tight text-white uppercase italic">Initialize System Node</h3>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                {config.leadFormPolicy === 'mandatory' 
                  ? "Please anchor your verification details to begin active conversational diagnostics." 
                  : "Provide your details to connect with a pipeline agent, or skip to chat anonymously."}
              </p>
            </div>

            <form onSubmit={(e) => handleFormSubmit(e, false)} className="space-y-3 pt-2">
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="text" 
                  required 
                  placeholder="Full Name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                />
              </div>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="tel" 
                  placeholder="Phone Number (Optional)" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="email" 
                  placeholder="Business Email (Optional)" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingForm}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-3.5 rounded-xl text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
              >
                Launch Protocol <ArrowRight size={14} />
              </button>

              {config.leadFormPolicy === 'optional' && (
                <button
                  type="button"
                  disabled={isSubmittingForm}
                  onClick={() => handleFormSubmit(undefined, true)}
                  className="w-full text-center text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors pt-2 block border border-transparent hover:border-white/5 py-2 rounded-xl bg-white/[0.01]"
                >
                  Skip & Chat Anonymously
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* HEADER BANNER LAYER */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
        <div
          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <Bot size={18} />
        </div>
        <div>
          <h4 style={{ color: config.textColor || "#ffffff" }} className="text-sm font-black tracking-tight">
            {config.widgetTitle || "AI Assistant"}
          </h4>
          <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Agent Online
          </span>
        </div>
      </div>

      {/* TRANSCRIPT CONTEXT WINDOW TRACK */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none bg-black/10">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              style={
                msg.role === "user"
                  ? { backgroundColor: primaryColor, color: "#000000" }
                  : { backgroundColor: "rgba(255,255,255,0.04)", color: config.textColor || "#ffffff" }
              }
              className="max-w-[88%] rounded-2xl px-4 py-3 shadow-md border border-white/5"
            >
              {msg.role === "user" ? (
                <p className="text-sm md:text-base font-semibold leading-relaxed">{msg.content}</p>
              ) : (
                <FormattedMessage content={msg.content} primaryColor={primaryColor} />
              )}
            </div>
          </div>
        ))}
        
        {isBotTyping && (
          <div className="flex justify-start">
            <div
              style={{ color: config.textColor || "#ffffff" }}
              className="bg-white/[0.04] border border-white/5 rounded-2xl px-5 py-3.5 font-mono text-[10px] tracking-[0.25em] opacity-40 animate-pulse"
            >
              THINKING...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ACTIONS SUBMISSION FOOTER CONTAINER */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/[0.01] flex gap-3">
        <input
          type="text"
          value={inputMessage}
          disabled={showFormGate}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={showFormGate ? "Awaiting node authentication..." : "Type a message..."}
          style={{ color: config.textColor || "#ffffff" }}
          className="flex-1 bg-zinc-950/80 border border-white/5 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/10 transition-all placeholder:text-zinc-600 disabled:opacity-30"
        />
        <button
          type="submit"
          disabled={showFormGate}
          style={{ backgroundColor: primaryColor }}
          className="p-4 rounded-xl text-black hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-lg cursor-pointer disabled:opacity-30"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}