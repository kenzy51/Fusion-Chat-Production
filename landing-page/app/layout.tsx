import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.getfusionchat.com"), 
  title: {
    default: "Fusion Chat | Premium AI Chat Concierge & Autonomous Booking Pipelines",
    template: "%s | Fusion Chat",
  },
  description:
    "Bespoke low-latency AI chat concierges and automated lead qualification pipelines for high-ticket industries, luxury MedSpas, and medical practices. Capture, qualify, and book clients 24/7.",
  keywords: [
    "Fusion Chat AI",
    "AI Chat Concierge New York",
    "High-Ticket Lead Automation",
    "MedSpa AI Chat Widget",
    "Autonomous Client Acquisition",
    "Bespoke Conversational Systems",
    "Luxury Wellness AI Integration"
  ],
  authors: [{ name: "Kanat Nazarov" }],
  openGraph: {
    title: "Fusion Chat | Enterprise AI Conversational Architecture",
    description: "Low-latency autonomous chat widgets and client acquisition pipelines.",
    url: "https://www.getfusionchat.com",
    siteName: "Fusion Chat",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "vQ3BgmDR-jElI5WkHaCD7nqASJNVeAOwFVvLSy3lfUw",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/fusion.png", sizes: "48x48", type: "image/png" },
      { url: "/fusion.png", sizes: "96x96", type: "image/png" }, 
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
        <Script id="fusion-ai-config" strategy="afterInteractive">
          {`window.FusionAIChatConfig = { tenantSlug: "kanat" };`}
        </Script>
        
        <Script
          src="https://fusion-chat-production.vercel.app/embed.js"
          strategy="afterInteractive"
        />
    </html>
  );
}