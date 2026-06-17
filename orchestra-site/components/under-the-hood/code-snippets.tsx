"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "@phosphor-icons/react";

const EASE = [0.32, 0.72, 0, 1] as const;

/**
 * The three paste-and-go config snippets. Names are LOCKED — rendered verbatim
 * (flags, file paths, frontmatter keys) so a viewer can copy them without
 * paraphrase drift.
 */
type Snippet = {
  /** what file / surface this goes in */
  label: string;
  /** the verbatim payload (copied exactly as written) */
  code: string;
};

const SNIPPETS: readonly Snippet[] = [
  {
    label: "settings.json",
    code: `{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }`,
  },
  {
    label: ".claude/agents/frontend.md",
    code: `---
name: frontend
description: Frontend dev. Builds the UI from the design. Owns UI files only.
tools: Read, Write, Edit, Bash, Grep, Glob
model: opus
---`,
  },
  {
    label: "спросите Claude Code",
    code: `Создай команду агентов: PM, фронтенд, бэкенд, QA, ревьюер. Все на Opus.`,
  },
];

/**
 * Copyable config cards for "Под капотом". Each is a double-bezel card whose
 * core holds a JetBrains-Mono code block (horizontal scroll stays WITHIN the
 * card, never the page) and a keyboard-accessible «Скопировать» button that
 * writes the verbatim snippet to the clipboard and flashes «Скопировано ✓».
 */
export function CodeSnippets() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
      {SNIPPETS.map((snippet) => (
        <SnippetCard key={snippet.label} snippet={snippet} />
      ))}
    </div>
  );
}

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (insecure context / denied permission) — fail
      // silently so the card stays usable; the snippet is visible to select.
      setCopied(false);
    }
  }, [snippet.code]);

  return (
    <div className="flex h-full w-full min-w-0 max-w-full flex-col rounded-[1.75rem] border border-line bg-gradient-to-b from-shell to-paper-alt p-2 shadow-[0_1px_2px_rgba(26,23,20,0.04),0_18px_40px_-28px_rgba(26,23,20,0.35)]">
      <div className="flex h-full min-w-0 flex-col rounded-[1.25rem] border border-line bg-card p-4 shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(26,23,20,0.05),0_1px_1px_rgba(26,23,20,0.03)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-vermilion">
            {snippet.label}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Скопировать сниппет: ${snippet.label}`}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] tracking-[0.02em] text-ink-soft transition-colors duration-200 hover:border-vermilion/50 hover:text-vermilion"
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
            <span aria-live="polite">
              {copied ? "Скопировано ✓" : "Скопировать"}
            </span>
          </button>
        </div>

        <pre className="mt-4 min-w-0 max-w-full overflow-x-auto rounded-[0.9rem] border border-line bg-shell/60 p-4 font-mono text-[12.5px] leading-relaxed text-ink [scrollbar-width:thin]">
          <code className="whitespace-pre">{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
}
