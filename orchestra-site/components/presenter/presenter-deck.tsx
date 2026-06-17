"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CaretLeft,
  CaretRight,
  Cursor,
  Lightbulb,
  MapPin,
} from "@phosphor-icons/react";
import { usePresenter } from "@/components/presenter/use-presenter";
import {
  PRESENTER_EASE,
  locationLabel,
  pillarLabel,
  secondsLabel,
} from "@/components/presenter/presenter-meta";
import { isTypingTarget } from "@/components/presenter/presenter-keys";

function Chip({
  children,
  tone = "ink",
}: {
  children: ReactNode;
  tone?: "ink" | "accent";
}) {
  const toneClass =
    tone === "accent"
      ? "border-vermilion/30 bg-vermilion-soft/40 text-vermilion"
      : "border-line bg-card text-ink-muted";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${toneClass}`}
    >
      {children}
    </span>
  );
}

/**
 * The standalone /present deck — a premium teleprompter / cue board, built for
 * a phone held at arm's length while the projector shows the live site. Big,
 * high-contrast SAY line; a visually distinct FACT drop; ← → / Space / click to
 * advance; a tappable progress rail. Mobile-first, zero overflow at 375px.
 */
export function PresenterDeck() {
  const reduceMotion = useReducedMotion();
  const { index, total, cue, nextCue, isFirst, isLast, next, prev, goTo } =
    usePresenter();

  // Global keys: → / Space advance, ← goes back. Guarded against text entry.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(document.activeElement)) return;
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        next();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev]);

  // Click-anywhere-to-advance, except on real controls.
  const onSurfaceClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (target.closest("button, a, [data-no-advance]")) return;
      next();
    },
    [next],
  );

  const pillar = pillarLabel(cue.pillar);
  const seconds = secondsLabel(cue.seconds);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-paper px-4 pt-24 pb-5 sm:px-8 sm:pt-28 sm:pb-8">
      <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col">
        {/* Masthead */}
        <header className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-vermilion">
            Режим презентации
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-ink tabular">
            BEAT {cue.beat} / {total}
          </span>
        </header>

        {/* Progress rail — tappable jump targets */}
        <div className="mt-4 flex items-center gap-1" role="group" aria-label="Прогресс">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Бит ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="group relative flex-1 py-2"
            >
              <span
                className={`block h-[3px] rounded-full transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  i <= index ? "bg-vermilion" : "bg-line"
                } group-hover:bg-vermilion/70`}
              />
            </button>
          ))}
        </div>

        {/* Cue body — the reading surface (click to advance) */}
        <main
          onClick={onSurfaceClick}
          className="mt-5 flex flex-1 cursor-pointer flex-col"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={cue.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: PRESENTER_EASE }}
              className="flex flex-1 flex-col"
            >
              {/* Where + what */}
              <div className="flex flex-wrap items-center gap-2">
                <Chip>
                  <MapPin weight="light" className="h-3 w-3" />
                  {locationLabel(cue)}
                </Chip>
                {pillar && <Chip tone="accent">{pillar}</Chip>}
                {seconds && <Chip>{seconds}</Chip>}
              </div>

              <h1 className="mt-4 font-display text-xl leading-snug font-semibold tracking-tight text-ink sm:text-2xl">
                {cue.section}
              </h1>

              {/* SAY — the spoken line, large and legible */}
              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-vermilion">
                  Говорите
                </p>
                <p className="mt-3 text-[1.65rem] leading-[1.28] font-medium break-words [overflow-wrap:anywhere] text-ink sm:text-[2.1rem] sm:leading-[1.25]">
                  {cue.say}
                </p>
              </div>

              {/* DROP — the insider fact, visually distinct */}
              <div className="mt-7 rounded-[1.5rem] border border-vermilion/15 bg-vermilion-soft/35 p-5 sm:p-6">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-vermilion">
                  <Lightbulb weight="fill" className="h-3.5 w-3.5" />
                  Факт в зал
                </p>
                <p className="mt-3 text-base leading-relaxed break-words [overflow-wrap:anywhere] text-ink-soft sm:text-lg">
                  {cue.drop}
                </p>
              </div>

              {/* ACTION — optional concrete on-screen move */}
              {cue.action && (
                <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-line bg-card px-4 py-3">
                  <Cursor
                    weight="light"
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted"
                  />
                  <p className="text-sm leading-relaxed break-words [overflow-wrap:anywhere] text-ink-soft">
                    {cue.action}
                  </p>
                </div>
              )}

              {/* Prep cue — a subtle hint of what's next */}
              <p className="mt-auto pt-6 font-mono text-[11px] leading-relaxed text-ink-muted">
                {nextCue ? (
                  <>
                    Далее → <span className="text-ink-soft">{nextCue.section}</span>
                  </>
                ) : (
                  "Финал — это последний бит."
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Controls */}
        <nav className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={isFirst}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-card px-5 py-2.5 text-sm font-medium text-ink transition-[transform,opacity,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-ink active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35"
          >
            <CaretLeft weight="bold" className="h-4 w-4" />
            Назад
          </button>

          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted tabular">
            {index + 1} / {total}
          </span>

          <button
            type="button"
            onClick={next}
            disabled={isLast}
            className="inline-flex items-center gap-2 rounded-full bg-vermilion px-6 py-2.5 text-sm font-medium text-paper transition-[transform,opacity,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35"
          >
            Далее
            <CaretRight weight="bold" className="h-4 w-4" />
          </button>
        </nav>

        <p className="mt-3 text-center font-mono text-[10px] tracking-[0.14em] text-ink-muted">
          ← → или пробел · клик по карточке — дальше
        </p>
      </div>
    </div>
  );
}
