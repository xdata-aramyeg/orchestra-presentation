"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * Clipboard hook with a transient "copied" flag. Writes verbatim text to the
 * clipboard and flips `copied` true for `resetMs`, then back. Fails silently
 * when the clipboard is unavailable (insecure context / denied permission) so
 * the surrounding UI stays usable — the source text is always visible to select.
 */
export function useClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetMs);
      } catch {
        setCopied(false);
      }
    },
    [resetMs],
  );

  return { copied, copy } as const;
}

type CopyButtonProps = {
  /** the verbatim payload written to the clipboard */
  text: string;
  /** accessible description, e.g. "Скопировать: .claude/agents/pm.md" */
  ariaLabel: string;
  /** idle label (default «Скопировать») */
  label?: string;
  /** copied label (default «Скопировано ✓») */
  copiedLabel?: string;
};

/**
 * Keyboard-accessible «Скопировать» pill. Writes the verbatim payload to the
 * clipboard and flashes a check + «Скопировано ✓». Icon cross-fade respects
 * prefers-reduced-motion; the live label is announced politely.
 */
export function CopyButton({
  text,
  ariaLabel,
  label = "Скопировать",
  copiedLabel = "Скопировано ✓",
}: CopyButtonProps) {
  const reduceMotion = useReducedMotion();
  const { copied, copy } = useClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      aria-label={ariaLabel}
      className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] tracking-[0.02em] text-ink-soft transition-colors duration-200 hover:border-vermilion/50 hover:text-vermilion active:scale-[0.98]"
    >
      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center text-vermilion"
            >
              <Check weight="bold" className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Copy weight="bold" className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
