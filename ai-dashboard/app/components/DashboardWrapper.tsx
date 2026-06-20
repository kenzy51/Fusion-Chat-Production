/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Client-side cookie helper
const checkSessionCookie = () => {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("access_token=");
};

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasToken, setHasToken] = useState(false);
  const pathname = usePathname(); // 🎯 Triggers layout re-evaluations whenever paths/sessions mutate

  useEffect(() => {
    // Re-check cookie states on page transitions or logouts
    setHasToken(checkSessionCookie());
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {hasToken ? (
        // 🛡️ AUTHENTICATED WORKSPACE LAYOUT
        <>
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto">
            <div className="w-full h-full flex flex-col">
              <div className="max-w-6xl mx-auto w-full p-8 pb-0 uppercase tracking-wider text-[10px] font-bold text-zinc-500">
                Overview / 2026 Marketing
              </div>
              {children}
            </div>
          </main>
        </>
      ) : (
        // 🔓 UN-AUTHENTICATED LAYOUT (Login / Register / Public Widgets)
        <main className="flex-1 h-screen overflow-y-auto w-full h-full">
          {children}
        </main>
      )}
    </div>
  );
}