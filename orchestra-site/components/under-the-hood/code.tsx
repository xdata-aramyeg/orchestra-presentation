import { type ReactNode } from "react";

/**
 * Inline mono token for code-ish names (flags, hooks, file paths, tool ids).
 * These names are LOCKED — rendered verbatim in JetBrains Mono on a faint
 * shell chip so they read as "code" without leaving the warm-paper palette.
 */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-shell/80 px-1.5 py-0.5 font-mono text-[0.82em] text-ink [overflow-wrap:anywhere] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </code>
  );
}
