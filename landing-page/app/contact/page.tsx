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
      practiceName: formData.get("practiceName"),
      interest: formData.get("interest"),
      leads: formData.get("leads"),
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
        {/* Left Side: Copy & Info */}
        <div className="space-y-12">
          <div>
            <h2 className="text-[#d4ff33] font-mono tracking-widest uppercase text-sm mb-4">
              Connect with Fusion
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-none">
              Ready to <br />
              Automate?
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              We only partner with one practice per neighborhood to ensure
              market exclusivity. Fill out the form to see if your area is still
              available for a Neural Core deployment.
            </p>
          </div>

          <div className="space-y-8 pt-8 border-t border-white/10">
            <div>
              <h4 className="text-white font-bold mb-2">Direct Access</h4>
              <a
                href="mailto:hello@fusionaiagency.com"
                className="block text-zinc-500 hover:text-[#d4ff33] transition-colors"
              >
                hello@fusionaiagency.com
              </a>
              <p className="text-zinc-500">929-769-6545</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">NYC Headquarters</h4>
              <p className="text-zinc-500">11232, NY</p>
            </div>
          </div>
        </div>

        {/* Right Side: High-Intent Form */}
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
                  placeholder="Type Your Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Practice Name
                </label>
                <input
                  name="practiceName"
                  required
                  type="text"
                  placeholder="Type Your Practice Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all"
                />
              </div>{" "}
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Phone Number
                </label>
                <input
                  name="phone"
                  required
                  type="text"
                  placeholder="Type Your phone"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  Email
                </label>
                <input
                  name="email"
                  required
                  type="text"
                  placeholder="Type Your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Select Interest
              </label>
              <div className="relative">
                <select
                  name="interest"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-400 focus:border-[#d4ff33] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option>Neural Core ($499/mo)</option>
                  <option>Growth Engine ($2,490/mo)</option>
                  <option>Enterprise / Multi-Location</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Current Monthly Leads
              </label>
              <input
                name="leads"
                required
                type="text"
                placeholder="e.g. 50-100"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                Message (Optional)
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your current growth bottlenecks..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#d4ff33] outline-none transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4ff33] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#bce62d] hover:shadow-[0_0_30px_rgba(212,255,51,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing Agent..." : "Request Strategy Call"}
            </button>

            {status === "success" && (
              <p className="text-[#d4ff33] text-center text-sm font-mono animate-pulse">
                &gt; Strategy call requested successfully
              </p>
            )}
            {status === "error" && (
              <p className="text-red-500 text-center text-sm font-mono">
                &gt; Error: Use hello@fusionaiagency.com
              </p>
            )}

            <p className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em] mt-4">
              Powered by Fusion Works LLC
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
