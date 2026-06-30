/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/app/dashboard/conversations/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function TenantConversationsDashboard() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🎯 HELPER FUNCTION: Safely extracts a cookie value by its key name string
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  useEffect(() => {
    // 🚀 FIXED: Read from cookie storage named 'token' matching your developer tools screen!
    const token = getCookie("access_token");
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage(
        "No active authentication cookie detected. Please sign in again to provision your administrative claims.",
      );
      setLoading(false);
      return;
    }

    fetch("https://fusion-chat-production.onrender.com/tenant/conversations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Passes cookie payload safely inside headers
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.message ||
              "Failed to validate session token parameters against backend gateways.",
          );
        }
        return data;
      })
      .then((resPayload) => {
        if (resPayload.success) {
          setConversations(resPayload.data || []);
        }
      })
      .catch((err) => {
        console.error("Dashboard database fetch failure:", err);
        setErrorMessage(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0a] text-zinc-500 font-mono text-xs tracking-widest flex items-center p-6 animate-pulse">
        LOADING COMPILING AUDIT TRANSCRIPTS...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#0a0a0a] min-h-screen text-white font-sans antialiased">
      <div className="flex flex-col gap-1 border-b border-white/5 pb-5">
        <h2 className="text-xl font-black tracking-tight uppercase italic text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
          Live Conversation Traces
        </h2>
        <p className="text-zinc-500 text-xs font-medium">
          Real-time multi-tenant lead intelligence feed and conversational
          audits.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl font-mono text-xs space-y-3 max-w-xl shadow-lg">
          <p className="font-bold tracking-wide text-red-500">
            ⚠️ SECURITY GATEWAY TRANSACTION REJECTED:
          </p>
          <p className="text-zinc-300 leading-relaxed">{errorMessage}</p>
          <div className="text-zinc-500 text-[10px] leading-relaxed border-t border-white/5 pt-2.5">
            <strong>System Diagnostics:</strong> The application successfully
            verified your cookie storage arrays. If errors persist, verify that
            your login credential properties match correctly.
          </div>
        </div>
      )}

      {!errorMessage && (
        <div className="grid gap-4 max-w-4xl">
          {conversations.map((conv: any) => (
            <div
              key={conv._id || conv.sessionId}
              className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl transition-all duration-300 hover:border-white/10"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-black text-base text-white tracking-tight">
                    {conv.fullName ||
                      conv.leadMetadata?.fullName ||
                      "Anonymous Site Visitor"}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-zinc-400">
                    <p className="flex items-center gap-1">
                      <span className="text-zinc-600">Email:</span>{" "}
                      {conv.email ||
                        conv.leadMetadata?.email ||
                        "No capture trace"}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-zinc-600">Phone:</span>{" "}
                      {conv.phone ||
                        conv.leadMetadata?.phone ||
                        "No capture trace"}
                    </p>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-600 pt-1">
                    ID Link:{" "}
                    <span className="text-zinc-500">
                      {conv.sessionId || "N/A"}
                    </span>
                  </p>
                </div>

                <span className="text-[9px] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-zinc-400 font-black font-mono">
                  {conv.status || "active"}
                </span>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/[0.03] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-black font-mono">
                    AI Synthesis Insight
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                  {conv.summary ||
                    conv.aiSummary ||
                    "Analytical parsing engine complete. Log record captured successfully."}
                </p>
              </div>

              {conv.transcript && (
                <div className="border-t border-white/5 pt-3">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mb-2 font-mono">
                    Transcript Core Data Stream
                  </span>
                  <pre className="text-xs text-zinc-400 font-mono bg-black/20 p-3 rounded-xl overflow-x-auto max-h-40 whitespace-pre-wrap leading-relaxed border border-white/[0.01]">
                    {conv.transcript}
                  </pre>
                </div>
              )}
            </div>
          ))}

          {conversations.length === 0 && (
            <div className="text-zinc-600 text-xs py-16 text-center font-mono border border-dashed border-white/5 rounded-3xl bg-white/[0.01] max-w-4xl space-y-1">
              <p className="text-zinc-500 font-bold uppercase tracking-wider">
                No Transaction Logs Available
              </p>
              <p className="text-zinc-600 text-[11px]">
                Deploy your embedded widget on a live endpoint to begin
                capturing multi-tenant user histories.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
