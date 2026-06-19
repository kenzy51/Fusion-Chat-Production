import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/ui/sidebar";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Ai Dashboard",
  description: "Fusion Ai",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🎯 READ LIVE COOKIES: Grab the custom token your login form sets
  const cookieStore = await cookies();
  const hasSessionToken = cookieStore.has("access_token");
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white font-sans">
        <Providers>
          <div className="flex min-h-screen">
            {hasSessionToken ? (
              // 🛡️ DYNAMIC SECURED DASHBOARD WRAPPER
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
              // 🔓 PUBLIC VIEWING CONTAINER (Login / Register Gates)
              <main className="flex-1 h-screen overflow-y-auto w-full h-full">
                {children}
              </main>
            )}
          </div>
        </Providers>
        <Toaster theme="dark" position="bottom-right" closeButton richColors />
      </body>
    </html>
  );
}
