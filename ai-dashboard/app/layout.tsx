import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import DashboardWrapper from "./components/DashboardWrapper";

export const metadata: Metadata = {
  title: "Ai Dashboard",
  description: "Fusion Ai",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white font-sans">
        <Providers>
          {/* 🎯 Wrap your application inside a dynamic client-side shell */}
          <DashboardWrapper>
            {children}
          </DashboardWrapper>
        </Providers>
        <Toaster theme="dark" position="bottom-right" closeButton richColors />
      </body>
    </html>
  );
}