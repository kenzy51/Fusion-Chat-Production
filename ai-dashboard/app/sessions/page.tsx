// frontend/app/sessions/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "@/app/login/page";

interface ChatSession {
  _id?: string;
  sessionId: string;
  endUserName?: string;
  fullName?: string;
  email?: string;
  status?: string;
  channel?: string;
  messageCount?: number;
  transcript?: string;
  lastMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 🎯 HELPER: Safely extract a cookie value by its key name
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

const formatTimestamp = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  open: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  closed: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
  resolved: "bg-sky-500/10 border-sky-500/20 text-sky-400",
  pending: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const token = getCookie("access_token") || localStorage.getItem("access_token");
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setErrorMessage(
        "No active authentication cookie detected. Please sign in again to provision your administrative claims.",
      );
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/tenant/sessions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
        // Accept several common response envelopes from the gateway.
        const list = Array.isArray(resPayload)
          ? resPayload
          : resPayload.data || resPayload.sessions || [];
        setSessions(list);
      })
      .catch((err) => {
        console.error("Sessions database fetch failure:", err);
        setErrorMessage(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredSessions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sessions.filter((session) => {
      const matchesStatus =
        statusFilter === "all" ||
        (session.status || "active").toLowerCase() === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      const haystack = [
        session.sessionId,
        session.endUserName,
        session.fullName,
        session.email,
        session.lastMessage,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [sessions, query, statusFilter]);

  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => set.add((s.status || "active").toLowerCase()));
    return ["all", ...Array.from(set)];
  }, [sessions]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0a0a0a] text-zinc-500 font-mono text-xs tracking-widest flex items-center p-6 animate-pulse">
        LOADING SYNCING ACTIVE SESSION REGISTRY...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[#0a0a0a] min-h-screen text-white font-sans antialiased">
      <div className="flex flex-col gap-1 border-b border-white/5 pb-5">
        <h2 className="text-xl font-black tracking-tight uppercase italic text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4ff33] animate-pulse" />{" "}
          Live Session Registry
        </h2>
        <p className="text-zinc-500 text-xs font-medium">
          Real-time index of every conversational session running against your
          deployed agents.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl font-mono text-xs space-y-3 max-w-xl shadow-lg">
          <p className="font-bold tracking-wide text-red-500">
            ⚠️ SECURITY GATEWAY TRANSACTION REJECTED:
          </p>
          <p className="text-zinc-300 leading-relaxed">{errorMessage}</p>
          <div className="text-zinc-500 text-[10px] leading-relaxed border-t border-white/5 pt-2.5">
            <strong>System Diagnostics:</strong> The application verified your
            cookie storage arrays. If errors persist, confirm your login
            credential properties match correctly.
          </div>
        </div>
      )}

      {!errorMessage && (
        <>
          {/* SUMMARY STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl">
            <StatCard label="Total Sessions" value={sessions.length} />
            <StatCard
              label="Active"
              value={
                sessions.filter(
                  (s) =>
                    (s.status || "active").toLowerCase() === "active" ||
                    (s.status || "").toLowerCase() === "open",
                ).length
              }
              accent
            />
            <StatCard
              label="Total Messages"
              value={sessions.reduce((sum, s) => sum + (s.messageCount || 0), 0)}
            />
            <StatCard label="Showing" value={filteredSessions.length} />
          </div>

          {/* CONTROLS */}
          <div className="flex flex-wrap items-center gap-3 max-w-4xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email or session id..."
              className="flex-1 min-w-[220px] bg-zinc-900/40 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff33]/40 transition-colors"
            />
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setStatusFilter(option)}
                  className={`text-[10px] uppercase tracking-widest font-black font-mono px-3 py-2 rounded-full border transition-colors ${
                    statusFilter === option
                      ? "bg-[#d4ff33] text-black border-[#d4ff33]"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/20"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* SESSION GRID */}
          <div className="grid gap-4 max-w-4xl">
            {filteredSessions.map((session) => {
              const status = (session.status || "active").toLowerCase();
              const badgeStyle =
                statusStyles[status] ||
                "bg-white/5 border-white/10 text-zinc-400";
              return (
                <div
                  key={session._id || session.sessionId}
                  className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl transition-all duration-300 hover:border-white/10"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-white tracking-tight">
                        {session.endUserName ||
                          session.fullName ||
                          "Anonymous Site Visitor"}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-zinc-400">
                        {session.email && (
                          <p className="flex items-center gap-1">
                            <span className="text-zinc-600">Email:</span>{" "}
                            {session.email}
                          </p>
                        )}
                        <p className="flex items-center gap-1">
                          <span className="text-zinc-600">Channel:</span>{" "}
                          {session.channel || "web-widget"}
                        </p>
                        <p className="flex items-center gap-1">
                          <span className="text-zinc-600">Messages:</span>{" "}
                          {session.messageCount ?? 0}
                        </p>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-600 pt-1">
                        Session ID:{" "}
                        <span className="text-zinc-500">
                          {session.sessionId || "N/A"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-[9px] border px-3 py-1 rounded-full uppercase tracking-widest font-black font-mono ${badgeStyle}`}
                      >
                        {status}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600">
                        {formatTimestamp(session.updatedAt || session.createdAt)}
                      </span>
                    </div>
                  </div>

                  {(session.lastMessage || session.transcript) && (
                    <div className="bg-black/50 p-4 rounded-2xl border border-white/[0.03] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff33]" />
                        <span className="text-[9px] uppercase tracking-widest text-[#d4ff33] font-black font-mono">
                          Latest Exchange
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium leading-relaxed line-clamp-3">
                        {session.lastMessage ||
                          session.transcript ||
                          "No message payload captured for this session yet."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredSessions.length === 0 && (
              <div className="text-zinc-600 text-xs py-16 text-center font-mono border border-dashed border-white/5 rounded-3xl bg-white/[0.01] max-w-4xl space-y-1">
                <p className="text-zinc-500 font-bold uppercase tracking-wider">
                  {sessions.length === 0
                    ? "No Active Sessions Available"
                    : "No Sessions Match Your Filters"}
                </p>
                <p className="text-zinc-600 text-[11px]">
                  {sessions.length === 0
                    ? "Deploy your embedded widget on a live endpoint to begin capturing conversational sessions."
                    : "Adjust your search query or status filter to widen the result set."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-lg">
      <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black font-mono">
        {label}
      </p>
      <p
        className={`text-2xl font-black tracking-tight mt-1 ${
          accent ? "text-[#d4ff33]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}