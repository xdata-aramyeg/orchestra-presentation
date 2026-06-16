import { type ReactNode } from "react";
import { COLORS } from "../theme";

export type AvatarSlug =
  | "maestro"
  | "librettist"
  | "scenographer"
  | "machinist"
  | "diapason"
  | "reviewer"
  | "chronicler";

type Geometry = {
  /** Russian label (kept for parity with the site emblems / a11y intent). */
  label: string;
  /** The ink line-art body (everything except the single vermilion accent). */
  ink: ReactNode;
  /**
   * The one vermilion accent, rendered as a function of its own draw progress
   * `a` (0 → 1). For stroke-draws we map `a` to strokeDashoffset; for the
   * conductor's beat dots we map `a` to a staggered fill.
   */
  accent: (a: number) => ReactNode;
};

const ink = {
  fill: "none",
  stroke: COLORS.ink,
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const faint = { ...ink, opacity: 0.22 };

/** A vermilion path that draws itself: a=0 hidden, a=1 fully drawn. */
const drawn = (a: number) => ({
  fill: "none" as const,
  stroke: COLORS.vermilion,
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 100,
  strokeDasharray: 100,
  strokeDashoffset: 100 - 100 * Math.max(0, Math.min(1, a)),
});

/**
 * Avatar geometry, ported verbatim from components/avatars/emblems.tsx and
 * re-expressed so the accent is frame-driven (no CSS classes / realtime clocks).
 */
export const GEOMETRY: Record<AvatarSlug, Geometry> = {
  maestro: {
    label: "Маэстро — дирижёр",
    ink: (
      <>
        <path style={ink} d="M62 152 L132 74" />
        <circle style={faint} cx="80" cy="170" r="4" />
        <circle style={faint} cx="100" cy="170" r="4" />
        <circle style={faint} cx="120" cy="170" r="4" />
      </>
    ),
    accent: (a) => {
      // three beats fill in sequence (раз-два-три)
      const dot = (i: number) =>
        Math.max(0, Math.min(1, (a - i * 0.25) * 3));
      return (
        <>
          <circle cx="80" cy="170" r="4" fill={COLORS.vermilion} opacity={dot(0)} />
          <circle cx="100" cy="170" r="4" fill={COLORS.vermilion} opacity={dot(1)} />
          <circle cx="120" cy="170" r="4" fill={COLORS.vermilion} opacity={dot(2)} />
        </>
      );
    },
  },
  librettist: {
    label: "Либреттист — PM",
    ink: (
      <>
        <path style={faint} d="M52 142 L150 142" />
        <path style={ink} d="M58 132 L90 92" />
        <path style={ink} d="M58 132 L51 143 L62 128" />
      </>
    ),
    accent: (a) => <path style={drawn(a)} d="M52 142 L150 142" />,
  },
  scenographer: {
    label: "Сценограф — Frontend",
    ink: (
      <>
        <path style={faint} d="M54 66 L54 54 L66 54" />
        <path style={faint} d="M146 54 L158 54 L158 66" />
        <path style={faint} d="M158 146 L158 158 L146 158" />
        <path style={faint} d="M66 158 L54 158 L54 146" />
      </>
    ),
    accent: (a) => (
      <rect
        x="62"
        y="62"
        width="88"
        height="88"
        rx="6"
        style={{ ...drawn(a), strokeDasharray: 100 }}
      />
    ),
  },
  machinist: {
    label: "Машинист — Backend",
    ink: (
      <>
        <g>
          <circle style={ink} cx="78" cy="76" r="30" />
          <circle style={ink} cx="78" cy="76" r="6" />
          <path style={ink} d="M108 76 L116 76" />
          <path style={ink} d="M99.2 97.2 L104.9 102.9" />
          <path style={ink} d="M78 106 L78 114" />
          <path style={ink} d="M56.8 97.2 L51.1 102.9" />
          <path style={ink} d="M48 76 L40 76" />
          <path style={ink} d="M56.8 54.8 L51.1 49.1" />
          <path style={ink} d="M78 46 L78 38" />
          <path style={ink} d="M99.2 54.8 L104.9 49.1" />
        </g>
        <rect style={ink} x="116" y="120" width="64" height="44" rx="6" />
        <path style={faint} d="M126 134 L150 134" />
        <path style={faint} d="M126 146 L142 146" />
      </>
    ),
    accent: (a) => (
      <path d="M150 140 L150 152" style={{ ...drawn(a) }} />
    ),
  },
  diapason: {
    label: "Камертон — QA",
    ink: (
      <>
        <path style={ink} d="M78 50 L78 118" />
        <path style={ink} d="M122 50 L122 118" />
        <path style={ink} d="M78 118 Q78 140 100 140 Q122 140 122 118" />
        <path style={ink} d="M100 140 L100 168" />
        <path style={ink} d="M88 168 L112 168" />
      </>
    ),
    accent: (a) => <path d="M150 64 L158 74 L176 50" style={drawn(a)} />,
  },
  reviewer: {
    label: "Рецензент — Reviewer",
    ink: (
      <>
        <path style={faint} d="M52 70 L140 70" />
        <path style={faint} d="M52 96 L132 96" />
        <path style={faint} d="M52 122 L138 122" />
        <g>
          <circle style={ink} cx="64" cy="62" r="20" />
          <path style={ink} d="M78 76 L92 90" />
        </g>
      </>
    ),
    accent: (a) => <path d="M138 138 L148 150 L168 124" style={drawn(a)} />,
  },
  chronicler: {
    label: "Хроникёр — Motion",
    ink: (
      <>
        <rect style={ink} x="46" y="98" width="108" height="64" rx="6" />
        <path style={faint} d="M62 118 L138 118" />
        <path style={faint} d="M62 134 L128 134" />
        <path style={faint} d="M62 150 L118 150" />
        <rect style={ink} x="46" y="86" width="108" height="13" rx="3" />
      </>
    ),
    accent: (a) => (
      <path
        d="M62 99 L70 86 M80 99 L88 86 M98 99 L106 86 M116 99 L124 86 M134 99 L142 86"
        style={drawn(a)}
      />
    ),
  },
};
