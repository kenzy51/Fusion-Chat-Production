/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, Send } from "lucide-react";

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

// 🚀 PRODUCTION-READY RICH LAYOUT PARSER FOR AI ANSWERS
function FormattedMessage({ content, primaryColor }: { content: string; primaryColor: string }) {
  if (!content) return null;

  // Split text by lines to parse headers, paragraphs, and list arrays cleanly
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm md:text-base leading-relaxed tracking-wide">
      {lines.map((line, lineIdx) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          return <div key={lineIdx} className="h-2" />;
        }

        // 1. Detect Bullet Arrays/Lists (starting with '-', '*', or '•')
        if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*") || trimmedLine.startsWith("•")) {
          const rawText = trimmedLine.replace(/^[-*•]\s*/, "");
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2 my-1">
              <span style={{ color: primaryColor }} className="text-sm font-bold mt-0.5">•</span>
              <span className="flex-1">{renderBoldText(rawText)}</span>
            </div>
          );
        }

        // 2. Standard block parsing with potential bold elements
        return (
          <p key={lineIdx} className="block">
            {renderBoldText(trimmedLine)}
          </p>
        );
      })}
    </div>
  );
}

// Helper to find and parse **Title** or **Bold Text** tags natively inside strings
function renderBoldText(text: string) {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  return parts.map((part, i) => {
    // Alternate tokens represent matching chunks inside the regex blocks
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-extrabold text-white text-base md:text-lg block mt-3 mb-1 first:mt-0 tracking-tight">
          {part}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

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
      <div className="w-screen h-screen bg-[#0a0a0a] text-zinc-500 font-mono text-xs tracking-widest flex items-center justify-center animate-pulse">
        CONNECTING CHAT MATRIX LAYER...
      </div>
    );
  }

  const primaryColor = config.primaryColor || "#d4ff33";

  return (
    <div
      style={{ backgroundColor: config.backgroundColor || "#0a0a0a" }}
      className="w-screen h-screen flex flex-col overflow-hidden font-sans antialiased"
    >
      {/* HEADER BANNER LAYER */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
        <div
          style={{
            backgroundColor: `${primaryColor}20`,
            color: primaryColor,
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center"
        >
          <Bot size={18} />
        </div>
        <div>
          <h4
            style={{ color: config.textColor || "#ffffff" }}
            className="text-sm font-black tracking-tight"
          >
            {config.widgetTitle || "AI Assistant"}
          </h4>
          <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
            Agent Online
          </span>
        </div>
      </div>

      {/* TRANSCRIPT CONTEXT WINDOW TRACK */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-none bg-black/10">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              style={
                msg.role === "user"
                  ? {
                      backgroundColor: primaryColor,
                      color: "#000000",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: config.textColor || "#ffffff",
                    }
              }
              // 🚀 Sizing optimized: switched padding and sizes to text-sm/text-base layouts
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
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-white/5 bg-white/[0.01] flex gap-3"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ color: config.textColor || "#ffffff" }}
          className="flex-1 bg-zinc-950/80 border border-white/5 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/10 transition-all placeholder:text-zinc-600"
        />
        <button
          type="submit"
          style={{ backgroundColor: primaryColor }}
          className="p-4 rounded-xl text-black hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-lg cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}