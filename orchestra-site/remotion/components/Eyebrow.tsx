import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";

type EyebrowProps = {
  index: number;
  label: string;
  /** Use the dark-scene palette (the failed-v1 beats). */
  dark?: boolean;
};

/**
 * Top-left scene marker: a numbered chapter label in mono, like a field-notes
 * index. Fades in at the top of each scene.
 */
export const Eyebrow = ({ index, label, dark = false }: EyebrowProps) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [6, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const color = dark ? "rgba(255,255,255,0.55)" : COLORS.inkMuted;

  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: 100,
        display: "flex",
        alignItems: "baseline",
        gap: 18,
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 22,
          color: COLORS.vermilion,
          fontWeight: 600,
        }}
      >
        {String(index).padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 22,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
};
