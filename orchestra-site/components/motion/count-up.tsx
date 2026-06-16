"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useReducedMotion,
} from "motion/react";

const EASE_EDITORIAL = [0.32, 0.72, 0, 1] as const;

type CountUpProps = {
  /** the final value to count toward */
  value: number;
  /** text appended after the number, e.g. a unit */
  suffix?: string;
  className?: string;
  durationSeconds?: number;
};

/**
 * Animates a number up from zero the first time it scrolls into view. Respects
 * prefers-reduced-motion by rendering the final value immediately. Uses tabular
 * figures (via the `tabular` utility) to avoid horizontal jitter while counting.
 */
export function CountUp({
  value,
  suffix = "",
  className,
  durationSeconds = 1.1,
}: CountUpProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced motion renders the final value directly (see `shown` below), so
    // no animation — and no setState — is needed here.
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: EASE_EDITORIAL,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion, durationSeconds]);

  const shown = reduceMotion ? value : display;

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {shown.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}
