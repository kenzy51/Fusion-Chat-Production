"use client";

import { useEffect, useState, useRef } from "react";

interface ChatSession {
  sessionId: string;
  endUserName?: string;
  status: string;
  transcript?: string;
  updatedAt: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatsPage() {
  const currentTenantId = "66708b76e1a47b2c93d9ef12";
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch(
          `http://localhost:3003/sessions?tenantId=${currentTenantId}`,
        );
        const data = await res.json();
        setSessions(data);
        if (data.length > 0) {
          setActiveSessionId(data[0].sessionId);
        }
      } catch (err) {
        console.error("Failed fetching active tenant sessions:", err);
      }
    }
    fetchSessions();
  }, [currentTenantId]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3003/chat-stream");
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);

      if (payload.event === "session_established") {
        console.log("Session initialized:", payload.sessionId);
        setActiveSessionId(payload.sessionId);

        if (payload.greeting) {
          setMessages([{ role: "assistant", content: payload.greeting }]);
        }
      }

      if (payload.event === "ai_response") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: payload.data },
        ]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current || !activeSessionId) return;

    const userMsg: Message = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMsg]);

    const payload = {
      event: "message", // This MUST match the string inside @SubscribeMessage('message') on the backend
      data: {
        tenantId: currentTenantId,
        sessionId: activeSessionId,
        text: inputMessage,
        history: messages.map((m) => ({ role: m.role, content: m.content })), // Keep clean mappings
      },
    };

    socketRef.current.send(JSON.stringify(payload));
    setInputMessage("");
  };
  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden bg-background">
      {/* 📁 SIDEBAR: Live Sessions Feed */}
      <div className="w-1/4 border-r bg-muted/20 overflow-y-auto">
        <div className="p-4 font-semibold border-b">Active Conversations</div>
        <div className="divide-y">
          {sessions.map((session) => (
            <button
              key={session.sessionId}
              onClick={() => setActiveSessionId(session.sessionId)}
              className={`w-full p-4 text-left transition-colors flex flex-col gap-1 ${
                activeSessionId === session.sessionId
                  ? "bg-muted font-medium"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className="truncate">
                {session.endUserName || "Anonymous Web Visitor"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {session.sessionId}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 💬 MAIN VIEW: Selected Session Output Stream */}
      <div className="flex-1 flex flex-col justify-between bg-card">
        {activeSessionId ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b font-medium bg-muted/10">
              Active Session:{" "}
              <span className="text-sm font-mono text-muted-foreground">
                {activeSessionId}
              </span>
            </div>

            {/* Conversation Core Frame */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Bar Entry Point */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t flex gap-2 bg-background"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a live chat session thread from the panel to view the
            transcription stream.
          </div>
        )}
      </div>
    </div>
  );
}
