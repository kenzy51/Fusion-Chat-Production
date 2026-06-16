import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
// import NextTopLoader from "nextjs-toploader";
// import NextTopLoader from "nextjs-toploader";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fusionaiagency.com"), 
  title: {
    // REPOSITIONED: Focus locked completely on systems architecture and heavy tech
    default: "Fusion AI | NYC Neural Infrastructure & Autonomous Systems",
    template: "%s | Fusion AI",
  },
  description:
    "Bespoke low-latency AI voice nodes and enterprise-grade RAG pipelines for high-performance operations. We engineer autonomous communication networks.",
  keywords: [
    "NYC AI Systems Architect",
    "Neural Voice Nodes",
    "Autonomous Business Infrastructure",
    "Retrieval-Augmented Generation RAG",
    "Enterprise AI Automation New York",
    "Medical & Logistics AI Integration",
    "Bespoke Intelligent Agent Networks"
  ],
  authors: [{ name: "Kanat Nazarov" }],
  openGraph: {
    title: "Fusion AI | Enterprise Neural Architecture",
    description: "Low-latency autonomous voice agents and deep RAG knowledge networks.",
    url: "https://www.fusionaiagency.com",
    siteName: "Fusion AI",
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
    </html>
  );
}
