import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS, EASE } from "../theme";

type CaptionProps = {
  children: React.ReactNode;
  /** Frame within the scene when the caption begins to appear. */
  from?: number;
  /** Frames the caption stays before fading (0 = stay to end of scene). */
  hold?: number;
  /** Optional small mono kicker above the line. */
  kicker?: string;
  /** Highlight whole caption in vermilion (used for Человек's lines). */
  accent?: boolean;
};

/**
 * Burned-in Russian caption, pinned to the lower third. Fades in on `from`,
 * optionally out after `hold`. Frame-deterministic.
 */
export const Caption = ({
  children,
  from = 8,
  hold = 0,
  kicker,
  accent = false,
}: CaptionProps) => {
  const frame = useCurrentFrame();

  const appear = interpolate(frame, [from, from + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t,
  });
  const fade =
    hold > 0
      ? interpolate(frame, [from + hold, from + hold + 14], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const opacity = appear * fade;
  const y = interpolate(appear, [0, 1], [18, 0], { easing: (t) => t });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 88,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        padding: "0 180px",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {kicker ? (
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 20,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent ? COLORS.vermilion : COLORS.inkMuted,
          }}
        >
          {kicker}
        </span>
      ) : null}
      <p
        style={{
          margin: 0,
          textAlign: "center",
          fontFamily: FONTS.sans,
          fontSize: 38,
          lineHeight: 1.4,
          fontWeight: 500,
          color: accent ? COLORS.vermilion : COLORS.ink,
          maxWidth: 1320,
          textWrap: "balance",
        }}
      >
        {children}
      </p>
    </div>
  );
};
