/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/app/dashboard/conversations/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function TenantConversationsDashboard() {
  const [conversations, setConversations] = useState<never[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token"); 
    
    fetch("https://fusion-chat-production.onrender.com/tenant/conversations", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((resPayload) => {
        if (resPayload.success) {
          setConversations(resPayload.data);
        }
      })
      .catch((err) => console.error("Dashboard synchronization failure:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-zinc-500 font-mono text-xs">LOADING AUDIT TRANSCRIPTS...</div>;

  return (
    <div className="p-6 space-y-4 bg-[#0a0a0a] min-h-screen text-white">
      <h2 className="text-xl font-black tracking-tight uppercase italic">Live Conversation Traces</h2>
      
      <div className="grid gap-4">
        {conversations.map((conv:any) => (
          <div key={conv._id} className="bg-zinc-900 border border-white/5 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-white">
                  {conv.fullName || "Anonymous User"}
                </h3>
                <p className="text-xs text-zinc-500">{conv.email || "No email provided"}</p>
                <p className="text-xs text-zinc-500">{conv.phone || "No phone provided"}</p>
              </div>
              <span className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest text-zinc-400">
                {conv.status}
              </span>
            </div>

            <div className="bg-black/40 p-3 rounded-xl border border-white/[0.02]">
              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-black block mb-1">AI Synthesis Insight</span>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">{conv.summary || "Pending analytics calculation..."}</p>
            </div>
          </div>
        ))}
        
        {conversations.length === 0 && (
          <div className="text-zinc-600 text-xs py-8 text-center font-mono">NO ACTIVE CONVERSATIONS LOGGED IN THIS ID SLOT</div>
        )}
      </div>
    </div>
  );
}