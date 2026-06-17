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

/**
 * Overshoot ramp 0→1 with a small settle past the target (easeOutBack). Use for
 * elements that "snap into register" — blocks landing, gate releasing, a card
 * settling. `back` controls overshoot amount (1.7 ≈ a confident click).
 */
export const overshoot = (
  frame: number,
  start: number,
  end: number,
  back = 1.7,
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => {
      const c3 = back + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + back * Math.pow(t - 1, 2);
    },
  });

/**
 * Anticipation ramp: dips slightly *back* before driving to the target
 * (easeInBack), then onward. Returned value can exceed [0,1] briefly on the low
 * side — use for a wind-up before a push (the tracks loading toward the gate).
 */
export const anticipate = (
  frame: number,
  start: number,
  end: number,
  back = 1.5,
) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => {
      const c3 = back + 1;
      return c3 * t * t * t - back * t * t;
    },
  });

/** A calm, continuous breathing sine in [-1,1], period `seconds` at 30fps. */
export const breathe = (frame: number, seconds = 4, phase = 0) =>
  Math.sin(((frame / 30) * Math.PI * 2) / seconds + phase);

/** Reveal the first N chars of `text` based on progress 0→1 (typewriter). */
export const typewriter = (text: string, progress: number) =>
  text.slice(0, Math.round(text.length * Math.max(0, Math.min(1, progress))));

/** Re-export the site easing for any interpolate that wants the exact bezier. */
export { EASE };
