import { type ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  /** when true, render the dot marker before the label */
  marker?: boolean;
  className?: string;
};

/**
 * Tiny pill tag that sits before a major heading. Vermilion accent, mono,
 * wide tracking — the editorial "section index" cue.
 */
export function Eyebrow({ children, marker = true, className }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-vermilion/30 bg-vermilion-soft/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-vermilion ${className ?? ""}`}
    >
      {marker && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-vermilion"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
