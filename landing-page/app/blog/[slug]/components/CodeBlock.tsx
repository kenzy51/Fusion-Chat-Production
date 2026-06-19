// app/blog/[slug]/components/CodeBlock.tsx
"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  codeString: string;
  language: string;
}

export default function CodeBlock({ codeString, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const executeCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-10 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 shadow-2xl font-mono text-sm z-10">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/60 border-b border-zinc-900 text-xs text-zinc-500">
        <span className="uppercase tracking-widest font-bold text-[10px]">
           {language}
        </span>
        <button
          onClick={executeCopy}
          className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 font-mono text-[11px]"
        >
          {copied ? (
            <>
              <Check size={12} className="text-[#d4ff33]" />
              <span className="text-[#d4ff33]">Copied_</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy_</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto text-zinc-300 leading-relaxed text-sm bg-black/40">
        <code>{codeString}</code>
      </pre>
    </div>
  );
}