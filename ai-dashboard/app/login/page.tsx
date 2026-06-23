/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, KeyRound, Mail } from "lucide-react";
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-nest-backend-app.onrender.com" // Live production Render API link (uses HTTPS)
    : "http://localhost:3003";
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Режимы экрана: 'login' (вход) или 'forgot' (восстановление)
  const [mode, setMode] = useState<"login" | "forgot">("login");

  const [email, setEmail] = useState("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid credentials.");

      // Сохраняем JWT токен в куки
      document.cookie = `access_token=${data.access_token}; path=/; max-age=28800; SameSite=Strict; Secure`;

      toast.success("Access Granted", {
        description: "Decrypting dashboard architecture...",
      });
      router.push("/config");
      router.refresh();
    } catch (err: any) {
      toast.error("Access Denied", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to process recovery request.");

      toast.success("Recovery Link Transmitted", {
        description:
          "Check your secure mailbox container for the reset access key.",
      });
      setMode("login");
    } catch (err: any) {
      toast.error("Recovery Fault", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black selection:bg-[#d4ff33] selection:text-black p-4">
      <div className="w-full max-w-md p-8 md:p-12 bg-zinc-900/40 border border-white/10 rounded-[40px] backdrop-blur-xl shadow-2xl space-y-6 transition-all duration-500">
        {/* Шапка формы в зависимости от режима */}
        <div className="flex flex-col gap-1 text-center mb-2">
          <span className="text-[#d4ff33] text-[10px] font-bold uppercase tracking-[0.2em]">
            {mode === "login" ? "Secure Gateway" : "Identity Recovery"}
          </span>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
            {mode === "login" ? "Fusion AI Access" : "Reset Key Request"}
          </h1>
        </div>

        {mode === "login" ? (
          /* ЭКРАН ВХОДА */
          <form onSubmit={handleLogin} className="space-y-5">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-[10px] text-zinc-500 hover:text-[#d4ff33] transition-colors font-bold uppercase tracking-wider"
                >
                  Forgot Cipher?
                </button>
              </div>
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
              className="w-full h-14 bg-[#d4ff33] text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#c2eb2f] transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_30px_rgba(212,255,51,0.1)]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Authenticating Context..." : "Log In"}
            </button>
          </form>
        ) : (
          /* ЭКРАН ВОССТАНОВЛЕНИЯ ПАРОЛЯ */
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <p className="text-xs text-zinc-500 leading-relaxed text-center">
              Enter your registered corporate email node. We will transmit an
              encrypted pipeline link to override your access credential layers.
            </p>
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

            <button
              className="w-full h-14 bg-[#d4ff33] text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#c2eb2f] transition-all active:scale-[0.98] disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Transmitting..." : "Send Reset Key Link"}
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors pt-2"
            >
              <ArrowLeft size={14} /> Back to Gateway Login
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500">
            Don&apos;t have an infrastructure account?{" "}
            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              className="text-[#d4ff33] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer ml-1 inline-block text-xs"
            >
              Create Workspace
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-xs">
          INITIALIZING INTERACTION MATRIX...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
