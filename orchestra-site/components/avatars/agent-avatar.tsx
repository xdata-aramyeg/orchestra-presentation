"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { EMBLEMS, type AvatarSlug } from "./emblems";

const NAMED_SIZES = { sm: 44, md: 72, lg: 160 } as const;

/** ms the stroke-draw entrance runs before the idle loop takes over (≈ av-draw) */
const DRAW_MS = 850;

type Size = keyof typeof NAMED_SIZES | number;

type Play =
  | "auto" /** draw in + loop immediately on mount */
  | "inView" /** draw in + loop once it scrolls into view */
  | "static"; /** never animate — show the resolved pose */

type AgentAvatarProps = {
  slug: AvatarSlug;
  size?: Size;
  play?: Play;
  className?: string;
};

/**
 * <AgentAvatar slug size play /> — renders an agent's line-art emblem.
 *
 * The component only chooses the phase class on the <svg>; all motion lives in
 * avatars.css:
 *   - before reveal / static / reduced motion → no class → resolved "done" pose
 *   - on reveal → `.av-in` (the line-art draws itself in via pathLength)
 *   - after the draw → `.av-run` (the calm idle/action loop with secondary motion)
 * `prefers-reduced-motion` keeps it at the resolved pose (never starts the phases,
 * and a CSS media-query net freezes any forced run).
 */
export function AgentAvatar({
  slug,
  size = "md",
  play = "inView",
  className,
}: AgentAvatarProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [looping, setLooping] = useState(false);

  const emblem = EMBLEMS[slug];
  const px = typeof size === "number" ? size : NAMED_SIZES[size];

  const started =
    !reduceMotion && (play === "auto" || (play === "inView" && inView));

  // Once the entrance has had time to draw, hand off to the looping phase.
  // setState only fires inside the timeout (never synchronously in the effect).
  useEffect(() => {
    if (!started || looping) return;
    const timer = setTimeout(() => setLooping(true), DRAW_MS);
    return () => clearTimeout(timer);
  }, [started, looping]);

  const phase = !started ? "" : looping ? "av-run" : "av-in";

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={emblem.label}
      viewBox="0 0 200 200"
      width={px}
      height={px}
      className={`av-svg ${phase} ${className ?? ""}`}
    >
      {emblem.body}
    </svg>
  );
}
