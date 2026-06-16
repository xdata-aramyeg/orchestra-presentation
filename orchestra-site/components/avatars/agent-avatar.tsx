"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { EMBLEMS, type AvatarSlug } from "./emblems";

const NAMED_SIZES = { sm: 44, md: 72, lg: 160 } as const;

type Size = keyof typeof NAMED_SIZES | number;

type Play =
  | "auto" /** loop immediately on mount */
  | "inView" /** start the loop once it scrolls into view */
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
 * The looping action is pure CSS (avatars.css); this component only decides
 * whether the loop runs by toggling the `.av-run` class:
 *   - play="auto"   → runs on mount
 *   - play="inView" → runs after it scrolls into view (Motion useInView, once)
 *   - play="static" → never runs
 * `prefers-reduced-motion` forces the static, resolved "done" pose (the CSS base
 * state already equals that pose, and a media-query net kills any forced run).
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

  const emblem = EMBLEMS[slug];
  const px = typeof size === "number" ? size : NAMED_SIZES[size];

  const running =
    !reduceMotion &&
    (play === "auto" || (play === "inView" && inView));

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={emblem.label}
      viewBox="0 0 200 200"
      width={px}
      height={px}
      className={`av-svg ${running ? "av-run" : ""} ${className ?? ""}`}
    >
      {emblem.body}
    </svg>
  );
}
