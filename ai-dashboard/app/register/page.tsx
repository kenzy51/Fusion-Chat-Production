/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Clock, Mail } from "lucide-react";
import { BASE_URL } from "../login/page";

export default function RegisterPage() {
  const router = useRouter();
  
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // 🚀 TRACK SUBMISSION STATE

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      // 1. Send registration payload parameters to the backend cluster
      const registerRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, name, email, password }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.message || "Registration phase rejected.");

      // 🎯 MODIFIED: Do not log in or set cookies. Set submitted true to toggle the pending UI screen.
      setIsSubmitted(true);
      toast.success("Request Submitted", { 
        description: "Your infrastructure allocation is queuing for security verification." 
      });

    } catch (err: any) {
      toast.error("Provisioning Aborted", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 🚀 PENDING STATE SCREEN CONTAINER (Renders right after form succeeds)
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 selection:bg-[#d4ff33] selection:text-black">
        <div className="w-full max-w-xl p-8 md:p-12 bg-zinc-900/40 border border-white/10 rounded-[40px] backdrop-blur-xl shadow-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-20 h-20 bg-[#d4ff33]/10 border border-[#d4ff33]/20 text-[#d4ff33] rounded-full flex items-center justify-center relative">
            <Clock size={36} className="animate-pulse" />
            <ShieldCheck size={18} className="absolute bottom-1 right-1 bg-black text-[#d4ff33] rounded-full p-0.5" />
          </div>

          <div className="space-y-3">
            <span className="text-[#d4ff33] text-[10px] font-bold uppercase tracking-[0.25em]">Workspace Security Protocol</span>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Application Pending Review</h1>
            <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed pt-2">
              An administrator is currently validating your workspace allocation request. We will review your corporate parameters and transmit an onboarding configuration email to <span className="text-zinc-200 font-mono text-xs border-b border-zinc-800 pb-0.5">{email}</span> shortly.
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => (window.location.href = "/login")}
              className="px-6 h-12 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-bold uppercase tracking-wider hover:text-white hover:border-zinc-700 transition-colors"
            >
              Return to Gateway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4 selection:bg-[#d4ff33] selection:text-black">
      <form 
        onSubmit={handleRegister}
        className="w-full max-w-xl p-8 md:p-12 bg-zinc-900/40 border border-white/10 rounded-[40px] backdrop-blur-xl shadow-2xl space-y-6"
      >
        <div className="flex flex-col gap-1 text-center mb-2">
          <span className="text-[#d4ff33] text-[10px] font-bold uppercase tracking-[0.2em]">Infrastructure Provisioner</span>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Deploy New Node</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Workspace / Company Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Acme Corp"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white text-sm focus:outline-none focus:border-[#d4ff33] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Root Admin Name</label>
            <input
              type="text"
              placeholder="Alex Mercer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white text-sm focus:outline-none focus:border-[#d4ff33] transition-colors"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Corporate Email Address</label>
            <input
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white text-sm focus:outline-none focus:border-[#d4ff33] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Security Access Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white text-sm focus:outline-none focus:border-[#d4ff33] transition-colors"
              required
            />
          </div>
        </div>

        <button
          className="w-full h-14 bg-[#d4ff33] text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#c2eb2f] transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_30px_rgba(212,255,51,0.15)]"
          type="submit"
          disabled={loading}
        >
          {loading ? "Compiling Node Parameters..." : "Request Access Review"}
        </button>

        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500">
            Already running an active node?{" "}
            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
              className="text-[#d4ff33] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer ml-1 text-xs"
            >
              Sign In Instead
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}