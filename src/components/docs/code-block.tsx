"use client";

import { useState } from "react";

type Props = { code: string; language: string; copyLabel: string; copiedLabel: string };

export function CodeBlock({ code, language, copyLabel, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("textarea");
      input.value = code;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const success = document.execCommand("copy");
      input.remove();
      setCopied(success);
      if (success) window.setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-border bg-[#18213c] text-slate-100">
      <div className="flex items-center justify-between border-b border-white/15 px-4 py-2 text-xs">
        <span className="font-medium uppercase tracking-wider text-slate-300">{language}</span>
        <button type="button" onClick={copy} className="rounded px-2 py-1 text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-live="polite">
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6"><code>{code}</code></pre>
    </div>
  );
}
