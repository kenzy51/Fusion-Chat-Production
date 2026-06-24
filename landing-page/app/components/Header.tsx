/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) {
    return null;
  }
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const links = [
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-[#09090b]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 h-20 flex items-center justify-between">
          {/* Logo - Stays above everything */}
          <Link
            href="/"
            className="flex items-center gap-3 relative z-[110] group"
          >
            {/* The Refined Icon */}
            <div className="w-9 h-9 bg-[#d4ff33] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,255,51,0.2)] group-hover:shadow-[0_0_25px_rgba(212,255,51,0.4)] transition-all duration-300">
              <span className="text-black font-extrabold text-2xl font-mono leading-none -mt-0.5">
                F
              </span>
            </div>

            {/* The Brand Name */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                {/* FUSION - Pure White */}
                <span className="text-white font-bold text-xl tracking-tighter uppercase leading-none">
                  Fusion
                </span>

                {/* AI - Gemini Gradient */}
                <span
                  className="font-black text-xl tracking-tighter uppercase leading-none"
                  style={{
                    background:
                      "linear-gradient(90deg, #4e8cff 0%, #8033ff 50%, #f87171 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  AI
                </span>
              </div>

              {/* Subtitle */}
              <span className="text-zinc-500 text-[9px] font-mono uppercase tracking-[0.3em] leading-none opacity-60">
                Neural Systems
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-zinc-400 hover:text-[#d4ff33] text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-[#d4ff33] transition-all">
              Get Started
            </button>
          </div>

          {/* Burger Button - Stays above everything */}
          <button
            className="md:hidden relative z-[110] w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Moved OUTSIDE <nav> to prevent parent z-index issues */}
      <div
        className={`fixed inset-0 bg-[#09090b] z-[90] flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-4xl font-bold text-white hover:text-[#d4ff33] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/contact">
            <button className="bg-[#d4ff33] text-black px-10 py-4 rounded-full font-bold text-xl mt-4 shadow-[0_0_20px_rgba(212,255,51,0.2)] hover:shadow-[0_0_40px_rgba(212,255,51,0.4)] transition-all cursor-pointer transform hover:scale-105 active:scale-95">
              Get Started
            </button>
          </Link>
        </div>

        <div className="absolute bottom-12 text-zinc-600 font-mono text-xs uppercase tracking-[0.3em]">
          Fusion Web Works LLC • NYC
        </div>
      </div>
    </>
  );
}
