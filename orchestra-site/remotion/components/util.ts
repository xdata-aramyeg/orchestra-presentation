import { interpolate } from "remotion";
import { EASE } from "../theme";

/** Editorial-eased 0→1 ramp over [start, end] frames, clamped. */
export const ramp = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) =>
      // cubic-bezier(0.32,0.72,0,1) approximation via easeOutCubic-ish curve
      1 - Math.pow(1 - t, 3),
  });

/** Linear clamped 0→1 ramp (for typewriter char counts etc.). */
export const lin = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Reveal the first N chars of `text` based on progress 0→1 (typewriter). */
export const typewriter = (text: string, progress: number) =>
  text.slice(0, Math.round(text.length * Math.max(0, Math.min(1, progress))));

/** Re-export the site easing for any interpolate that wants the exact bezier. */
export { EASE };
