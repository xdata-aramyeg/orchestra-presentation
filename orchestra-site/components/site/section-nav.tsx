"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * Curated jump-list of the home's major sections (in DOM order). Each entry is a
 * real in-page anchor, so navigation is native (keyboard + smooth-scroll honoring
 * the global reduced-motion rule).
 */
const SECTIONS = [
  { id: "teams", label: "Команда" },
  { id: "how", label: "Структура" },
  { id: "flow", label: "Поток" },
  { id: "thread", label: "Тред" },
  { id: "film-teaser", label: "Фильм" },
  { id: "tools", label: "Скиллы" },
  { id: "mistakes", label: "Ошибки" },
  { id: "under-the-hood", label: "Под капотом" },
] as const;

/**
 * Slim, unobtrusive navigability for the long home page:
 *  - a thin top scroll-progress bar (all viewports);
 *  - a right-side dot-rail (lg+) that marks the current section and jumps to any.
 * Warm-paper / vermilion / mono, keyboard-accessible, reduced-motion safe.
 */
export function SectionNav() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Spring only when motion is allowed; otherwise track raw progress.
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX = reduceMotion ? scrollYProgress : progress;

  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Top scroll-progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-vermilion"
        style={{ scaleX }}
        aria-hidden="true"
      />

      {/* Right-side dot-rail (desktop only) */}
      <nav
        aria-label="Разделы страницы"
        className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-label={s.label}
              aria-current={isActive ? "true" : undefined}
              className="group flex items-center justify-end gap-2.5"
            >
              <span
                className={`pointer-events-none rounded-full bg-paper/85 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-ink-soft backdrop-blur-sm transition-opacity duration-200 ${
                  isActive
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`h-2 w-2 shrink-0 rounded-full border transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isActive
                    ? "scale-125 border-vermilion bg-vermilion"
                    : "border-line-strong bg-transparent group-hover:border-ink"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
