import { useCurrentFrame } from "remotion";
import { GEOMETRY, type AvatarSlug } from "./avatarGeometry";
import { COLORS, FONTS } from "../theme";
import { breathe } from "./util";

type AvatarProps = {
  slug: AvatarSlug;
  /** Entrance progress 0 → 1 (drives opacity + a small settle scale). */
  enter?: number;
  /** Accent draw progress 0 → 1 (the single vermilion element animating). */
  accent?: number;
  /** Diameter in px. */
  size?: number;
  /** Russian role caption shown under the emblem. */
  caption?: string;
  /** Dim to ~idle (used for the "devs idle during QA" beat). */
  idle?: boolean;
  /**
   * Phase offset (frames) for the breathing loop so a row of avatars doesn't
   * bob in unison. Defaults to 0.
   */
  phase?: number;
  /** Disable the secondary breathing motion (for tight grid cards). */
  still?: boolean;
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/**
 * A single agent emblem, frame-driven. The body fades/settles in with `enter`;
 * the one vermilion accent draws itself with `accent`. No realtime clocks —
 * every value is passed in from a scene's useCurrentFrame derivation.
 */
export const Avatar = ({
  slug,
  enter = 1,
  accent = 1,
  size = 200,
  caption,
  idle = false,
  phase = 0,
  still = false,
}: AvatarProps) => {
  const frame = useCurrentFrame();
  const e = clamp(enter);
  const geo = GEOMETRY[slug];
  const scale = 0.88 + 0.12 * e;
  const opacity = (idle ? 0.28 : 1) * e;

  // Secondary motion: a calm 5s breathing loop (±2.4px lift, hair of scale) so
  // the emblem reads "alive but ~80% calm" — matches the polished site avatars.
  // Settled in only after entry (× e) and frozen when idle.
  const settled = still || idle ? 0 : e;
  const b = breathe(frame, 5, phase);
  const bobY = b * 2.4 * settled;
  const breatheScale = 1 + b * 0.006 * settled;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: size * 0.06,
        opacity,
        transform: `scale(${scale})`,
        filter: idle ? "grayscale(1)" : "none",
        transition: "none",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        style={{
          overflow: "visible",
          transform: `translateY(${bobY}px) scale(${breatheScale})`,
        }}
      >
        {geo.ink}
        {geo.accent(idle ? 0 : accent)}
      </svg>
      {caption ? (
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: size * 0.085,
            letterSpacing: "0.06em",
            color: COLORS.inkMuted,
            textTransform: "uppercase",
          }}
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
};
