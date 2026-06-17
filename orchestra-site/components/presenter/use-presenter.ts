"use client";

import { useCallback, useMemo, useState } from "react";
import { PRESENTER_CUES, type PresenterCue } from "@/content/presenter-cues";

const clamp = (value: number, max: number) =>
  Math.max(0, Math.min(value, max));

export type PresenterNav = {
  index: number;
  total: number;
  cue: PresenterCue;
  /** the upcoming cue, so the presenter can prep — null at the end */
  nextCue: PresenterCue | null;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
};

/**
 * Shared cue-deck navigation. Both the standalone /present deck and the global
 * HUD consume the SAME PRESENTER_CUES through this hook, so they never drift.
 * Stops cleanly at both ends (no wrap) and keeps the index immutable.
 */
export function usePresenter(initialIndex = 0): PresenterNav {
  const total = PRESENTER_CUES.length;
  const [index, setIndex] = useState(() => clamp(initialIndex, total - 1));

  const next = useCallback(
    () => setIndex((i) => clamp(i + 1, total - 1)),
    [total],
  );
  const prev = useCallback(() => setIndex((i) => clamp(i - 1, total - 1)), [
    total,
  ]);
  const goTo = useCallback(
    (target: number) => setIndex(clamp(target, total - 1)),
    [total],
  );

  return useMemo<PresenterNav>(
    () => ({
      index,
      total,
      cue: PRESENTER_CUES[index],
      nextCue: index < total - 1 ? PRESENTER_CUES[index + 1] : null,
      isFirst: index === 0,
      isLast: index === total - 1,
      next,
      prev,
      goTo,
    }),
    [index, total, next, prev, goTo],
  );
}
