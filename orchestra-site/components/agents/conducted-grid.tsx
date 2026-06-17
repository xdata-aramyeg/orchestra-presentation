"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/reveal";
import { AgentCard } from "@/components/agents/agent-card";
import { AGENTS } from "@/content/agents";

/**
 * The conductor's downbeat: Маэстро is cued first and beats 1‑2‑3; on the third
 * beat the remaining six fire their idle-actions in role order, ~170ms apart —
 * an orchestra "настройка". The grid plays once when it scrolls into view and
 * can be replayed via the «▶ сыграть» pill. Reduced motion skips it entirely
 * (avatars render their resolved poses; no auto-play, no pill).
 */

/** Maestro's 3rd baton beat lands ~1.9s into its restarted loop. */
const THIRD_BEAT_MS = 1900;
/** Stagger between each section player after the downbeat. */
const STAGGER_MS = 170;

// Role order after Маэстро (matches the AGENTS roster order).
const FOLLOWERS = [
  "librettist",
  "scenographer",
  "machinist",
  "diapason",
  "reviewer",
  "chronicler",
] as const;

export function ConductedGrid() {
  const reduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });

  // Per-slug cue counter — bumping a slug's number restarts that avatar's loop.
  const [cues, setCues] = useState<Record<string, number>>({});
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playedRef = useRef(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const bump = useCallback((slug: string) => {
    setCues((prev) => ({ ...prev, [slug]: (prev[slug] ?? 0) + 1 }));
  }, []);

  const play = useCallback(() => {
    if (reduceMotion) return;
    clearTimers();
    // Downbeat: the conductor raises the baton and beats 1‑2‑3.
    bump("maestro");
    // On the third beat, the section answers in order.
    FOLLOWERS.forEach((slug, i) => {
      const timer = setTimeout(
        () => bump(slug),
        THIRD_BEAT_MS + i * STAGGER_MS,
      );
      timersRef.current.push(timer);
    });
  }, [reduceMotion, clearTimers, bump]);

  // Auto-play once when the grid enters the viewport.
  useEffect(() => {
    if (reduceMotion || !inView || playedRef.current) return;
    playedRef.current = true;
    play();
  }, [inView, reduceMotion, play]);

  // Clean up any pending timers on unmount.
  useEffect(() => clearTimers, [clearTimers]);

  return (
    <>
      {!reduceMotion && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={play}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors duration-200 hover:border-vermilion/50 hover:text-vermilion active:scale-[0.97]"
          >
            <Play
              weight="fill"
              className="h-3 w-3 text-vermilion transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
            Сыграть
          </button>
        </div>
      )}

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {AGENTS.map((agent, i) => (
          <Reveal key={agent.slug} delay={(i % 3) * 0.08}>
            <AgentCard agent={agent} cue={cues[agent.slug] ?? 0} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
