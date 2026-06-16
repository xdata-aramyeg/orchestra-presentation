"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useWaitlist } from "./waitlist-provider";

/**
 * Live social-proof counter. Reads the shared count (loaded from
 * GET /api/waitlist/count and refreshed on every successful join) and animates
 * a count-up whenever the value changes. Respects prefers-reduced-motion by
 * snapping straight to the final number.
 */
export function LiveCounter() {
  const { count } = useWaitlist();
  const reduceMotion = useReducedMotion();

  const motionValue = useMotionValue(0);
  const [animated, setAnimated] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    // When reduced motion is on, skip the animation entirely — the rendered
    // value is derived from `count` directly below, so no setState is needed.
    if (count === null || reduceMotion) {
      previous.current = count ?? 0;
      return;
    }

    // Start the count-up from the last value we showed, then animate to the new
    // count (set the origin BEFORE animating).
    motionValue.set(previous.current);
    const controls = animate(motionValue, count, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setAnimated(Math.round(latest)),
    });
    previous.current = count;

    return () => controls.stop();
  }, [count, motionValue, reduceMotion]);

  const showNumber = count !== null;
  const display = reduceMotion ? (count ?? 0) : animated;

  return (
    <p
      className="flex items-center gap-2 text-sm text-muted"
      aria-live="polite"
    >
      <span
        className="relative flex h-2 w-2 shrink-0"
        aria-hidden="true"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-go opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-go" />
      </span>
      {showNumber ? (
        <span>
          <span className="tabular font-mono font-semibold text-foreground">
            {display.toLocaleString()}
          </span>{" "}
          builders already in line.
        </span>
      ) : (
        <span className="opacity-70">Counting builders in line…</span>
      )}
    </p>
  );
}
