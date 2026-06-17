"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";

/** Resting weight when reduced motion is on (one solid, heavy pose). */
const STATIC_WGHT = 760;

/**
 * A single viewport-scale editorial beat: one massive Unbounded Cyrillic word,
 * rendered as a hollow ink outline on warm paper and gently transformed on
 * scroll (scale + horizontal drift + a soft opacity fade at the edges of its
 * travel). The variable `wght` axis "breathes" from light → heaviest at center
 * → light as the word crosses the viewport. Full-bleed; transform / opacity /
 * font-variation-settings only; static under reduced motion.
 */
export function CyrillicMoment({ word = "ОРКЕСТР" }: { word?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.82, 1, 1.14]);
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.35, 1, 1, 0.35],
  );

  // Lighter at the edges of travel, heaviest as it sits at viewport center.
  const wght = useTransform(scrollYProgress, [0, 0.5, 1], [320, 880, 320]);
  const fontVariationSettings = useMotionTemplate`"wght" ${wght}`;

  const style = reduceMotion
    ? { fontVariationSettings: `"wght" ${STATIC_WGHT}` }
    : { scale, x, opacity, fontVariationSettings };

  return (
    <section
      ref={ref}
      aria-label={word}
      className="relative flex items-center overflow-hidden bg-paper py-20 sm:py-28"
    >
      <motion.div
        style={{ fontFamily: "var(--font-unbounded-var)", ...style }}
        className="w-full origin-center text-center text-[22vw] leading-none tracking-tight whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)] sm:[-webkit-text-stroke:2px_var(--color-ink)]"
      >
        {word}
      </motion.div>
    </section>
  );
}
