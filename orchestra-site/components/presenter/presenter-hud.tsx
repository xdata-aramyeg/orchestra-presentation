"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CaretLeft,
  CaretRight,
  Lightbulb,
  MapPin,
  X,
} from "@phosphor-icons/react";
import { usePresenter } from "@/components/presenter/use-presenter";
import {
  PRESENTER_EASE,
  locationLabel,
  pillarLabel,
} from "@/components/presenter/presenter-meta";
import {
  isTerminalOpen,
  isTypingTarget,
  shouldIgnoreHotkey,
} from "@/components/presenter/presenter-keys";

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-card px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
      {children}
    </span>
  );
}

/**
 * Global presenter HUD — a compact, dismissible corner card for solo, single-
 * screen practice. Toggled by `P` (never while typing or while the backtick
 * terminal is open, and layout-independent via event.code), ← / → advance,
 * Esc or P closes. Condensed mirror of the /present deck; reduced-motion safe.
 */
export function PresenterHud() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const { index, total, cue, nextCue, isFirst, isLast, next, prev } =
    usePresenter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Toggle on the physical P key — never hijack inputs or the terminal.
      if (event.code === "KeyP") {
        if (shouldIgnoreHotkey(event)) return;
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (!open) return;
      // While open: arrows + Esc, but stand down for text entry / terminal so
      // its own history-arrows and Esc keep working.
      if (isTypingTarget(document.activeElement) || isTerminalOpen()) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, next, prev]);

  const pillar = pillarLabel(cue.pillar);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="presenter-hud"
          aria-label="Подсказки ведущего"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.24, ease: PRESENTER_EASE }}
          className="fixed inset-x-4 bottom-4 z-[120] flex max-h-[72vh] flex-col overflow-hidden rounded-[1.5rem] border border-line-strong bg-card shadow-[0_24px_70px_-24px_rgba(26,23,20,0.5)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[360px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-vermilion">
              Подсказка ведущему
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-semibold text-ink tabular">
                {cue.beat} / {total}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть подсказку"
                className="rounded-full p-1 text-ink-muted transition-colors duration-200 hover:text-ink"
              >
                <X weight="bold" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="min-w-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag>
                <MapPin weight="light" className="h-2.5 w-2.5" />
                {locationLabel(cue)}
              </Tag>
              {pillar && (
                <span className="inline-flex items-center rounded-full border border-vermilion/30 bg-vermilion-soft/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-vermilion">
                  {pillar}
                </span>
              )}
            </div>

            <p className="mt-2.5 font-display text-[13px] font-semibold leading-snug text-ink">
              {cue.section}
            </p>

            <p className="mt-3 text-[15px] leading-snug font-medium break-words [overflow-wrap:anywhere] text-ink">
              {cue.say}
            </p>

            <div className="mt-3 rounded-2xl border border-vermilion/15 bg-vermilion-soft/30 px-3.5 py-3">
              <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-vermilion">
                <Lightbulb weight="fill" className="h-3 w-3" />
                Факт
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed break-words [overflow-wrap:anywhere] text-ink-soft">
                {cue.drop}
              </p>
            </div>

            {cue.action && (
              <p className="mt-3 text-xs leading-relaxed break-words [overflow-wrap:anywhere] text-ink-muted">
                ▸ {cue.action}
              </p>
            )}

            {nextCue && (
              <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-muted">
                Далее → {nextCue.section}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2.5">
            <button
              type="button"
              onClick={prev}
              disabled={isFirst}
              aria-label="Назад"
              className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-200 hover:border-ink disabled:pointer-events-none disabled:opacity-35"
            >
              <CaretLeft weight="bold" className="h-3 w-3" />
              Назад
            </button>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted tabular">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={next}
              disabled={isLast}
              aria-label="Далее"
              className="inline-flex items-center gap-1 rounded-full bg-vermilion px-3.5 py-1.5 text-xs font-medium text-paper transition-colors duration-200 hover:bg-ink disabled:pointer-events-none disabled:opacity-35"
            >
              Далее
              <CaretRight weight="bold" className="h-3 w-3" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
