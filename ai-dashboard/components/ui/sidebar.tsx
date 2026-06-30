"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {  ChevronLeft, ChevronRight, Cpu, LogOut,MessageCircle  } from "lucide-react";
import { BASE_URL } from "@/app/login/page";

const menuItems = [
  { name: "Bot Config", icon: Cpu, href: "/config" }, 
  { name: "Conversations", icon: MessageCircle, href: "/conversations" }, 
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [profile, setProfile] = useState({
    businessName: "Loading...",
    adminName: "Admin Node",
    adminEmail: "syncing..."
  });

  useEffect(() => {
    const fetchCompleteProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${BASE_URL}/tenant/config`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          
          // 🎯 EXTRACT NESTED DATA PROPERTIES SECURELY:
          setProfile({
            businessName: data.name || "My Workspace",
            adminName: data.user?.name || "Admin User",
            adminEmail: data.user?.email || ""
          });
        }
      } catch (err) {
        console.error("Profile synchronization extraction crashed:", err);
      }
    };

    fetchCompleteProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
    router.push("/login");
  };

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "FX";

  return (
    <div className={`relative bg-zinc-900/40 backdrop-blur-xl flex flex-col p-4 gap-4 text-zinc-400 border border-white/10 rounded-[40px] h-[98vh] mt-2 ml-2 shadow-2xl transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[280px]"}`}>
      
      {/* COLLAPSE TOGGLE */}
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-12 bg-[#d4ff33] text-black rounded-full p-1 shadow-lg hover:scale-110 transition-transform z-50">
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* BRAND HOOK */}
      <div className={`px-4 py-2 mb-2 ${isCollapsed ? "text-center" : ""}`}>
        <h2 className="text-[#d4ff33] text-2xl font-bold lowercase tracking-tighter">
          {isCollapsed ? "f" : "fusion AI"}
        </h2>
      </div>

      {/* NAVIGATION LINKS */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center rounded-2xl transition-all group relative ${isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3"} ${isActive ? "bg-[#1a1a1a] text-zinc-100" : "hover:bg-[#151515] text-zinc-400"}`}>
              <div className="flex items-center gap-4">
                <item.icon className={`h-5 w-5 min-w-[20px] ${isActive ? "text-[#d4ff33]" : "group-hover:text-zinc-100"}`} />
                {!isCollapsed && <span className="text-[15px] font-medium">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* DYNAMIC PROFILE MATRIX FOOTER */}
      <div className="mt-auto pt-4 border-t border-zinc-800/50 space-y-2">
        <div className={`flex items-center gap-3 rounded-2xl ${isCollapsed ? "justify-center py-2" : "px-3 py-2"}`}>
          
          {/* Avatar badges dynamically matching your business initials */}
          <div className="w-10 h-10 min-w-[40px] rounded-full bg-gradient-to-tr from-[#d4ff33]/20 to-zinc-800 border border-[#d4ff33]/10 flex items-center justify-center text-[#d4ff33] text-xs font-black tracking-wider">
            {getInitials(profile.businessName)}
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden flex-1">
              {/* 🏢 Business Name */}
              <span className="text-xs font-black text-[#d4ff33] uppercase tracking-wider truncate mb-0.5">
                {profile.businessName}
              </span>
              {/* 👤 Personal User Name */}
              <span className="text-sm font-semibold text-zinc-100 truncate leading-tight">
                {profile.adminName}
              </span>
              {/* ✉️ Corporate Email */}
              <span className="text-[11px] text-zinc-500 truncate font-mono mt-0.5">
                {profile.adminEmail}
              </span>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button onClick={handleLogout} className={`flex items-center gap-4 w-full rounded-2xl py-3 px-4 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all group ${isCollapsed ? "justify-center" : ""}`}>
          <LogOut className="h-5 w-5 min-w-[20px] group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span className="text-[14px] font-semibold">Log out</span>}
        </button>
      </div>

    </div>
  );
}