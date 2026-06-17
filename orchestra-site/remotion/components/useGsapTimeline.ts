"use client";

import { useLayoutEffect, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import gsap from "gsap";

/**
 * The frame-deterministic GSAP pattern (see the motion-graphics skill).
 *
 * GSAP ships its own realtime ticker — left to play, it desyncs from Remotion's
 * one-render-per-frame model and renders as stutter. The fix: build the timeline
 * ONCE as `{paused: true}`, scoped to a ref subtree, then `seek(frame / fps)`
 * every render so the timeline becomes a pure function of the current frame.
 *
 * Reach for this only where the *choreography* is the hard part (many
 * overlapping, staggered tweens with custom eases) — simple fades/slides stay on
 * interpolate/spring. Targets are resolved by CSS selector inside the returned
 * ref; never give a GSAP-controlled element a competing frame-driven inline
 * transform, or the two writers fight.
 *
 * @param build  receives the paused timeline; author it in SECONDS.
 * @param deps   rebuild deps (default []). Rebuilding per frame is slow/flashy.
 */
export const useGsapTimeline = <T extends HTMLElement = HTMLDivElement>(
  build: (tl: gsap.core.Timeline) => void,
  deps: ReadonlyArray<unknown> = [],
) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const root = useRef<T>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      build(t);
      tl.current = t;
    }, root);
    return () => {
      ctx.revert();
      tl.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Seek the paused timeline to the exact video time, before paint.
  useLayoutEffect(() => {
    tl.current?.seek(frame / fps);
  }, [frame, fps]);

  return root;
};
