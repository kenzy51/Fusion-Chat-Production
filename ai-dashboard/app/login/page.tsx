"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link"; // 🎯 Imported for seamless routing

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(""); // Changed from username to email to match backend
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Workspace Provisioned!", {
        description:
          "Your infrastructure is ready. Log in to access your dashboard.",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const BASE_URL = "http://localhost:3003";

      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials for Fusion AI.");
      }

      document.cookie = `access_token=${data.access_token}; path=/; max-age=28800; SameSite=Strict; Secure`;
      toast.success("Access Granted", {
        description: "Decrypting dashboard architecture...",
      });

      // Send them straight into the platform core workspace
      router.push("/dashboard/chats");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Access Denied", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black selection:bg-[#d4ff33] selection:text-black p-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 md:p-12 bg-zinc-900/40 border border-white/10 rounded-[40px] space-y-6 w-full max-w-md backdrop-blur-xl shadow-2xl"
      >
        <div className="flex flex-col gap-1 text-center mb-2">
          <span className="text-[#d4ff33] text-[10px] font-bold uppercase tracking-[0.2em]">
            Secure Gateway
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tighter">
            Fusion AI Access
          </h1>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Corporate Email
          </label>
          <input
            type="email"
            placeholder="alex@company.com"
            value={email}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white font-medium text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff33] transition-colors"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white font-medium text-sm placeholder:text-zinc-600 focus:outline-none focus:border-[#d4ff33] pr-12 transition-colors"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          className="w-full h-14 bg-[#d4ff33] text-black text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-[#c2eb2f] transition-all active:scale-[0.98] disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Authenticating Context..." : "Log In"}
        </button>
        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500">
            Don&apos;t have an infrastructure account?{" "}
            <button
              type="button"
              onClick={() => (window.location.href = "/register")} // 🚀 Hard window reload bypasses middleware query strings!
              className="text-[#d4ff33] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer ml-1 inline-block text-xs"
            >
              Create Workspace
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
