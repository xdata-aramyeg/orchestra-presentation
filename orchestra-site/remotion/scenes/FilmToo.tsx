import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, FONTS } from "../theme";
import { Avatar } from "../components/Avatar";
import { Caption } from "../components/Caption";
import { ramp } from "../components/util";

/**
 * Scene 12 — Этот фильм — тоже команда. The seventh avatar, the Chronicler,
 * rolls in with the slate and points it at the finished site; the closing line
 * resolves to the Orchestra wordmark.
 */
export const FilmToo = () => {
  const frame = useCurrentFrame();

  const enter = ramp(frame, 6, 40);
  const roll = interpolate(enter, [0, 1], [-260, 0]);
  const wordmark = ramp(frame, 46, 76);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.paper,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* the chronicler rolls in */}
      <div style={{ transform: `translateX(${roll}px)`, opacity: enter }}>
        <Avatar slug="chronicler" enter={enter} accent={ramp(frame, 26, 56)} size={240} />
      </div>

      {/* the Orchestra wordmark resolves */}
      <div style={{ marginTop: 30, opacity: wordmark, transform: `translateY(${(1 - wordmark) * 16}px)` }}>
        <span
          style={{
            fontFamily: FONTS.display,
            fontSize: 76,
            fontWeight: 800,
            color: COLORS.ink,
            letterSpacing: "-0.02em",
          }}
        >
          Orchestra
        </span>
        <span style={{ color: COLORS.vermilion, fontFamily: FONTS.display, fontSize: 76, fontWeight: 800 }}>.</span>
      </div>

      <Caption from={30} kicker="Снято Хроникёром · на Opus" accent>
        Этот фильм тоже сделан командой.
      </Caption>
    </AbsoluteFill>
  );
};
