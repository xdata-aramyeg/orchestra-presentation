"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  BANNER_LINES,
  resolveCommand,
  type CommandResult,
} from "@/components/easter/commands";

const EASE = [0.32, 0.72, 0, 1] as const;

type Line = {
  id: number;
  kind: "in" | "out" | "banner";
  text: string;
};

let lineSeq = 0;
const nextId = () => ++lineSeq;

const makeBanner = (): Line[] =>
  BANNER_LINES.map((text) => ({ id: nextId(), kind: "banner" as const, text }));

const echo = (input: string): Line => ({
  id: nextId(),
  kind: "in",
  text: input,
});

const out = (text: string): Line => ({ id: nextId(), kind: "out", text });

/**
 * Hidden in-page terminal — a contrast easter egg for the Claude-Code talk.
 * Opens on the backtick key (never while typing in a field), Esc closes and
 * restores focus. Dark console panel over a scrim; vermilion prompt caret;
 * JetBrains Mono. Pure-overlay — it never shifts or widens the page beneath.
 */
export function EasterTerminal() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const close = useCallback(() => {
    setOpen(false);
    const target = restoreFocusRef.current;
    if (target && typeof target.focus === "function") target.focus();
  }, []);

  // Global open trigger: backtick, but never while the user is typing in a
  // field (input/textarea/select/contentEditable) — don't hijack the keyboard.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "`" || event.metaKey || event.ctrlKey || event.altKey)
        return;
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName;
      const typing =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el?.isContentEditable === true;
      if (typing) return;

      event.preventDefault();
      restoreFocusRef.current = el ?? null;
      setLines((prev) => (prev.length ? prev : [...makeBanner(), echo("whoami"), out("сайт, который построил себя")]));
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Move focus into the input on open; keep the latest line in view.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, open]);

  const runResult = useCallback(
    (input: string, result: CommandResult) => {
      if (result.kind === "clear") {
        setLines([]);
        return;
      }
      setLines((prev) => [
        ...prev,
        echo(input),
        ...result.lines.map((text) => out(text)),
      ]);
      if (result.kind === "navigate") {
        // Let the transcript paint, then navigate and close the overlay.
        setOpen(false);
        router.push(result.href);
      }
    },
    [router],
  );

  const submit = useCallback(() => {
    const input = value.trim();
    setValue("");
    setHistoryIdx(null);
    if (!input) return;
    setHistory((prev) => [...prev, input]);
    runResult(input, resolveCommand(input));
  }, [value, runResult]);

  const onInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
        return;
      }
      if (event.key === "ArrowUp") {
        if (history.length === 0) return;
        event.preventDefault();
        const idx = historyIdx === null ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(idx);
        setValue(history[idx]);
        return;
      }
      if (event.key === "ArrowDown") {
        if (historyIdx === null) return;
        event.preventDefault();
        const idx = historyIdx + 1;
        if (idx >= history.length) {
          setHistoryIdx(null);
          setValue("");
        } else {
          setHistoryIdx(idx);
          setValue(history[idx]);
        }
      }
    },
    [history, historyIdx, submit],
  );

  // Panel-level keys: Esc closes; Tab is trapped within the panel.
  const onPanelKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [close],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="scrim"
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          <button
            type="button"
            aria-label="Закрыть терминал"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default bg-ink/55 backdrop-blur-[2px]"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={onPanelKeyDown}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="relative flex max-h-[60vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16130f] shadow-[0_24px_70px_-20px_rgba(0,0,0,0.7)]"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-vermilion" aria-hidden="true" />
                <span
                  id={titleId}
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/70"
                >
                  orchestra · терминал
                </span>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-md px-2 py-1 font-mono text-[11px] text-paper/50 transition-colors duration-200 hover:text-paper"
              >
                esc
              </button>
            </div>

            {/* Transcript */}
            <div
              ref={scrollRef}
              className="min-w-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed [scrollbar-width:thin]"
            >
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={`min-w-0 break-words whitespace-pre-wrap ${
                    line.kind === "banner"
                      ? "text-vermilion/80"
                      : line.kind === "in"
                        ? "text-paper/90"
                        : "text-paper/70"
                  }`}
                >
                  {line.kind === "in" ? (
                    <>
                      <span className="text-vermilion">›</span> {line.text}
                    </>
                  ) : (
                    line.text
                  )}
                </div>
              ))}
            </div>

            {/* Prompt */}
            <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <span className="font-mono text-vermilion" aria-hidden="true">
                ›
              </span>
              <input
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={onInputKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Команда терминала"
                placeholder="help"
                className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-paper caret-vermilion outline-none placeholder:text-paper/30"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
