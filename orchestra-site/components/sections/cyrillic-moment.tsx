"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * A single viewport-scale editorial beat: one massive Unbounded Cyrillic word,
 * rendered as a hollow ink outline on warm paper and gently transformed on
 * scroll (scale + horizontal drift + a soft opacity fade at the edges of its
 * travel). Full-bleed; transform/opacity only; static under reduced motion.
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

  const style = reduceMotion ? undefined : { scale, x, opacity };

  return (
    <section
      ref={ref}
      aria-label={word}
      className="relative flex items-center overflow-hidden bg-paper py-20 sm:py-28"
    >
      <motion.div
        style={style}
        className="w-full origin-center text-center font-display text-[22vw] leading-none font-extrabold tracking-tight whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)] sm:[-webkit-text-stroke:2px_var(--color-ink)]"
      >
        {word}
      </motion.div>
    </section>
  );
}
