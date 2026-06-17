/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const BASE_URL = "http://localhost:3003";

    try {
      // 1. Создаем организацию (Tenant) и пользователя (User)
      const registerRes = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, name, email, password }),
      });

      const registerData = await registerRes.json();
      if (!registerRes.ok) throw new Error(registerData.message || "Registration phase rejected.");

      // 🎯 АВТОВХОД: Скрыто запрашиваем токен, так как аккаунт только что создался успешно
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();
      
      if (loginRes.ok && loginData.access_token) {
        // Записываем токен напрямую в куки для обхода ручного логина
        document.cookie = `access_token=${loginData.access_token}; path=/; max-age=28800; SameSite=Strict; Secure`;
        
        toast.success("Workspace Configured", { description: "Auto-authenticating root node..." });
        router.push("/config"); // Мгновенный переход во внутреннюю панель
        router.refresh();
      } else {
        // Резервный вариант, если автологин не прошёл: отправляем на страницу входа
        toast.success("Account Ready", { description: "Redirection to manual credential gateway..." });
        router.push("/login?registered=true");
      }

    } catch (err: any) {
      toast.error("Provisioning Aborted", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? "Compiling Node Parameters..." : "Initialize Tenant Cluster"}
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