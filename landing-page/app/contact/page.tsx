/* eslint-disable react/jsx-no-comment-textnodes */
"use client";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      businessName: formData.get("businessName"),
      interest: formData.get("interest"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#09090b] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Copy & Sandbox Info Context */}
        <div className="space-y-12">
          <div>
            <h2 className="text-[#d4ff33] font-mono tracking-widest uppercase text-sm mb-4">
              Connect with Fusion Chat
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-none">
              Deploy Your <br />
              AI Pipeline.
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              Integrate premium low-latency chat widgets into your multi-tenant ecosystem. Choose a pricing tire or request an isolated staging node.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 max-w-md space-y-3">
            <span className="text-[#d4ff33] font-mono text-[10px] uppercase tracking-widest block">
              // Sandbox Free Tier Rule Matrix
            </span>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Selecting the **Sandbox Free** tier requires a valid business domain email (e.g., <code className="text-white font-mono">name@yourcompany.com</code>). Individual generic web emails (Gmail/Yahoo) tracking free submissions are rejected by our automated filters to preserve platform cluster security resources.
            </p>
          </div>

          <div className="space-y-8 pt-8 border-t border-white/10">
            <div>
              <h4 className="text-white font-bold mb-2">Direct Communications</h4>
              <a
                href="mailto:hello@getfusionchat.com"
                className="block text-zinc-500 hover:text-[#d4ff33] transition-colors font-mono text-sm"
              >
                hello@getfusionchat.com
              </a>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">System Core Origin</h4>
              <p className="text-zinc-500 font-mono text-sm">New York City, NY</p>
            </div>
          </div>
        </div>

        {/* Right Side: High-Intent Multi-Tenant Inbound Form */}
        <div className="bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  name="fullName"
                  required
                  type="text"
                  placeholder="Your Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Business Name
                </label>
                <input
                  name="businessName"
                  required
                  type="text"
                  placeholder="Your Practice/Company"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all text-sm"
                />
              </div>{" "}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Phone Number
                </label>
                <input
                  name="phone"
                  required
                  type="tel"
                  placeholder="Your Contact Number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Corporate Email
                </label>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="name@business.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* 🛠️ UPDATED SELECT MENU INCORPORATING TARGET PRICING TIERS */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Target Platform Architecture Tier
              </label>
              <div className="relative">
                <select
                  name="interest"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-zinc-300 focus:border-[#d4ff33] outline-none transition-all appearance-none cursor-pointer text-sm"
                >
                  <option value="free">Sandbox Free (Verification Assessment Required)</option>
                  <option value="pro">Fusion Chat Pro ($20/mo Core Solution)</option>
                  <option value="elite">Voice & Chat Elite ($249/mo Full Pipeline)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Operational Context & Integrations
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your tech stack, layout tools, or internal CRM targets..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all resize-none text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4ff33] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#bce62d] hover:shadow-[0_0_30px_rgba(212,255,51,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Processing Secure Metrics..." : "Initialize Deployment Protocol"}
            </button>

            {status === "success" && (
              <p className="text-[#d4ff33] text-center text-sm font-mono animate-pulse">
                &gt; Request successfully routed to pipeline ingest.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-center text-sm font-mono">
                &gt; Critical Error: Use hello@getfusionchat.com
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}