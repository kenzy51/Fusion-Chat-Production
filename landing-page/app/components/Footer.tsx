/* eslint-disable react/jsx-no-comment-textnodes */
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#09090b] pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-white font-bold text-xl tracking-tighter uppercase">
                Fusion AI
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed font-light">
              Autonomous workflows and enterprise-grade intelligence platforms.{" "}
              <br />
              Powered by Fusion Web Works LLC.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-mono text-zinc-400">
              // Solutions
            </h4>
            <ul className="text-zinc-500 space-y-2 text-sm font-light">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-cyan-500/40" />
                Autonomous Voice Nodes (SARA)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-purple-500/40" />
                Neural Vector-RAG Interfaces
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-500/40" />
                Programmatic SEO Engines
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-mono text-zinc-400">
              // Company
            </h4>
            <ul className="text-zinc-500 space-y-2 text-sm font-light">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-200"
                >
                  Contact Protocol
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase font-mono text-zinc-400">
              // NYC Operations
            </h4>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              929-769-6545 <br />
              <a
                href="mailto:hello@fusionaiagency.com"
                className="hover:text-white transition-colors duration-200"
              >
                hello@fusionaiagency.com
              </a>
            </p>
          </div>
        </div>

        {/* BOTTOM METRIC ROW — Fixed layout bug from md:row to md:flex-row */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-zinc-600 text-xs font-light text-center sm:text-left">
            <span>© 2026 Fusion Works LLC. All rights reserved.</span>
            <span className="hidden sm:inline text-zinc-800">|</span>
            {/* THE BACKLINK: High-value anchor text linking to your main root */}
            <span className="text-zinc-500">
              Architected by{" "}
              <a
                href="https://www.kanatnazarov.com/developer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-cyan-400 font-medium transition-colors duration-200 underline decoration-zinc-800 underline-offset-4 hover:decoration-cyan-500/40"
              >
                Kanat Nazarov
              </a>
            </span>
          </div>

          <div className="flex gap-6 text-[10px] font-mono tracking-wider text-zinc-600 uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500/50" /> HIPAA
              Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500/50" />{" "}
              AES-256 Protected
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
