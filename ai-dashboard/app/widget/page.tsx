/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef, Suspense } from "react"; // 🚀 Added Suspense
import { useSearchParams } from "next/navigation";
import { Bot, Send } from "lucide-react";

// 1. 🛡️ The Main Export Wrapped with a Suspense Container Layer
export default function StandalonePublicWidgetPage() {
  return (
    <Suspense 
      fallback={
        <div className="w-screen h-screen bg-[#0a0a0a] text-zinc-500 font-mono text-[10px] tracking-widest flex items-center justify-center animate-pulse">
          INITIALIZING SECURE ENVIRONMENT...
        </div>
      }
    >
      <WidgetContent />
    </Suspense>
  );
}

// 2. 🧠 Move your entire actual logic engine right down here
function WidgetContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const BASE_URL = "https://fusion-chat-production.onrender.com";

  const [config, setConfig] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;

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
      })
      .catch((err) => console.error("Widget layout configuration failure:", err));
  }, [slug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !slug) return;

    const userMsg = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsBotTyping(true);

    try {
      const res = await fetch(`${BASE_URL}/public-tenant/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage, slug }),
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
      <div className="w-screen h-screen bg-[#0a0a0a] text-zinc-500 font-mono text-[10px] tracking-widest flex items-center justify-center animate-pulse">
        CONNECTING CHAT MATRIX LAYER...
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: config.backgroundColor || "#0a0a0a" }}
      className="w-screen h-screen flex flex-col overflow-hidden font-sans antialiased"
    >
      {/* HEADER BANNER LAYER */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
        <div
          style={{
            backgroundColor: `${config.primaryColor || "#d4ff33"}20`,
            color: config.primaryColor || "#d4ff33",
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Bot size={16} />
        </div>
        <div>
          <h4
            style={{ color: config.textColor || "#ffffff" }}
            className="text-xs font-black tracking-tight"
          >
            {config.widgetTitle || "AI Assistant"}
          </h4>
          <span className="text-[9px] text-zinc-500 font-bold uppercase flex items-center gap-1 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
            Agent Online
          </span>
        </div>
      </div>

      {/* TRANSCRIPT CONTEXT WINDOW TRACK */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none bg-black/10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              style={
                msg.role === "user"
                  ? {
                      backgroundColor: config.primaryColor || "#d4ff33",
                      color: "#000000",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: config.textColor || "#ffffff",
                    }
              }
              className="max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm"
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex justify-start">
            <div
              style={{ color: config.textColor || "#ffffff" }}
              className="bg-white/[0.04] rounded-2xl px-4 py-3 font-mono text-[9px] tracking-[0.2em] opacity-40 animate-pulse"
            >
              THINKING...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ACTIONS SUBMISSION FOOTER CONTAINER */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-white/5 bg-white/[0.01] flex gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ color: config.textColor || "#ffffff" }}
          className="flex-1 bg-zinc-950/80 border border-white/5 rounded-xl px-3.5 text-xs outline-none focus:border-white/10 transition-all"
        />
        <button
          type="submit"
          style={{ backgroundColor: config.primaryColor || "#d4ff33" }}
          className="p-3 rounded-xl text-black hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-lg"
        >
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}